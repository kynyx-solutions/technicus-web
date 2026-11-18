"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/admin/client";
import { Badge, btn, timeAgo } from "@/components/admin/ui";
import type { PageSpeedRow } from "@/lib/db/types";
import { runPageSpeed } from "../actions";

const tone = (n?: number) => (n === undefined ? "neutral" : n >= 90 ? "green" : n >= 50 ? "amber" : "red");
const names: Record<string, string> = { performance: "Speed", accessibility: "Accessibility", "best-practices": "Best practices", seo: "SEO" };

export function Speed({ pages, runs, base }: { pages: string[]; runs: PageSpeedRow[]; base: string }) {
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [busy, setBusy] = useState<string | null>(null);
  const toast = useToast();
  const router = useRouter();
  const latest = (path: string) => runs.filter((r) => r.path === path && r.strategy === strategy);

  return (
    <>
      <div className="mb-4 inline-flex rounded-full bg-white p-1">
        {(["mobile", "desktop"] as const).map((s) => (
          <button key={s} type="button" onClick={() => setStrategy(s)} className={`rounded-full px-4 py-1.5 text-sm ${strategy === s ? "bg-black text-white" : "text-black/65"}`}>
            {s === "mobile" ? "Phone" : "Desktop"}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {pages.map((path) => {
          const [run, previous] = latest(path);
          const change = run && previous ? run.scores.performance - previous.scores.performance : 0;
          return (
            <li key={path} className="rounded-[18px] bg-white p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{path}</span>
                  <span className="block text-[0.8rem] text-black/50">{run ? `Tested ${timeAgo(run.created_at)}` : "Not tested yet"}</span>
                </span>
                {run &&
                  Object.entries(run.scores).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1.5 text-[0.82rem] text-black/60">
                      {names[k] ?? k} <Badge tone={tone(v)}>{v}</Badge>
                    </span>
                  ))}
                {change !== 0 && <span className={`text-[0.82rem] ${change > 0 ? "text-[#14715f]" : "text-[#b4234f]"}`}>{change > 0 ? `+${change}` : change} since last test</span>}
                <a href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(base + path)}`} target="_blank" rel="noreferrer" className={`${btn.ghost} ${btn.small}`}>
                  Full report
                </a>
                <button
                  type="button"
                  disabled={busy !== null}
                  className={`${btn.primary} ${btn.small}`}
                  onClick={async () => {
                    setBusy(path);
                    const r = await runPageSpeed(path, strategy);
                    setBusy(null);
                    if (!r.ok) toast(r.error ?? "The test failed", "error");
                    else router.refresh();
                  }}
                >
                  {busy === path ? "Testing… (up to a minute)" : "Run test"}
                </button>
              </div>
              {run && (
                <div className="mt-3 grid gap-4 border-t border-black/6 pt-3 md:grid-cols-2">
                  <dl className="grid grid-cols-3 gap-2 text-[0.85rem]">
                    {Object.entries(run.metrics).map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-black/50">{k}</dt>
                        <dd className="font-medium">{v || "–"}</dd>
                      </div>
                    ))}
                  </dl>
                  {run.opportunities.length > 0 && (
                    <ul className="space-y-1 text-[0.85rem]">
                      {run.opportunities.map((o) => (
                        <li key={o.title} className="flex justify-between gap-3">
                          <span className="text-black/70">{o.title}</span>
                          <span className="shrink-0 text-black/50">saves {o.savings}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
