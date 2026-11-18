import Link from "next/link";
import { industryCards, insightCards, pillarStack, workItems } from "@/components/lists";
import { Showreel } from "@/components/showreel";
import { Cards, ClosingCall, DevNote, Faqs, Hero, Intro, PostCards, Section, ServiceStack, Stats, Steps, WorkGrid } from "@/components/ui";
import { clientNames, method, positioning, quotes, stats } from "@/content/company";
import { homeFaqs } from "@/content/faqs";

export default function Home() {
  return (
    <>
      <Hero
        title={positioning.statement}
        lead={positioning.lead}
        media={<Showreel className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-video" />}
      />

      <Section>
        <Intro
          label="What we do"
          text="We work with startups, growing companies and established organisations to plan, design, build and run software. One team takes a product from the first decision to the system that runs it, in any industry and on any major technology stack."
        />
        <div className="mt-16 md:mt-24">
          <ServiceStack items={pillarStack()} />
        </div>
      </Section>

      {clientNames.length > 0 ? (
        <Section title="Trusted by" center>
          <ul className="grid grid-cols-2 gap-8 text-center text-2xl md:grid-cols-4">
            {clientNames.map((name) => (
              <li key={name} data-reveal>
                {name}
              </li>
            ))}
          </ul>
        </Section>
      ) : (
        <div className="inner">
          <DevNote>client names approved for display (content/company.ts). The &quot;Trusted by&quot; band is hidden until then.</DevNote>
        </div>
      )}

      <Section
        tone="dark"
        title="Selected work"
        action={
          <Link href="/work" className="btn-outline-light px-7 py-4" data-magnetic>
            All work
          </Link>
        }
      >
        <WorkGrid items={workItems(undefined, 6)} />
      </Section>

      {quotes.length > 0 && (
        <Section title="Trusted by our clients" center>
          <ul className="grid gap-4 md:grid-cols-2">
            {quotes.map((q, i) => (
              <li key={q.name} data-reveal className={`rounded-[20px] p-8 ${i % 2 ? "bg-lavender" : "bg-mint"}`}>
                <blockquote className="text-xl leading-snug">&ldquo;{q.text}&rdquo;</blockquote>
                <p className="mt-6 text-black/60">
                  {q.name}, {q.role}, {q.company}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section>
        <Intro
          label="How we work"
          text="Every engagement follows the same four stages. You see working software early and often, and you always know what is being built, why, and what it costs."
        >
          <Link href="/about/how-we-work" className="btn-outline mt-8 px-7 py-4" data-reveal>
            How we work with clients
          </Link>
        </Intro>
        <div className="mt-14 md:mt-20">
          <Steps steps={method} />
        </div>
        {stats.length > 0 && (
          <div className="mt-4">
            <Stats items={stats} />
          </div>
        )}
      </Section>

      <Section title="Industries" lead="The same engineering discipline, applied with knowledge of how each sector works.">
        <Cards columns={4} items={industryCards()} />
      </Section>

      <Section
        tone="dark"
        title="Insights"
        action={
          <Link href="/insights" className="btn-outline-light px-7 py-4" data-magnetic>
            All insights
          </Link>
        }
      >
        <PostCards items={insightCards()} />
      </Section>

      <Section title="Questions">
        <Faqs faqs={homeFaqs} />
      </Section>

      <ClosingCall />
    </>
  );
}
