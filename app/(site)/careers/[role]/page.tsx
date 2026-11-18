import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/forms/application-form";
import { BulletList, Hero, Intro, Section } from "@/components/ui";
import { getJob, getJobs } from "@/lib/cms";
import { withSeo } from "@/lib/seo";

type Props = PageProps<"/careers/[role]">;

// Published openings only (built-in drafts are added while developing).
// Openings added in the admin after a build are rendered on their first visit.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getJobs()).map((r) => ({ role: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const role = await getJob((await params).role);
  if (!role) return {};
  return withSeo(`/careers/${role.slug}`, { title: role.title, description: role.summary }, role.seo);
}

export default async function RolePage({ params }: Props) {
  const role = await getJob((await params).role);
  if (!role) notFound();

  return (
    <>
      <Hero
        align="left"
        eyebrow={`${role.team} · ${role.location} · ${role.type}`}
        crumbs={[
          { href: "/careers", name: "Careers" },
          { href: `/careers/${role.slug}`, name: role.title },
        ]}
        title={role.title}
        lead={role.summary}
      >
        {role.published === false && (
          <p className="mt-8 inline-block rounded-xl border border-dashed border-indigo bg-lavender px-4 py-3 font-mono text-xs" data-reveal>
            Draft role. Visible only while developing. It is not advertised and is not in the production site.
          </p>
        )}
      </Hero>

      <Section>
        <Intro label="The role" text="What you will do.">
          <div className="mt-10">
            <BulletList items={role.responsibilities} />
          </div>
        </Intro>
        <div className="mt-20">
          <Intro label="You" text="What we look for.">
            <div className="mt-10">
              <BulletList items={role.requirements} />
            </div>
          </Intro>
        </div>
      </Section>

      <Section id="apply" tone="dark" title={`Apply for ${role.title}`}>
        <ApplicationForm roles={[role.title]} role={role.title} />
      </Section>
    </>
  );
}
