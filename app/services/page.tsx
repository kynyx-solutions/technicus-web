import type { Metadata } from "next";
import Link from "next/link";
import { pillarStack, workItems } from "@/components/lists";
import { ClosingCall, Features, Hero, Intro, Section, ServiceStack, Tags, WorkGrid } from "@/components/ui";
import { engagementModels, technologies } from "@/content/company";

export const metadata: Metadata = {
  title: "Services",
  description: "Strategy, design, engineering, AI and data, cloud and security, growth, and managed services.",
};

export default function ServicesPage() {
  return (
    <>
      <Hero
        tone="dark"
        art="triangle"
        crumbs={[{ href: "/services", name: "Services" }]}
        title="Everything it takes to plan, build and run technology"
        lead="Seven practices that work as one team. Engage one of them for a single problem, or all of them for a whole product."
        actions
      />

      <Section>
        <ServiceStack items={pillarStack()} />
      </Section>

      <Section tone="grey">
        <Intro label="How we engage" text="Four ways to work with us. The right one depends on how clear the scope is and how long the work will run." />
        <div className="mt-14">
          <Features columns={4} items={engagementModels} />
        </div>
        <Link href="/about/how-we-work" className="btn-outline mt-14 px-7 py-4" data-reveal>
          How we work
        </Link>
      </Section>

      <Section title="Technologies" lead="The stacks our teams work in.">
        <Tags items={technologies.flatMap((g) => g.items)} />
        <Link href="/technologies" className="btn-outline mt-12 px-7 py-4" data-reveal>
          All technologies
        </Link>
      </Section>

      <Section tone="dark" title="Selected work">
        <WorkGrid items={workItems(undefined, 4)} />
      </Section>

      <ClosingCall />
    </>
  );
}
