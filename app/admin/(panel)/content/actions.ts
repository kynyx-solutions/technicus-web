"use server";

import { contentConfig, slugify, toEditor } from "@/lib/admin/content-config";
import { validateContent } from "@/lib/admin/content-schema";
import { refreshSite } from "@/lib/admin/refresh";
import { requireAdmin } from "@/lib/auth";
import { defaults } from "@/lib/cms";
import { db } from "@/lib/db";
import { contentTypes, type ContentType } from "@/lib/db/types";

type Result = { ok: boolean; error?: string; errors?: Record<string, string>; id?: string };

const isType = (t: string): t is ContentType => (contentTypes as readonly string[]).includes(t);

export async function saveContent(type: string, id: string | null, input: { slug: string; published: boolean; data: unknown }): Promise<Result> {
  await requireAdmin();
  if (!isType(type)) return { ok: false, error: "Unknown content type" };
  const config = contentConfig[type];
  const checked = validateContent(type, input.data);
  if (!checked.ok) return { ok: false, errors: checked.errors, error: "Please check the marked fields." };

  const data = checked.data;
  const slug = slugify(config.autoSlug ? config.autoSlug.map((f) => String(data[f] ?? "")).join(" ") : input.slug || String(data[config.titleField] ?? ""));
  if (!slug) return { ok: false, errors: { slug: "Add a web address." }, error: "Please check the marked fields." };

  const rows = (await db().all("content")).filter((r) => r.type === type);
  if (rows.some((r) => r.slug === slug && r.id !== id)) {
    return { ok: false, errors: { slug: "Another item already uses this web address." }, error: "Please check the marked fields." };
  }

  let saved;
  if (id) {
    saved = await db().update("content", id, { slug, published: Boolean(input.published), data });
    if (!saved) return { ok: false, error: "This item no longer exists." };
  } else {
    const order = rows.reduce((max, r) => Math.max(max, r.sort_order), 0) + 1;
    saved = await db().insert("content", { type, slug, published: Boolean(input.published), data, sort_order: order });
  }
  refreshSite();
  return { ok: true, id: saved.id };
}

export async function setPublished(id: string, published: boolean): Promise<Result> {
  await requireAdmin();
  if (!(await db().update("content", id, { published }))) return { ok: false, error: "This item no longer exists." };
  refreshSite();
  return { ok: true };
}

export async function deleteContent(id: string): Promise<Result> {
  await requireAdmin();
  await db().remove("content", [id]);
  refreshSite();
  return { ok: true };
}

/** Moves an item one place up or down in its list. */
export async function moveContent(type: string, id: string, direction: -1 | 1): Promise<Result> {
  await requireAdmin();
  const rows = (await db().all("content")).filter((r) => r.type === type).sort((a, b) => a.sort_order - b.sort_order || b.created_at.localeCompare(a.created_at));
  const i = rows.findIndex((r) => r.id === id);
  const j = i + direction;
  if (i < 0 || j < 0 || j >= rows.length) return { ok: true };
  [rows[i], rows[j]] = [rows[j], rows[i]];
  for (const [index, row] of rows.entries()) if (row.sort_order !== index + 1) await db().update("content", row.id, { sort_order: index + 1 });
  refreshSite();
  return { ok: true };
}

/**
 * Copies the content written in code into the admin so it can be edited.
 * Without `overwrite`, items whose web address already exists are skipped.
 */
export async function importDefaults(type: string, overwrite: boolean): Promise<Result & { created?: number; updated?: number; skipped?: number }> {
  await requireAdmin();
  if (!isType(type)) return { ok: false, error: "Unknown content type" };
  const config = contentConfig[type];
  const source: { slug: string; published: boolean; data: Record<string, unknown> }[] = (
    type === "articles"
      ? defaults.articles().map(({ slug, ...data }) => ({ slug, published: true, data }))
      : type === "projects"
        ? defaults.projects().map(({ slug, ...data }) => ({ slug, published: true, data }))
        : type === "jobs"
          ? defaults.jobs().map(({ slug, published, ...data }) => ({ slug, published: published !== false, data }))
          : defaults.testimonials().map((t) => ({ slug: slugify(`${t.name} ${t.company}`), published: true, data: t }))
  ).map((item) => ({ ...item, data: toEditor(type, item.data) }));

  const existing = (await db().all("content")).filter((r) => r.type === type);
  let order = existing.reduce((max, r) => Math.max(max, r.sort_order), 0);
  let created = 0;
  let updated = 0;
  let skipped = 0;
  for (const item of source) {
    const checked = validateContent(type, item.data);
    if (!checked.ok) {
      skipped++;
      continue;
    }
    const match = existing.find((r) => r.slug === item.slug);
    if (match && !overwrite) skipped++;
    else if (match) {
      await db().update("content", match.id, { data: checked.data, published: item.published });
      updated++;
    } else {
      await db().insert("content", { type, slug: item.slug, published: item.published, data: checked.data, sort_order: ++order });
      created++;
    }
  }
  refreshSite();
  return { ok: true, created, updated, skipped, error: config ? undefined : "" };
}
