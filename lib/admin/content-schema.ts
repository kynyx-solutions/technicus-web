import "server-only";
import { z } from "zod";
import { cleanHtml, htmlText } from "@/lib/html";
import type { ContentType } from "@/lib/db/types";
import { contentConfig, fromEditor, type FieldDef } from "./content-config";

const seoSchema = z
  .object({
    title: z.string().trim().max(120).optional(),
    description: z.string().trim().max(320).optional(),
    focus: z.string().trim().max(120).optional(),
    ogImage: z.string().trim().max(500).optional(),
    noindex: z.boolean().optional(),
  })
  .optional();

const link = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/") || /^https:\/\//.test(v), "Use a full https:// link or a path starting with /");

function fieldSchema(f: FieldDef): z.ZodType {
  const req = "required" in f && f.required;
  switch (f.kind) {
    case "text":
    case "textarea":
    case "date": {
      let s = z.string().trim().max(f.max ?? 10000);
      if (f.kind === "date") s = s.regex(/^(\d{4}-\d{2}-\d{2})?$/, "Use a date");
      return req ? s.min(1, `${f.label} is required.`) : s.optional().default("");
    }
    case "url":
      return req ? link.refine((v) => v !== "", `${f.label} is required.`) : link.optional().default("");
    case "image":
      return link.optional().default("");
    case "number":
      return z.union([z.number(), z.nan(), z.null()]).optional().transform((v) => (typeof v === "number" && !Number.isNaN(v) ? v : undefined));
    case "select": {
      const s = z.string().refine((v) => v === "" || f.options.some((o) => o.value === v), `Choose a ${f.label.toLowerCase()} from the list.`);
      return req ? s.refine((v) => v !== "", `${f.label} is required.`) : s.optional().default("");
    }
    case "multi":
      return z.array(z.string().refine((v) => f.options.some((o) => o.value === v))).max(20).optional().default([]);
    case "tags":
    case "lines":
      return z.array(z.string().trim().min(1).max(300)).max(f.max ?? 40).optional().default([]);
    case "richtext":
      return z.string().max(200_000).optional().default("");
    case "rows":
      return z
        .array(z.object(Object.fromEntries(f.fields.map((sub) => [sub.name, z.string().trim().max(300)]))))
        .max(f.max ?? 20)
        .optional()
        .default([]);
  }
}

export function validateContent(type: ContentType, raw: unknown) {
  const config = contentConfig[type];
  const schema = z.object({
    ...Object.fromEntries(config.fields.map((f) => [f.name, fieldSchema(f)])),
    ...(config.seo ? { seo: seoSchema } : {}),
  });
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !errors[key]) errors[key] = issue.message;
    }
    return { ok: false as const, errors };
  }
  const data = parsed.data as Record<string, unknown>;
  // Tidy up: clean HTML, drop empty rows, work out reading time.
  for (const f of config.fields) {
    if (f.kind === "richtext") data[f.name] = cleanHtml(String(data[f.name] ?? ""));
    if (f.kind === "rows") data[f.name] = (data[f.name] as Record<string, string>[]).filter((r) => Object.values(r).some(Boolean));
  }
  if (type === "articles" && !data.readingMinutes) {
    const words = htmlText(String(data.html)).split(" ").filter(Boolean).length;
    data.readingMinutes = Math.max(1, Math.round(words / 220));
  }
  return { ok: true as const, data: fromEditor(type, data) };
}
