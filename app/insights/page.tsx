import type { Metadata } from "next";
import Link from "next/link";
import { Art } from "@/components/art";
import { formatDate, insightCards } from "@/components/lists";
import { ClosingCall, Hero, PostCards, Section } from "@/components/ui";
import { articles } from "@/content/copy";
import { getPerson } from "@/content/people";

export const metadata: Metadata = {
  title: "Insights",
  description: "Articles and guides on strategy, design, engineering, AI, cloud and delivery.",
};

export default function InsightsPage() {
  const [featured] = articles;
  return (
    <>
      <Hero crumbs={[{ href: "/insights", name: "Insights" }]} title="Insights" lead="Practical writing for people who make technology decisions." />

      <Section>
        <Link href={`/insights/${featured.slug}`} className="group grid items-center gap-8 md:grid-cols-2 md:gap-14" data-reveal data-cursor="Read">
          <span className="relative block aspect-[4/3] overflow-hidden rounded-[22px] bg-lavender">
            <Art kind="hexagon" tone="light" className="absolute inset-x-0 bottom-0 mx-auto h-[78%] w-auto transition-transform duration-700 group-hover:scale-105" />
          </span>
          <span className="block">
            <span className="label block text-black/50">
              Latest · {featured.kind} · {featured.topic}
            </span>
            <span className="mt-4 block text-[clamp(1.8rem,3.2vw,2.7rem)] leading-[1.08] font-medium tracking-[-0.02em] transition-opacity group-hover:opacity-70">
              {featured.title}
            </span>
            <span className="mt-5 block text-lg text-black/65">{featured.summary}</span>
            <span className="label mt-6 block text-black/45">
              {getPerson(featured.author)?.name} · {formatDate(featured.date)} · {featured.readingMinutes} min read
            </span>
          </span>
        </Link>
      </Section>

      <Section tone="grey" title="All articles">
        <PostCards items={insightCards(undefined, articles.length, featured.slug)} />
      </Section>

      <ClosingCall line="Have a question we have not written about?" lead="Ask us. If it is useful to others too, it may become the next article." />
    </>
  );
}
