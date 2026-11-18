import type { CardItem, StackItem, WorkItem } from "@/components/ui";
import { getPillarCopy } from "@/content/copy";
import { pillars, type Pillar } from "@/content/services";
import { industries } from "@/content/site";
import type { Project } from "@/content/work";
import type { ArticleItem } from "@/lib/cms";

/** The seven pillars as stacked service cards. */
export const pillarStack = (): StackItem[] =>
  pillars.map((p, index) => ({
    href: `/services/${p.slug}`,
    title: p.name,
    text: getPillarCopy(p.slug)?.lead ?? p.summary,
    index,
    links: p.capabilities.map((c) => ({ href: `/services/${p.slug}/${c.slug}`, name: c.name })),
  }));

export const capabilityCards = (p: Pillar, except?: string): CardItem[] =>
  p.capabilities
    .filter((c) => c.slug !== except)
    .map((c) => ({
      href: `/services/${p.slug}/${c.slug}`,
      title: c.name,
      text: c.services.slice(0, 3).join(" · "),
      meta: p.name,
    }));

export const industryCards = (): CardItem[] =>
  industries.map((i) => ({ href: `/industries/${i.slug}`, title: i.name }));

const workItem = (p: Project): WorkItem => ({
  href: `/work/${p.slug}`,
  client: p.client,
  summary: p.summary,
  meta: p.industry,
});

/** Case studies, optionally only those for one pillar or industry. Falls back to all. */
export function workItems(projects: Project[], filter?: { pillar?: string; industry?: string }, count = 3): WorkItem[] {
  let list = projects;
  if (filter?.pillar) list = projects.filter((p) => p.pillars.includes(filter.pillar!));
  if (filter?.industry) list = projects.filter((p) => p.industrySlug === filter.industry);
  if (list.length === 0) list = projects;
  return list.slice(0, count).map(workItem);
}

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );

/** Articles, optionally only those related to one pillar. Falls back to the latest. */
export function insightCards(articles: ArticleItem[], pillar?: string, count = 3, except?: string): CardItem[] {
  const pool = articles.filter((a) => a.slug !== except);
  const related = pillar ? pool.filter((a) => a.related.includes(pillar)) : [];
  const list = related.length > 0 ? related : pool;
  return list.slice(0, count).map((a) => ({
    href: `/insights/${a.slug}`,
    title: a.title,
    text: a.summary,
    meta: `${a.kind} · ${a.readingMinutes} min`,
    image: a.coverImage,
  }));
}
