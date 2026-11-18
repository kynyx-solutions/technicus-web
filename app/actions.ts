"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { allowed, leadTypes, notifyTeam, saveLead, schemas, type LeadType } from "@/lib/leads";

export type FormState = {
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

export async function submitLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const type = formData.get("type");
  if (typeof type !== "string" || !leadTypes.includes(type as LeadType)) {
    return { message: "This form could not be sent. Please reload the page and try again." };
  }

  const values: Record<string, string> = {};
  // Pill buttons can send several values under one name; they are joined.
  for (const key of new Set(formData.keys())) {
    if (key.startsWith("$")) continue;
    values[key] = formData
      .getAll(key)
      .filter((v): v is string => typeof v === "string")
      .join(", ");
  }

  // Spam traps: a field people cannot see, and a form sent faster than a person
  // can type. Both pretend to succeed so that a bot learns nothing.
  const started = Number(values.started || 0);
  const tooFast = started > 0 && Date.now() - started < 2500;
  if (values.website || tooFast) redirect(`/contact/thank-you/${type}`);

  const requestHeaders = await headers();
  const address =
    requestHeaders.get("cf-connecting-ip") ??
    requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";
  if (!allowed(address)) {
    return { values, message: "Too many messages from this connection. Please try again in a few minutes, or email us." };
  }

  const parsed = schemas[type as LeadType].safeParse(values);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "");
      if (field && !errors[field]) errors[field] = issue.message;
    }
    return { values, errors, message: "Please check the marked fields." };
  }

  const fields = { ...(parsed.data as Record<string, string>) };
  delete fields.consent;
  const lead = {
    id: randomUUID(),
    type: type as LeadType,
    createdAt: new Date().toISOString(),
    fields: { ...fields, consent: "yes" },
  };

  try {
    await saveLead(lead);
  } catch (error) {
    console.error("Lead could not be saved", error);
    return { values, message: "We could not save your message. Please email us instead." };
  }
  await notifyTeam(lead);

  redirect(`/contact/thank-you/${type}`);
}
