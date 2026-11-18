import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/lead-form";
import { BulletList, Hero, Intro, Section } from "@/components/ui";
import { getRole, visibleRoles } from "@/content/careers";

type Props = PageProps<"/careers/[role]">;

// A production build contains published roles only (drafts are added while
// developing). With none published, every address under /careers/ is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return visibleRoles().map((r) => ({ role: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const role = getRole((await params).role);
  return { title: role?.title, description: role?.summary };
}

export default async function RolePage({ params }: Props) {
  const role = getRole((await params).role);
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
        {!role.published && (
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
        <LeadForm type="career" tone="dark" defaults={{ role: role.title }} />
      </Section>
    </>
  );
}
