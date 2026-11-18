import type { Metadata } from "next";
import { ContactTabs } from "@/components/forms/contact-tabs";
import { OfficeCards } from "@/components/offices";
import { SceneBox } from "@/components/three/scene-box";
import { DevNote, Hero, Section } from "@/components/ui";
import { contact } from "@/content/company";
import { pillars } from "@/content/services";

export const metadata: Metadata = {
  title: "Contact",
  description: "Talk to Technicus about a project, book a consultation or request an NDA.",
};

export default function ContactPage() {
  const direct = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { label: "Phone", value: contact.phone, href: contact.phoneHref },
    { label: "WhatsApp", value: "Message us", href: contact.whatsappHref },
    { label: "LinkedIn", value: "Follow Technicus", href: contact.linkedin },
  ].filter((d) => d.href);

  return (
    <>
      <Hero title="Tell us what you are building" lead="You will hear from someone who does the work." />

      <Section>
        <ContactTabs services={[...pillars.map((p) => p.name), "Not sure yet"]} />
        <DevNote>
          the reply time promised here (two working days) must be confirmed. Stored messages are in .data/leads.jsonl
          on this machine; see README for how to receive them by email and how storage changes at deployment.
        </DevNote>
      </Section>

      <Section tone="dark" title="Or reach us directly">
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
