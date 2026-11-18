import { SiteChrome } from "@/components/site/chrome";
import { SceneBox } from "@/components/three/scene-box";
import { Cards, Hero, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <SiteChrome>
      <Hero
        title="This page does not exist"
        lead="The address may be old or mistyped. These will get you back."
        media={<SceneBox targets={[{ mode: "notfound" }]} fallback="rounded" className="aspect-[4/3] md:aspect-[16/6]" />}
      />
      <Section>
        <Cards
          columns={4}
          items={[
            { href: "/", title: "Home" },
            { href: "/services", title: "Services" },
            { href: "/work", title: "Work" },
            { href: "/contact", title: "Contact" },
          ]}
        />
      </Section>
    </SiteChrome>
  );
}
