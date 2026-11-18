"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  allowed,
  applicationSchema,
  CV_MAX_BYTES,
  CV_TYPES,
  leadTypes,
  looksLikeCv,
  notifyTeam,
  saveApplication,
  saveLead,
  schemas,
  type LeadType,
} from "@/lib/leads";

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

  const address = await visitorAddress();
  if (!allowed(address)) {
    return { values, message: "Too many messages from this connection. Please try again in a few minutes, or email us." };
  }

  const parsed = schemas[type as LeadType].safeParse(values);
  if (!parsed.success) {
    return { values, errors: firstErrors(parsed.error.issues), message: "Please check the marked fields." };
  }

  const fields = { ...(parsed.data as Record<string, string>), consent: "yes" };
  let lead;
  try {
    lead = await saveLead(type as LeadType, fields, address);
  } catch (error) {
    console.error("Lead could not be saved", error);
    return { values, message: "We could not save your message. Please email us instead." };
  }
  await notifyTeam("lead", lead);

  redirect(`/contact/thank-you/${type}`);
}

async function visitorAddress() {
  const h = await headers();
  return h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}

const firstErrors = (issues: { path: PropertyKey[]; message: string }[]) => {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    const field = String(issue.path[0] ?? "");
    if (field && !errors[field]) errors[field] = issue.message;
  }
  return errors;
};

/** The careers form: details plus a CV file, stored privately. */
export async function submitApplication(_prev: FormState, formData: FormData): Promise<FormState> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) if (typeof value === "string" && !key.startsWith("$")) values[key] = value;

  const started = Number(values.started || 0);
  if (values.website || (started > 0 && Date.now() - started < 2500)) redirect("/contact/thank-you/career");

  const address = await visitorAddress();
  if (!allowed(address)) return { values, message: "Too many submissions from this connection. Please try again later." };

  const parsed = applicationSchema.safeParse(values);
  const errors = parsed.success ? {} : firstErrors(parsed.error.issues);

  const file = formData.get("cv");
  let cv: { bytes: Buffer; name: string; type: string } | null = null;
  if (!(file instanceof File) || file.size === 0) errors.cv = "Please attach your CV.";
  else if (file.size > CV_MAX_BYTES) errors.cv = "The file is larger than 4 MB.";
  else if (!CV_TYPES[file.type]) errors.cv = "Please attach a PDF or Word document.";
  else {
    const bytes = Buffer.from(await file.arrayBuffer());
    if (!looksLikeCv(bytes)) errors.cv = "This file does not look like a PDF or Word document.";
    else cv = { bytes, name: file.name, type: file.type };
  }

  if (!parsed.success || !cv || Object.keys(errors).length) {
    return { values, errors, message: "Please check the marked fields." };
  }

  let application;
  try {
    application = await saveApplication(parsed.data, cv, address);
  } catch (error) {
    console.error("Application could not be saved", error);
    return { values, message: "We could not save your application. Please email us instead." };
  }
  await notifyTeam("application", application);
  redirect("/contact/thank-you/career");
}
