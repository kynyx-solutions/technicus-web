import "server-only";
import { z } from "zod";
import { db, reference } from "@/lib/db";
import type { ApplicationRow, LeadRow } from "@/lib/db/types";

export const leadTypes = ["consultation", "brief", "nda", "local"] as const;
export type LeadType = (typeof leadTypes)[number];

const text = (max: number) => z.string().trim().max(max);
const required = (label: string, max = 200) => text(max).min(1, `${label} is required.`);
const optional = (max = 200) => text(max).optional().default("");
const email = text(200).email("Enter a valid email address.");
const consent = z.literal("on", { message: "Please agree before sending." });

const base = {
  name: required("Name"),
  source: optional(300),
};

/** One schema per form. The form fields in components/forms match these. */
export const schemas = {
  consultation: z.object({
    ...base,
    email,
    company: required("Company"),
    country: optional(),
    topic: optional(1000),
    preferredTime: optional(),
    timeZone: optional(),
    message: optional(4000),
    consent,
  }),
  brief: z.object({
    ...base,
    email,
    company: required("Company"),
    role: optional(),
    country: optional(),
    service: optional(1000),
    budget: optional(),
    timeline: optional(),
    message: required("A short description", 6000),
    consent,
  }),
  nda: z.object({
    ...base,
    email,
    company: required("Company"),
    message: optional(2000),
    consent,
  }),
  local: z.object({
    ...base,
    phone: required("Phone", 40),
    message: required("What you need", 2000),
    consent,
  }),
} satisfies Record<LeadType, z.ZodType>;

/** Job applications. The CV file is checked separately. */
export const applicationSchema = z.object({
  name: required("Name"),
  email,
  phone: optional(40),
  city: optional(100),
  role: optional(200),
  link: z.union([z.literal(""), text(500).url("Enter a full link, starting with https://")]).optional().default(""),
  message: optional(4000),
  consent,
});

export const CV_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};
export const CV_MAX_BYTES = 4 * 1024 * 1024;

/** True if the file's first bytes match a PDF or Word document, whatever its name says. */
export function looksLikeCv(bytes: Buffer) {
  const head = bytes.subarray(0, 8);
  const pdf = head.subarray(0, 4).toString() === "%PDF";
  const docx = head[0] === 0x50 && head[1] === 0x4b; // a zip file, which .docx is
  const doc = head.equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
  return pdf || docx || doc;
}

const split = (v?: string) => (v ? v.split(", ").map((s) => s.trim()).filter(Boolean) : []);

/** Stores a form submission as a lead in the admin's inbox. */
export async function saveLead(type: LeadType, fields: Record<string, string>, ip: string): Promise<LeadRow> {
  return db().insert("leads", {
    ref: reference("TQ"),
    type,
    name: fields.name ?? "",
    email: fields.email ?? "",
    phone: fields.phone ?? "",
    company: fields.company ?? "",
    country: fields.country ?? "",
    services: split(fields.service || fields.topic),
    budget: fields.budget ?? "",
    timeline: fields.timeline ?? "",
    message: fields.message ?? "",
    source: fields.source ?? "",
    fields,
    status: "new",
    priority: "medium",
    notes: [],
    ip,
  });
}

export async function saveApplication(
  fields: z.infer<typeof applicationSchema>,
  cv: { bytes: Buffer; name: string; type: string },
  ip: string,
): Promise<ApplicationRow> {
  const ref = reference("TJ");
  const cvPath = `cv/${new Date().toISOString().slice(0, 7)}/${ref}.${CV_TYPES[cv.type]}`;
  await db().putFile(cvPath, cv.bytes, cv.type);
  try {
    return await db().insert("applications", {
      ref,
      role: fields.role || "Open application",
      name: fields.name,
      email: fields.email,
      phone: fields.phone,
      city: fields.city,
      link: fields.link,
      message: fields.message,
      cv_path: cvPath,
      cv_name: cv.name.slice(0, 200),
      status: "new",
      notes: "",
      ip,
    });
  } catch (error) {
    await db().removeFiles([cvPath]);
    throw error;
  }
}

/**
 * Tells the team about a new lead or application. Either or both:
 * - RESEND_API_KEY, NOTIFY_EMAIL and MAIL_FROM: an email through Resend.
 * - LEAD_WEBHOOK_URL: the record posted as JSON (a chat channel or a CRM).
 * A failure here never loses the submission, which is already stored.
 */
export async function notifyTeam(kind: "lead" | "application", record: { ref: string; name: string; email: string; [k: string]: unknown }) {
  const site = process.env.SITE_URL ?? "";
  const tasks: Promise<unknown>[] = [];
  if (process.env.RESEND_API_KEY && process.env.NOTIFY_EMAIL && process.env.MAIL_FROM) {
    const link = `${site}/admin/${kind === "lead" ? "leads" : "applications"}`;
    const subject = kind === "lead" ? `New enquiry from ${record.name} (${record.ref})` : `New application from ${record.name} (${record.ref})`;
    const text = [
      subject,
      "",
      `Name: ${record.name}`,
      `Email: ${record.email}`,
      record.company ? `Company: ${record.company}` : "",
      record.role ? `Role: ${record.role}` : "",
      record.message ? `\n${record.message}` : "",
      "",
      `Open in the admin: ${link}`,
    ]
      .filter((l) => l !== "")
      .join("\n");
    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, "content-type": "application/json" },
        body: JSON.stringify({ from: process.env.MAIL_FROM, to: process.env.NOTIFY_EMAIL.split(","), reply_to: record.email, subject, text }),
        signal: AbortSignal.timeout(8000),
      }),
    );
  }
  if (process.env.LEAD_WEBHOOK_URL) {
    tasks.push(
      fetch(process.env.LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, ...record, ip: undefined }),
        signal: AbortSignal.timeout(5000),
      }),
    );
  }
  const results = await Promise.allSettled(tasks);
  for (const r of results) if (r.status === "rejected") console.error("Notification failed", record.ref, r.reason);
}

// A simple limit per visitor address, held in memory. It resets when the server
// restarts and is per server instance; Turnstile is added at deployment.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function allowed(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
