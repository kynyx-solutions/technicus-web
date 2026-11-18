import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { site } from "@/content/site";
import { freshSeoSettings } from "@/lib/cms";
import { sitePages } from "@/lib/site-pages";
import { PageSeo } from "./page-seo";

export const metadata: Metadata = { title: "Titles & descriptions" };

export default async function SeoPagesPage({ searchParams }: PageProps<"/admin/seo/pages">) {
  const [all, seo] = await Promise.all([sitePages(), freshSeoSettings()]);
  // Articles, case studies and openings have their SEO in their own editor.
  const pages = all.filter((p) => !["Case studies", "Insights", "Careers"].includes(p.group) || p.path === "/insights" || p.path.startsWith("/insights/authors"));
  const asked = (await searchParams).path;
  const path = typeof asked === "string" && pages.some((p) => p.path === asked) ? asked : "/";
  return (
    <>
      <PageHeader title="Titles & descriptions" lead="Search titles, descriptions and sharing images for the fixed pages. Articles, case studies and job openings have an SEO tab in their own editor." />
      <PageSeo key={path} pages={pages} path={path} saved={seo.pages} siteUrl={process.env.SITE_URL || site.url} />
    </>
  );
}
