import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { site } from "@/content/site";
import { freshSeoSettings } from "@/lib/cms";
import { SearchSettings } from "./search-settings";

export const metadata: Metadata = { title: "Search settings" };

export default async function SearchSettingsPage() {
  const { pages: _pages, ...rest } = await freshSeoSettings();
  void _pages;
  return (
    <>
      <PageHeader title="Search settings" lead="Whether search engines and AI crawlers may read the site, ownership codes, and the summary published for AI assistants." />
      <SearchSettings initial={rest} siteUrl={process.env.SITE_URL || site.url} />
    </>
  );
}
