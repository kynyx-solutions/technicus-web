import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Art, type ArtKind } from "@/components/art";
import { ClosingCall, DevNote, Features, Hero, Intro, Section } from "@/components/ui";
import { getCapabilityCopy, getIndustryCopy } from "@/content/copy";
import { pageSeo } from "@/content/seo";
import { getPillar, pillars } from "@/content/services";
import { getProject, getProjects } from "@/lib/cms";
import { withSeo } from "@/lib/seo";

type Props = PageProps<"/work/[project]">;

// Case studies added in the admin after a build are rendered on their first visit.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ project: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).project);
  if (!project) return {};
  return withSeo(`/work/${project.slug}`, { title: project.client, description: project.summary }, project.seo);
}

const KINDS: ArtKind[] = ["triangle", "arch", "hexagon", "rounded", "steps", "rings"];

export default async function CaseStudyPage({ params }: Props) {
  const slug = (await params).project;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  const facts = [
    { label: "Client", value: project.client },
    { label: "Sector", value: project.sector },
    { label: "Country", value: project.country },
    { label: "Services", value: project.services.join(", ") },
    { label: "Technologies", value: project.technologies.join(", ") },
  ].filter((f) => f.value);

  // The capabilities named in the project's services, or failing that, those of its pillars.
  const all = pillars.flatMap((p) => p.capabilities.map((c) => ({ ...c, pillar: p.slug })));
  const named = all.filter((c) => project.services.some((s) => s.toLowerCase() === c.name.toLowerCase()));
  const capabilities = (named.length ? named : all.filter((c) => project.pillars.includes(c.pillar)).slice(0, 2)).map((c) => ({
    ...c,
    href: `/services/${c.pillar}/${c.slug}`,
  }));
  const involved = capabilities.flatMap((c) => {
    const copy = getCapabilityCopy(c.pillar, c.slug);
    return c.services.slice(0, 4).map((name) => ({ title: name, text: copy?.services[name]?.text ?? "" })).filter((f) => f.text);
  });

  const industryLead = getIndustryCopy(project.industrySlug)?.lead;

  const story = [
    { title: "The problem", text: project.problem },
    { title: "Our approach", text: project.approach },
    { title: "What we built", text: project.built },
  ].filter((s): s is { title: string; text: string } => Boolean(s.text));

  return (
    <>
      <Hero
        align="left"
        eyebrow={project.client}
        crumbs={[
          { href: "/work", name: "Work" },
          { href: `/work/${project.slug}`, name: project.client },
        ]}
        title={project.summary.replace(/\.$/, "")}
        media={
          <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#e8e6f7] md:aspect-[16/8] md:rounded-[28px]">
            <Art kind={KINDS[index % KINDS.length]} tone="light" className="absolute inset-x-0 bottom-0 mx-auto h-[70%] w-auto" />
          </div>
        }
      />

      <Section>
        <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {facts.map((f) => (
            <div key={f.label} data-reveal>
              <dt className="label mb-2 text-black/50">{f.label}</dt>
              <dd className="text-lg">{f.value}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-10 flex flex-wrap gap-2" data-reveal>
          {project.pillars.map((slug) => {
            const pillar = getPillar(slug);
            return pillar ? (
              <li key={slug}>
                <Link href={`/services/${slug}`} className="inline-flex rounded-full border border-black/25 px-4 py-2 text-[0.95rem] transition-colors hover:bg-black hover:text-white">
                  {pillar.name}
                </Link>
              </li>
            ) : null;
          })}
        </ul>
        <DevNote>
          this case study only has what the old site stated. Still needed: client permission, screenshots, the problem,
          our approach, what was built, outcome numbers and a client quote (Admin, Case studies).
        </DevNote>
        {story.map((part) => (
          <div key={part.title} className="mt-16">
            <Intro label={part.title} text={part.text} />
          </div>
        ))}
      </Section>

      {involved.length > 0 && (
        <Section tone="grey" title={pageSeo[`/work/${project.slug}`]?.heading ?? "What went into the project"}>
          <p className="lead mb-6 max-w-3xl text-black/70" data-reveal>
            The services behind this project, and what each of them covers at Technicus. Follow the links below to see each service in full, with the work it includes.
          </p>
          {industryLead && (
            <p className="mb-12 max-w-3xl text-black/65" data-reveal>
              {industryLead}
            </p>
          )}
          <Features items={involved} />
          <ul className="mt-12 flex flex-wrap gap-2" data-reveal>
            {capabilities.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="btn-outline px-5 py-3 text-base">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {project.outcomes && project.outcomes.length > 0 && (
        <Section tone="dark" title="Outcome">
          <ul className="grid gap-10 md:grid-cols-3">
            {project.outcomes.map((o) => (
              <li key={o.label} data-reveal>
                <p className="display">{o.value}</p>
                <p className="mt-3 text-white/60">{o.label}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {project.quote && (
        <Section>
          <figure className="rounded-[24px] bg-mint p-10 md:p-16">
            <blockquote className="h3" data-reveal>
              &ldquo;{project.quote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-8 text-black/60" data-reveal>
              {project.quote.name}, {project.quote.role}
            </figcaption>
          </figure>
        </Section>
      )}

      <section data-tone="light" className="panel bg-fog pb-16 md:pb-24">
        <Link href={`/work/${next.slug}`} data-cursor="Next" className="group inner block pt-20 pb-16 md:pt-28">
          <p className="label mb-5 text-black/50">Next project</p>
          <p className="display transition-opacity duration-300 group-hover:opacity-60">{next.client}</p>
        </Link>
      </section>

      <ClosingCall />
    </>
  );
}
