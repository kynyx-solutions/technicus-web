import type { Metadata } from "next";
import { ClosingCall, DevNote, Hero, Section, Tags } from "@/components/ui";
import { leaders } from "@/content/people";
import { withSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/about/leadership", { title: "Leadership" });
}

export default function LeadershipPage() {
  const team = leaders();
  return (
    <>
      <Hero
        crumbs={[
          { href: "/about", name: "About" },
          { href: "/about/leadership", name: "Leadership" },
        ]}
        title="Leadership"
        lead="The people who lead our practices and answer for the work."
      />

      <Section>
        {team.length === 0 ? (
          <>
            <p className="lead mx-auto max-w-2xl text-center text-black/65" data-reveal>
              Profiles of our leadership team are being prepared and will be published here.
            </p>
            <DevNote>
              the leadership team. Add each person to content/people.ts with leader: true, a photo, a short background,
              areas of expertise and a LinkedIn link. Consider removing the links to this page until at least one
              profile exists.
            </DevNote>
          </>
        ) : (
          <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {team.map((p) => (
              <li key={p.slug} data-reveal>
                <div
                  className={`mb-6 aspect-[4/5]  bg-sky bg-cover bg-center`}
                  style={p.photo ? { backgroundImage: `url(${p.photo})` } : undefined}
                />
                <h2 className="text-2xl font-medium">{p.name}</h2>
                <p className="mt-1 text-black/55">{p.role}</p>
                <p className="mt-4 text-black/70">{p.bio}</p>
                <div className="mt-5">
                  <Tags items={p.expertise} />
                </div>
                {p.linkedin && (
                  <a href={p.linkedin} target="_blank" rel="noreferrer" className="sweep mt-5 inline-block">
                    LinkedIn
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <ClosingCall />
    </>
  );
}
