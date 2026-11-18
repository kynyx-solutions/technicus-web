import type { Metadata } from "next";
import { workItems } from "@/components/lists";
import { SceneBox } from "@/components/three/scene-box";
import { ClosingCall, DevNote, Features, Hero, Section, WorkGrid } from "@/components/ui";
import { pillars } from "@/content/services";
import { withSeo } from "@/lib/seo";
import { getProjects } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/work", { title: "Work", description: "Selected projects by Technicus." });
}

export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <>
      <Hero
        crumbs={[{ href: "/work", name: "Work" }]}
        eyebrow="Case studies"
        title="Work we have shipped"
        lead="A selection of products and platforms built for our clients."
        media={<SceneBox targets={[{ mode: "gallery" }]} fallback="rounded" className="aspect-[4/3] md:aspect-[16/6]" />}
      />
      <Section title="Case studies by client" lead="Each case study shows the client, their industry and the services behind the project. Fuller write-ups, with the problem, our approach and the results, are added as clients agree to share them. Below the list, you can see the kinds of work we take on for clients, across strategy, design, engineering, data and growth.">
        <DevNote>
          for each project: client permission, screenshots, the problem, our approach, an outcome with a number, and a
          client quote (Admin, Case studies). The pictures are generated shapes until real screenshots exist.
        </DevNote>
        <WorkGrid items={workItems(projects, undefined, projects.length)} />
      </Section>
      <Section tone="grey" title="What we build for clients">
        <Features items={pillars.map((p) => ({ title: p.name, text: p.summary }))} />
      </Section>
      <ClosingCall line="Have a project in mind?" />
    </>
  );
}
