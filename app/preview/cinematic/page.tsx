import type { Metadata } from "next";
import Link from "next/link";
import { Instrument_Sans } from "next/font/google";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { pillars } from "@/content/services";
import { industries, site } from "@/content/site";
import { getContactInfo, getProjects } from "@/lib/cms";
import { HeroScene } from "@/components/preview/cinematic/scene";
import { CinematicHeader, CinematicMotion, ClosingCall, PracticeStage, Statement, WorkRail } from "@/components/preview/cinematic/client";
import { Lines, vars } from "@/components/preview/cinematic/parts";
import s from "@/components/preview/cinematic/styles";

const display = Instrument_Sans({ subsets: ["latin"], variable: "--font-cine", display: "swap", weight: ["400", "500", "600"] });

export const metadata: Metadata = { title: "Preview: cinematic" };

const statement =
  "Most companies don't need another vendor. They need one partner who can decide what to build, design it well, engineer it properly and keep it running. That is the whole of our job.";

// Where the dot-field glow sits on each case-study card, so no two look alike.
const art = [
  ["82%", "12%"],
  ["18%", "16%"],
  ["70%", "88%"],
  ["30%", "80%"],
  ["88%", "50%"],
  ["50%", "8%"],
];

export default async function CinematicPreview() {
  const [projects, contact] = await Promise.all([getProjects(), getContactInfo()]);
  const pillarName = (slug: string) => pillars.find((p) => p.slug === slug)?.name;
  const words = statement.split(" ");
  // "one partner" and "keep it running." light up in the accent.
  const one = words.indexOf("one");
  const keep = words.lastIndexOf("keep");
  const hl = new Set([one, one + 1, keep, keep + 1, keep + 2]);

  return (
    <div className={`${display.variable} ${s.root}`}>
      <CinematicMotion />
      <CinematicHeader wordmark={site.name} />

      <main>
        {/* Hero */}
        <section className={s.hero} aria-labelledby="hero-title">
          <div className={s.heroGlow} aria-hidden />
          <HeroScene />
          <div className={s.heroVignette} aria-hidden />
          <div className={`${s.shell} ${s.heroContent} pt-32 pb-10 md:pb-14`}>
            <p className={`${s.mono} ${s.heroFade} text-white/60`} style={vars({ "--d": -2 })}>
              Technology consultancy · India and worldwide
            </p>
            <h1 id="hero-title" className={`${s.display} ${s.heroTitle} mt-6 max-w-[11ch]`}>
              <Lines
                lines={[
                  "The software",
                  "your business",
                  <>
                    runs on<span className={s.dot}>.</span>
                  </>,
                ]}
              />
            </h1>
            <div className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-12">
              <p className={`${s.heroFade} max-w-[46ch] text-lg leading-relaxed text-white/70 md:col-span-6 md:text-xl`}>
                Technicus designs, builds and runs digital products for companies in India and around the world, from the first strategy decision to
                the systems that keep them working.
              </p>
              <div className={`${s.heroFade} flex flex-wrap gap-3 md:col-span-6 md:justify-end`} style={vars({ "--d": 1 })}>
                <Link href="/contact" className={`${s.btn} ${s.btnAccent}`}>
                  Start a project <ArrowRight size={16} aria-hidden />
                </Link>
                <Link href="#work" className={s.btn}>
                  See our work
                </Link>
              </div>
            </div>
            <div className={`${s.heroFade} mt-12 flex items-center justify-between gap-6 border-t border-white/10 pt-6 md:mt-16`} style={vars({ "--d": 2 })}>
              <ul className={`${s.mono} hidden flex-wrap gap-x-5 gap-y-2 tracking-[0.08em]! text-white/45 lg:flex`}>
                {pillars.map((p) => (
                  <li key={p.slug}>{p.name}</li>
                ))}
              </ul>
              <span className={`${s.mono} ${s.scrollCue} ml-auto`}>
                Scroll <span aria-hidden />
              </span>
            </div>
          </div>
        </section>

        {/* Statement */}
        <Statement>
          <div className={`${s.statementStage}`}>
            <div className={s.shell}>
              <p className={`${s.mono} mb-10 text-white/50`}>Our view</p>
              <p className={`${s.display} ${s.statementText}`} style={vars({ "--n": words.length })}>
                {words.map((w, i) => (
                  <span key={i}>
                    <span
                      className={s.word}
                      style={vars({ "--i": i })}
                      data-hl={hl.has(i) ? "" : undefined}
                    >
                      {w}
                    </span>{" "}
                  </span>
                ))}
              </p>
            </div>
            <div className={s.statementRail} aria-hidden />
          </div>
        </Statement>

        {/* Practices */}
        <PracticeStage
          practices={pillars.map(({ slug, name, summary, capabilities }) => ({
            slug,
            name,
            summary,
            capabilities: capabilities.map(({ slug, name }) => ({ slug, name })),
          }))}
          intro={
            <>
              <p className={`${s.mono} text-white/50`}>What we do</p>
              <h2 id="practices-title" className={`${s.display} ${s.pTitle} mt-6`}>
                One team.
                <br />
                Every discipline.
              </h2>
              <p className="mt-6 max-w-[38ch] text-white/60">
                Strategy, design, engineering, AI, cloud and growth sit under one roof, so nothing is lost between handovers.
              </p>
            </>
          }
        />

        {/* Work */}
        <WorkRail
          count={projects.length + 1}
          head={
            <div className={`${s.shell} flex flex-col gap-6`}>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className={`${s.mono} text-white/50`}>Selected work</p>
                  <h2 id="work-title" className={`${s.display} mt-5 text-[clamp(2.4rem,5vw,4.6rem)]`}>
                    Built for real businesses.
                  </h2>
                </div>
                <Link href="/work" className={s.btn}>
                  All case studies <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
              <div className={`${s.progress} hidden lg:block`} aria-hidden />
            </div>
          }
        >
          {projects.map((p, i) => {
            const [ax, ay] = art[i % art.length];
            return (
              <Link key={p.slug} href={`/work/${p.slug}`} className={s.card} data-spot style={vars({ "--ax": ax, "--ay": ay })}>
                <span className={s.cardGlow} aria-hidden />
                <span className={s.cardArt} aria-hidden />
                <span className={`${s.mono} flex justify-between gap-4 text-white/55`}>
                  <span>{p.industry}</span>
                  <span>{p.country}</span>
                </span>
                <span className="mt-auto block pt-16">
                  <span className={`${s.display} ${s.cardClient} block`}>{p.client}</span>
                  <span className="mt-3 block text-sm text-white/50">{p.sector}</span>
                  <span className="mt-5 block max-w-[40ch] leading-relaxed text-white/75">{p.summary}</span>
                </span>
                <span className="mt-7 flex items-end justify-between gap-4">
                  <span className="flex flex-wrap gap-2">
                    {p.pillars.slice(0, 2).map((slug) => {
                      const name = pillarName(slug);
                      return name ? (
                        <span key={slug} className={s.tag}>
                          {name}
                        </span>
                      ) : null;
                    })}
                  </span>
                  <span className={s.arrowDisc} aria-hidden>
                    <ArrowRight size={18} />
                  </span>
                </span>
              </Link>
            );
          })}
          <Link href="/work" className={`${s.card} ${s.cardEnd}`} data-spot>
            <span className={`${s.mono} text-white/50`}>More work</span>
            <span className={`${s.display} ${s.cardClient} mt-5 block`}>
              See every
              <br />
              case study
            </span>
            <span className={`${s.arrowDisc} mt-10`} aria-hidden>
              <ArrowRight size={18} />
            </span>
          </Link>
        </WorkRail>

        {/* Industries */}
        <section className="border-t border-white/10 py-28 md:py-40" aria-labelledby="industries-title">
          <div className={`${s.shell} grid gap-14 lg:grid-cols-12`}>
            <div className="lg:col-span-4">
              <p className={`${s.mono} text-white/50`}>Industries</p>
              <h2 id="industries-title" className={`${s.display} mt-6 text-[clamp(2.4rem,4.6vw,4.4rem)]`} data-cine>
                <Lines lines={["Sector", "knowledge,", "applied."]} />
              </h2>
              <p className="mt-6 max-w-[34ch] text-white/60" data-cine="fade">
                We work across sectors, so the patterns we bring to your project have usually been tested somewhere else first.
              </p>
            </div>
            <ul className="grid gap-x-12 sm:grid-cols-2 lg:col-span-8">
              {industries.map((ind, i) => (
                <li key={ind.slug} data-cine="fade" style={vars({ "--d": i % 2 })}>
                  <Link href={`/industries/${ind.slug}`} className={s.indLink}>
                    <span>{ind.name}</span>
                    <ArrowUpRight size={22} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Closing call */}
        <ClosingCall>
          <div className={`${s.shell} relative py-32 text-center`}>
            <p className={`${s.mono} text-white/55`}>Start a conversation</p>
            <h2 id="cta-title" className={`${s.display} ${s.ctaTitle} mx-auto mt-8 max-w-[12ch]`} data-cine>
              <Lines lines={["Have something", "worth building?"]} />
            </h2>
            <p className="mx-auto mt-8 max-w-[44ch] text-lg text-white/65" data-cine="fade">
              Tell us where you are and what you need. We will come back to you with a clear next step.
            </p>
            <div className="mt-10 flex justify-center" data-cine="fade" style={vars({ "--d": 1 })}>
              <Link href="/contact" className={`${s.btn} ${s.btnAccent} px-7! py-4! text-base!`}>
                Talk to us <ArrowRight size={18} aria-hidden />
              </Link>
            </div>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 text-base sm:flex-row sm:gap-10" data-cine="fade" style={vars({ "--d": 2 })}>
              <a href={`mailto:${contact.email}`} className={s.contactLink}>
                {contact.email}
              </a>
              <a href={contact.phoneHref} className={s.contactLink}>
                {contact.phone}
              </a>
            </div>
          </div>
        </ClosingCall>
      </main>

      <footer className={s.footer}>
        <div className={`${s.shell} grid gap-10 py-14 md:grid-cols-12`}>
          <div className="md:col-span-4">
            <Link href="/preview/cinematic" className={`${s.wordmark} text-white`}>
              {site.name}
            </Link>
            <p className="mt-4 max-w-[30ch]">Technology consultancy. Strategy, design, engineering, AI, cloud and growth.</p>
          </div>
          <nav aria-label="Services" className="md:col-span-4">
            <p className={`${s.mono} mb-4 text-white/40`}>Services</p>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {pillars.map((p) => (
                <li key={p.slug}>
                  <Link href={`/services/${p.slug}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Company" className="md:col-span-2">
            <p className={`${s.mono} mb-4 text-white/40`}>Company</p>
            <ul className="grid gap-2">
              {[
                ["/about", "About"],
                ["/work", "Work"],
                ["/insights", "Insights"],
                ["/careers", "Careers"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-2">
            <p className={`${s.mono} mb-4 text-white/40`}>Contact</p>
            <ul className="grid gap-2">
              <li>
                <a href={`mailto:${contact.email}`} className="break-all">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.phoneHref}>{contact.phone}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={`${s.shell} flex flex-wrap justify-between gap-4 border-t border-white/10 py-6 text-sm text-white/40`}>
          <span>
            © {new Date().getFullYear()} {site.legalName}
          </span>
          <Link href="/privacy">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
