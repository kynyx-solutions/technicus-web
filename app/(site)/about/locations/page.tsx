import type { Metadata } from "next";
import { OfficeCards } from "@/components/offices";
import { SceneBox } from "@/components/three/scene-box";
import { BulletList, ClosingCall, DevNote, Hero, Intro, Section } from "@/components/ui";
import { communication } from "@/content/company";
import { withSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/about/locations", { title: "Locations" });
}

export default function LocationsPage() {
  return (
    <>
      <Hero
        crumbs={[
          { href: "/about", name: "About" },
          { href: "/about/locations", name: "Locations" },
        ]}
        eyebrow="Office locations"
        title="Where to find us"
        lead="We work from India with clients in other countries and time zones."
        media={<SceneBox targets={[{ mode: "globe" }]} fallback="arch" className="aspect-[4/3] md:aspect-[16/7]" />}
      />

      <Section title="Office locations" lead="Our team is based in India. We work with clients in other countries and time zones, and agree for each project the hours when both teams are online together, so questions are answered the same day. Most work happens over video calls and shared tools, so where you are matters less than when we are both online. To meet in person or visit an office, write to us and we will arrange it. Each office card below shows the address, a phone number and the local time there right now, so you can see at a glance whether we are in working hours.">
        <div className="mb-14">
          <BulletList items={communication} />
        </div>
        <OfficeCards />
        <DevNote>
          confirmation of every office address and phone number. The old site also listed a branch in Phagwara, Punjab;
          it is left out until confirmed. Add offices in content/company.ts and they appear here and on the globe.
        </DevNote>
      </Section>

      <Section tone="grey">
        <Intro
          label="Time zones"
          text="For each engagement we agree the hours in which both teams are online together, and plan reviews and calls inside them. Outside those hours, work continues and you find written updates waiting for you."
        />
      </Section>

      <ClosingCall />
    </>
  );
}
