"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useState } from "react";
import { submitApplication, type FormState } from "@/app/actions";

type Props = {
  /** Open roles to choose from. An open application is always possible. */
  roles: string[];
  /** Fixes the role, on a role's own page. */
  role?: string;
};

const OPEN = "Open application";

/** The job application form, with a CV upload. Always on a dark section. */
export function ApplicationForm({ roles, role }: Props) {
  const id = useId();
  const [state, action, pending] = useActionState<FormState, FormData>(submitApplication, {});
  const [started, setStarted] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setStarted(String(Date.now())), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const value = (f: string) => state.values?.[f] ?? (f === "role" ? (role ?? "") : "");
  const options = [...roles, OPEN];

  const text = (name: string, label: string, opts: { type?: string; required?: boolean; half?: boolean; autoComplete?: string; placeholder?: string } = {}) => {
    const fieldId = `${id}-${name}`;
    const error = state.errors?.[name];
    return (
      <div key={`${name}-${value(name)}`} className={opts.half ? "" : "md:col-span-2"}>
        <label htmlFor={fieldId} className="block text-[0.95rem] text-white/60">
          {label}
          {opts.required && <span className="text-[#ff6b9a]"> *</span>}
        </label>
        {opts.type === "textarea" ? (
          <textarea id={fieldId} name={name} rows={3} className="field" defaultValue={value(name)} aria-invalid={error ? true : undefined} />
        ) : (
          <input
            id={fieldId}
            name={name}
            type={opts.type ?? "text"}
            required={opts.required}
            autoComplete={opts.autoComplete}
            placeholder={opts.placeholder}
            defaultValue={value(name)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className="field"
          />
        )}
        {error && (
          <p id={`${fieldId}-error`} className="mt-3 text-[0.95rem] text-[#ff6b9a]">
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <form action={action} noValidate className="grid gap-x-10 gap-y-10 md:grid-cols-2">
      <input type="hidden" name="started" value={started} />
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {role ? (
        <input type="hidden" name="role" value={role} />
      ) : (
        <fieldset className="md:col-span-2">
          <legend className="mb-3 text-[0.95rem] font-medium text-white">I&apos;m applying for…</legend>
          <div className="flex flex-wrap gap-2.5 md:gap-3">
            {options.map((option) => (
              <label key={option}>
                <input type="radio" name="role" value={option} defaultChecked={(value("role") || OPEN) === option} className="peer sr-only" />
                <span className="inline-flex cursor-pointer items-center border border-white/30 px-4 py-2.5 text-[0.95rem] leading-none font-medium transition-colors peer-checked:border-white peer-checked:bg-white peer-checked:text-navy peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo hover:border-white">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {text("name", "Your name", { required: true, half: true, autoComplete: "name" })}
      {text("email", "Email", { type: "email", required: true, half: true, autoComplete: "email" })}
      {text("phone", "Phone", { type: "tel", half: true, autoComplete: "tel" })}
      {text("city", "City", { half: true, autoComplete: "address-level2" })}

      <div className="md:col-span-2">
        <label htmlFor={`${id}-cv`} className="block text-[0.95rem] text-white/60">
          Your CV (PDF or Word, up to 4 MB)<span className="text-[#ff6b9a]"> *</span>
        </label>
        <input
          id={`${id}-cv`}
          name="cv"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          aria-invalid={state.errors?.cv ? true : undefined}
          className="mt-3 block w-full text-lg text-white/80 file:mr-5 file:cursor-pointer file:border-0 file:bg-white file:px-6 file:py-3 file:text-base file:font-medium file:text-black hover:file:bg-smoke"
        />
        {state.errors?.cv && <p className="mt-3 text-[0.95rem] text-[#ff6b9a]">{state.errors.cv}</p>}
      </div>

      {text("link", "LinkedIn or portfolio (optional)", { type: "url", placeholder: "https://" })}
      {text("message", "A few lines about you", { type: "textarea" })}

      <div className="md:col-span-2">
        <label className="flex items-start gap-3 text-[0.95rem] text-white/70">
          <input type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-white" />
          <span>
            I agree that Technicus may store my application and CV to consider me for roles, as described in the{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              privacy policy
            </Link>
            .
          </span>
        </label>
        {state.errors?.consent && <p className="mt-2 text-[0.95rem] text-[#ff6b9a]">{state.errors.consent}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-6 md:col-span-2">
        <button type="submit" disabled={pending} className="btn-light px-8 py-5 text-lg disabled:opacity-60">
          {pending ? "Sending…" : "Send application"}
        </button>
        <p role="status" aria-live="polite" className="text-[0.95rem] text-[#ff6b9a]">
          {state.message}
        </p>
      </div>
    </form>
  );
}
