import type { Metadata } from "next";
import { SceneBox } from "@/components/three/scene-box";
import { ClosingCall, Hero, Intro, Section } from "@/components/ui";
import { technologies } from "@/content/company";
import { withSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/technologies", {
  title: "Technologies",
  description: "The languages, frameworks, platforms and tools our teams work in.",
});
}

export default function TechnologiesPage() {
  return (
    <>
      <Hero
        crumbs={[{ href: "/technologies", name: "Technologies" }]}
        eyebrow="Our technology stack"
        title="We choose technology to fit the problem"
        lead="Our teams work across the major stacks, so the recommendation you get depends on your situation and not on what we happen to know."
        media={<SceneBox targets={[{ mode: "pillar", index: 2 }]} fallback="triangle" className="aspect-[4/3] md:aspect-[16/7]" />}
      />

      <Section
        title="Our technology stack by area"
        lead="These are the languages, frameworks and platforms our teams use most. We are not tied to any vendor: we recommend a stack based on your situation, the people who will maintain the system, how it needs to grow and what it costs to run each month."
      >
        <ul className="border-t border-black/15">
          {technologies.map((group) => (
            <li key={group.group} className="grid gap-6 border-b border-black/15 py-10 md:grid-cols-12" data-reveal>
              <h2 className="h3 md:col-span-4">{group.group}</h2>
              <ul className="flex flex-wrap gap-2.5 md:col-span-8">
                {group.items.map((item) => (
                  <li key={item} className="border border-ink/20 px-5 py-2.5 text-[1.05rem]">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="dark">
        <Intro
          label="How we choose"
          text="The right stack is the one your team can run in five years. We weigh what you already have, who will maintain it, how it must scale and what it costs to operate, and we explain the trade-offs before anything is built. If the best answer is a platform you already own, or software you can buy instead of build, we will say so."
        />
      </Section>

      <ClosingCall line="Not sure which stack fits?" lead="Tell us what you are building and the constraints you have. We will give you a straight recommendation." />
    </>
  );
}
