import type { MetadataRoute } from "next";
import { noindexPaths } from "@/content/seo";
import { site } from "@/content/site";
import { getArticles, getJobs, getProjects, getSeoSettings } from "@/lib/cms";
import { sitePages } from "@/lib/site-pages";

/** Every public page, except those marked noindex in the admin. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, seo, articles, projects, jobs] = await Promise.all([sitePages(), getSeoSettings(), getArticles(), getProjects(), getJobs()]);
  const hidden = new Set([
    ...noindexPaths,
    ...Object.entries(seo.pages).filter(([, o]) => o.noindex).map(([path]) => path),
    ...articles.filter((a) => a.seo?.noindex).map((a) => `/insights/${a.slug}`),
    ...projects.filter((p) => p.seo?.noindex).map((p) => `/work/${p.slug}`),
    ...jobs.filter((j) => j.seo?.noindex).map((j) => `/careers/${j.slug}`),
  ]);
  return pages.filter((p) => !hidden.has(p.path)).map((p) => ({ url: `${site.url}${p.path}` }));
}
