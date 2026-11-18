import type { Metadata } from "next";
import { workItems } from "@/components/lists";
import { SceneBox } from "@/components/three/scene-box";
import { ClosingCall, DevNote, Hero, Section, WorkGrid } from "@/components/ui";
import { projects } from "@/content/work";

export const metadata: Metadata = { title: "Work", description: "Selected projects by Technicus." };

export default function WorkPage() {
  return (
    <>
      <Hero
        crumbs={[{ href: "/work", name: "Work" }]}
        title="Work we have shipped"
        lead="A selection of products and platforms built for our clients."
        media={<SceneBox targets={[{ mode: "gallery" }]} fallback="rounded" className="aspect-[4/3] md:aspect-[16/6]" />}
      />
      <Section>
        <DevNote>
          for each project: client permission, screenshots, the problem, our approach, an outcome with a number, and a
          client quote (content/work.ts). The pictures are generated shapes until real screenshots exist.
        </DevNote>
        <WorkGrid items={workItems(undefined, projects.length)} />
      </Section>
      <ClosingCall line="Have a project in mind?" />
    </>
  );
}
