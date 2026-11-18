import "server-only";
import type { Metadata } from "next";
import { noindexPaths, pageSeo } from "@/content/seo";
import { getSeoSettings, type Seo } from "@/lib/cms";

/** The SEO built into the site for a path (content/seo.ts), before admin overrides. */
export function builtInSeo(path: string): Seo {
  const s = pageSeo[path];
  return {
    ...(s ? { focus: s.focus, title: s.title, description: s.description } : {}),
    ...(noindexPaths.includes(path) ? { noindex: true } : {}),
  };
}

/** Built-in SEO, then the admin's page settings, then the item's own SEO fields. */
export async function effectiveSeo(path: string, item?: Seo): Promise<Seo> {
  const settings = await getSeoSettings();
  return { ...builtInSeo(path), ...stripEmpty(settings.pages[path]), ...stripEmpty(item) };
}

/**
 * Page metadata with SEO applied. Fixed pages are overridden from SEO > Titles
 * and descriptions; articles, case studies and openings carry their own SEO
 * fields, passed as `item`.
 */
export async function withSeo(path: string, base: { title: string; description?: string }, item?: Seo): Promise<Metadata> {
  const o = await effectiveSeo(path, item);
  const description = o.description || base.description;
  const image = o.ogImage || "/og-image";
  return {
    title: o.title ? { absolute: o.title } : base.title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "Technicus", title: o.title || base.title, description, url: path, images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: o.title || base.title, description, images: [image] },
    robots: o.noindex ? { index: false, follow: true } : undefined,
  };
}

function stripEmpty(seo?: Seo): Seo {
  if (!seo) return {};
  return Object.fromEntries(Object.entries(seo).filter(([, v]) => v !== "" && v !== undefined && v !== false)) as Seo;
}
