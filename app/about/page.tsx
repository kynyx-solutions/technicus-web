import type { Metadata } from "next";
import Link from "next/link";
import { SceneBox } from "@/components/three/scene-box";
import { ClosingCall, DevNote, Hero, Intro, Prose, Section, Stats, Steps } from "@/components/ui";
import { offices, stats, values } from "@/content/company";
import { leaders } from "@/content/people";

export const metadata: Metadata = {
  title: "About",
  description: "Technicus is a technology consultancy founded in Madhubani, India, working with clients worldwide.",
};

export default function AboutPage() {
  return (
    <>
      <Hero
        crumbs={[{ href: "/about", name: "About" }]}
        title="We help organisations make good technology decisions, then carry them out"
        media={<SceneBox targets={[{ mode: "globe" }]} fallback="arch" label="Based in India · Working worldwide" className="aspect-[4/3] md:aspect-[16/7]" />}
      />

      <Section>
        <Intro label="Our story" text="Technicus began in Madhubani, a town in the Indian state of Bihar, building websites and software for the businesses around us." />
        <div className="mt-12 md:ml-[25%] md:mt-16">
          <Prose
            paragraphs={[
              "Those first clients were shops, schools, hotels and showrooms with no technology team of their own. They needed someone to tell them plainly what was worth building, and then to build it properly.",
              "That habit shaped the company. We learned to start from the business problem, to explain trade-offs in plain words and to stay responsible for what we ship. As the work grew in size and reach, we added strategy, design, AI, cloud and growth to engineering, so that a client could get a whole answer from one team.",
              "Today we work as a technology consultancy for organisations in many industries and countries. Where we come from still decides how we work: close to the client, careful with their money and honest about what we know.",
            ]}
          />
          <DevNote>
            the founding year, the founders and the real milestones, so this story can become a dated timeline. The text
            above is written from what the old site shows and must be confirmed.
          </DevNote>
        </div>
      </Section>

      <Section title="What we hold ourselves to">
        <Steps steps={values} />
        {stats.length > 0 && (
          <div className="mt-4">
            <Stats items={stats} />
          </div>
        )}
      </Section>

      {leaders().length > 0 && (
        <Section tone="grey" title="Leadership">
          <Link href="/about/leadership" className="btn-dark px-7 py-4" data-reveal>
            Meet the leadership team
          </Link>
        </Section>
      )}

      <Section tone="dark">
        <Intro label="Where we work" text="Based in India, working with clients in other countries and time zones. We arrange working hours to overlap with yours.">
          <ul className="mt-10 border-t border-white/15">
            {offices.map((o) => (
              <li key={o.city} className="flex flex-wrap justify-between gap-4 border-b border-white/15 py-6" data-reveal>
                <span className="text-2xl">{o.city}</span>
                <span className="text-white/55">{o.country}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal>
            <Link href="/about/locations" className="btn-outline-light px-7 py-4">
              Locations
            </Link>
            <Link href="/careers" className="btn-light px-7 py-4">
              Work at Technicus
            </Link>
          </div>
        </Intro>
      </Section>

      <ClosingCall />
    </>
  );
}
