import type { Metadata } from "next";
import Link from "next/link";
import { ApplicationForm } from "@/components/forms/application-form";
import { ArrowCircle, DevNote, Hero, Intro, Prose, Section, Steps } from "@/components/ui";
import { hiringSteps } from "@/content/careers";
import { getJobs } from "@/lib/cms";
import { withSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/careers", { title: "Careers", description: "Work at Technicus." });
}

export default async function CareersPage() {
  const roles = await getJobs();
  return (
    <>
      <Hero
        tone="dark"
        art="steps"
        crumbs={[{ href: "/careers", name: "Careers" }]}
        eyebrow="Careers at Technicus"
        title="Build things that matter to the people who use them"
        lead="We look for people who are good at their craft, say what they think and finish what they start."
      />

      <Section>
        <Intro label="Working here" text="You work directly with clients on real problems: products people depend on, systems a business runs on.">
          <div className="mt-8">
            <Prose
              paragraphs={[
                "Teams are small, so what you do is visible and your judgment counts. You work alongside strategists, designers, engineers and data specialists, and you see a project from the first conversation to production.",
              ]}
            />
          </div>
          <DevNote>
            benefits, working arrangements (office, remote or mixed), locations and anything else that is a fact about
            employment at Technicus. None of it is stated here because none of it is known.
          </DevNote>
        </Intro>
      </Section>

      <Section id="roles" tone="grey" title={roles.length > 0 ? "Open roles" : "No openings right now"}>
        {roles.length > 0 ? (
          <ul className="space-y-3">
            {roles.map((role) => (
              <li key={role.slug} data-reveal>
                <Link href={`/careers/${role.slug}`} className="group flex flex-wrap items-center justify-between gap-6 card-press p-6 md:p-7">
                  <span>
                    <span className="block text-[1.6rem] leading-tight font-medium tracking-[-0.01em]">
                      {role.title}
                      {role.published === false && (
                        <span className="ml-3 border border-blue/40 px-2 py-0.5 align-middle text-[0.7rem] font-medium tracking-[0.1em] text-blue uppercase">
                          Draft
                        </span>
                      )}
                    </span>
                    <span className="mt-2 block text-black/55">
                      {role.team} · {role.location} · {role.type}
                    </span>
                  </span>
                  <ArrowCircle />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="lead max-w-2xl text-black/65" data-reveal>
            We still want to hear from good people. Send us an open application below.
          </p>
        )}
        <DevNote>
          real roles. The roles marked Draft are examples that appear only while developing and are never published.
          Add real openings in the admin (Job openings); once any exist there, these examples disappear.
        </DevNote>
      </Section>

      <Section title="Careers at Technicus: how we hire" lead="Four steps, usually over two to three weeks. You will know at each step what comes next and when to expect an answer, whether or not we move forward.">
        <Steps steps={hiringSteps} />
      </Section>

      <Section id="apply" tone="dark" title="Tell us about yourself">
        <ApplicationForm roles={roles.map((r) => r.title)} />
      </Section>
    </>
  );
}
