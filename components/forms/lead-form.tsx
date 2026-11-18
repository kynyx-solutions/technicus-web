"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useId, useState } from "react";
import { submitLead, type FormState } from "@/app/actions";

type Field = {
  name: string;
  label: string;
  kind?: "text" | "email" | "tel" | "url" | "textarea" | "datetime-local" | "chips" | "choice";
  required?: boolean;
  options?: string[];
  autoComplete?: string;
  placeholder?: string;
  half?: boolean;
};

type FormType = "consultation" | "brief" | "nda" | "career" | "local";

const budgets = ["Not sure yet", "Under $10k", "$10k to $50k", "$50k to $150k", "Over $150k"];
const timelines = ["As soon as possible", "Within 3 months", "3 to 6 months", "Not decided"];

const name: Field = { name: "name", label: "Your name", required: true, autoComplete: "name", half: true };
const email: Field = { name: "email", label: "Work email", kind: "email", required: true, autoComplete: "email", half: true };
const company: Field = { name: "company", label: "Company", required: true, autoComplete: "organization", half: true };
const country: Field = { name: "country", label: "Country", autoComplete: "country-name", half: true };

const forms: Record<FormType, { fields: Field[]; submit: string }> = {
  consultation: {
    submit: "Request a consultation",
    fields: [
      { name: "topic", label: "I would like to talk about…", kind: "chips" },
      name,
      email,
      company,
      country,
      { name: "preferredTime", label: "Preferred date and time", kind: "datetime-local", half: true },
      { name: "timeZone", label: "Your time zone", half: true },
      { name: "message", label: "Anything we should know beforehand", kind: "textarea" },
    ],
  },
  brief: {
    submit: "Send the brief",
    fields: [
      { name: "service", label: "I'm interested in…", kind: "chips" },
      name,
      email,
      company,
      { name: "role", label: "Your role", autoComplete: "organization-title", half: true },
      country,
      { name: "message", label: "Tell us about the project", kind: "textarea", required: true },
      { name: "budget", label: "Budget", kind: "choice", options: budgets },
      { name: "timeline", label: "Timeline", kind: "choice", options: timelines },
    ],
  },
  nda: {
    submit: "Request an NDA",
    fields: [name, email, company, { name: "message", label: "Anything to add", kind: "textarea" }],
  },
  career: {
    submit: "Send application",
    fields: [
      name,
      { ...email, label: "Email" },
      { name: "phone", label: "Phone", kind: "tel", autoComplete: "tel", half: true },
      { name: "role", label: "Role you are interested in", half: true },
      { name: "link", label: "Link to your CV, LinkedIn or portfolio", kind: "url", required: true, placeholder: "https://" },
      { name: "message", label: "A few lines about you", kind: "textarea" },
    ],
  },
  local: {
    submit: "Send enquiry",
    fields: [
      name,
      { name: "phone", label: "Phone", kind: "tel", required: true, autoComplete: "tel", half: true },
      { name: "message", label: "What do you need?", kind: "textarea", required: true },
    ],
  },
};

type Props = {
  type: FormType;
  /** Options for the pill buttons on the brief and consultation forms. */
  services?: string[];
  /** Values to fill in before the visitor types, for example the role title. */
  defaults?: Record<string, string>;
  /** "dark" when the form sits on a black section. */
  tone?: "light" | "dark";
};

export function LeadForm({ type, services = [], defaults, tone = "light" }: Props) {
  const id = useId();
  const pathname = usePathname();
  const [state, action, pending] = useActionState<FormState, FormData>(submitLead, {});
  const [started, setStarted] = useState("");
  const [zone, setZone] = useState("");
  const config = forms[type];
  const dark = tone === "dark";

  useEffect(() => {
    // Set after the page is live: the time the form was opened, and the
    // visitor's time zone so that a requested call time is unambiguous.
    const timer = window.setTimeout(() => {
      setStarted(String(Date.now()));
      setZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const value = (field: string) => state.values?.[field] ?? defaults?.[field] ?? (field === "timeZone" ? zone : "");
  const chosen = (field: string) => value(field).split(", ").filter(Boolean);

  const pill = `inline-flex cursor-pointer items-center rounded-full border px-5 py-3 text-lg leading-none transition-colors md:px-6 md:text-[1.35rem] ${
    dark
      ? "border-white/40 peer-checked:border-white peer-checked:bg-white peer-checked:text-black hover:border-white"
      : "border-black/30 peer-checked:border-black peer-checked:bg-black peer-checked:text-white hover:border-black"
  } peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo`;

  return (
    <form action={action} noValidate className="grid gap-x-10 gap-y-10 md:grid-cols-2">
      <input type="hidden" name="type" value={type} />
      <input type="hidden" name="source" value={pathname} />
      <input type="hidden" name="started" value={started} />
      {/* Hidden from people; bots tend to fill it in. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {config.fields.map((field) => {
        const fieldId = `${id}-${field.name}`;
        const error = state.errors?.[field.name];
        const errorText = error && (
          <p id={`${fieldId}-error`} className="mt-3 text-[0.95rem] text-[#d6336c]">
            {error}
          </p>
        );

        if (field.kind === "chips" || field.kind === "choice") {
          const options = field.kind === "chips" ? services : (field.options ?? []);
          if (options.length === 0) return null;
          const multiple = field.kind === "chips";
          return (
            <fieldset key={field.name} className="md:col-span-2" aria-describedby={error ? `${fieldId}-error` : undefined}>
              <legend className={`mb-5 text-xl md:text-2xl ${dark ? "text-white" : "text-black"}`}>{field.label}</legend>
              <div className="flex flex-wrap gap-2.5 md:gap-3">
                {options.map((option) => (
                  <label key={option}>
                    <input
                      type={multiple ? "checkbox" : "radio"}
                      name={field.name}
                      value={option}
                      defaultChecked={chosen(field.name).includes(option)}
                      className="peer sr-only"
                    />
                    <span className={pill}>{option}</span>
                  </label>
                ))}
              </div>
              {errorText}
            </fieldset>
          );
        }

        const common = {
          id: fieldId,
          name: field.name,
          required: field.required,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? `${fieldId}-error` : undefined,
          className: "field",
        };
        return (
          <div key={`${field.name}-${value(field.name)}`} className={field.half ? "" : "md:col-span-2"}>
            <label htmlFor={fieldId} className={`block text-[0.95rem] ${dark ? "text-white/60" : "text-black/55"}`}>
              {field.label}
              {field.required && <span className="text-[#d6336c]"> *</span>}
            </label>
            {field.kind === "textarea" ? (
              <textarea {...common} rows={3} defaultValue={value(field.name)} />
            ) : (
              <input
                {...common}
                type={field.kind ?? "text"}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                defaultValue={value(field.name)}
              />
            )}
            {errorText}
          </div>
        );
      })}

      <div className="md:col-span-2">
        <label className={`flex items-start gap-3 text-[0.95rem] ${dark ? "text-white/70" : "text-black/65"}`}>
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-black" />
          <span>
            I agree that Technicus may store these details and use them to reply to me, as described in the{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {state.errors?.consent && <p className="mt-2 text-[0.95rem] text-[#d6336c]">{state.errors.consent}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-6 md:col-span-2">
        <button type="submit" disabled={pending} className={`${dark ? "btn-light" : "btn-dark"} px-8 py-5 text-lg disabled:opacity-60`} data-magnetic>
          {pending ? "Sending…" : config.submit}
        </button>
        <p role="status" aria-live="polite" className="text-[0.95rem] text-[#d6336c]">
          {state.message}
        </p>
      </div>
    </form>
  );
}
