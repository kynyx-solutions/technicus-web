"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useToast } from "@/components/admin/client";
import { SeoPanel, type SeoValue } from "@/components/admin/seo-panel";
import { btn, Card, input } from "@/components/admin/ui";
import type { SitePage } from "@/lib/site-pages";
import { pageFacts, savePageSeo } from "../actions";

export function PageSeo({ pages, path, saved, siteUrl }: { pages: SitePage[]; path: string; saved: Record<string, SeoValue>; siteUrl: string }) {
  const [value, setValue] = useState<SeoValue>(saved[path] ?? {});
  const [facts, setFacts] = useState<{ title: string; description: string; html: string } | null>(null);
  const [q, setQ] = useState("");
  const [pending, start] = useTransition();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    let live = true;
    pageFacts(path).then((f) => live && setFacts(f));
    return () => {
      live = false;
    };
  }, [path]);

  const term = q.trim().toLowerCase();
  const groups = [...new Set(pages.map((p) => p.group))];
  // The page's own title, without the " | Technicus" ending the site adds.
  const baseTitle = facts?.title.replace(/ \| Technicus$/, "") ?? "";

  return (
    <div className="grid gap-4 lg:grid-cols-[18rem_1fr]">
      <Card padded={false} className="max-h-[75vh] overflow-y-auto p-2">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a page" className={`${input} mb-2`} />
        {groups.map((g) => {
          const list = pages.filter((p) => p.group === g && (!term || p.path.includes(term)));
          if (!list.length) return null;
          return (
            <div key={g} className="mb-2">
              <p className="px-3 py-1 text-[0.72rem] font-medium tracking-[0.06em] text-black/40 uppercase">{g}</p>
              {list.map((p) => (
                <Link
                  key={p.path}
                  href={`/admin/seo/pages?path=${encodeURIComponent(p.path)}`}
                  className={`flex items-center justify-between gap-2 truncate rounded-full px-3 py-1.5 text-[0.88rem] ${p.path === path ? "bg-black text-white" : "hover:bg-black/5"}`}
                >
                  <span className="truncate">{p.path}</span>
                  {saved[p.path] && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${p.path === path ? "bg-white" : "bg-indigo"}`} title="Has custom SEO" />}
                </Link>
              ))}
            </div>
          );
        })}
      </Card>
      <Card
        title={path}
        action={
          <div className="flex gap-2">
            <a href={path} target="_blank" className={`${btn.secondary} ${btn.small}`}>
              View
            </a>
            <button type="button" className={`${btn.ghost} ${btn.small}`} onClick={() => setValue({})}>
              Clear
            </button>
            <button
              type="button"
              disabled={pending}
              className={`${btn.primary} ${btn.small}`}
              onClick={() =>
                start(async () => {
                  const r = await savePageSeo(path, value);
                  toast(r.ok ? "Saved. The page is updated." : (r.error ?? "Could not save"), r.ok ? "ok" : "error");
                  if (r.ok) {
                    router.refresh();
                    pageFacts(path).then(setFacts);
                  }
                })
              }
            >
              {pending ? "Saving…" : "Save"}
            </button>
          </div>
        }
      >
        {facts ? (
          <SeoPanel
            key={path}
            value={value}
            onChange={setValue}
            fallback={{ title: baseTitle, description: facts.description }}
            path={path}
            html={facts.html}
            kind="page"
            siteUrl={siteUrl}
          />
        ) : (
          <p className="py-10 text-center text-black/50">Loading the page…</p>
        )}
      </Card>
    </div>
  );
}
