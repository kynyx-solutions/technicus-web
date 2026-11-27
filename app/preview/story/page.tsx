import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { StoryHeader, StoryFooter } from "@/components/preview/story/chrome";
import { Story, type StoryStage, type RailItem } from "@/components/preview/story/story";
import "@/components/preview/story/story.css";
import { pillars } from "@/content/services";
import { industries } from "@/content/site";
import { getContactInfo, getProjects } from "@/lib/cms";

const display = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz", "wdth"], variable: "--sty-font-display", display: "swap" });
const text = Instrument_Sans({ subsets: ["latin"], variable: "--sty-font-text", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--sty-font-mono", display: "swap" });

export const metadata: Metadata = { title: "Preview: scroll story" };

const pillar = (slug: string) => {
  const p = pillars.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown practice: ${slug}`);
  return p;
};

/** The story, stage by stage. Copy is ours; practice names and capabilities come from content. */
const script: { key: string; slug: string; title: string; body: string }[] = [
  {
    key: "idea",
    slug: "strategy-consulting",
    title: "It starts with a question worth answering.",
    body: "Before anyone writes code, we work out what to build, who it is for and what comes first. Clear priorities at the start save months later.",
  },
  {
    key: "structure",
    slug: "experience-design",
    title: "Structure before style.",
    body: "We map the journeys and lay out every screen in plain boxes, so the product makes sense long before it looks finished.",
  },
  {
    key: "interface",
    slug: "experience-design",
    title: "Then it starts to look like you.",
    body: "Type, colour, imagery and motion turn that structure into an interface people trust, built on a design system your team can extend.",
  },
  {
    key: "code",
    slug: "product-engineering",
    title: "Screens become working software.",
    body: "Our engineers build web, mobile and platform software with reviews, tests and documentation from the first commit, not bolted on at the end.",
  },
  {
    key: "intelligence",
    slug: "ai-data",
    title: "Your data starts doing some of the work.",
    body: "We connect the data you already have, then add AI where it earns its place: search, recommendations, automation and assistants people actually use.",
  },
  {
    key: "live",
    slug: "cloud-security",
    title: "Live, secure and watched closely.",
    body: "We deploy to cloud infrastructure sized for growth, with security, backups and monitoring in place before launch day rather than after the first incident.",
  },
  {
    key: "growth",
    slug: "growth-marketing",
    title: "Found by the people it was built for.",
    body: "Search, content, analytics and performance marketing bring the right visitors in, and the data shows what to improve next.",
  },
  {
    key: "care",
    slug: "managed-services",
    title: "And we keep it running.",
    body: "Support, maintenance and dedicated teams keep the product healthy and improving long after launch. Then the next idea arrives, and the cycle starts again.",
  },
];

const railLabels: Record<string, string> = {
  "strategy-consulting": "Strategy",
  "experience-design": "Design",
  "product-engineering": "Engineering",
  "ai-data": "AI and Data",
  "cloud-security": "Cloud and Security",
  "growth-marketing": "Growth",
  "managed-services": "Managed Services",
};

export default async function StoryPreview() {
  const [projects, contact] = await Promise.all([getProjects(), getContactInfo()]);

  const stages: StoryStage[] = script.map((s) => {
    const p = pillar(s.slug);
    return { ...s, practice: p.name, capabilities: p.capabilities.map((c) => c.name) };
  });
  const rail: RailItem[] = pillars.map((p) => ({ slug: p.slug, label: railLabels[p.slug] ?? p.name }));
  const stageToRail = script.map((s) => rail.findIndex((r) => r.slug === s.slug));
  const pillarName = (slug: string) => pillars.find((p) => p.slug === slug)?.name;

  return (
    <div className={`sty-root ${display.variable} ${text.variable} ${mono.variable}`}>
      <a href="#sty-main" className="sty-skip">
        Skip to content
      </a>
      <StoryHeader />

      <main id="sty-main">
        {/* ---------------- hero ---------------- */}
        <section className="sty-hero" aria-labelledby="sty-hero-title">
          <div className="sty-wrap">
            <p className="sty-eyebrow">Technology consultancy &middot; India, working worldwide</p>
            <div className="sty-hero-top">
            <h1 id="sty-hero-title" className="sty-display sty-h1">
              We take products from{" "}
              <span className="sty-underline">
                first sketch
                <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                  <path d="M4 15 C 60 7, 150 6, 296 11 M 30 20 C 110 15, 200 15, 270 18" pathLength={1} />
                </svg>
              </span>{" "}
              to everyday use.
            </h1>
            <nav className="sty-hero-index" aria-label="Practices">
              <p className="sty-hero-index-h">Seven practices, one team</p>
              <ul>
                {pillars.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/services/${p.slug}`}>
                      <span>{p.name}</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            </div>
            <div className="sty-hero-foot">
              <p className="sty-lede">
                Strategy, design, engineering, AI, cloud, growth and long-term care from one accountable team. We build
                digital products for companies that need them to work, not just to launch.
              </p>
              <div className="sty-hero-ctas">
                <Link href="/contact" className="sty-btn sty-btn-accent">
                  Start a conversation <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link href="/work" className="sty-btn sty-btn-line">
                  See our work
                </Link>
              </div>
            </div>
            <div className="sty-cue" aria-hidden="true">
              <span className="sty-cue-line" />
              Scroll to watch a product take shape
            </div>
          </div>
        </section>

        <Story stages={stages} rail={rail} stageToRail={stageToRail} />

        {/* ---------------- work ---------------- */}
        <section className="sty-section" aria-labelledby="sty-work-title">
          <div className="sty-wrap">
            <div className="sty-section-head">
              <div>
                <p className="sty-eyebrow">Selected work</p>
                <h2 id="sty-work-title" className="sty-display sty-h2">
                  The same story, told by our clients&rsquo; products.
                </h2>
              </div>
              <Link href="/work" className="sty-textlink">
                All case studies <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <ul className="sty-work">
              {projects.slice(0, 6).map((p) => (
                <li key={p.slug}>
                  <Link href={`/work/${p.slug}`} className="sty-work-row">
                    <span className="sty-work-client sty-display">{p.client}</span>
                    <span className="sty-work-meta">
                      {p.industry}
                      <span aria-hidden="true"> &middot; </span>
                      {p.country}
                    </span>
                    <span className="sty-work-summary">{p.summary}</span>
                    <span className="sty-work-tags">
                      {p.pillars
                        .map(pillarName)
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((n) => (
                          <span key={n}>{n}</span>
                        ))}
                    </span>
                    <ArrowUpRight className="sty-work-arrow" size={22} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- industries ---------------- */}
        <section className="sty-section sty-section-tint" aria-labelledby="sty-ind-title">
          <div className="sty-wrap sty-ind">
            <div>
              <p className="sty-eyebrow">Industries</p>
              <h2 id="sty-ind-title" className="sty-display sty-h2">
                Built for the way your sector works.
              </h2>
              <p className="sty-body">
                Regulation, seasonality, legacy systems and the habits of your customers shape every product. We bring
                that context to the first conversation.
              </p>
            </div>
            <ul className="sty-ind-list">
              {industries.map((i) => (
                <li key={i.slug}>
                  <Link href={`/industries/${i.slug}`}>
                    {i.name}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------- closing ---------------- */}
        <section className="sty-cta" aria-labelledby="sty-cta-title">
          <div className="sty-wrap">
            <h2 id="sty-cta-title" className="sty-display sty-cta-h">
              Still a sketch? <span>That is the best time to call.</span>
            </h2>
            <div className="sty-cta-row">
              <p>
                Tell us where you are. We will tell you plainly what it takes to build it, launch it and look after it.
              </p>
              <div className="sty-cta-actions">
                <Link href="/contact" className="sty-btn sty-btn-accent">
                  Start a conversation <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a href={`mailto:${contact.email}`} className="sty-cta-link">
                  {contact.email}
                </a>
                <a href={contact.phoneHref} className="sty-cta-link">
                  {contact.phone}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StoryFooter practices={pillars} email={contact.email} phone={contact.phone} phoneHref={contact.phoneHref} />
    </div>
  );
}
