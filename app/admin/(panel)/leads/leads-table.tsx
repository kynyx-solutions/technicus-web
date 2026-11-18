"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useConfirm, useToast } from "@/components/admin/client";
import { Badge, btn, input, label, priorityTone, statusTone, timeAgo } from "@/components/admin/ui";
import { leadStatuses, priorities, type LeadRow } from "@/lib/db/types";
import { bulkLeads } from "./actions";

export function LeadFilters({ services, sorts, forms }: { services: string[]; sorts: Record<string, string>; forms: Record<string, string> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    router.replace(`${pathname}?${next}`);
  };

  useEffect(() => {
    // Search as the owner types, after a short pause.
    if (q === (params.get("q") ?? "")) return;
    const t = window.setTimeout(() => set("q", q), 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const select = (key: string, all: string, options: [string, string][]) => (
    <select aria-label={all} value={params.get(key) ?? ""} onChange={(e) => set(key, e.target.value)} className={`${input} !w-auto`}>
      <option value="">{all}</option>
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
  const active = ["q", "status", "priority", "service", "type", "from", "to", "sort"].some((k) => params.get(k));

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, company, reference" className={`${input} !w-full md:!w-72`} />
      {select("status", "All statuses", leadStatuses.map((s) => [s, label(s)]))}
      {select("priority", "All priorities", priorities.map((s) => [s, label(s)]))}
      {select("type", "All forms", Object.entries(forms))}
      {services.length > 0 && select("service", "All services", services.map((s) => [s, s]))}
      <input type="date" aria-label="From" value={params.get("from") ?? ""} onChange={(e) => set("from", e.target.value)} className={`${input} !w-auto`} />
      <input type="date" aria-label="To" value={params.get("to") ?? ""} onChange={(e) => set("to", e.target.value)} className={`${input} !w-auto`} />
      {select("sort", "Newest first", Object.entries(sorts).filter(([k]) => k !== "newest"))}
      {active && (
        <button
          type="button"
          className={btn.ghost}
          onClick={() => {
            setQ("");
            router.replace(pathname);
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export function LeadTable({ items }: { items: LeadRow[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [pending, start] = useTransition();
  const ask = useConfirm();
  const toast = useToast();
  const router = useRouter();
  const all = items.length > 0 && selected.length === items.length;

  const run = (action: "status" | "delete") =>
    start(async () => {
      if (action === "delete" && !(await ask({ title: `Delete ${selected.length} lead${selected.length > 1 ? "s" : ""}?`, text: "This cannot be undone.", confirm: "Delete", danger: true })))
        return;
      const r = await bulkLeads(selected, action, status);
      if (!r.ok) return toast(r.error ?? "Something went wrong", "error");
      toast(action === "delete" ? "Deleted" : "Status updated");
      setSelected([]);
      setStatus("");
    });

  return (
    <div className="overflow-hidden rounded-[22px] bg-white">
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-black/8 bg-lavender/60 px-4 py-3 text-sm">
          <span className="font-medium">{selected.length} selected</span>
          <select aria-label="Set status" value={status} onChange={(e) => setStatus(e.target.value)} className={`${input} !w-auto !py-1.5`}>
            <option value="">Set status…</option>
            {leadStatuses.map((s) => (
              <option key={s} value={s}>
                {label(s)}
              </option>
            ))}
          </select>
          <button type="button" disabled={!status || pending} onClick={() => run("status")} className={`${btn.primary} ${btn.small}`}>
            Apply
          </button>
          <button type="button" disabled={pending} onClick={() => run("delete")} className={`${btn.danger} ${btn.small}`}>
            Delete
          </button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-[0.9rem]">
          <thead className="border-b border-black/8">
            <tr>
              <th className="w-10 px-4 py-3">
                <input type="checkbox" aria-label="Select all" checked={all} onChange={() => setSelected(all ? [] : items.map((i) => i.id))} className="h-4 w-4 accent-black" />
              </th>
              {["Contact", "Services", "Budget", "Priority", "Status", "Received"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[0.78rem] font-medium tracking-[0.02em] text-black/50 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((l) => (
              <tr key={l.id} className="cursor-pointer border-b border-black/5 last:border-0 hover:bg-fog" onClick={() => router.push(`/admin/leads/${l.id}`)}>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    aria-label={`Select ${l.name}`}
                    checked={selected.includes(l.id)}
                    onChange={() => setSelected((s) => (s.includes(l.id) ? s.filter((x) => x !== l.id) : [...s, l.id]))}
                    className="h-4 w-4 accent-black"
                  />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${l.id}`} className="font-medium hover:underline" onClick={(e) => e.stopPropagation()}>
                    {l.name || "No name"}
                  </Link>
                  <span className="block text-[0.82rem] text-black/55">
                    {[l.company, l.email].filter(Boolean).join(" · ")}
                  </span>
                </td>
                <td className="max-w-[16rem] px-4 py-3 text-black/70">{l.services.join(", ") || "–"}</td>
                <td className="px-4 py-3 text-black/70">{l.budget || "–"}</td>
                <td className="px-4 py-3">
                  <Badge tone={priorityTone[l.priority]}>{label(l.priority)}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[l.status]}>{label(l.status)}</Badge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-black/60" title={new Date(l.created_at).toLocaleString()}>
                  {timeAgo(l.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Pager({ page, pages, total, limit }: { page: number; pages: number; total: number; limit: number }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const href = (p: number) => {
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    return `${pathname}?${next}`;
  };
  const from = total ? (page - 1) * limit + 1 : 0;
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-black/60">
      <span>
        {from}–{Math.min(page * limit, total)} of {total}
      </span>
      <span className="flex gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={`${btn.secondary} ${btn.small}`}>
            Previous
          </Link>
        ) : null}
        {page < pages ? (
          <Link href={href(page + 1)} className={`${btn.secondary} ${btn.small}`}>
            Next
          </Link>
        ) : null}
      </span>
    </div>
  );
}
