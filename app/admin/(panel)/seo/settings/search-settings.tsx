"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/admin/client";
import { Badge, btn, Card, Field, input } from "@/components/admin/ui";
import type { SeoSettings } from "@/lib/cms";
import { checkCrawlerFiles, saveSearchSettings } from "../actions";

type Files = Awaited<ReturnType<typeof checkCrawlerFiles>>;

export function SearchSettings({ initial, siteUrl }: { initial: Omit<SeoSettings, "pages">; siteUrl: string }) {
  const [v, setV] = useState(initial);
  const [files, setFiles] = useState<Files | null>(null);
  const [pending, start] = useTransition();
  const toast = useToast();
  const toggle = (on: boolean, change: (on: boolean) => void, title: string, text: string) => (
    <label className="flex items-start gap-3">
      <input type="checkbox" role="switch" checked={on} onChange={(e) => change(e.target.checked)} className="peer sr-only" />
      <span aria-hidden className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-black/15 transition-colors peer-checked:bg-black after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
      <span>
        <span className="block font-medium">{title}</span>
        <span className="block text-[0.88rem] text-black/55">{text}</span>
      </span>
    </label>
  );

  return (
    <div className="space-y-4">
      <Card title="Search engines">
        <div className="space-y-5">
          {toggle(v.indexing, (on) => setV({ ...v, indexing: on }), "Allow search engines", "Off until launch: every page says noindex and robots.txt blocks crawlers. Switch on when the site is live on its real domain.")}
          {v.indexing ? <Badge tone="green">The site can be indexed</Badge> : <Badge tone="amber">The site is hidden from search engines</Badge>}
        </div>
      </Card>
      <Card title="AI crawlers">
        <div className="space-y-5">
          {toggle(v.aiCrawlers.search, (on) => setV({ ...v, aiCrawlers: { ...v.aiCrawlers, search: on } }), "Allow AI search assistants", "ChatGPT search, Perplexity, Claude and others that cite and link to pages when answering. Recommended: on.")}
          {toggle(v.aiCrawlers.training, (on) => setV({ ...v, aiCrawlers: { ...v.aiCrawlers, training: on } }), "Allow AI training crawlers", "Crawlers that collect text to train AI models, such as GPTBot, ClaudeBot and Google-Extended. They do not send visitors.")}
        </div>
      </Card>
      <Card title="Ownership verification">
        <p className="mb-4 text-[0.88rem] text-black/55">Paste the code (or the whole meta tag) from each search engine&apos;s webmaster tools.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {(["google", "bing", "yandex"] as const).map((k) => (
            <Field key={k} label={{ google: "Google Search Console", bing: "Bing Webmaster Tools", yandex: "Yandex Webmaster" }[k]}>
              <input value={v.verification[k]} onChange={(e) => setV({ ...v, verification: { ...v.verification, [k]: e.target.value } })} className={input} />
            </Field>
          ))}
        </div>
      </Card>
      <Card title="Summary for AI assistants (llms.txt)">
        <Field label="What Technicus is, in two or three sentences" hint="Published at /llms.txt with links to the services and latest articles.">
          <textarea value={v.llms} rows={4} maxLength={2000} onChange={(e) => setV({ ...v, llms: e.target.value })} className={input} />
        </Field>
      </Card>
      <div className="flex justify-end">
        <button
          type="button"
          disabled={pending}
          className={btn.primary}
          onClick={() =>
            start(async () => {
              const r = await saveSearchSettings(v);
              toast(r.ok ? "Saved. The site is updated." : (r.error ?? "Could not save"), r.ok ? "ok" : "error");
            })
          }
        >
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>

      <Card title="Crawler files" action={<button type="button" className={`${btn.secondary} ${btn.small}`} onClick={async () => setFiles(await checkCrawlerFiles())}>Check now</button>}>
        {files ? (
          <ul className="space-y-3">
            {files.map((f) => (
              <li key={f.path}>
                <div className="flex items-center gap-2">
                  <a href={f.path} target="_blank" className="font-medium hover:underline">
                    {f.path}
                  </a>
                  <Badge tone={f.ok ? "green" : "red"}>{f.ok ? "OK" : `Error ${f.status}`}</Badge>
                  <span className="text-[0.85rem] text-black/55">{f.note}</span>
                </div>
                {f.preview && <pre className="mt-2 max-h-40 overflow-auto rounded-xl bg-fog p-3 text-[0.78rem]">{f.preview}</pre>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[0.9rem] text-black/55">robots.txt, sitemap.xml and llms.txt are generated from these settings and the content.</p>
        )}
      </Card>
      <Card title="Submit and monitor">
        <div className="flex flex-wrap gap-2">
          {[
            ["Google Search Console", "https://search.google.com/search-console"],
            ["Bing Webmaster Tools", "https://www.bing.com/webmasters"],
            ["Google Business Profile", "https://business.google.com"],
            ["Schema validator", `https://validator.schema.org/#url=${encodeURIComponent(siteUrl)}`],
          ].map(([l, h]) => (
            <a key={l} href={h} target="_blank" rel="noreferrer" className={`${btn.secondary} ${btn.small}`}>
              {l}
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
