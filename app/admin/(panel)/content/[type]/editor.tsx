"use client";

import { Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useConfirm, useToast } from "@/components/admin/client";
import { ImageField } from "@/components/admin/image-field";
import { RichText } from "@/components/admin/rich-text";
import { SeoPanel, useSeoScore, type SeoValue } from "@/components/admin/seo-panel";
import { Badge, btn, Card, Field, input } from "@/components/admin/ui";
import { contentConfig, slugify, type FieldDef } from "@/lib/admin/content-config";
import { scoreTone } from "@/lib/admin/seo-analyze";
import type { ContentType } from "@/lib/db/types";
import { deleteContent, saveContent } from "../actions";

type Props = {
  type: ContentType;
  id: string | null;
  initial: { slug: string; published: boolean; data: Record<string, unknown> };
  siteUrl: string;
};

export function ContentEditor({ type, id, initial, siteUrl }: Props) {
  const config = contentConfig[type];
  const router = useRouter();
  const toast = useToast();
  const ask = useConfirm();
  const [data, setData] = useState<Record<string, unknown>>(initial.data);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(id));
  const [published, setPublished] = useState(initial.published);
  const [tab, setTab] = useState<"content" | "seo">("content");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();

  const titleValue = String(data[config.titleField] ?? "");
  const set = (name: string, value: unknown) => {
    setData((d) => ({ ...d, [name]: value }));
    setDirty(true);
    if (name === config.titleField && !slugTouched && !config.autoSlug) setSlug(slugify(String(value)));
  };
  const path = config.publicPath?.(slug || "new") ?? "";
  const bodyHtml = config.bodyField ? (config.bodyField === "html" ? String(data.html ?? "") : `<p>${String(data[config.bodyField] ?? "")}</p>`) : "";
  const seo = (data.seo ?? {}) as SeoValue;
  const fallbackDescription = String(data.summary ?? "");
  const score = useSeoScore({ value: seo, fallback: { title: titleValue, description: fallbackDescription }, path, html: bodyHtml, kind: type === "articles" ? "article" : type === "projects" ? "case" : "job" });

  const save = () =>
    start(async () => {
      const r = await saveContent(type, id, { slug, published, data });
      if (!r.ok) {
        setErrors(r.errors ?? {});
        toast(r.error ?? "Could not save", "error");
        if (r.errors && Object.keys(r.errors).some((k) => k !== "seo")) setTab("content");
        return;
      }
      setErrors({});
      setDirty(false);
      toast(id ? "Saved. The site is updated." : `${config.singular[0].toUpperCase()}${config.singular.slice(1)} created`);
      if (!id && r.id) router.replace(`/admin/content/${type}/${r.id}`);
      else router.refresh();
    });

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-4 mb-6 flex flex-wrap items-center gap-3 bg-fog/90 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-[560] tracking-[-0.01em]">{titleValue || `New ${config.singular}`}</p>
          {dirty && <p className="text-[0.8rem] text-black/50">Unsaved changes</p>}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" role="switch" checked={published} onChange={(e) => (setPublished(e.target.checked), setDirty(true))} className="peer sr-only" />
          <span aria-hidden className="relative h-5 w-9 rounded-full bg-black/15 transition-colors peer-checked:bg-black after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
          {published ? "Visible on site" : "Hidden"}
        </label>
        {id && config.publicPath && initial.published && (
          <a href={config.publicPath(initial.slug)} target="_blank" rel="noreferrer" className={btn.secondary}>
            View
          </a>
        )}
        {id && (
          <button
            type="button"
            className={btn.danger}
            onClick={async () => {
              if (!(await ask({ title: `Delete this ${config.singular}?`, text: "It is removed from the site for good.", confirm: "Delete", danger: true }))) return;
              const r = await deleteContent(id);
              if (r.ok) {
                toast("Deleted");
                router.push(`/admin/content/${type}`);
              }
            }}
          >
            Delete
          </button>
        )}
        <button type="button" onClick={save} disabled={pending} className={btn.primary}>
          {pending ? "Saving…" : id ? (dirty ? "Save changes" : "Saved") : `Create ${config.singular}`}
        </button>
      </div>

      {config.seo && (
        <div className="mb-4 inline-flex rounded-full bg-white p-1">
          {(["content", "seo"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm ${tab === t ? "bg-black text-white" : "text-black/65"}`}>
              {t === "content" ? "Content" : "SEO"}
              {t === "seo" && <Badge tone={scoreTone(score.score)}>{score.score}</Badge>}
            </button>
          ))}
        </div>
      )}

      {tab === "content" ? (
        <Card>
          <div className="grid gap-5 md:grid-cols-2">
            {!config.autoSlug && (
              <Field
                className="md:col-span-2"
                label="Web address"
                hint={errors.slug ? <span className="text-[#b4234f]">{errors.slug}</span> : <>{siteUrl.replace(/^https?:\/\//, "")}{config.publicPath?.("") ?? "/"}<strong>{slug || "…"}</strong></>}
              >
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlug(slugify(e.target.value));
                    setSlugTouched(true);
                    setDirty(true);
                  }}
                  className={input}
                />
              </Field>
            )}
            {config.fields.map((f) => (
              <FieldInput key={f.name} field={f} value={data[f.name]} error={errors[f.name]} onChange={(v) => set(f.name, v)} />
            ))}
          </div>
        </Card>
      ) : (
        <Card>
          <SeoPanel
            value={seo}
            onChange={(v) => set("seo", v)}
            fallback={{ title: titleValue, description: fallbackDescription }}
            path={path}
            html={bodyHtml}
            kind={type === "articles" ? "article" : type === "projects" ? "case" : "job"}
            siteUrl={siteUrl}
          />
        </Card>
      )}
    </div>
  );
}

function FieldInput({ field: f, value, error, onChange }: { field: FieldDef; value: unknown; error?: string; onChange: (v: unknown) => void }) {
  const wide = !("half" in f && f.half) ? "md:col-span-2" : "";
  const hint = error ? <span className="text-[#b4234f]">{error}</span> : f.hint;
  const text = (value as string) ?? "";
  const label = `${f.label}${"required" in f && f.required ? " *" : ""}`;

  switch (f.kind) {
    case "text":
    case "url":
    case "date":
      return (
        <Field className={wide} label={label} hint={hint}>
          <input type={f.kind === "date" ? "date" : "text"} value={text} maxLength={"max" in f ? f.max : undefined} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} className={input} />
        </Field>
      );
    case "textarea":
      return (
        <Field className={wide} label={label} hint={hint}>
          <textarea value={text} rows={4} maxLength={f.max} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} className={input} />
        </Field>
      );
    case "number":
      return (
        <Field className={wide} label={label} hint={hint}>
          <input type="number" min={0} value={typeof value === "number" ? value : ""} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} className={input} />
        </Field>
      );
    case "select":
      return (
        <Field className={wide} label={label} hint={hint}>
          <select value={text} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} className={input}>
            <option value="">Choose…</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      );
    case "multi": {
      const chosen = (value as string[]) ?? [];
      return (
        <fieldset className="md:col-span-2">
          <legend className="mb-1.5 text-[0.85rem] font-medium text-black/75">{f.label}</legend>
          <div className="flex flex-wrap gap-2">
            {f.options.map((o) => {
              const on = chosen.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => onChange(on ? chosen.filter((v) => v !== o.value) : [...chosen, o.value])}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${on ? "border-black bg-black text-white" : "border-black/15 bg-white hover:border-black"}`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
          {hint && <p className="mt-1.5 text-[0.8rem] text-black/50">{hint}</p>}
        </fieldset>
      );
    }
    case "tags":
      return <Tags label={f.label} hint={hint} value={(value as string[]) ?? []} onChange={onChange} />;
    case "lines": {
      const lines = (value as string[]) ?? [];
      return (
        <Field className="md:col-span-2" label={f.label} hint={hint}>
          <textarea value={lines.join("\n")} rows={Math.max(4, lines.length + 1)} onChange={(e) => onChange(e.target.value.split("\n").map((l) => l.trimStart()).filter((l, i, all) => l || i === all.length - 1))} className={input} />
        </Field>
      );
    }
    case "image":
      return (
        <div className={wide}>
          <ImageField label={f.label} value={text} onChange={onChange} shape={f.shape} />
          {hint && <p className="mt-1.5 text-[0.8rem] text-black/50">{hint}</p>}
        </div>
      );
    case "richtext":
      return (
        <div className="md:col-span-2">
          <p className="mb-1.5 text-[0.85rem] font-medium text-black/75">{f.label}</p>
          <RichText value={text} onChange={onChange} />
          {hint && <p className="mt-1.5 text-[0.8rem] text-black/50">{hint}</p>}
        </div>
      );
    case "rows": {
      const rows = (value as Record<string, string>[]) ?? [];
      return (
        <div className="md:col-span-2">
          <p className="mb-1.5 text-[0.85rem] font-medium text-black/75">{f.label}</p>
          <div className="space-y-2">
            {rows.map((row, i) => (
              <div key={i} className="flex gap-2">
                {f.fields.map((sub) => (
                  <input
                    key={sub.name}
                    value={row[sub.name] ?? ""}
                    placeholder={sub.label}
                    aria-label={sub.label}
                    onChange={(e) => onChange(rows.map((r, j) => (j === i ? { ...r, [sub.name]: e.target.value } : r)))}
                    className={input}
                  />
                ))}
                <button type="button" aria-label="Remove" onClick={() => onChange(rows.filter((_, j) => j !== i))} className="rounded-full p-2 text-black/45 hover:text-[#b4234f]">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          {rows.length < (f.max ?? 20) && (
            <button type="button" onClick={() => onChange([...rows, Object.fromEntries(f.fields.map((s) => [s.name, ""]))])} className={`${btn.ghost} ${btn.small} mt-2`}>
              <Plus size={14} /> Add
            </button>
          )}
          {hint && <p className="mt-1.5 text-[0.8rem] text-black/50">{hint}</p>}
        </div>
      );
    }
  }
}

function Tags({ label, hint, value, onChange }: { label: string; hint?: React.ReactNode; value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const parts = draft.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...new Set([...value, ...parts])]);
    setDraft("");
  };
  return (
    <div className="md:col-span-2">
      <p className="mb-1.5 text-[0.85rem] font-medium text-black/75">{label}</p>
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-black/12 bg-white px-2 py-2 focus-within:border-black">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full bg-lavender px-2.5 py-1 text-[0.85rem]">
            {t}
            <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((v) => v !== t))} className="text-black/50 hover:text-black">
              <X size={13} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
          }}
          onBlur={add}
          className="min-w-[8rem] flex-1 bg-transparent px-1 py-0.5 text-[0.95rem] outline-none"
          placeholder={value.length ? "" : "Type and press Enter"}
        />
      </div>
      {hint && <p className="mt-1.5 text-[0.8rem] text-black/50">{hint}</p>}
    </div>
  );
}
