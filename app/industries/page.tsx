import type { Metadata } from "next";
import { workItems } from "@/components/lists";
import { ClosingCall, Hero, Rows, Section, WorkGrid } from "@/components/ui";
import { getIndustryCopy } from "@/content/copy";
import { industries } from "@/content/site";

export const metadata: Metadata = {
  title: "Industries",
  description: "Technology consulting and delivery for twelve industries.",
};

export default function IndustriesPage() {
  return (
    <>
      <Hero
        crumbs={[{ href: "/industries", name: "Industries" }]}
        title="Technology works differently in every industry"
        lead="We bring the same engineering discipline to each one, and learn the rules, the users and the economics that make it different."
      />

      <Section>
        <Rows
          items={industries.map((i) => ({
            href: `/industries/${i.slug}`,
            title: i.name,
            text: getIndustryCopy(i.slug)?.lead,
          }))}
        />
      </Section>

      <Section tone="dark" title="Selected work">
        <WorkGrid items={workItems(undefined, 4)} />
      </Section>

      <ClosingCall />
    </>
  );
}
