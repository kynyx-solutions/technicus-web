"use client";

import { Check as CheckIcon, ChevronDown, Circle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Badge, btn, input, Stat } from "@/components/admin/ui";
import type { PageAudit } from "@/lib/admin/audit";
import { scoreTone } from "@/lib/admin/seo-analyze";
import type { SitePage } from "@/lib/site-pages";
import { auditPages } from "./actions";

type Audit = Omit<PageAudit, "html" | "text">;

const editLink = (path: string) =>
  path.startsWith("/insights/") && !path.startsWith("/insights/authors")
    ? "/admin/content/articles"
    : path.startsWith("/work/")
      ? "/admin/content/projects"
      : path.startsWith("/careers/")
        ? "/admin/content/jobs"
        : `/admin/seo/pages?path=${encodeURIComponent(path)}`;

export function SeoHealth({ pages, siteUrl }: { pages: SitePage[]; siteUrl: string }) {
  const [results, setResults] = useState<Record<string, Audit>>({});
  const [running, setRunning] = useState(false);
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("");
  const started = useRef(false);

  const run = async () => {
    setRunning(true);
    setResults({});
    for (let i = 0; i < pages.length; i += 6) {
      const batch = await auditPages(pages.slice(i, i + 6).map((p) => p.path));
      setResults((r) => ({ ...r, ...Object.fromEntries(batch.map((a) => [a.path, a])) }));
    }
    setRunning(false);
  };
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const t = window.setTimeout(run, 0);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const done = Object.values(results);
  const duplicates = useMemo(() => {
    const count = (key: "title" | "description") => {
      const m = new Map<string, number>();
      for (const a of done) if (a[key]) m.set(a[key], (m.get(a[key]) ?? 0) + 1);
      return m;
    };
    return { title: count("title"), description: count("description") };
  }, [done]);

  const withDupes = done.map((a) => {
    const extra = [];
    if ((duplicates.title.get(a.title) ?? 0) > 1) extra.push({ id: "dup-title", status: "bad" as const, text: "Another page has the same title." });
    if ((duplicates.description.get(a.description) ?? 0) > 1) extra.push({ id: "dup-desc", status: "ok" as const, text: "Another page has the same description." });
    return { ...a, checks: [...extra, ...a.checks], score: extra.length ? Math.max(0, a.score - extra.length * 6) : a.score };
  });
  // Pages kept out of search on purpose (placeholders, legal texts) are listed
  // separately and not counted.
  const indexed = withDupes.filter((a) => !a.noindex);
  const hidden = withDupes.filter((a) => a.noindex);
  const avg = indexed.length ? Math.round(indexed.reduce((s, a) => s + a.score, 0) / indexed.length) : 0;
  const weak = indexed.filter((a) => a.score < 95).length;
  const critical = indexed.reduce((s, a) => s + a.checks.filter((c) => c.status === "bad").length, 0);
  const groups = [...new Set(pages.map((p) => p.group))];
  const groupOf = new Map(pages.map((p) => [p.path, p.group]));
  const term = q.trim().toLowerCase();
  const shown = indexed
    .filter((a) => (!group || groupOf.get(a.path) === group) && (!term || `${a.path} ${a.title}`.toLowerCase().includes(term)))
    .sort((a, b) => a.score - b.score);

  return (
    <>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Average SEO score" value={done.length ? avg : "…"} sub={running ? `Checking ${done.length} of ${pages.length} pages` : `${indexed.length} pages in search`} />
        <Stat label="Pages needing work" value={done.length ? weak : "…"} sub="Score under 95" />
        <Stat label="Problems" value={done.length ? critical : "…"} sub="Red items across all pages" />
        <div className="flex flex-col justify-between rounded-[22px] bg-white p-5 md:p-6">
          <p className="text-[0.85rem] text-black/55">Check again after changes</p>
          <button type="button" disabled={running} onClick={run} className={`${btn.primary} mt-3`}>
            {running ? "Checking…" : "Run the check"}
          </button>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages" className={`${input} md:!w-72`} />
        <select aria-label="Page type" value={group} onChange={(e) => setGroup(e.target.value)} className={`${input} !w-auto`}>
          <option value="">All pages</option>
          {groups.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
      </div>

      <ul className="space-y-2">
        {shown.map((a) => (
          <li key={a.path}>
            <details className="group rounded-[18px] bg-white">
              <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                <Badge tone={scoreTone(a.score)}>{a.score}</Badge>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{a.title || "No title"}</span>
                  <span className="block truncate text-[0.82rem] text-black/50">
                    {a.path} · {groupOf.get(a.path)} · {a.words} words
                  </span>
                </span>
                {a.noindex && <Badge tone="red">noindex</Badge>}
                <ChevronDown size={17} className="text-black/40 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-black/6 px-4 py-4">
                <ul className="space-y-1.5 text-[0.88rem]">
                  {a.checks.map((c) => (
                    <li key={c.id} className="flex gap-2">
                      {c.status === "good" ? <CheckIcon size={16} className="mt-0.5 shrink-0 text-[#14715f]" /> : c.status === "ok" ? <Circle size={14} className="mt-1 shrink-0 text-[#c08a00]" /> : <X size={16} className="mt-0.5 shrink-0 text-[#b4234f]" />}
                      <span className="text-black/75">{c.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href={editLink(a.path)} className={`${btn.primary} ${btn.small}`}>
                    Edit SEO
                  </Link>
                  <a href={a.path} target="_blank" className={`${btn.secondary} ${btn.small}`}>
                    View page
                  </a>
                  <a href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(siteUrl + a.path)}`} target="_blank" rel="noreferrer" className={`${btn.secondary} ${btn.small}`}>
                    Rich results test
                  </a>
                  <a href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(siteUrl + a.path)}`} target="_blank" rel="noreferrer" className={`${btn.secondary} ${btn.small}`}>
                    PageSpeed
                  </a>
                </div>
              </div>
            </details>
          </li>
        ))}
      </ul>

      {hidden.length > 0 && (
        <details className="mt-6 rounded-[18px] bg-white px-4 py-3">
          <summary className="cursor-pointer text-[0.92rem] font-medium">
            {hidden.length} pages kept out of search on purpose <span className="font-normal text-black/50">(not counted)</span>
          </summary>
          <ul className="mt-3 space-y-1 text-[0.88rem] text-black/65">
            {hidden.map((a) => (
              <li key={a.path} className="flex justify-between gap-3">
                <a href={a.path} target="_blank" className="hover:underline">
                  {a.path}
                </a>
                <Link href={editLink(a.path)} className="text-black/45 hover:text-black">
                  Change
                </Link>
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}
