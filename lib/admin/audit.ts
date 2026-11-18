import "server-only";
import { headers } from "next/headers";
import { getArticles, getJobs, getProjects, type Seo } from "@/lib/cms";
import { effectiveSeo } from "@/lib/seo";
import { analyze, extract, type Check } from "./seo-analyze";

export type PageAudit = {
  path: string;
  ok: boolean;
  status: number;
  title: string;
  description: string;
  h1Count: number;
  words: number;
  noindex: boolean;
  score: number;
  checks: Check[];
  text: string;
  html: string;
};

/** The address of this site as the current request sees it, for fetching its own pages. */
export async function selfOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}

const attr = (html: string, re: RegExp) => {
  const m = re.exec(html);
  return m ? m[1].replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').trim() : "";
};

/** The SEO in force for a path: built in, admin page settings, and the item's own fields. */
export async function overridesFor(path: string): Promise<Seo> {
  const slug = path.split("/").pop() ?? "";
  let item: Seo | undefined;
  if (path.startsWith("/insights/") && !path.startsWith("/insights/authors/")) item = (await getArticles()).find((a) => a.slug === slug)?.seo;
  else if (path.startsWith("/work/")) item = (await getProjects()).find((p) => p.slug === slug)?.seo;
  else if (path.startsWith("/careers/")) item = (await getJobs()).find((j) => j.slug === slug)?.seo;
  return effectiveSeo(path, item);
}

export async function auditPage(origin: string, path: string): Promise<PageAudit> {
  const empty = { path, ok: false, title: "", description: "", h1Count: 0, words: 0, noindex: false, score: 0, text: "", html: "" };
  try {
    const res = await fetch(origin + path, { cache: "no-store", headers: { "user-agent": "TechnicusSEOCheck/1.0" }, signal: AbortSignal.timeout(30000) });
    const html = await res.text();
    if (!res.ok) return { ...empty, status: res.status, checks: [{ id: "status", status: "bad", text: `The page answers with error ${res.status}.` }] };
    const title = attr(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = attr(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
    const ogImage = attr(html, /<meta[^>]+property="og:image"[^>]+content="([^"]*)"/i);
    const main = /<main[^>]*>([\s\S]*?)<\/main>/i.exec(html)?.[1] ?? html;
    const h1Count = (main.match(/<h1[\s>]/gi) ?? []).length;
    const o = await overridesFor(path);
    const kind = path.startsWith("/insights/") && !path.startsWith("/insights/authors") ? "article" : path.startsWith("/work/") ? "case" : path.startsWith("/careers/") ? "job" : "page";
    const result = analyze({ title, description, path, focus: o.focus, html: main, ogImage: o.ogImage || ogImage || undefined, noindex: o.noindex, h1Count, kind });
    return { path, ok: true, status: res.status, title, description, h1Count, words: result.words, noindex: Boolean(o.noindex), score: result.score, checks: result.checks, text: extract(main).text, html: main };
  } catch (error) {
    return { ...empty, status: 0, checks: [{ id: "status", status: "bad", text: `The page could not be loaded: ${error instanceof Error ? error.message : "unknown error"}.` }] };
  }
}
