import "server-only";
import { pillars } from "@/content/services";
import { aboutPages, industries, legalPages, localPages } from "@/content/site";
import { getArticles, getJobs, getProjects } from "@/lib/cms";

export type SitePage = { path: string; group: "Pages" | "Services" | "Industries" | "Case studies" | "Insights" | "Careers" | "Local" };

/** Every public page, for the sitemap and the SEO tools. */
export async function sitePages(): Promise<SitePage[]> {
  const [projects, articles, jobs] = await Promise.all([getProjects(), getArticles(), getJobs()]);
  const page = (group: SitePage["group"]) => (path: string): SitePage => ({ path, group });
  return [
    ...["/", "/services", "/technologies", "/industries", "/work", "/insights", ...aboutPages.map((p) => p.href), "/careers", "/contact", "/india"].map(page("Pages")),
    ...pillars.flatMap((p) => [`/services/${p.slug}`, ...p.capabilities.map((c) => `/services/${p.slug}/${c.slug}`)]).map(page("Services")),
    ...industries.map((i) => `/industries/${i.slug}`).map(page("Industries")),
    ...projects.map((p) => `/work/${p.slug}`).map(page("Case studies")),
    ...articles.map((a) => `/insights/${a.slug}`).map(page("Insights")),
    ...[...new Set(articles.map((a) => a.author))].map((slug) => `/insights/authors/${slug}`).map(page("Insights")),
    ...jobs.filter((j) => j.published !== false).map((j) => `/careers/${j.slug}`).map(page("Careers")),
    ...legalPages.map((p) => p.href).map(page("Pages")),
    ...localPages.map((p) => `/${p.slug}`).map(page("Local")),
  ];
}
