import type { Metadata } from "next";
import { ContactTabs } from "@/components/forms/contact-tabs";
import { OfficeCards } from "@/components/offices";
import { SceneBox } from "@/components/three/scene-box";
import { DevNote, Hero, Section, Steps } from "@/components/ui";
import { pillars } from "@/content/services";
import { withSeo } from "@/lib/seo";
import { getContactInfo } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/contact", {
  title: "Contact",
  description: "Talk to Technicus about a project, book a consultation or request an NDA.",
});
}

export default async function ContactPage() {
  const contact = await getContactInfo();
  const direct = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { label: "Phone", value: contact.phone, href: contact.phoneHref },
    { label: "WhatsApp", value: "Message us", href: contact.whatsappHref },
    { label: "LinkedIn", value: "Follow Technicus", href: contact.linkedin },
  ].filter((d) => d.href);

  return (
    <>
      <Hero eyebrow="Contact Technicus" title="Tell us what you are building" lead="You will hear from someone who does the work." />

      <Section>
        <ContactTabs services={[...pillars.map((p) => p.name), "Not sure yet"]} />
        <DevNote>
          the reply time promised here (two working days) must be confirmed. Stored messages are in .data/leads.jsonl
          on this machine; see README for how to receive them by email and how storage changes at deployment.
        </DevNote>
      </Section>

      <Section tone="grey" title="What happens after you write">
        <Steps
          steps={[
            { title: "We read it", text: "Someone who does the work reads your message, not a sales team, and replies within two working days." },
            { title: "A first call", text: "A short call to understand the problem, the constraints and what a good outcome looks like for you." },
            { title: "A clear proposal", text: "A written plan with scope, team, timeline and cost, or an honest answer if we are not the right fit." },
            { title: "Start", text: "Once you agree, we confirm the team and the first milestone and start the work." },
          ]}
        />
      </Section>

      <Section tone="dark" title="Contact Technicus directly">
        <ul className="flex flex-wrap gap-3">
          {direct.map((d) => (
            <li key={d.label} data-reveal>
              <a
                href={d.href}
                target={d.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="btn-outline-light px-6 py-4 text-[1.3rem] font-normal md:text-[1.5rem]"
              >
                <span className="text-white/50">{d.label}</span> {d.value}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-16">
          <SceneBox targets={[{ mode: "globe" }]} fallback="arch" className="aspect-[4/3] md:aspect-[16/7]" />
        </div>
      </Section>

      <Section title="Offices">
        <OfficeCards />
      </Section>
    </>
  );
}
