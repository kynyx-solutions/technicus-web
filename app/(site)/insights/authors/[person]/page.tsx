import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClosingCall, Hero, PostCards, Section, Tags } from "@/components/ui";
import { getArticles } from "@/lib/cms";
import { withSeo } from "@/lib/seo";
import { getPerson, people } from "@/content/people";

type Props = PageProps<"/insights/authors/[person]">;

export const dynamicParams = false;

// Only people who have written something get an author page.
export async function generateStaticParams() {
  const articles = await getArticles();
  return people.filter((p) => articles.some((a) => a.author === p.slug)).map((p) => ({ person: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const person = getPerson((await params).person);
  return withSeo(`/insights/authors/${person?.slug ?? ""}`, { title: person?.name ?? "Author", description: person?.bio });
}

export default async function AuthorPage({ params }: Props) {
  const person = getPerson((await params).person);
  if (!person) notFound();
  const written = (await getArticles()).filter((a) => a.author === person.slug);

  return (
    <>
      <Hero
        eyebrow={person.role}
        crumbs={[
          { href: "/insights", name: "Insights" },
          { href: `/insights/authors/${person.slug}`, name: person.name },
        ]}
        title={person.name}
        lead={person.bio}
      >
        {person.linkedin && (
          <a href={person.linkedin} target="_blank" rel="noreferrer" className="btn-outline mt-10 px-7 py-4" data-reveal>
            LinkedIn
          </a>
        )}
      </Hero>

      <Section title="Writes about">
        <Tags items={person.expertise} />
      </Section>

      <Section tone="grey" title={`${written.length} ${written.length === 1 ? "piece" : "pieces"} published`}>
        <PostCards
          items={written.map((a) => ({
            href: `/insights/${a.slug}`,
            title: a.title,
            meta: `${a.kind} · ${a.readingMinutes} min`,
          }))}
        />
      </Section>

      <ClosingCall />
    </>
  );
}
