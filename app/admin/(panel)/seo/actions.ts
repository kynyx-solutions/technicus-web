"use server";

import { z } from "zod";
import { auditPage, selfOrigin, type PageAudit } from "@/lib/admin/audit";
import { refreshSite } from "@/lib/admin/refresh";
import { requireAdmin } from "@/lib/auth";
import { freshSeoSettings, type SeoSettings } from "@/lib/cms";
import { site } from "@/content/site";
import { db } from "@/lib/db";
import { keywordKinds, keywordStatuses } from "@/lib/db/types";

type Result = { ok: boolean; error?: string };

/** Checks a batch of pages. The SEO health page calls this a few pages at a time. */
export async function auditPages(paths: string[]): Promise<Omit<PageAudit, "html" | "text">[]> {
  await requireAdmin();
  const origin = await selfOrigin();
  const results = await Promise.all(paths.slice(0, 10).map((p) => auditPage(origin, p)));
  return results.map((r) => ({ ...r, html: undefined, text: undefined }) as unknown as Omit<PageAudit, "html" | "text">);
}

/** One page's current title, description and main text, for the page SEO editor. */
export async function pageFacts(path: string) {
  await requireAdmin();
  const r = await auditPage(await selfOrigin(), path);
  return { title: r.title, description: r.description, html: r.html, ok: r.ok };
}

const seoOverride = z.object({
  title: z.string().trim().max(120).optional(),
  description: z.string().trim().max(320).optional(),
  focus: z.string().trim().max(120).optional(),
  ogImage: z.string().trim().max(500).optional(),
  noindex: z.boolean().optional(),
});

async function saveSeo(update: (s: SeoSettings) => SeoSettings) {
  const current = await freshSeoSettings();
  await db().setSetting("seo", update(current));
  refreshSite();
}

export async function savePageSeo(path: string, value: unknown): Promise<Result> {
  await requireAdmin();
  const parsed = seoOverride.safeParse(value);
  if (!parsed.success || !path.startsWith("/")) return { ok: false, error: "Check the fields." };
  const clean = Object.fromEntries(Object.entries(parsed.data).filter(([, v]) => v !== "" && v !== false && v !== undefined));
  await saveSeo((s) => {
    const pages = { ...s.pages };
    if (Object.keys(clean).length) pages[path] = clean;
    else delete pages[path];
    return { ...s, pages };
  });
  return { ok: true };
}

const searchSettings = z.object({
  indexing: z.boolean(),
  verification: z.object({ google: z.string().trim().max(200), bing: z.string().trim().max(200), yandex: z.string().trim().max(200) }),
  aiCrawlers: z.object({ search: z.boolean(), training: z.boolean() }),
  llms: z.string().trim().max(2000),
});

export async function saveSearchSettings(value: unknown): Promise<Result> {
  await requireAdmin();
  const parsed = searchSettings.safeParse(value);
  if (!parsed.success) return { ok: false, error: "Check the fields." };
  // Verification fields accept a whole meta tag; keep only the code.
  const code = (v: string) => /content="([^"]+)"/.exec(v)?.[1] ?? v;
  const v = parsed.data;
  await saveSeo((s) => ({ ...s, ...v, verification: { google: code(v.verification.google), bing: code(v.verification.bing), yandex: code(v.verification.yandex) } }));
  return { ok: true };
}

/** Fetches robots.txt, sitemap.xml and llms.txt from this site and checks them. */
export async function checkCrawlerFiles() {
  await requireAdmin();
  const origin = await selfOrigin();
  const files = ["/robots.txt", "/sitemap.xml", "/llms.txt"];
  return Promise.all(
    files.map(async (path) => {
      try {
        const res = await fetch(origin + path, { cache: "no-store", signal: AbortSignal.timeout(15000) });
        const body = await res.text();
        const note =
          path === "/sitemap.xml"
            ? `${(body.match(/<loc>/g) ?? []).length} pages listed`
            : path === "/robots.txt"
              ? /Disallow: \/\s*$/m.test(body) && !/Allow: \//.test(body)
                ? "Blocks all search engines"
                : "Allows search engines"
              : `${body.split("\n").length} lines`;
        return { path, ok: res.ok, status: res.status, note, preview: body.slice(0, 600) };
      } catch {
        return { path, ok: false, status: 0, note: "Could not be loaded", preview: "" };
      }
    }),
  );
}

/* ---------------------------------------------------------- keywords --- */

const keywordInput = z.object({
  term: z.string().trim().min(1, "Enter a keyword").max(120),
  kind: z.enum(keywordKinds),
  page: z.string().trim().max(300),
  status: z.enum(keywordStatuses),
  position: z.number().int().min(1).max(200).nullable(),
  notes: z.string().trim().max(1000),
});

export async function saveKeyword(id: string | null, value: unknown): Promise<Result> {
  await requireAdmin();
  const parsed = keywordInput.safeParse(value);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the fields." };
  const all = await db().all("keywords");
  if (all.some((k) => k.term.toLowerCase() === parsed.data.term.toLowerCase() && k.id !== id)) return { ok: false, error: "That keyword is already tracked." };
  if (id) await db().update("keywords", id, parsed.data);
  else await db().insert("keywords", parsed.data);
  return { ok: true };
}

export async function deleteKeyword(id: string): Promise<Result> {
  await requireAdmin();
  await db().remove("keywords", [id]);
  return { ok: true };
}

/** How well each assigned page covers its keyword: in the title, the main heading, the text. */
export async function keywordCoverage(): Promise<Record<string, "strong" | "partial" | "missing" | "unassigned" | "error">> {
  await requireAdmin();
  const origin = await selfOrigin();
  const keywords = await db().all("keywords");
  const pages = [...new Set(keywords.map((k) => k.page).filter(Boolean))];
  const audits = new Map((await Promise.all(pages.map((p) => auditPage(origin, p)))).map((a) => [a.path, a]));
  return Object.fromEntries(
    keywords.map((k) => {
      if (!k.page) return [k.id, "unassigned"];
      const a = audits.get(k.page);
      if (!a?.ok) return [k.id, "error"];
      const term = k.term.toLowerCase();
      const words = term.split(/\s+/).filter((w) => w.length > 2);
      const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(a.html)?.[1].replace(/<[^>]+>/g, " ").toLowerCase() ?? "";
      const inTitle = a.title.toLowerCase().includes(term);
      const inBody = a.text.toLowerCase().includes(term);
      const someWords = words.length > 0 && words.every((w) => a.text.toLowerCase().includes(w));
      return [k.id, (inTitle || h1.includes(term)) && inBody ? "strong" : inBody || someWords ? "partial" : "missing"];
    }),
  );
}

/** Search suggestions from Google for a seed phrase, grouped by intent. */
export async function keywordIdeas(seed: string, country: string, deep: boolean) {
  await requireAdmin();
  const q = seed.trim().slice(0, 80);
  if (!q) return { ok: false as const, error: "Enter a seed phrase." };
  const gl = /^[a-z]{2}$/i.test(country) ? country.toLowerCase() : "us";
  const ask = async (query: string) => {
    try {
      const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=${gl}&q=${encodeURIComponent(query)}`, { signal: AbortSignal.timeout(8000) });
      const data = (await res.json()) as [string, string[]];
      return data[1] ?? [];
    } catch {
      return [];
    }
  };
  const queries = [q, `${q} for`, `best ${q}`, `${q} near me`, `how ${q}`, `what is ${q}`, `${q} cost`, ...(deep ? "abcdefghijklmnopqrstuvwxyz".split("").map((l) => `${q} ${l}`) : [])];
  const results = new Set<string>();
  for (let i = 0; i < queries.length; i += 6) {
    (await Promise.all(queries.slice(i, i + 6).map(ask))).flat().forEach((s) => results.add(s.toLowerCase()));
  }
  results.delete(q.toLowerCase());
  const list = [...results];
  const groups = {
    Questions: list.filter((s) => /^(how|what|why|when|which|who|can|is|are|does|do|should)\b/.test(s)),
    Commercial: list.filter((s) => /\b(best|top|cost|price|pricing|company|companies|agency|services?|hire|vs|review)\b/.test(s)),
    Local: list.filter((s) => /\b(near me|in [a-z]+|india|usa|uk|dubai|london|bangalore|delhi|mumbai)\b/.test(s)),
  };
  const grouped = new Set(Object.values(groups).flat());
  return { ok: true as const, groups: { ...groups, Other: list.filter((s) => !grouped.has(s)) } };
}

/* -------------------------------------------------------- page speed --- */

/** Runs Google PageSpeed Insights against the public site and stores the result. */
export async function runPageSpeed(path: string, strategy: "mobile" | "desktop"): Promise<Result> {
  await requireAdmin();
  const base = process.env.SITE_URL || site.url;
  const params = new URLSearchParams({ url: base + path, strategy });
  for (const c of ["performance", "accessibility", "best-practices", "seo"]) params.append("category", c);
  if (process.env.PAGESPEED_API_KEY) params.set("key", process.env.PAGESPEED_API_KEY);
  try {
    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`, { cache: "no-store", signal: AbortSignal.timeout(90000) });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data?.error?.message ?? `PageSpeed answered ${res.status}` };
    const lh = data.lighthouseResult;
    const scores = Object.fromEntries(Object.entries(lh.categories as Record<string, { score: number }>).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)]));
    const audit = (id: string) => lh.audits[id]?.displayValue ?? "";
    const metrics = { FCP: audit("first-contentful-paint"), LCP: audit("largest-contentful-paint"), TBT: audit("total-blocking-time"), CLS: audit("cumulative-layout-shift"), "Speed Index": audit("speed-index") };
    const opportunities = Object.values(lh.audits as Record<string, { title: string; details?: { type?: string; overallSavingsMs?: number }; score: number | null }>)
      .filter((a) => a.details?.type === "opportunity" && (a.details.overallSavingsMs ?? 0) > 0)
      .sort((a, b) => (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0))
      .slice(0, 6)
      .map((a) => ({ title: a.title, savings: `${((a.details?.overallSavingsMs ?? 0) / 1000).toFixed(1)} s` }));
    await db().insert("pagespeed", { path, strategy, scores, metrics, opportunities });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "PageSpeed could not be reached" };
  }
}
