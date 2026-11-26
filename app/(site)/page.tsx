import Link from "next/link";
import { ClientLogos } from "@/components/home/client-logos";
import { HeroPanel } from "@/components/home/hero-panel";
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

export default async function Home() {
  const [home, quotes, projects, articles] = await Promise.all([getHome(), getTestimonials(), getProjects(), getArticles()]);
  const { clients, stats } = home;
  return (
    <>
      <Hero eyebrow="Technology consultancy" title={home.heroTitle} lead={home.heroLead} actions media={<HeroPanel />} />

      {clients.length > 0 ? (
        <Section tone="grey" title="Trusted by" center>
          <ClientLogos clients={clients} />
        </Section>
      ) : (
        <div className="inner">
          <DevNote>client logos approved for display (Admin, Home page). The &quot;Trusted by&quot; section is hidden until then.</DevNote>
        </div>
      )}

      <Section eyebrow="What we do" title="Services across the whole technology lifecycle" lead={home.introText}>
        <ServiceStack items={pillarStack()} />
      </Section>

      {stats.length > 0 && (
        <Section tone="grey">
          <Stats items={stats} />
        </Section>
      )}

      <Section tone="grey" eyebrow="How we work" title="A clear process, from first question to running system">
        <Intro label="Our method" text={home.howText}>
          <Link href="/about/how-we-work" className="btn-outline mt-8" data-reveal>
            How we work with clients
          </Link>
        </Intro>
        <div className="mt-12">
          <Steps steps={method} />
        </div>
      </Section>

      <Section eyebrow="Industries" title={home.industriesTitle} lead={home.industriesLead} action={<Link href="/industries" className="btn-outline">All industries</Link>}>
        <Cards columns={4} items={industryCards()} />
      </Section>

      <Section tone="grey" eyebrow="Case studies" title={home.workTitle} action={<Link href="/work" className="btn-outline">All case studies</Link>}>
        <WorkGrid items={workItems(projects, undefined, 6)} />
      </Section>

      {quotes.length > 0 ? (
        <Section eyebrow="Testimonials" title="Trusted by our clients">
          <Testimonials items={quotes} />
        </Section>
      ) : (
        <div className="inner">
          <DevNote>client testimonials (Admin, Testimonials). The section is hidden until at least one is published.</DevNote>
        </div>
      )}

      <Section tone="grey" eyebrow="Insights" title={home.insightsTitle} action={<Link href="/insights" className="btn-outline">All insights</Link>}>
        <PostCards items={insightCards(articles)} />
      </Section>

      {home.faqs.length > 0 && (
        <Section eyebrow="FAQ" title="Questions about our technology consultancy">
          <Faqs faqs={home.faqs} />
        </Section>
      )}

      <ClosingCall line={home.closingTitle} lead={home.closingLead} />
    </>
  );
}
