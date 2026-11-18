"use server";

import { z } from "zod";
import { refreshSite } from "@/lib/admin/refresh";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

type Result = { ok: boolean; error?: string; errors?: Record<string, string> };

const str = (max: number) => z.string().trim().max(max);
const link = z
  .string()
  .trim()
  .max(300)
  .refine((v) => v === "" || /^https:\/\//.test(v), "Use a full link starting with https://");

const homeSchema = z.object({
  heroTitle: str(120).min(1, "The headline is required."),
  heroLead: str(400),
  introText: str(800),
  workTitle: str(80),
  howText: str(600),
  industriesTitle: str(80),
  industriesLead: str(300),
  insightsTitle: str(80),
  faqs: z.array(z.object({ q: str(300).min(1), a: str(2000).min(1) })).max(20),
  closingTitle: str(120),
  closingLead: str(400),
  clients: z
    .array(
      z.object({
        name: str(80).min(1, "Each client needs a name."),
        logo: z.string().trim().max(500).refine((v) => v === "" || v.startsWith("/") || /^https:\/\//.test(v), "Upload an image or use an https:// link").optional(),
        url: link.optional(),
      }),
    )
    .max(40),
  stats: z.array(z.object({ value: z.number().min(0), suffix: str(6).optional(), label: str(80).min(1) })).max(6),
});

const contactSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  phone: str(40),
  whatsapp: str(40),
  linkedin: link,
  x: link,
  facebook: link,
  instagram: link,
  offices: z
    .array(
      z.object({
        city: str(80).min(1, "Each office needs a city."),
        country: str(80).min(1),
        lines: z.array(str(160)).max(6),
        timeZone: str(60).refine((tz) => {
          try {
            new Intl.DateTimeFormat("en", { timeZone: tz });
            return true;
          } catch {
            return false;
          }
        }, "Use a time zone such as Asia/Kolkata."),
        lat: z.number().min(-90).max(90),
        lon: z.number().min(-180).max(180),
        hq: z.boolean().optional(),
      }),
    )
    .max(12),
});

function issues(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const i of error.issues) {
    const key = i.path.join(".");
    if (!errors[key]) errors[key] = i.message;
  }
  return errors;
}

async function save<S extends z.ZodType>(key: string, schema: S, value: unknown): Promise<Result> {
  await requireAdmin();
  const parsed = schema.safeParse(value);
  if (!parsed.success) return { ok: false, error: "Please check the marked fields.", errors: issues(parsed.error) };
  await db().setSetting(key, parsed.data);
  refreshSite();
  return { ok: true };
}

export async function saveHome(value: unknown) {
  return save("home", homeSchema, value);
}

export async function saveContact(value: unknown) {
  return save("contact", contactSchema, value);
}

export async function resetSetting(key: "home" | "contact") {
  await requireAdmin();
  await db().setSetting(key, {});
  refreshSite();
  return { ok: true };
}
