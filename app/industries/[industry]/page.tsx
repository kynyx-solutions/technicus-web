import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { insightCards, workItems } from "@/components/lists";
import { ClosingCall, Hero, PostCards, Section, Steps, WorkGrid } from "@/components/ui";
import { getIndustryCopy } from "@/content/copy";
import { getCapability } from "@/content/services";
import { industries } from "@/content/site";
import { projects } from "@/content/work";

type Props = PageProps<"/industries/[industry]">;

export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((i) => ({ industry: i.slug }));
}

const find = (slug: string) => industries.find((i) => i.slug === slug);

/** Turns "/services/ai-data/automation" into the capability's name. */
function capabilityName(path: string) {
  const [, , pillar, capability] = path.split("/");
  return getCapability(pillar, capability)?.name ?? "Learn more";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry } = await params;
  return { title: find(industry)?.name, description: getIndustryCopy(industry)?.lead };
}

export default async function IndustryPage({ params }: Props) {
  const industry = find((await params).industry);
  if (!industry) notFound();
  const copy = getIndustryCopy(industry.slug);
  const hasWork = projects.some((p) => p.industrySlug === industry.slug);

  return (
    <>
      <Hero
        tone="dark"
        art="hexagon"
        crumbs={[
          { href: "/industries", name: "Industries" },
          { href: `/industries/${industry.slug}`, name: industry.name },
        ]}
        title={industry.name}
        lead={copy?.lead}
        actions
      />

      {copy && (
        <Section title="What clients bring to us">
          <Steps steps={copy.challenges} />
        </Section>
      )}

      {copy && (
        <Section tone="grey" title="How we help">
          <ul className="border-t border-black/15">
            {copy.solutions.map((s) => (
              <li key={s.title} className="grid gap-4 border-b border-black/15 py-10 md:grid-cols-12 md:gap-10" data-reveal>
                <h3 className="h3 md:col-span-5">{s.title}</h3>
                <div className="md:col-span-7">
                  <p className="text-lg text-black/70">{s.text}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.links.map((href) => (
                      <li key={href}>
                        <Link href={href} className="inline-flex rounded-full border border-black/25 px-4 py-2 text-[0.95rem] transition-colors hover:bg-black hover:text-white">
                          {capabilityName(href)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section tone="dark" title={hasWork ? `Work in ${industry.name.toLowerCase()}` : "Selected work"}>
        <WorkGrid items={workItems({ industry: industry.slug }, 2)} />
      </Section>

      <Section title="Reading for technology leaders">
        <PostCards items={insightCards()} />
      </Section>

      <ClosingCall line={`Working in ${industry.name.toLowerCase()}?`} />
    </>
  );
}
