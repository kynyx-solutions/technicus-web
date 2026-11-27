import type { Metadata } from "next";
import Link from "next/link";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import "@/components/preview/bento/bento.css";
import { BentoHeader } from "@/components/preview/bento/header";
import { Wordmark, nav } from "@/components/preview/bento/brand";
import { CodeTile } from "@/components/preview/bento/code-tile";
import { MapTile } from "@/components/preview/bento/map-tile";
import { PracticesTile } from "@/components/preview/bento/practices-tile";
import { WorkTile } from "@/components/preview/bento/work-tile";
import { ProcessTile } from "@/components/preview/bento/process-tile";
import { IndustriesTile } from "@/components/preview/bento/industries-tile";
import { AiTile, ContactTile, DesignTile, RunTile } from "@/components/preview/bento/small-tiles";
import { pillars } from "@/content/services";
import { industries, site } from "@/content/site";
import { offices } from "@/content/company";
import { getContactInfo, getProjects } from "@/lib/cms";

const sans = Schibsted_Grotesk({ subsets: ["latin"], variable: "--bnt-font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--bnt-font-mono", display: "swap" });

export const metadata: Metadata = { title: "Preview: live bento" };

const words = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
const word = (n: number) => words[n] ?? String(n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default async function BentoPreview() {
  const [projects, contact] = await Promise.all([getProjects(), getContactInfo()]);
  const hq = offices.find((o) => o.hq) ?? offices[0];
  const origin: [number, number] = hq ? [hq.lon, hq.lat] : [78, 22];
  const practices = pillars.map((p) => ({
    slug: p.slug,
    name: p.name,
    summary: p.summary,
    capabilities: p.capabilities.map((c) => c.name),
  }));
  const work = projects.map((p) => ({
    slug: p.slug,
    client: p.client,
    industry: p.industry,
    sector: p.sector,
    summary: p.summary,
    country: p.country,
  }));
  const heroLines = ["We design, build", "and run the software", "behind your business."];

  return (
    <div className={`${sans.variable} ${mono.variable} bnt-root min-h-screen`}>
      <a href="#bnt-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>
      <BentoHeader />

      <main id="bnt-main">
        {/* Hero */}
        <section className="bnt-wrap pb-10 pt-12 md:pb-14 md:pt-20">
          <div className="grid gap-8 min-[1100px]:grid-cols-[minmax(0,1fr)_340px] min-[1100px]:items-end">
            <h1 className="bnt-display text-[44px] min-[480px]:text-[54px] md:text-[76px] min-[1300px]:text-[92px]">
              {heroLines.map((l, i) => (
                <span key={l} className="bnt-hero-line">
                  <span style={{ "--i": i } as React.CSSProperties}>
                    {i === heroLines.length - 1 ? (
                      <>
                        {l.replace(/\.$/, "")}
                        <span className="bnt-accent-dot" aria-hidden="true" />
                        <span className="sr-only">.</span>
                      </>
                    ) : (
                      l
                    )}
                  </span>
                </span>
              ))}
            </h1>
            <div className="bnt-fade max-w-[46ch]" style={{ "--d": "420ms" } as React.CSSProperties}>
              <p className="text-[16.5px] leading-[1.55] text-[var(--bnt-ink-2)]">
                Technicus is a technology consultancy based in India and working worldwide. {cap(word(pillars.length))} practices, from
                strategy to managed services, delivered by one accountable team.
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/contact" className="bnt-btn bnt-btn-ink px-5 py-3 text-[15px]">
                  Start a project <ArrowRight size={16} />
                </Link>
                <Link href="/work" className="bnt-btn bnt-btn-line px-5 py-3 text-[15px]">
                  See our work
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* The bento */}
        <section aria-label="What we do" className="bnt-wrap">
          <div className="bnt-grid">
            <CodeTile delay={0} />
            <MapTile origin={origin} delay={110} />
            <PracticesTile items={practices} delay={0} />
            <WorkTile items={work} delay={110} />
            <ProcessTile delay={0} />
            <IndustriesTile items={industries} delay={110} />
            <DesignTile delay={0} />
            <AiTile delay={90} />
            <RunTile delay={0} />
            <ContactTile email={contact.email} phone={contact.phone} phoneHref={contact.phoneHref} delay={90} />
          </div>
        </section>

        {/* Practices index */}
        <section className="bnt-wrap pb-20 pt-24 md:pb-28 md:pt-32" aria-labelledby="bnt-practices">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
            <h2 id="bnt-practices" className="bnt-display text-[40px] md:text-[60px]">
              {cap(word(pillars.length))} practices.
              <br />
              One team.
            </h2>
            <p className="max-w-[44ch] text-[16px] leading-[1.55] text-[var(--bnt-ink-2)] md:justify-self-end">
              Start with the practice you need. Bring in the others when the work calls for them, without changing partner.
            </p>
          </div>
          <ul className="mt-12 border-b border-[var(--bnt-line-2)]">
            {pillars.map((p) => (
              <li key={p.slug} className="bnt-row">
                <Link
                  href={`/services/${p.slug}`}
                  className="grid items-center gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto] md:py-7"
                >
                  <span className="bnt-row-name text-[22px] font-semibold tracking-[-0.025em] md:text-[26px]">{p.name}</span>
                  <span className="text-[15px] leading-[1.5] text-[var(--bnt-ink-2)]">{p.summary}</span>
                  <span className="hidden text-[14px] leading-[1.5] text-[var(--bnt-muted)] md:block">
                    {p.capabilities.map((c) => c.name).join(", ")}
                  </span>
                  <span className="bnt-go hidden md:inline-grid" aria-hidden="true">
                    <ArrowRight size={16} strokeWidth={1.75} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Closing call to action */}
        <section className="bnt-wrap pb-20 md:pb-28" aria-labelledby="bnt-close">
          <div className="grid gap-10 border-t border-[var(--bnt-ink)] pt-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:pt-16">
            <h2 id="bnt-close" className="bnt-display text-[44px] md:text-[72px]">
              Have something
              <br />
              to build or fix?
            </h2>
            <div className="flex flex-col justify-end gap-6">
              <p className="max-w-[40ch] text-[16px] leading-[1.55] text-[var(--bnt-ink-2)]">
                Tell us where you are and what you need. We reply with a clear next step, whether that is a call, a scoped proposal
                or an honest referral.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link href="/contact" className="bnt-btn bnt-btn-ink px-6 py-3.5 text-[15px]">
                  Start a project <ArrowRight size={16} />
                </Link>
                <a href={`mailto:${contact.email}`} className="bnt-link">
                  {contact.email} <ArrowUpRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bnt-foot bg-[var(--bnt-dark)] text-[#f2f0eb]">
        <div className="bnt-wrap grid gap-10 py-14 md:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] md:py-20">
          <div>
            <Wordmark className="text-[26px]" />
            <p className="mt-4 max-w-[34ch] text-[14.5px] leading-[1.55] text-[#a6a39b]">{site.description}</p>
          </div>
          <div>
            <h2 className="text-[13px] font-medium text-[#8d8a83]">Practices</h2>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">
              {pillars.map((p) => (
                <li key={p.slug}>
                  <Link href={`/services/${p.slug}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[13px] font-medium text-[#8d8a83]">Company</h2>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-[13px] font-medium text-[#8d8a83]">Get in touch</h2>
            <ul className="mt-4 space-y-2.5 text-[14.5px]">
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <a href={contact.phoneHref}>{contact.phone}</a>
              </li>
              {hq ? (
                <li className="text-[#a6a39b]">
                  {hq.city}, {hq.country}
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        <div className="bnt-wrap flex flex-col gap-3 border-t border-[#2a2a28] py-6 text-[13px] text-[#8d8a83] md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalName}
          </p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
