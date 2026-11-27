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
        <Link href={`/insights/${featured.slug}`} className="group grid items-center gap-8 card-press overflow-hidden md:grid-cols-2 md:gap-0" data-reveal>
          <span className="relative block aspect-[4/3] overflow-hidden bg-sky md:aspect-auto md:h-full md:min-h-[360px]">
            {featured.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={featured.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <Art kind="hexagon" tone="light" className="absolute inset-0 h-full w-full p-8" />
            )}
          </span>
          <span className="block p-7 md:p-10">
            <span className="label block text-blue">
              Latest · {featured.kind} · {featured.topic}
            </span>
            <span className="h2 mt-3 block transition-colors group-hover:text-blue">
              {featured.title}
            </span>
            <span className="mt-4 block text-muted">{featured.summary}</span>
            <span className="mt-6 block text-[0.88rem] text-muted">
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
