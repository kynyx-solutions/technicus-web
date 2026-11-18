import type { Metadata } from "next";
import { LeadForm } from "@/components/forms/lead-form";
import { workItems } from "@/components/lists";
import { OfficeCards } from "@/components/offices";
import { BulletList, Cards, DevNote, Hero, Section, Tags, WorkGrid } from "@/components/ui";
import { quality } from "@/content/company";
import { localPages } from "@/content/site";
import { withSeo } from "@/lib/seo";
import { getContactInfo, getProjects } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/india", {
  title: "Technicus in India",
  description: "Websites, apps, software, design and digital marketing for businesses in Bihar and across India.",
});
}

export default async function IndiaPage() {
  const contact = await getContactInfo();
  return (
    <>
      <Hero
        crumbs={[{ href: "/india", name: "India" }]}
        eyebrow="Software development in India"
        title="Websites, apps and software for businesses across India"
        lead="The same team and the same standards, for shops, schools, hotels, clinics and growing companies close to home."
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

      <Section title="Software development in India for local businesses" lead="Shops, schools, hotels, clinics and growing companies across Bihar and the rest of India work with our team in Madhubani for websites, apps, billing and business software, design and online marketing.">
        <Cards items={localPages.map((p) => ({ href: `/${p.slug}`, title: p.name }))} />
        <p className="mt-14 mb-5 text-xl" data-reveal>
          Also available
        </p>
        <Tags items={["Domain registration", "Web hosting", "SSL certificates", "Business email", "Bulk SMS", "Print design"]} />
        <DevNote>whether the hosting store, bulk SMS and Technicus Academy are still offered, and whether starting prices are shown on this page.</DevNote>
      </Section>

      <Section tone="grey" title="What every project includes" lead="The same standards apply to a small shop website and to a large business system.">
        <BulletList items={quality} />
      </Section>

      <Section tone="dark" title="Projects for Indian businesses">
        <WorkGrid items={workItems(await getProjects(), undefined, 4)} />
      </Section>

      <Section id="enquiry" title="Tell us what you need. We will call you back.">
        <LeadForm type="local" />
      </Section>

      <Section tone="grey" title="Office">
        <OfficeCards />
      </Section>
    </>
  );
}
