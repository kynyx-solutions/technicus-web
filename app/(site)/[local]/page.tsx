import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/lead-form";
import { workItems } from "@/components/lists";
import { BulletList, Features, Hero, Intro, Section, WorkGrid } from "@/components/ui";
import { communication, method, quality } from "@/content/company";
import { pageSeo } from "@/content/seo";
import { getCapability, getPillar } from "@/content/services";
import { localPages } from "@/content/site";
import { getContactInfo, getProjects } from "@/lib/cms";
import { withSeo } from "@/lib/seo";

// The six local service pages keep the URLs of the old site, so they sit at the
// root. Any other root-level address falls through to the 404 page.
type Props = PageProps<"/[local]">;

export const dynamicParams = false;

export function generateStaticParams() {
  return localPages.map((p) => ({ local: p.slug }));
}

const find = (slug: string) => localPages.find((p) => p.slug === slug);

/** The services listed on the matching global page, reused as "what is included". */
function included(globalPath: string) {
  const [, , pillarSlug, capabilitySlug] = globalPath.split("/");
  if (capabilitySlug) return getCapability(pillarSlug, capabilitySlug)?.services ?? [];
  return getPillar(pillarSlug)?.capabilities.map((c) => c.name) ?? [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = find((await params).local);
  return withSeo(`/${page?.slug ?? ""}`, {
    title: page?.name ?? "Technicus in India",
    description: page ? `${page.name} by Technicus, for businesses in Bihar and across India.` : undefined,
  });
}

export default async function LocalServicePage({ params }: Props) {
  const contact = await getContactInfo();
  const page = find((await params).local);
  if (!page) notFound();

  return (
    <>
      <Hero
        eyebrow="Technicus in India"
        crumbs={[
          { href: "/india", name: "India" },
          { href: `/${page.slug}`, name: page.name.split(" in ")[0] },
        ]}
        title={page.name}
        lead="For shops, schools, hotels, clinics and growing companies. Tell us what you need and we will call you back."
      >
        <div className="mt-10 flex flex-wrap justify-center gap-3" data-reveal>
          <a href={contact.phoneHref} className="btn-dark px-7 py-4">
            Call {contact.phone}
          </a>
          <a href={contact.whatsappHref} target="_blank" rel="noreferrer" className="btn-outline px-7 py-4">
            WhatsApp us
          </a>
        </div>
      </Hero>

      <Section>
        <Intro label="What is included" text="Everything you need, from the first conversation to a site or system that runs.">
          <div className="mt-10">
            <BulletList items={included(page.global)} />
          </div>
          <Link href={page.global} className="btn-outline mt-10 px-7 py-4" data-reveal>
            See the full service
          </Link>
        </Intro>
      </Section>

      <Section tone="grey" title={pageSeo[`/${page.slug}`]?.heading ?? "Why choose Technicus"}>
        <p className="lead mb-12 max-w-3xl text-black/70" data-reveal>
          You work with a team based in Madhubani, Bihar, that builds for clients across India and abroad. Every project follows the same four steps, so you
          always know what is happening and what comes next.
        </p>
        <Features items={method} columns={4} />
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <div data-reveal>
            <h3 className="text-[1.3rem] font-medium">What every project includes</h3>
            <div className="mt-5">
              <BulletList items={quality} />
            </div>
          </div>
          <div data-reveal>
            <h3 className="text-[1.3rem] font-medium">How we keep you informed</h3>
            <div className="mt-5">
              <BulletList items={communication} />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="dark" title="Projects for Indian businesses">
        <WorkGrid items={workItems(await getProjects(), undefined, 2)} />
      </Section>

      <Section id="enquiry" title="Ask for a call back">
        <LeadForm type="local" />
      </Section>
    </>
  );
}
