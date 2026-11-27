import Link from "next/link";
import { ClientLogos } from "@/components/home/client-logos";
import { Testimonials } from "@/components/home/testimonials";
import { industryCards, insightCards, pillarStack, workItems } from "@/components/lists";
import { Cards, ClosingCall, DevNote, Faqs, Hero, Intro, PostCards, Section, ServiceStack, Stats, Steps, WorkGrid } from "@/components/ui";
import { method } from "@/content/company";
import { getArticles, getHome, getProjects, getTestimonials } from "@/lib/cms";
import { withSeo } from "@/lib/seo";

export async function generateMetadata() {
  const home = await getHome();
  return withSeo("/", { title: "Technicus: technology consultancy", description: home.heroLead });
}

/*
  Rhythm: paper hero, white statement and services, paper method, an ink band
  for the work, white industries, paper insights, white questions, then the
  paper close and the ink footer.
*/
export default async function Home() {
  const [home, quotes, projects, articles] = await Promise.all([getHome(), getTestimonials(), getProjects(), getArticles()]);
  const { clients, stats } = home;
  return (
    <>
      <Hero eyebrow="Technology consultancy" title={home.heroTitle} lead={home.heroLead} actions />

      <Section>
        <Intro label="Our view" text={home.introText}>
          <Link href="/about/how-we-work" className="group mt-10 inline-flex items-center gap-3 border-b border-ink/30 pb-1 text-[0.95rem] font-medium hover:border-ink" data-reveal>
            How we work with clients
            <span aria-hidden className="transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1">
              →
            </span>
          </Link>
        </Intro>
      </Section>

      <Section eyebrow="Services" title="Seven practices, one accountable team">
        <ServiceStack items={pillarStack()} />
      </Section>

      {clients.length > 0 ? (
        <Section eyebrow="Clients" title="Trusted by teams in many sectors">
          <ClientLogos clients={clients} />
        </Section>
      ) : (
        <div className="inner">
          <DevNote>client logos approved for display (Admin, Home page). The clients section is hidden until then.</DevNote>
        </div>
      )}

      {stats.length > 0 && (
        <Section>
          <Stats items={stats} />
        </Section>
      )}

      <Section tone="grey" eyebrow="Method" title="A clear process, from first question to running system" lead={home.howText}>
        <Steps steps={method} />
      </Section>

      <Section
        tone="dark"
        eyebrow="Work"
        title={home.workTitle}
        action={
          <Link href="/work" className="btn-outline-light">
            All case studies
          </Link>
        }
      >
        <WorkGrid items={workItems(projects, undefined, 4)} />
      </Section>

      <Section
        eyebrow="Industries"
        title={home.industriesTitle}
        lead={home.industriesLead}
        action={
          <Link href="/industries" className="btn-outline">
            All industries
          </Link>
        }
      >
        <Cards columns={4} items={industryCards()} />
      </Section>

      {quotes.length > 0 ? (
        <Section tone="grey" eyebrow="Clients" title="In their words">
          <Testimonials items={quotes} />
        </Section>
      ) : (
        <div className="inner">
          <DevNote>client testimonials (Admin, Testimonials). The section is hidden until at least one is published.</DevNote>
        </div>
      )}

      <Section
        tone="grey"
        eyebrow="Insights"
        title={home.insightsTitle}
        action={
          <Link href="/insights" className="btn-outline">
            All insights
          </Link>
        }
      >
        <PostCards items={insightCards(articles)} />
      </Section>

      {home.faqs.length > 0 && (
        <Section eyebrow="Questions" title="What clients usually ask first">
          <Faqs faqs={home.faqs} />
        </Section>
      )}

      <ClosingCall line={home.closingTitle} lead={home.closingLead} />
    </>
  );
}
