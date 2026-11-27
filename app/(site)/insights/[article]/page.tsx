import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate, insightCards } from "@/components/lists";
import { Cards, ClosingCall, Hero, PostCards, Section } from "@/components/ui";
import { getPerson } from "@/content/people";
import { getPillar } from "@/content/services";
import { getArticle, getArticles } from "@/lib/cms";
import { cleanHtml } from "@/lib/html";
import { withSeo } from "@/lib/seo";

type Props = PageProps<"/insights/[article]">;

// Articles added in the admin after a build are rendered on their first visit.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ article: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).article);
  if (!article) return {};
  return withSeo(`/insights/${article.slug}`, { title: article.title, description: article.summary }, article.seo);
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle((await params).article);
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
      <article data-tone="light" className="bg-mist py-14 md:py-20">
        <div className="mx-auto max-w-[44rem] px-5 text-lg leading-relaxed md:px-0 md:text-[1.2rem] md:leading-[1.7]">
          {article.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.coverImage} alt="" className="mb-12 aspect-[21/9] w-full object-cover" />
          )}
          <div className="article-body" dangerouslySetInnerHTML={{ __html: cleanHtml(article.html) }} />
          {author && (
            <div className="mt-16 card p-8">
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
        <PostCards items={insightCards(await getArticles(), undefined, 3, article.slug)} />
      </Section>

      <ClosingCall />
    </>
  );
}
