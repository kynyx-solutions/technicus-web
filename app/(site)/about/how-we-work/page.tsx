import type { Metadata } from "next";
import { BulletList, ClosingCall, Faqs, Features, Hero, Intro, Section, Steps } from "@/components/ui";
import { communication, engagementModels, method, quality } from "@/content/company";
import { howWeWorkFaqs } from "@/content/faqs";
import { withSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/about/how-we-work", {
  title: "How we work",
  description: "Our delivery method, engagement models, communication and quality standards.",
});
}

export default function HowWeWorkPage() {
  return (
    <>
      <Hero
        tone="dark"
        art="rings"
        crumbs={[
          { href: "/about", name: "About" },
          { href: "/about/how-we-work", name: "How we work" },
        ]}
        eyebrow="How we work"
        title="Clear steps, regular proof, no surprises"
        lead="How an engagement with Technicus runs, from the first call to long-term support."
        actions
      />

      <Section title="How we work, in four stages">
        <Steps steps={method} />
      </Section>

      <Section tone="dark">
        <Intro label="Engagement models" text="Choose the model that fits the work. We will tell you which one we would pick in your place, and why." />
        <div className="mt-14">
          <Features items={engagementModels} />
        </div>
      </Section>

      <Section>
        <Intro label="Communication" text="You always know where things stand.">
          <div className="mt-10">
            <BulletList items={communication} />
          </div>
        </Intro>
        <div className="mt-20">
          <Intro label="Quality" text="Standards we apply to every project.">
            <div className="mt-10">
              <BulletList items={quality} />
            </div>
          </Intro>
        </div>
      </Section>

      <Section tone="grey" title="Questions">
        <Faqs faqs={howWeWorkFaqs} />
      </Section>

      <ClosingCall />
    </>
  );
}
