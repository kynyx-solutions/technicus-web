import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClosingCall, Hero, PostCards, Section, Tags } from "@/components/ui";
import { articles } from "@/content/copy";
import { getPerson, people } from "@/content/people";

type Props = PageProps<"/insights/authors/[person]">;

export const dynamicParams = false;

// Only people who have written something get an author page.
const authors = () => people.filter((p) => articles.some((a) => a.author === p.slug));

export function generateStaticParams() {
  return authors().map((p) => ({ person: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const person = getPerson((await params).person);
  return { title: person?.name, description: person?.bio };
}

export default async function AuthorPage({ params }: Props) {
  const person = getPerson((await params).person);
  if (!person) notFound();
  const written = articles.filter((a) => a.author === person.slug);

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
