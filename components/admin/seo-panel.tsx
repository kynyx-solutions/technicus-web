"use client";

import { Check as CheckIcon, Circle, X } from "lucide-react";
import { analyze, scoreTone, type PageFacts } from "@/lib/admin/seo-analyze";
import { Badge, Field, input } from "./ui";

export type SeoValue = { title?: string; description?: string; focus?: string; ogImage?: string; noindex?: boolean };

type Props = {
  value: SeoValue;
  onChange: (v: SeoValue) => void;
  /** What the page uses when no override is set. */
  fallback: { title: string; description: string };
  path: string;
  html: string;
  kind: PageFacts["kind"];
  siteUrl: string;
};

export function useSeoScore(p: Omit<Props, "onChange" | "siteUrl">) {
  return analyze({
    title: p.value.title || p.fallback.title,
    description: p.value.description || p.fallback.description,
    path: p.path,
    focus: p.value.focus,
    html: p.html,
    ogImage: p.value.ogImage,
    noindex: p.value.noindex,
    kind: p.kind,
  });
}

export function SeoPanel(props: Props) {
  const { value, onChange, fallback, path, siteUrl } = props;
  const result = useSeoScore(props);
  const title = value.title || fallback.title;
  const description = value.description || fallback.description;
  const set = (patch: SeoValue) => onChange({ ...value, ...patch });
  const counter = (n: number, max: number) => <span className={n > max ? "text-[#b4234f]" : ""}>{n} / {max}</span>;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-3">
        <Field label="Meta title" hint={<>Leave empty to use “{fallback.title}”. {counter(title.length, 60)}</>}>
          <input value={value.title ?? ""} onChange={(e) => set({ title: e.target.value })} placeholder={fallback.title} maxLength={120} className={input} />
        </Field>
        <Field label="Meta description" hint={<>Leave empty to use the summary. {counter(description.length, 158)}</>}>
          <textarea value={value.description ?? ""} onChange={(e) => set({ description: e.target.value })} placeholder={fallback.description} rows={3} maxLength={320} className={input} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Focus keyword" hint="The search phrase this page should rank for.">
            <input value={value.focus ?? ""} onChange={(e) => set({ focus: e.target.value })} className={input} />
          </Field>
          <Field label="Social sharing image" hint="https:// link or /path. 1200 × 630.">
            <input value={value.ogImage ?? ""} onChange={(e) => set({ ogImage: e.target.value })} className={input} />
          </Field>
        </div>
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" checked={Boolean(value.noindex)} onChange={(e) => set({ noindex: e.target.checked })} className="mt-0.5 h-4 w-4 accent-black" />
          <span>
            Hide from search engines (noindex). The page stays on the site but is left out of search results and the sitemap.
          </span>
        </label>

        <div>
          <p className="mb-2 text-[0.85rem] font-medium text-black/75">Google preview</p>
          <div className="rounded-2xl border border-black/10 bg-white p-4 font-[arial,sans-serif]">
            <p className="truncate text-[0.8rem] text-[#4d5156]">
              {siteUrl.replace(/^https?:\/\//, "")}
              {path === "/" ? "" : path.split("/").join(" › ")}
            </p>
            <p className="mt-1 truncate text-[1.25rem] leading-snug text-[#1a0dab]">{title.length > 60 ? `${title.slice(0, 58)}…` : title}</p>
            <p className="mt-1 line-clamp-2 text-[0.875rem] leading-snug text-[#4d5156]">{description.length > 158 ? `${description.slice(0, 155)}…` : description}</p>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="rounded-2xl bg-fog p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-medium">SEO score</p>
            <Badge tone={scoreTone(result.score)}>{result.score} / 100</Badge>
          </div>
          <ul className="space-y-2 text-[0.88rem]">
            {result.checks.map((c) => (
              <li key={c.id} className="flex gap-2">
                {c.status === "good" ? (
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-[#14715f]" />
                ) : c.status === "ok" ? (
                  <Circle size={14} className="mt-1 shrink-0 text-[#c08a00]" />
                ) : (
                  <X size={16} className="mt-0.5 shrink-0 text-[#b4234f]" />
                )}
                <span className="text-black/75">{c.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
