import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, insightCards } from "@/components/lists";
import { Cards, ClosingCall, Hero, PostCards, Section } from "@/components/ui";
import { articles, getArticle } from "@/content/copy";
import { getPerson } from "@/content/people";
import { getPillar } from "@/content/services";

type Props = PageProps<"/insights/[article]">;

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ article: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).article);
  return { title: article?.title, description: article?.summary };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).article);
  if (!article) notFound();
  const author = getPerson(article.author);

  return (
    <>
      <Hero
        eyebrow={`${article.kind} · ${article.topic}`}
        crumbs={[
          { href: "/insights", name: "Insights" },
          { href: `/insights/${article.slug}`, name: article.kind },
        ]}
        title={article.title}
        lead={article.summary}
      >
        <p className="mt-8 text-[0.95rem] text-black/55" data-reveal>
          {author && (
            <Link href={`/insights/authors/${author.slug}`} className="sweep text-black">
              {author.name}
            </Link>
          )}
          {" · "}
          <time dateTime={article.date}>{formatDate(article.date)}</time> · {article.readingMinutes} min read
        </p>
      </Hero>

      {/* Reading column: plain, with no scroll effects. */}
      <article data-tone="light" className="panel bg-fog pt-16 pb-28 md:pt-24 md:pb-40">
        <div className="mx-auto max-w-[44rem] space-y-6 px-5 text-lg leading-relaxed md:px-0 md:text-[1.2rem] md:leading-[1.7]">
          {article.body.map((block, i) =>
            block.type === "h2" ? (
              <h2 key={i} className="pt-8 text-[1.75rem] leading-tight font-medium tracking-[-0.015em] md:text-[2rem]">
                {block.text}
              </h2>
            ) : block.type === "ul" ? (
              <ul key={i} className="space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-4">
                    <span aria-hidden className="mt-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p key={i}>{block.text}</p>
            ),
          )}
          {author && (
            <div className="mt-16 rounded-[22px] bg-white p-8">
              <p className="label mb-3 text-black/50">Written by</p>
              <Link href={`/insights/authors/${author.slug}`} className="sweep text-2xl font-medium">
                {author.name}
              </Link>
              <p className="mt-3 text-base text-black/65">{author.bio}</p>
            </div>
          )}
        </div>
      </article>

      <Section title="Related services">
        <Cards
          columns={2}
          items={article.related.flatMap((slug) => {
            const pillar = getPillar(slug);
            return pillar ? [{ href: `/services/${slug}`, title: pillar.name, text: pillar.summary, meta: "Service" }] : [];
          })}
        />
      </Section>

      <Section tone="dark" title="More reading">
        <PostCards items={insightCards(undefined, 3, article.slug)} />
      </Section>

      <ClosingCall />
    </>
  );
}
