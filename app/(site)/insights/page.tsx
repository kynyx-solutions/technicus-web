import type { Metadata } from "next";
import Link from "next/link";
import { Art } from "@/components/art";
import { formatDate, insightCards } from "@/components/lists";
import { ClosingCall, Hero, PostCards, Section, Tags } from "@/components/ui";
import { pillars } from "@/content/services";
import { getPerson } from "@/content/people";
import { withSeo } from "@/lib/seo";
import { getArticles } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/insights", {
  title: "Insights",
  description: "Articles and guides on strategy, design, engineering, AI, cloud and delivery.",
});
}

export default async function InsightsPage() {
  const articles = await getArticles();
  const [featured] = articles;
  if (!featured) return <Hero title="Insights" lead="Articles are on their way." />;
  return (
    <>
      <Hero eyebrow="Technology insights" crumbs={[{ href: "/insights", name: "Insights" }]} title="Insights" lead="Practical writing for people who make technology decisions." />

      <Section>
        <Link href={`/insights/${featured.slug}`} className="group grid items-center gap-8 md:grid-cols-2 md:gap-14" data-reveal data-cursor="Read">
          <span className="relative block aspect-[4/3] overflow-hidden rounded-[22px] bg-lavender">
            {featured.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featured.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <Art kind="hexagon" tone="light" className="absolute inset-x-0 bottom-0 mx-auto h-[78%] w-auto transition-transform duration-700 group-hover:scale-105" />
            )}
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

      <Section tone="grey" title="Technology insights and guides">
        <PostCards items={insightCards(articles, undefined, articles.length, featured.slug)} />
      </Section>

      <Section title="What we write about" lead="Guides drawn from the work itself: how to scope an AI project, when to build or buy, what to check before a cloud migration, how to brief designers and how to choose a team model. Each one is written for the person who has to make the decision, not for other engineers, and is updated when our advice changes.">
        <Tags items={pillars.map((p) => p.name)} />
      </Section>

      <ClosingCall line="Have a question we have not written about?" lead="Ask us. If it is useful to others too, it may become the next article." />
    </>
  );
}
