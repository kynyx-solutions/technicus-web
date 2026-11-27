import type { Metadata } from "next";
import Link from "next/link";
import { Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { ArrowRight, ArrowUpRight, Menu } from "lucide-react";
import "@/components/preview/blueprint/blueprint.css";
import { Cross, Dim, Sheet, SheetHeading } from "@/components/preview/blueprint/parts";
import { SystemPanel } from "@/components/preview/blueprint/system-panel";
import { Terminal, type TermData } from "@/components/preview/blueprint/terminal";
import { Reveal } from "@/components/preview/blueprint/reveal";
import { pillars } from "@/content/services";
import { industries } from "@/content/site";
import { getContactInfo, getProjects } from "@/lib/cms";

const sans = Instrument_Sans({ subsets: ["latin"], axes: ["wdth"], variable: "--bp-font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--bp-font-mono", display: "swap" });

export const metadata: Metadata = { title: "Preview: engineering blueprint" };

const ROOT = "bp-root";
const nav = [
  { href: "/services", name: "Services" },
  { href: "/industries", name: "Industries" },
  { href: "/work", name: "Work" },
  { href: "/insights", name: "Insights" },
  { href: "/careers", name: "Careers" },
  { href: "/about", name: "About" },
];

function Wordmark() {
  return (
    <Link href="/preview/blueprint" className="group flex items-center gap-2.5" aria-label="Technicus home">
      <svg viewBox="0 0 22 22" className="size-[22px]" aria-hidden="true">
        <rect x="0.5" y="0.5" width="21" height="21" fill="none" stroke="currentColor" />
        <path d="M5 6.5h12M11 6.5v10" stroke="var(--bp-accent)" strokeWidth="2.2" />
      </svg>
      <span className="text-[19px] font-semibold tracking-[-0.03em]">Technicus</span>
    </Link>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--bp-ink)] bg-[var(--bp-paper)]">
      <div className="mx-auto flex h-14 max-w-[1320px] items-center justify-between gap-6 border-x border-[var(--bp-line)] px-4 sm:px-6">
        <Wordmark />
        <nav aria-label="Main" className="max-lg:hidden">
          <ul className="flex items-center gap-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="bp-press block px-3 py-2 text-[14px] text-[var(--bp-ink-2)] hover:text-[var(--bp-ink)] hover:underline hover:decoration-[var(--bp-accent)] hover:decoration-2 hover:underline-offset-[6px]">
                  {n.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/contact" className="bp-press bp-mono inline-flex h-9 items-center gap-2 bg-[var(--bp-ink)] px-4 text-[12px] font-medium tracking-wide text-[var(--bp-paper)] uppercase hover:bg-[var(--bp-accent)] hover:text-[var(--bp-ink)]">
            Contact <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
          <details className="bp-menu relative lg:hidden">
            <summary className="bp-press grid size-9 cursor-pointer place-items-center border border-[var(--bp-ink)]" aria-label="Menu">
              <Menu className="size-4" aria-hidden="true" />
            </summary>
            <nav aria-label="Mobile" className="absolute top-[calc(100%+9px)] right-0 w-[min(80vw,280px)] border border-[var(--bp-ink)] bg-[var(--bp-paper)] shadow-[8px_8px_0_rgba(18,20,18,0.1)]">
              <ul>
                {nav.map((n) => (
                  <li key={n.href} className="border-b border-[var(--bp-line)] last:border-0">
                    <Link href={n.href} className="flex items-center justify-between px-4 py-3 text-[15px] hover:bg-[var(--bp-paper-2)]">
                      {n.name} <ArrowUpRight className="size-4 text-[var(--bp-muted)]" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

export default async function BlueprintPreview() {
  const [projects, contact] = await Promise.all([getProjects(), getContactInfo()]);

  const data: TermData = {
    practices: pillars.map((p) => ({
      slug: p.slug,
      name: p.name,
      summary: p.summary,
      capabilities: p.capabilities.map((c) => ({ slug: c.slug, name: c.name })),
    })),
    projects: projects.map((p) => ({
      slug: p.slug,
      client: p.client,
      industry: p.industry,
      sector: p.sector,
      summary: p.summary,
      country: p.country,
      technologies: p.technologies ?? [],
      pillars: p.pillars ?? [],
    })),
    industries: industries.map((i) => ({ slug: i.slug, name: i.name })),
    contact: { email: contact.email, phone: contact.phone, phoneHref: contact.phoneHref },
  };
  const pillarName = (slug: string) => pillars.find((p) => p.slug === slug)?.name;

  return (
    <div id={ROOT} className={`bp-root ${sans.variable} ${mono.variable}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-[var(--bp-ink)] focus:px-4 focus:py-2 focus:text-[var(--bp-paper)]">
        Skip to content
      </a>
      <Header />
      <Reveal root={ROOT} />

      <main id="main" className="mx-auto max-w-[1320px] border-x border-[var(--bp-line-strong)] bg-[var(--bp-paper)]/60">
        {/* Overview */}
        <section aria-labelledby="bp-hero" className="relative">
          <div className="bp-label flex border-b border-[var(--bp-line)]">
            <div className="flex items-center gap-2 border-r border-[var(--bp-line)] px-4 py-2.5 sm:px-6">
              <span className="text-[var(--bp-muted)]">Sheet</span>
              <span>Overview</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 max-sm:hidden sm:px-6">
              <span className="text-[var(--bp-muted)]">Project</span>
              <span>Technicus, technology consultancy</span>
            </div>
            <div className="ml-auto flex items-center gap-2 px-4 py-2.5 sm:px-6">
              <span className="text-[var(--bp-muted)]">Based</span>
              <span>India</span>
              <span className="text-[var(--bp-muted)] max-sm:hidden">· Works</span><span className="text-[var(--bp-muted)] sm:hidden">·</span>
              <span>Worldwide</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <div className="relative flex flex-col justify-between border-[var(--bp-line)] px-4 pt-12 pb-10 sm:px-6 md:pt-16 lg:border-r lg:px-10 lg:pb-12">
              <div>
                <Dim label="Strategy to production" className="bp-rise mb-8 max-w-xl" />
                <p className="bp-rise bp-label flex items-center gap-2 text-[var(--bp-muted)]" style={{ ["--bp-d" as string]: "60ms" }}>
                  <span className="inline-block size-2 bg-[var(--bp-accent)]" aria-hidden="true" />
                  Technology consultancy
                </p>
                <h1
                  id="bp-hero"
                  className="bp-rise mt-6 text-[clamp(2.75rem,6.6vw,5.9rem)] leading-[0.96] font-semibold tracking-[-0.045em] text-balance [font-stretch:92%]"
                  style={{ ["--bp-d" as string]: "120ms" }}
                >
                  We <span className="bp-underline">engineer</span> the systems your business runs on.
                </h1>
                <p className="bp-rise mt-8 max-w-xl text-[18px] leading-relaxed text-[var(--bp-ink-2)] text-pretty" style={{ ["--bp-d" as string]: "220ms" }}>
                  Strategy, design, engineering, AI, cloud and the team to run it, under one roof. We work from the first
                  decision to the system in production, and we write down every choice so your people can own it after us.
                </p>
                <div className="bp-rise mt-9 flex flex-wrap gap-3" style={{ ["--bp-d" as string]: "300ms" }}>
                  <Link href="/contact" className="bp-press inline-flex h-12 items-center gap-3 bg-[var(--bp-accent)] px-6 text-[15px] font-semibold text-[var(--bp-ink)] hover:bg-[var(--bp-ink)] hover:text-[var(--bp-paper)]">
                    Start a project <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <a href="#console" className="bp-press bp-mono inline-flex h-12 items-center gap-2 border border-[var(--bp-ink)] px-5 text-[13px] hover:bg-[var(--bp-ink)] hover:text-[var(--bp-paper)]">
                    <span className="text-[var(--bp-accent-ink)]" aria-hidden="true">$</span> open the console
                  </a>
                </div>
              </div>

              <dl className="bp-rise mt-14 grid grid-cols-2 border-t border-l border-[var(--bp-line)] sm:grid-cols-4" style={{ ["--bp-d" as string]: "380ms" }}>
                {[
                  ["Engagement", "Projects, teams, run"],
                  ["Stack", "Fits the problem"],
                  ["Handover", "Documented"],
                  ["Ownership", "Yours, always"],
                ].map(([k, v]) => (
                  <div key={k} className="border-r border-b border-[var(--bp-line)] px-3 py-3">
                    <dt className="bp-label text-[10px] text-[var(--bp-muted)]">{k}</dt>
                    <dd className="mt-1 text-[14px] font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative px-4 pt-6 pb-12 sm:px-6 lg:px-10 lg:pt-16">
              <Dim label="Reference architecture" className="mb-4 max-lg:hidden" />
              <SystemPanel />
              <p className="bp-label mt-4 text-[10px] text-[var(--bp-muted)]">
                Illustrative drawing. Every system we ship is drawn up for its own brief.
              </p>
            </div>
          </div>
        </section>

        {/* Console */}
        <Sheet id="console" sheet="Console" dark labelledBy="bp-console">
          <div className="grid gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16 lg:px-10">
            <div className="bp-reveal">
              <p className="bp-label flex items-center gap-2 text-white/55">
                <span className="inline-block size-2 bg-[var(--bp-accent)]" aria-hidden="true" />
                For the technical buyer
              </p>
              <h2 id="bp-console" className="mt-5 text-[clamp(2.1rem,4.2vw,3.4rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
                Skip the brochure. Query us.
              </h2>
              <p className="mt-6 text-[17px] leading-relaxed text-white/65">
                Everything on this site, from a prompt. Ask for a practice and get its parts list, or pull a build log
                from client work. Every answer links to the full page.
              </p>
              <noscript>
                <ul className="mt-6 grid gap-2 text-white">
                  <li><Link className="underline" href="/services">Services</Link></li>
                  <li><Link className="underline" href="/work">Work</Link></li>
                  <li><Link className="underline" href="/industries">Industries</Link></li>
                  <li><Link className="underline" href="/contact">Contact</Link></li>
                </ul>
              </noscript>
            </div>
            <div className="bp-reveal min-w-0">
              <Terminal data={data} />
            </div>
          </div>
        </Sheet>

        {/* Practices */}
        <Sheet id="practices" sheet="Practices" labelledBy="bp-practices">
          <SheetHeading
            id="bp-practices"
            kicker="Practices"
            title="Seven practices, one engineering standard."
            intro="Each practice has its own specialists and its own parts list. They share the same habits: written decisions, reviewed code and systems that are measured once they ship."
          />
          <ul className="grid gap-px border-t border-[var(--bp-line)] bg-[var(--bp-line)] sm:grid-cols-2 xl:grid-cols-4">
            {pillars.map((p) => (
              <li key={p.slug} className="bp-spec bp-reveal flex flex-col bg-[var(--bp-paper)] px-6 pt-8 pb-7 transition-colors hover:bg-[#f7f6f2]">
                <span className="bp-spec-outline" aria-hidden="true" />
                <span className="bp-spec-corner bp-tl" aria-hidden="true" />
                <span className="bp-spec-corner bp-tr" aria-hidden="true" />
                <span className="bp-spec-corner bp-bl" aria-hidden="true" />
                <span className="bp-spec-corner bp-br" aria-hidden="true" />
                <div className="bp-spec-dim" aria-hidden="true">
                  <span className="bp-dim-line bp-start" />
                  <span className="bp-label text-[10px]">Spec</span>
                  <span className="bp-dim-line bp-end" />
                </div>

                <p className="bp-label flex items-center justify-between gap-3 text-[10px] text-[var(--bp-muted)]">
                  <span>Practice</span>
                  <span className="truncate">/{p.slug}</span>
                </p>
                <h3 className="mt-6 text-[24px] leading-[1.1] font-semibold tracking-[-0.025em]">
                  <Link href={`/services/${p.slug}`} className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none">
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--bp-ink-2)]">{p.summary}</p>

                <p className="bp-label mt-7 border-b border-[var(--bp-ink)] pb-2 text-[10px] text-[var(--bp-muted)]">Parts list</p>
                <ul className="mb-6">
                  {p.capabilities.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/services/${p.slug}/${c.slug}`}
                        className="relative z-10 flex items-end gap-2 border-b border-[var(--bp-line)] py-2 text-[14px] hover:text-[var(--bp-accent-ink)]"
                      >
                        <span>{c.name}</span>
                        <span className="bp-leader" aria-hidden="true" />
                        <ArrowUpRight className="mb-0.5 size-3.5 shrink-0 text-[var(--bp-muted)]" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <span className="bp-mono mt-auto flex items-center gap-2 text-[12px] font-medium tracking-wide uppercase" aria-hidden="true">
                  Open spec <ArrowRight className="bp-arrow size-3.5 text-[var(--bp-accent-ink)]" />
                </span>
              </li>
            ))}
            <li className="bp-reveal flex flex-col justify-between bg-[var(--bp-ink)] px-6 pt-8 pb-7 text-[var(--bp-paper)]">
              <div>
                <p className="bp-label text-[10px] text-white/50">Not sure where you fit?</p>
                <p className="mt-6 text-[24px] leading-[1.15] font-semibold tracking-[-0.025em]">
                  Most work crosses practices. Tell us the problem and we will assemble the team.
                </p>
              </div>
              <div className="mt-10 grid gap-3">
                <Link href="/contact" className="bp-press inline-flex h-11 items-center justify-between bg-[var(--bp-accent)] px-4 text-[14px] font-semibold text-[var(--bp-ink)] hover:bg-[var(--bp-paper)]">
                  Describe your project <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <a href="#console" className="bp-press bp-mono inline-flex h-11 items-center gap-2 border border-white/25 px-4 text-[12px] hover:border-[var(--bp-accent)]">
                  <span className="text-[var(--bp-accent)]" aria-hidden="true">$</span> services
                </a>
              </div>
            </li>
          </ul>
        </Sheet>

        {/* Build logs */}
        <Sheet id="work" sheet="Build logs" labelledBy="bp-work">
          <SheetHeading
            id="bp-work"
            kicker="Selected work"
            title="Build logs from client work."
            intro="Shipped for businesses in retail, travel, finance, education and more. Each log covers what the client needed, what we built and how."
          />
          <ol className="relative border-t border-[var(--bp-line)]">
            <span className="pointer-events-none absolute top-0 bottom-0 left-[27px] z-10 w-px bg-[var(--bp-line-strong)] sm:left-[35px] lg:left-[51px]" aria-hidden="true" />
            {projects.map((p) => (
              <li key={p.slug} className="bp-row bp-reveal relative border-b border-[var(--bp-line)] transition-colors hover:bg-[#f7f6f2]">
                <span className="bp-row-mark absolute top-9 z-20 left-[23px] size-[9px] border border-[var(--bp-ink)] bg-[var(--bp-paper)] sm:left-[31px] lg:left-[47px]" aria-hidden="true" />
                <div className="grid gap-4 py-8 pr-4 pl-14 sm:pr-6 sm:pl-[68px] md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_auto] md:gap-10 lg:pr-10 lg:pl-[92px]">
                  <div className="bp-mono grid content-start gap-1 text-[12px] text-[var(--bp-muted)]">
                    <span className="bp-label text-[10px] text-[var(--bp-accent-ink)]">Delivered</span>
                    <span>{p.industry}</span>
                    <span>{p.country}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[clamp(1.5rem,2.6vw,2rem)] leading-tight font-semibold tracking-[-0.03em]">
                      <Link href={`/work/${p.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
                        {p.client}
                      </Link>
                    </h3>
                    <p className="mt-1 text-[14px] text-[var(--bp-muted)]">{p.sector}</p>
                    <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-[var(--bp-ink-2)]">{p.summary}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Practices and stack">
                      {(p.pillars ?? []).map((s) => pillarName(s)).filter(Boolean).map((n) => (
                        <li key={n} className="bp-mono border border-[var(--bp-ink)] px-2 py-0.5 text-[11px]">{n}</li>
                      ))}
                      {(p.technologies ?? []).slice(0, 4).map((t) => (
                        <li key={t} className="bp-mono border border-[var(--bp-line-strong)] px-2 py-0.5 text-[11px] text-[var(--bp-muted)]">{t}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="bp-mono flex items-start gap-2 text-[12px] font-medium tracking-wide whitespace-nowrap uppercase md:pt-2" aria-hidden="true">
                    Read the log <ArrowRight className="bp-arrow size-3.5 text-[var(--bp-accent-ink)]" />
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex justify-end px-4 py-6 sm:px-6 lg:px-10">
            <Link href="/work" className="bp-press bp-mono inline-flex h-11 items-center gap-2 border border-[var(--bp-ink)] px-5 text-[12px] font-medium tracking-wide uppercase hover:bg-[var(--bp-ink)] hover:text-[var(--bp-paper)]">
              All work <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </Sheet>

        {/* Industries */}
        <Sheet id="industries" sheet="Industries" labelledBy="bp-industries">
          <SheetHeading
            id="bp-industries"
            kicker="Industries"
            title="Built for the rules of your sector."
            intro="Regulation, seasonality, legacy systems and the way your customers buy. We learn the constraints first, then draw the system around them."
          />
          <ul className="grid grid-cols-1 gap-px border-t border-[var(--bp-line)] bg-[var(--bp-line)] sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((i) => (
              <li key={i.slug} className="bg-[var(--bp-paper)]">
                <Link
                  href={`/industries/${i.slug}`}
                  className="bp-cell bp-press group relative flex h-full min-h-[104px] flex-col justify-between gap-6 px-6 py-5 hover:bg-[var(--bp-ink)] hover:text-[var(--bp-paper)] active:scale-[0.985]"
                >
                  <span className="bp-label text-[10px] text-[var(--bp-muted)] group-hover:text-white/50">/{i.slug}</span>
                  <span className="flex items-end justify-between gap-3 text-[19px] leading-tight font-medium tracking-[-0.015em]">
                    {i.name}
                    <ArrowRight className="bp-arrow size-4 shrink-0 text-[var(--bp-accent-ink)] group-hover:text-[var(--bp-accent)]" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Sheet>

        {/* Contact */}
        <Sheet id="contact" sheet="Contact" labelledBy="bp-contact">
          <div className="relative grid gap-12 overflow-hidden px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:px-10">
            <div className="bp-reveal">
              <Dim label="Brief to plan" className="mb-8 max-w-md" />
              <h2 id="bp-contact" className="text-[clamp(2.5rem,6vw,5.2rem)] leading-[0.98] font-semibold tracking-[-0.045em] text-balance">
                Bring us the problem. We will draw up the plan.
              </h2>
              <p className="mt-7 max-w-xl text-[18px] leading-relaxed text-[var(--bp-ink-2)]">
                A short call with a senior engineer, then a written proposal: scope, team, approach and what it costs. No
                obligation either way.
              </p>
            </div>
            <div className="bp-reveal self-end">
              <div className="border border-[var(--bp-ink)] bg-[var(--bp-paper)]">
                <p className="bp-label border-b border-[var(--bp-ink)] px-5 py-2.5 text-[var(--bp-muted)]">Contact</p>
                <dl className="divide-y divide-[var(--bp-line)]">
                  <div className="grid grid-cols-[5.5rem_1fr] items-center px-5 py-4">
                    <dt className="bp-label text-[10px] text-[var(--bp-muted)]">Email</dt>
                    <dd className="min-w-0 truncate"><a href={`mailto:${contact.email}`} className="text-[16px] font-medium hover:text-[var(--bp-accent-ink)] hover:underline">{contact.email}</a></dd>
                  </div>
                  <div className="grid grid-cols-[5.5rem_1fr] items-center px-5 py-4">
                    <dt className="bp-label text-[10px] text-[var(--bp-muted)]">Phone</dt>
                    <dd><a href={contact.phoneHref} className="text-[16px] font-medium hover:text-[var(--bp-accent-ink)] hover:underline">{contact.phone}</a></dd>
                  </div>
                </dl>
                <Link href="/contact" className="bp-press flex h-14 items-center justify-between bg-[var(--bp-accent)] px-5 text-[16px] font-semibold text-[var(--bp-ink)] hover:bg-[var(--bp-ink)] hover:text-[var(--bp-paper)]">
                  Start a project <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </Sheet>
      </main>

      <footer className="border-t border-[var(--bp-ink)] bg-[var(--bp-night)] text-[#f2f1ec]">
        <div className="relative mx-auto max-w-[1320px] border-x border-[var(--bp-night-line)]">
          <div className="grid gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-10">
            <div>
              <div className="text-[#f2f1ec]"><Wordmark /></div>
              <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/60">
                Technology consultancy. Strategy, design, engineering, AI, cloud and growth. Based in India, working worldwide.
              </p>
            </div>
            <div>
              <p className="bp-label text-[10px] text-white/45">Practices</p>
              <ul className="mt-4 grid gap-2 text-[14px]">
                {pillars.map((p) => (
                  <li key={p.slug}><Link href={`/services/${p.slug}`} className="text-white/75 hover:text-[var(--bp-accent)]">{p.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="bp-label text-[10px] text-white/45">Company</p>
              <ul className="mt-4 grid gap-2 text-[14px]">
                {nav.map((n) => (
                  <li key={n.href}><Link href={n.href} className="text-white/75 hover:text-[var(--bp-accent)]">{n.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="bp-label text-[10px] text-white/45">Contact</p>
              <ul className="mt-4 grid gap-2 text-[14px]">
                <li><a href={`mailto:${contact.email}`} className="break-all text-white/75 hover:text-[var(--bp-accent)]">{contact.email}</a></li>
                <li><a href={contact.phoneHref} className="text-white/75 hover:text-[var(--bp-accent)]">{contact.phone}</a></li>
                <li><Link href="/contact" className="text-white/75 hover:text-[var(--bp-accent)]">Contact form</Link></li>
              </ul>
            </div>
          </div>
          <div className="bp-label grid border-t border-[var(--bp-night-line)] text-[10px] sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Drawn by", "Technicus Infotech LLP"],
              ["Sheet", "Footer"],
              ["Scale", "Fits every screen"],
              ["Revision", "Current"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2 border-b border-[var(--bp-night-line)] px-4 py-3 sm:px-6 lg:border-r lg:border-b-0 lg:last:border-r-0 lg:px-10">
                <span className="text-white/40">{k}</span>
                <span className="text-white/80">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 px-4 py-5 text-[13px] text-white/45 sm:px-6 lg:px-10">
            <span>© Technicus Infotech LLP</span>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </div>
          <Cross className="-top-[7px] -left-[7px] text-[#f2f1ec]" />
          <Cross className="-top-[7px] -right-[7px] text-[#f2f1ec]" />
        </div>
      </footer>
    </div>
  );
}
