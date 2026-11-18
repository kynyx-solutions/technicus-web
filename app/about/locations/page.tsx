import type { Metadata } from "next";
import { OfficeCards } from "@/components/offices";
import { SceneBox } from "@/components/three/scene-box";
import { ClosingCall, DevNote, Hero, Intro, Section } from "@/components/ui";

export const metadata: Metadata = { title: "Locations" };

export default function LocationsPage() {
  return (
    <>
      <Hero
        crumbs={[
          { href: "/about", name: "About" },
          { href: "/about/locations", name: "Locations" },
        ]}
        title="Where to find us"
        lead="We work from India with clients in other countries and time zones."
        media={<SceneBox targets={[{ mode: "globe" }]} fallback="arch" className="aspect-[4/3] md:aspect-[16/7]" />}
      />

      <Section>
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
