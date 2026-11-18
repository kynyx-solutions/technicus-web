import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/lead-form";
import { workItems } from "@/components/lists";
import { BulletList, Hero, Intro, Section, WorkGrid } from "@/components/ui";
import { contact } from "@/content/company";
import { getCapability, getPillar } from "@/content/services";
import { localPages } from "@/content/site";

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
  return {
    title: page?.name,
    description: page ? `${page.name} by Technicus, for businesses in Bihar and across India.` : undefined,
  };
}

export default async function LocalServicePage({ params }: Props) {
  const page = find((await params).local);
  if (!page) notFound();

  return (
    <>
      <Hero
        eyebrow="Technicus in India"
        crumbs={[
          { href: "/india", name: "India" },
          { href: `/${page.slug}`, name: page.name },
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

      <Section tone="dark" title="Projects for Indian businesses">
        <WorkGrid items={workItems(undefined, 2)} />
      </Section>

      <Section id="enquiry" title="Ask for a call back">
        <LeadForm type="local" />
      </Section>
    </>
  );
}
