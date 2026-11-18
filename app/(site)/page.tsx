import Link from "next/link";
import { industryCards, insightCards, pillarStack, workItems } from "@/components/lists";
import { ClientLogos } from "@/components/home/client-logos";
import { TestimonialPile } from "@/components/home/testimonial-pile";
import { Showreel } from "@/components/showreel";
import { Cards, ClosingCall, DevNote, Faqs, Hero, Intro, PostCards, Section, ServiceStack, Stats, Steps, WorkGrid } from "@/components/ui";
import { method } from "@/content/company";
import { getArticles, getHome, getProjects, getTestimonials } from "@/lib/cms";
import { withSeo } from "@/lib/seo";

export async function generateMetadata() {
  const home = await getHome();
  return withSeo("/", { title: "Technicus: technology consultancy", description: home.heroLead });
}

export default async function Home() {
  const [home, quotes] = await Promise.all([getHome(), getTestimonials()]);
  const { clients, stats } = home;
  return (
    <>
      <Hero
        title={home.heroTitle}
        lead={home.heroLead}
        media={<Showreel className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-video" />}
      />

      <Section>
        <Intro
          label="What we do"
          text={home.introText}
        />
        <div className="mt-12 md:mt-16">
          <ServiceStack items={pillarStack()} />
        </div>
      </Section>

      {clients.length > 0 ? (
        <Section title="Trusted by" center>
          <ClientLogos clients={clients} />
        </Section>
      ) : (
        <div className="inner">
          <DevNote>client logos approved for display (Admin, Home page). The &quot;Trusted by&quot; section is hidden until then.</DevNote>
        </div>
      )}

      <Section
        tone="dark"
        title={home.workTitle}
        action={
          <Link href="/work" className="btn-outline-light px-7 py-4" data-magnetic>
            All work
          </Link>
        }
      >
        <WorkGrid items={workItems(await getProjects(), undefined, 6)} />
      </Section>

      {quotes.length > 0 ? (
        <Section title="Trusted by our clients" center>
          <TestimonialPile items={quotes} />
        </Section>
      ) : (
        <div className="inner">
          <DevNote>client testimonials (Admin, Testimonials). The section is hidden until at least one is published.</DevNote>
        </div>
      )}

      <Section>
        <Intro
          label="How we work"
          text={home.howText}
        >
          <Link href="/about/how-we-work" className="btn-outline mt-8 px-7 py-4" data-reveal>
            How we work with clients
          </Link>
        </Intro>
        <div className="mt-10 md:mt-14">
          <Steps steps={method} />
        </div>
        {stats.length > 0 && (
          <div className="mt-4">
            <Stats items={stats} />
          </div>
        )}
      </Section>

      <Section title={home.industriesTitle} lead={home.industriesLead}>
        <Cards columns={4} items={industryCards()} />
      </Section>

      <Section
        tone="dark"
        title={home.insightsTitle}
        action={
          <Link href="/insights" className="btn-outline-light px-7 py-4" data-magnetic>
            All insights
          </Link>
        }
      >
        <PostCards items={insightCards(await getArticles())} />
      </Section>

      {home.faqs.length > 0 && (
        <Section title="Questions about our technology consultancy">
          <Faqs faqs={home.faqs} />
        </Section>
      )}

      <ClosingCall line={home.closingTitle} lead={home.closingLead} />
    </>
  );
}
