import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PILLAR_ART } from "@/components/art";
import { ExpertContact } from "@/components/expert";
import { capabilityCards, insightCards, workItems } from "@/components/lists";
import { Cards, ClosingCall, Faqs, Features, Hero, Intro, PostCards, Section, Tags, WorkGrid } from "@/components/ui";
import { engagementModels } from "@/content/company";
import { getCapabilityCopy } from "@/content/copy";
import { pageSeo } from "@/content/seo";
import { anchor, getCapability, getPillar, pillars } from "@/content/services";
import { getArticles, getProjects } from "@/lib/cms";
import { withSeo } from "@/lib/seo";

type Props = PageProps<"/services/[pillar]/[capability]">;

export const dynamicParams = false;

export function generateStaticParams() {
  return pillars.flatMap((p) => p.capabilities.map((c) => ({ pillar: p.slug, capability: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pillar, capability } = await params;
  return withSeo(`/services/${pillar}/${capability}`, {
    title: getCapability(pillar, capability)?.name ?? "Services",
    description: getCapabilityCopy(pillar, capability)?.lead,
  });
}

export default async function CapabilityPage({ params }: Props) {
  const slugs = await params;
  const pillar = getPillar(slugs.pillar);
  const capability = getCapability(slugs.pillar, slugs.capability);
  if (!pillar || !capability) notFound();
  const copy = getCapabilityCopy(pillar.slug, capability.slug);
  const art = PILLAR_ART[pillars.indexOf(pillar) % PILLAR_ART.length];
  const seo = pageSeo[`/services/${pillar.slug}/${capability.slug}`];

  return (
    <>
      <Hero
        tone="dark"
        art={art}
        crumbs={[
          { href: "/services", name: "Services" },
          { href: `/services/${pillar.slug}`, name: pillar.name },
          { href: `/services/${pillar.slug}/${capability.slug}`, name: capability.name },
        ]}
        eyebrow={seo?.eyebrow}
        title={capability.name}
        lead={copy?.lead}
        actions
      />

      <Section title={seo?.heading ?? "What we build"} lead={seo?.intro}>
        <ul className="space-y-3">
          {capability.services.map((service) => {
            const detail = copy?.services[service];
            return (
              <li
                key={service}
                id={anchor(service)}
                data-reveal
                className="scroll-mt-28 grid gap-6 rounded-xl border border-line bg-white p-7 md:grid-cols-12 md:gap-10 md:p-10"
              >
                <div className="md:col-span-5">
                  <h3 className="h3 text-ink">{service}</h3>
                </div>
                <div className="md:col-span-7">
                  {detail && <p className="leading-relaxed text-muted">{detail.text}</p>}
                  {detail && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {detail.deliverables.map((d) => (
                        <li key={d} className="rounded-md bg-sky px-3 py-1.5 text-[0.88rem] text-navy">
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {copy && (
        <Section tone="dark">
          <Intro label="Why it matters" text={copy.why} />
        </Section>
      )}

      <Section title="Ways to start">
        <Features columns={4} items={engagementModels} />
      </Section>

      {copy && (
        <Section tone="grey" title="Technologies">
          <Tags items={copy.technologies} />
        </Section>
      )}

      <Section tone="dark" title="Related work">
        <WorkGrid items={workItems(await getProjects(), { pillar: pillar.slug }, 2)} />
      </Section>

      {copy && (
        <Section title="Questions">
          <Faqs faqs={copy.faqs} />
        </Section>
      )}

      <Section tone="grey" title={`More in ${pillar.name}`}>
        <Cards items={capabilityCards(pillar, capability.slug).slice(0, 3)} />
        <div className="mt-20">
          <PostCards items={insightCards(await getArticles(), pillar.slug)} />
        </div>
        <div className="mt-20">
          <ExpertContact pillarSlug={pillar.slug} pillarName={pillar.name} />
        </div>
      </Section>

      <ClosingCall line={`Need help with ${capability.name.toLowerCase()}?`} />
    </>
  );
}
