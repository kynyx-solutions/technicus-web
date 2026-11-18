import type { Metadata } from "next";
import Link from "next/link";
import { Notice, PageHeader } from "@/components/admin/ui";
import { site } from "@/content/site";
import { getSeoSettings } from "@/lib/cms";
import { sitePages } from "@/lib/site-pages";
import { SeoHealth } from "./seo-health";

export const metadata: Metadata = { title: "SEO health" };

export default async function SeoHealthPage() {
  const [pages, seo] = await Promise.all([sitePages(), getSeoSettings()]);
  return (
    <>
      <PageHeader title="SEO health" lead="Every public page, checked as search engines see it: titles, descriptions, headings, length, keywords and images. Weakest first." />
      {!seo.indexing && (
        <div className="mb-4">
          <Notice>
            Search engines are blocked across the whole site until launch. Switch this on in{" "}
            <Link href="/admin/seo/settings" className="underline underline-offset-2">
              Search settings
            </Link>{" "}
            when the site goes live. It is not counted against the pages below.
          </Notice>
        </div>
      )}
      <SeoHealth pages={pages} siteUrl={process.env.SITE_URL || site.url} />
    </>
  );
}
