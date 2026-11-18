import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { pageSeo, trendingKeywords } from "@/content/seo";
import { db } from "@/lib/db";
import { sitePages } from "@/lib/site-pages";
import { Keywords } from "./keywords";

export const metadata: Metadata = { title: "Keywords" };

// Suggestions: the focus keyword of every page, and searches that are rising.
const recommended = [
  ...Object.entries(pageSeo).map(([page, s]) => ({ term: s.focus, page, kind: "target" as const })),
  ...trendingKeywords.map((k) => ({ ...k, kind: "trending" as const })),
];

export default async function KeywordsPage() {
  const [items, pages] = await Promise.all([db().all("keywords"), sitePages()]);
  return (
    <>
      <PageHeader title="Keywords" lead="The searches Technicus wants to be found for, each linked to the page that should rank. Check coverage to see whether that page actually uses the phrase." />
      <Keywords items={items.sort((a, b) => a.term.localeCompare(b.term))} pages={pages.map((p) => p.path)} recommended={recommended} />
    </>
  );
}
