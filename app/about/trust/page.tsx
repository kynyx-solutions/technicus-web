import type { Metadata } from "next";
import Link from "next/link";
import { BulletList, ClosingCall, DevNote, Hero, Intro, Section } from "@/components/ui";
import { contact } from "@/content/company";

export const metadata: Metadata = {
  title: "Trust",
  description: "How Technicus handles client code, data, contracts and security.",
};

// DRAFT: each line states a practice. The owner must confirm that every one of
// them is true today before launch, and remove any that is not.
const security = [
  "Access to client systems is given to named people only, and removed when the engagement ends.",
  "Client source code is kept in private repositories, under the client's own account where possible.",
  "Passwords, keys and other secrets are never stored in source code.",
  "Development and testing use sample or anonymised data unless real data is necessary and agreed.",
];

const contracts = [
  "A non-disclosure agreement is available before you share any detail of your project.",
  "Source code, designs and documentation belong to you, and this is written into the contract.",
  "Domains, hosting and other accounts are registered in your name.",
  "Support terms after launch are agreed in writing before the project starts.",
];

export default function TrustPage() {
  return (
    <>
      <Hero
        tone="dark"
        art="diamond"
        crumbs={[
          { href: "/about", name: "About" },
          { href: "/about/trust", name: "Trust" },
        ]}
        title="You are trusting us with your systems and your data"
        lead="This is how we look after them."
      />

      <Section>
        <Intro label="Security practices" text="How we handle your code and data.">
          <div className="mt-10">
            <BulletList items={security} />
          </div>
          <DevNote>
            confirmation from the owner that each practice on this page is followed today. Statements that are not true
            must be removed, not softened.
          </DevNote>
        </Intro>
      </Section>

      <Section tone="grey">
        <Intro label="Data protection" text="We collect only the personal data we need to reply to you and to deliver our work.">
          <div className="mt-8 space-y-5 text-lg text-black/70" data-reveal>
            <p>
              Our{" "}
              <Link href="/privacy" className="underline underline-offset-4">
                privacy policy
              </Link>{" "}
              explains what we hold, why, and for how long.
            </p>
            <p>
              To see, correct or delete the data we hold about you, write to{" "}
              <a href={`mailto:${contact.email}`} className="underline underline-offset-4">
                {contact.email}
              </a>
              .
            </p>
          </div>
        </Intro>
      </Section>

      <Section>
        <Intro label="Contracts" text="In plain words.">
          <div className="mt-10">
            <BulletList items={contracts} />
          </div>
        </Intro>
        <div className="mt-20">
          <Intro label="Partners and certifications" text="We list partnerships and certifications here once we hold them. We do not display badges we have not earned.">
            <DevNote>any partner programmes or certifications actually held. If there are none at launch, decide whether to keep this section.</DevNote>
          </Intro>
        </div>
      </Section>

      <ClosingCall line="Need an NDA before we talk?" lead="Ask for one. We send it before you share any detail of your project." />
    </>
  );
}
