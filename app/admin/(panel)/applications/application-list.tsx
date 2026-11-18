"use client";

import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ActionButton, useToast } from "@/components/admin/client";
import { Badge, btn, fmtDateTime, input, label, statusTone, timeAgo } from "@/components/admin/ui";
import { applicationStatuses, type ApplicationRow } from "@/lib/db/types";
import { deleteApplication, updateApplication } from "./actions";

export function ApplicationList({ items, roles }: { items: ApplicationRow[]; roles: string[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(params.get("q") ?? "");
  const role = params.get("role") ?? "";
  const status = params.get("status") ?? "";

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next}`);
  };

  const term = q.trim().toLowerCase();
  const shown = items.filter(
    (a) =>
      (!role || a.role === role) &&
      (!status || a.status === status) &&
      (!term || [a.name, a.email, a.phone, a.city, a.ref].join(" ").toLowerCase().includes(term)),
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, phone, city" className={`${input} !w-full md:!w-72`} />
        <select aria-label="Role" value={role} onChange={(e) => set("role", e.target.value)} className={`${input} !w-auto`}>
          <option value="">All roles</option>
          {roles.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select aria-label="Status" value={status} onChange={(e) => set("status", e.target.value)} className={`${input} !w-auto`}>
          <option value="">All statuses</option>
          {applicationStatuses.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
        <span className="ml-auto text-sm text-black/50">
          {shown.length} of {items.length}
        </span>
      </div>
      <ul className="space-y-2">
        {shown.map((a) => (
          <Application key={a.id} a={a} />
        ))}
      </ul>
    </>
  );
}

function Application({ a }: { a: ApplicationRow }) {
  const toast = useToast();
  const [notes, setNotes] = useState(a.notes);
  const [pending, start] = useTransition();
  const save = (patch: { status?: string; notes?: string }) =>
    start(async () => {
      const r = await updateApplication(a.id, patch);
      toast(r.ok ? "Saved" : (r.error ?? "Something went wrong"), r.ok ? "ok" : "error");
    });
  const digits = a.phone.replace(/\D/g, "");
  const intl = digits.length === 10 ? `91${digits}` : digits;

  return (
    <li>
      <details className="group rounded-[22px] bg-white">
        <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lavender font-medium text-indigo uppercase">{a.name.charAt(0)}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{a.name}</span>
            <span className="block truncate text-[0.85rem] text-black/55">
              {a.role}
              {a.city && ` · ${a.city}`}
            </span>
          </span>
          <Badge tone={statusTone[a.status]}>{label(a.status)}</Badge>
          <span className="hidden text-[0.85rem] text-black/50 sm:block">{timeAgo(a.created_at)}</span>
          <ChevronDown size={18} className="text-black/40 transition-transform group-open:rotate-180" />
        </summary>
        <div className="grid gap-6 border-t border-black/8 px-5 py-5 lg:grid-cols-3">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[0.9rem] lg:col-span-2">
            {[
              ["Reference", a.ref],
              ["Role", a.role],
              ["Email", a.email],
              ["Phone", a.phone],
              ["City", a.city],
              ["Received", fmtDateTime(a.created_at)],
              ["CV", a.cv_name],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.78rem] text-black/50">{k}</dt>
                  <dd className="break-words">{v}</dd>
                </div>
              ))}
            {a.link && (
              <div className="col-span-2">
                <dt className="text-[0.78rem] text-black/50">Link</dt>
                <dd>
                  <a href={a.link} target="_blank" rel="noreferrer" className="break-all underline underline-offset-2">
                    {a.link}
                  </a>
                </dd>
              </div>
            )}
            {a.message && (
              <div className="col-span-2">
                <dt className="text-[0.78rem] text-black/50">About them</dt>
                <dd className="whitespace-pre-wrap">{a.message}</dd>
              </div>
            )}
          </dl>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {a.cv_path && (
                <a href={`/admin/applications/${a.id}/cv`} className={`${btn.primary} ${btn.small}`}>
                  Download CV
                </a>
              )}
              {a.email && (
                <a href={`mailto:${a.email}?subject=${encodeURIComponent(`Your application to Technicus (${a.ref})`)}`} className={`${btn.secondary} ${btn.small}`}>
                  Email
                </a>
              )}
              {digits.length >= 8 && (
                <>
                  <a href={`tel:+${intl}`} className={`${btn.secondary} ${btn.small}`}>
                    Call
                  </a>
                  <a href={`https://wa.me/${intl}`} target="_blank" rel="noreferrer" className={`${btn.secondary} ${btn.small}`}>
                    WhatsApp
                  </a>
                </>
              )}
            </div>
            <label className="block">
              <span className="mb-1.5 block text-[0.85rem] font-medium text-black/75">Status</span>
              <select disabled={pending} defaultValue={a.status} onChange={(e) => save({ status: e.target.value })} className={input}>
                {applicationStatuses.map((s) => (
                  <option key={s} value={s}>
                    {label(s)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[0.85rem] font-medium text-black/75">Private notes</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} maxLength={4000} className={input} />
            </label>
            <div className="flex justify-between gap-2">
              <ActionButton
                action={() => deleteApplication(a.id)}
                confirm={{ title: `Delete ${a.name}'s application?`, text: "The application and the CV file are removed for good.", confirm: "Delete", danger: true }}
                done="Application deleted"
                className={`${btn.danger} ${btn.small}`}
              >
                Delete
              </ActionButton>
              <button type="button" disabled={pending || notes === a.notes} onClick={() => save({ notes })} className={`${btn.primary} ${btn.small}`}>
                Save notes
              </button>
            </div>
          </div>
        </div>
      </details>
    </li>
  );
}
