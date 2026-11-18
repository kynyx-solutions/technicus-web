import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

export const leadTypes = ["consultation", "brief", "nda", "career", "local"] as const;
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
  career: z.object({
    ...base,
    email,
    phone: optional(40),
    role: optional(),
    link: required("A link to your CV or profile", 500).url("Enter a full link, starting with https://"),
    message: optional(4000),
    consent,
  }),
  local: z.object({
    ...base,
    phone: required("Phone", 40),
    message: required("What you need", 2000),
    consent,
  }),
} satisfies Record<LeadType, z.ZodType>;

export type Lead = {
  id: string;
  type: LeadType;
  createdAt: string;
  fields: Record<string, string>;
};

/**
 * Where leads are kept. This version appends one JSON object per line to a file
 * in .data/ (not committed). It works on any Node server. On Cloudflare Workers
 * there is no file system: replace this function with an insert into D1 when
 * the site is deployed there. Nothing else in the forms needs to change.
 */
export async function saveLead(lead: Lead) {
  const dir = path.join(process.cwd(), ".data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "leads.jsonl"), JSON.stringify(lead) + "\n", "utf8");
}

/**
 * Tells the team about a new lead. If LEAD_WEBHOOK_URL is set, the lead is
 * posted there as JSON (an email service, a chat channel or a CRM can receive
 * it). Without it, the lead is only stored. A failure here never loses the
 * lead, because it has already been saved.
 */
export async function notifyTeam(lead: Lead) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    console.error("Lead notification failed", lead.id, error);
  }
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
