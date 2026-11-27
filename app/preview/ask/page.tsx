import type { Metadata } from "next";
import Link from "next/link";
import { Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AskExperience } from "@/components/preview/ask/ask-experience";
import { AskHeader } from "@/components/preview/ask/header";
import { Wordmark, nav } from "@/components/preview/ask/brand";
import { Reveal } from "@/components/preview/ask/reveal";
import type { AskData } from "@/components/preview/ask/matcher";
import "@/components/preview/ask/ask.css";
import { pillars } from "@/content/services";
import { industries, site } from "@/content/site";
import { getContactInfo, getProjects } from "@/lib/cms";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--ask-font-serif", display: "swap" });
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--ask-font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Preview: AI-first homepage",
  description: "Tell Technicus what you are trying to build and see how we would approach it.",
};

const label = "text-[12px] font-medium tracking-[0.16em] text-[var(--ask-muted)] uppercase";

export default async function AskPreview() {
  const [projects, contact] = await Promise.all([getProjects(), getContactInfo()]);

  // Only what the matcher needs crosses to the client.
  const data: AskData = {
    pillars: pillars.map(({ slug, name, summary, capabilities }) => ({ slug, name, summary, capabilities })),
    projects: projects.map(({ slug, client, sector, industry, industrySlug, pillars, services, summary, country }) => ({
      slug,
      client,
      sector,
      industry,
      industrySlug,
      pillars,
      services,
      summary,
      country,
    })),
    industries: industries.map(({ slug, name }) => ({ slug, name })),
  };

  return (
    <div className={`${serif.variable} ${sans.variable} ask-root min-h-screen`}>
      <a href="#ask-input" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-[var(--ask-ink)] focus:px-4 focus:py-2 focus:text-[var(--ask-paper)]">
        Skip to the prompt
      </a>
      <AskHeader />

      <main>
        <AskExperience data={data} email={contact.email} />

        {/* Positioning */}
        <section aria-labelledby="ask-about" className="border-t border-[var(--ask-line)]">
          <Reveal className="mx-auto grid max-w-[1240px] gap-8 px-4 py-20 sm:px-6 md:grid-cols-[1fr_2fr] md:py-28 lg:px-10">
            <h2 id="ask-about" className={label}>
              Who we are
            </h2>
            <p className="ask-serif text-balance text-[32px] leading-[1.12] md:text-[48px]">
              A technology consultancy that decides, designs, builds and runs software with you, from first question to a product in daily use.{" "}
              <span className="text-[var(--ask-muted)]">Based in India, working with organisations worldwide.</span>
            </p>
          </Reveal>
        </section>

        {/* Practices */}
        <section aria-labelledby="ask-practices" className="border-t border-[var(--ask-line)]">
          <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 md:py-28 lg:px-10">
            <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className={label}>Practices</p>
                <h2 id="ask-practices" className="ask-serif mt-4 max-w-[760px] text-balance text-[44px] leading-[1] md:text-[64px]">
                  Everything it takes, in one team.
                </h2>
              </div>
              <Link href="/services" className="ask-row-link inline-flex items-center gap-2 text-[15px] font-medium">
                All services <ArrowRight aria-hidden size={16} className="ask-arrow" />
              </Link>
            </Reveal>
            <ul className="mt-12 border-t border-[var(--ask-ink)] md:mt-16">
              {pillars.map((p) => (
                <Reveal as="li" key={p.slug} className="border-b border-[var(--ask-line)]">
                  <div className="grid gap-4 py-7 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,5fr)] md:items-baseline md:gap-8 md:py-9">
                    <h3>
                      <Link href={`/services/${p.slug}`} className="ask-row-link group inline-flex items-baseline gap-3 hover:text-[var(--ask-accent-ink)]">
                        <span className="ask-serif text-[32px] leading-[1.05] md:text-[40px]">{p.name}</span>
                        <ArrowUpRight aria-hidden size={20} className="ask-arrow shrink-0 translate-y-0.5 opacity-40 group-hover:opacity-100" />
                      </Link>
                    </h3>
                    <p className="text-[16.5px] leading-[1.5] text-[var(--ask-ink-2)]">{p.summary}</p>
                    <ul className="flex flex-wrap gap-1.5" aria-label={`${p.name} capabilities`}>
                      {p.capabilities.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/services/${p.slug}/${c.slug}`}
                            className="ask-press inline-block rounded-full border border-[var(--ask-line)] px-3 py-1.5 text-[13.5px] text-[var(--ask-ink-2)] hover:border-[var(--ask-ink)] hover:text-[var(--ask-ink)]"
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Work */}
        <section aria-labelledby="ask-work" className="border-t border-[var(--ask-line)] bg-[var(--ask-paper-2)]/60">
          <div className="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 md:py-28 lg:px-10">
            <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className={label}>Selected work</p>
                <h2 id="ask-work" className="ask-serif mt-4 max-w-[760px] text-balance text-[44px] leading-[1] md:text-[64px]">
                  Built for businesses that run on it.
                </h2>
              </div>
              <Link href="/work" className="ask-row-link inline-flex items-center gap-2 text-[15px] font-medium">
                All work <ArrowRight aria-hidden size={16} className="ask-arrow" />
              </Link>
            </Reveal>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
              {projects.map((p) => (
                <Reveal as="li" key={p.slug} className="flex">
                  <Link href={`/work/${p.slug}`} className="ask-card-link ask-press group flex w-full flex-col rounded-[22px] border border-[var(--ask-line)] bg-[var(--ask-card)] p-3 hover:border-[var(--ask-ink)]/40">
                    <span aria-hidden className="ask-plate relative flex aspect-[16/10] items-end justify-between overflow-hidden rounded-[16px] p-5 text-[var(--ask-paper)]">
                      <span className="ask-serif text-[44px] leading-[0.9] md:text-[52px]">{p.client}</span>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--ask-paper)] text-[var(--ask-ink)]">
                        <ArrowUpRight size={17} className="ask-arrow" />
                      </span>
                    </span>
                    <span className="flex flex-1 flex-col px-2 pt-5 pb-2">
                      <span className="flex flex-wrap gap-x-3 text-[12.5px] font-medium tracking-[0.12em] text-[var(--ask-muted)] uppercase">
                        <span>{p.industry}</span>
                        <span aria-hidden>·</span>
                        <span>{p.country}</span>
                      </span>
                      <span className="mt-3 text-[19px] leading-[1.35] font-medium tracking-[-0.01em]">{p.summary}</span>
                      <span className="sr-only">Case study: {p.client}</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Industries */}
        <section aria-labelledby="ask-industries" className="border-t border-[var(--ask-line)]">
          <Reveal className="mx-auto grid max-w-[1240px] gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1fr_2fr] md:py-28 lg:px-10">
            <div>
              <p className={label}>Industries</p>
              <h2 id="ask-industries" className="ask-serif mt-4 text-[40px] leading-[1.02] md:text-[52px]">
                We learn your business before we build for it.
              </h2>
            </div>
            <ul className="grid self-end border-t border-[var(--ask-line)] sm:grid-cols-2">
              {industries.map((i) => (
                <li key={i.slug} className="border-b border-[var(--ask-line)] sm:odd:border-r sm:odd:pr-6 sm:even:pl-6">
                  <Link href={`/industries/${i.slug}`} className="ask-row-link group flex items-center justify-between py-4 text-[17px] hover:text-[var(--ask-accent-ink)]">
                    {i.name}
                    <ArrowRight aria-hidden size={16} className="ask-arrow opacity-30 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* Closing call to action */}
        <section aria-labelledby="ask-cta" className="px-4 pb-4 sm:px-6 lg:px-10">
          <Reveal className="mx-auto max-w-[1240px] overflow-hidden rounded-[28px] bg-[var(--ask-ink)] px-6 py-16 text-[var(--ask-paper)] md:rounded-[36px] md:px-16 md:py-24">
            <p className="text-[12px] font-medium tracking-[0.16em] text-[#f3a585] uppercase">Start a conversation</p>
            <h2 id="ask-cta" className="ask-serif mt-5 max-w-[900px] text-balance text-[44px] leading-[1] md:text-[80px]">
              Bring the problem. We will help you shape the answer.
            </h2>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <Link href="/contact" className="ask-press inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ask-accent)] px-6 py-3.5 text-[15.5px] font-medium text-white hover:bg-[#d8501f]">
                Talk to a specialist <ArrowRight aria-hidden size={16} />
              </Link>
              <a href="#ask-input" className="ask-press inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-3.5 text-[15.5px] hover:border-white/60">
                Ask another question
              </a>
            </div>
            <div className="mt-14 flex flex-col gap-2 border-t border-white/15 pt-8 text-[16px] text-[#d9d4c8] sm:flex-row sm:gap-10">
              <a href={`mailto:${contact.email}`} className="hover:text-white">
                {contact.email}
              </a>
              <a href={contact.phoneHref} className="hover:text-white">
                {contact.phone}
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="mx-auto max-w-[1240px] px-4 pt-16 pb-10 sm:px-6 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="mt-5 max-w-[320px] text-[15px] leading-[1.55] text-[var(--ask-muted)]">{site.description}</p>
          </div>
          <nav aria-label="Company">
            <p className={label}>Company</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-[var(--ask-accent-ink)]">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Practices">
            <p className={label}>Practices</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              {pillars.map((p) => (
                <li key={p.slug}>
                  <Link href={`/services/${p.slug}`} className="hover:text-[var(--ask-accent-ink)]">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className={label}>Contact</p>
            <ul className="mt-4 space-y-2.5 text-[15px]">
              <li>
                <a href={`mailto:${contact.email}`} className="break-all hover:text-[var(--ask-accent-ink)]">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.phoneHref} className="hover:text-[var(--ask-accent-ink)]">
                  {contact.phone}
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--ask-accent-ink)]">
                  Contact page
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-[var(--ask-line)] pt-6 text-[13.5px] text-[var(--ask-muted)] sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.legalName}</p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy" className="hover:text-[var(--ask-ink)]">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[var(--ask-ink)]">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
