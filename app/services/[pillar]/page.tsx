import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PILLAR_ART } from "@/components/art";
import { ExpertContact } from "@/components/expert";
import { capabilityCards, insightCards, workItems } from "@/components/lists";
import { SceneBox } from "@/components/three/scene-box";
import { Cards, ClosingCall, Hero, Intro, PostCards, Prose, Section, Steps, Tags, WorkGrid } from "@/components/ui";
import { getPillarCopy } from "@/content/copy";
import { getPillar, pillars } from "@/content/services";

type Props = PageProps<"/services/[pillar]">;

export const dynamicParams = false;

export function generateStaticParams() {
  return pillars.map((p) => ({ pillar: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pillar: slug } = await params;
  const pillar = getPillar(slug);
  return { title: pillar?.name, description: getPillarCopy(slug)?.lead ?? pillar?.summary };
}

export default async function PillarPage({ params }: Props) {
  const { pillar: slug } = await params;
  const pillar = getPillar(slug);
  if (!pillar) notFound();
  const copy = getPillarCopy(slug);
  const index = pillars.indexOf(pillar);
  const art = PILLAR_ART[index % PILLAR_ART.length];

  return (
    <>
      <Hero
        tone="dark"
        crumbs={[
          { href: "/services", name: "Services" },
          { href: `/services/${pillar.slug}`, name: pillar.name },
        ]}
        title={pillar.name}
        lead={copy?.lead ?? pillar.summary}
        actions
        media={<SceneBox targets={[{ mode: "pillar", index }]} fallback={art} className="aspect-[4/3] md:aspect-[16/7]" />}
      />

      {copy && (
        <Section>
          <Intro label="Overview" text={copy.headline} />
          <div className="mt-12 md:ml-[25%] md:mt-16">
            <Prose paragraphs={copy.overview} />
          </div>
        </Section>
      )}

      <Section tone="grey" title="What we do">
        <Cards items={capabilityCards(pillar)} />
      </Section>

      {copy && (
        <Section title="How the work runs">
          <Steps steps={copy.approach} />
        </Section>
      )}

      {copy && (
        <Section title="Technologies">
          <Tags items={copy.technologies} />
        </Section>
      )}

      <Section tone="dark" title="Related work">
        <WorkGrid items={workItems({ pillar: pillar.slug }, 2)} />
      </Section>

      <Section title="Related reading">
        <PostCards items={insightCards(pillar.slug)} />
        <div className="mt-16 md:mt-24">
          <ExpertContact pillarSlug={pillar.slug} pillarName={pillar.name} />
        </div>
      </Section>

      <ClosingCall line={`Planning ${pillar.name.toLowerCase()} work?`} />
    </>
  );
}
