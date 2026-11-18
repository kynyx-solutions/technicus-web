import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PILLAR_ART } from "@/components/art";
import { ExpertContact } from "@/components/expert";
import { capabilityCards, insightCards, workItems } from "@/components/lists";
import { Cards, ClosingCall, Faqs, Features, Hero, Intro, PostCards, Section, Tags, WorkGrid } from "@/components/ui";
import { engagementModels } from "@/content/company";
import { getCapabilityCopy } from "@/content/copy";
import { anchor, getCapability, getPillar, pillars } from "@/content/services";

type Props = PageProps<"/services/[pillar]/[capability]">;

export const dynamicParams = false;

export function generateStaticParams() {
  return pillars.flatMap((p) => p.capabilities.map((c) => ({ pillar: p.slug, capability: c.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pillar, capability } = await params;
  return {
    title: getCapability(pillar, capability)?.name,
    description: getCapabilityCopy(pillar, capability)?.lead,
  };
}

export default async function CapabilityPage({ params }: Props) {
  const slugs = await params;
  const pillar = getPillar(slugs.pillar);
  const capability = getCapability(slugs.pillar, slugs.capability);
  if (!pillar || !capability) notFound();
  const copy = getCapabilityCopy(pillar.slug, capability.slug);
  const art = PILLAR_ART[pillars.indexOf(pillar) % PILLAR_ART.length];

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
        title={capability.name}
        lead={copy?.lead}
        actions
      />

      <Section title="What we build">
        <ul className="space-y-3">
          {capability.services.map((service, i) => {
            const detail = copy?.services[service];
            return (
              <li
                key={service}
                id={anchor(service)}
                data-reveal
                className={`scroll-mt-28 grid gap-6 rounded-[22px] p-7 md:grid-cols-12 md:gap-10 md:p-12 ${i % 2 ? "bg-lavender" : "bg-mint"}`}
              >
                <div className="md:col-span-5">
                  <h3 className="text-[1.6rem] leading-tight font-medium tracking-[-0.01em] md:text-[1.9rem]">{service}</h3>
                </div>
                <div className="md:col-span-7">
                  {detail && <p className="text-[1.05rem] leading-relaxed text-black/70 md:text-lg">{detail.text}</p>}
                  {detail && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {detail.deliverables.map((d) => (
                        <li key={d} className="rounded-full bg-white/70 px-4 py-2 text-[0.95rem]">
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
        <WorkGrid items={workItems({ pillar: pillar.slug }, 2)} />
      </Section>

      {copy && (
        <Section title="Questions">
          <Faqs faqs={copy.faqs} />
        </Section>
      )}

      <Section tone="grey" title={`More in ${pillar.name}`}>
        <Cards items={capabilityCards(pillar, capability.slug).slice(0, 3)} />
        <div className="mt-20">
          <PostCards items={insightCards(pillar.slug)} />
        </div>
        <div className="mt-20">
          <ExpertContact pillarSlug={pillar.slug} pillarName={pillar.name} />
        </div>
      </Section>

      <ClosingCall line={`Need help with ${capability.name.toLowerCase()}?`} />
    </>
  );
}
