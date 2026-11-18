import type { MetadataRoute } from "next";
import { pillars } from "@/content/services";
import { visibleRoles } from "@/content/careers";
import { articles } from "@/content/copy";
import { aboutPages, industries, legalPages, localPages, site } from "@/content/site";
import { projects } from "@/content/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/services",
    ...pillars.flatMap((p) => [
      `/services/${p.slug}`,
      ...p.capabilities.map((c) => `/services/${p.slug}/${c.slug}`),
    ]),
    "/technologies",
    "/industries",
    ...industries.map((i) => `/industries/${i.slug}`),
    "/work",
    ...projects.map((p) => `/work/${p.slug}`),
    "/insights",
    ...articles.map((a) => `/insights/${a.slug}`),
    ...[...new Set(articles.map((a) => a.author))].map((slug) => `/insights/authors/${slug}`),
    ...aboutPages.map((p) => p.href),
    "/careers",
    ...visibleRoles()
      .filter((r) => r.published)
      .map((r) => `/careers/${r.slug}`),
    "/contact",
    ...legalPages.map((p) => p.href),
    "/india",
    ...localPages.map((p) => `/${p.slug}`),
  ];
  return paths.map((path) => ({ url: `${site.url}${path}` }));
}
