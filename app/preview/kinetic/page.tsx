import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { KineticHeader } from "@/components/preview/kinetic/header";
import { nav } from "@/components/preview/kinetic/nav";
import { HeroTitle } from "@/components/preview/kinetic/hero-title";
import { PracticeGrid } from "@/components/preview/kinetic/practice-grid";
import { ScrollFX } from "@/components/preview/kinetic/scroll-fx";
import { s } from "@/components/preview/kinetic/styles";
import "@/components/preview/kinetic/kinetic.css";
import { pillars } from "@/content/services";
import { industries, site } from "@/content/site";
import { getContactInfo, getProjects } from "@/lib/cms";

// Archivo's width axis gives the condensed, heavy display cut; the same family
// sets the text. Plex Mono is for small labels only.
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--k-font-display", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--k-font-mono", display: "swap" });

export const metadata: Metadata = { title: "Preview: bold kinetic type" };

const ROOT = "kinetic-root";
const words = ["platforms", "AI products", "mobile apps", "cloud systems", "online stores"];

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

/** A sentence whose words fill in one by one as it scrolls through the reading zone. */
function FillText({ text, marks = [] }: { text: string; marks?: string[] }) {
  const tokens = text.split(" ");
  return (
    <p data-kx="read" className={`${s.display} ${s.statement} relative z-0 text-balance`} style={{ "--n": tokens.length } as Vars}>
      {tokens.map((w, i) => (
        <span key={i}>
          <span className={`${s.fillWord} ${marks.includes(w) ? s.mark : ""}`} style={{ "--i": i } as Vars}>
            {w}
          </span>{" "}
        </span>
      ))}
    </p>
  );
}

/** A giant line of words that slides sideways with the scroll. Decorative. */
function Row({ items, dir, from, amt = "44vw", outline, square }: { items: string[]; dir: 1 | -1; from: string; amt?: string; outline?: boolean; square?: boolean }) {
  return (
    <div className={`${s.display} ${s.row}`} style={{ "--dir": dir, "--from": from, "--amt": amt } as Vars}>
      {items.map((w, i) => (
        <span key={i} className="contents">
          <span className={outline && i % 2 === 0 ? s.outline : ""}>{w}</span>
          <span className={`${s.glyph} ${square ? s.glyphSquare : ""}`} />
        </span>
      ))}
    </div>
  );
}

export default async function KineticPreview() {
  const [projects, contact] = await Promise.all([getProjects(), getContactInfo()]);
  const practices = pillars.map(({ slug, name, summary, capabilities }) => ({
    slug,
    name,
    summary,
    capabilities: capabilities.map(({ slug, name }) => ({ slug, name })),
  }));
  const year = new Date().getFullYear();

  return (
    <div id={ROOT} className={`${archivo.variable} ${plexMono.variable} ${s.root}`}>
      <ScrollFX rootId={ROOT} />
      <KineticHeader />

      <main>
        {/* ---------- Hero ---------- */}
        <section data-kx="exit" className={`${s.onInk} relative flex flex-col overflow-hidden bg-(--k-ink) md:min-h-[100svh] text-(--k-paper)`}>
          <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 pt-24 pb-6 md:px-10 md:pt-28 md:pb-8">
            <div className={`${s.mono} ${s.fadeUp} flex flex-wrap justify-between gap-x-6 gap-y-1 text-(--k-paper)/60`}>
              <span>Technology consultancy</span>
              <span>India based, working worldwide</span>
            </div>

            <div className="mt-auto pt-20 md:pt-10">
              <HeroTitle words={words} />
            </div>

            <div className="mt-8 grid items-end gap-6 border-t border-(--k-paper)/15 pt-6 md:mt-10 md:grid-cols-12 md:gap-8">
              <p className={`${s.fadeUp} max-w-[38ch] text-[1.08rem] leading-relaxed text-(--k-paper)/75 md:col-span-6 md:text-[1.15rem]`} style={{ "--d": 6 } as Vars}>
                Strategy, design, engineering, AI, cloud and growth from one accountable team. We take products from the first decision to production, and keep them running.
              </p>
              <div className={`${s.fadeUp} flex flex-wrap gap-3 md:col-span-5 md:col-start-8 md:justify-end`} style={{ "--d": 7 } as Vars}>
                <Link href="/contact" className={s.btn}>
                  Start a project <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link href="/work" className={`${s.btn} ${s.btnGhost}`}>
                  See our work
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Statement ---------- */}
        <section className={`${s.onPaper} mx-auto max-w-[1600px] px-4 pt-24 pb-16 md:px-10 md:pt-40 md:pb-24`}>
          <div className="grid gap-8 md:grid-cols-12">
            <p className={`${s.mono} md:col-span-3 md:pt-4`}>Our view</p>
            <div className="md:col-span-9">
              <FillText
                text="Most technology projects stall in the gap between the plan and the product. We close it. One team takes you from the first decision to software running in production, and stays to keep it there."
                marks={["One", "team"]}
              />
            </div>
          </div>
        </section>

        {/* ---------- Sliding rows ---------- */}
        <section data-kx="through" aria-hidden="true" className={`${s.rowsWrap} border-y border-(--k-ink)/15 py-8 md:py-12`}>
          <Row items={["Strategy", "Design", "Engineering", "Strategy", "Design", "Engineering"]} dir={-1} from="-30vw" />
          <Row items={["AI", "Data", "Cloud", "Security", "AI", "Data", "Cloud", "Security"]} dir={1} from="-60vw" outline square />
          <Row items={["Growth", "Managed teams", "Growth", "Managed teams", "Growth"]} dir={-1} from="-20vw" />
        </section>

        {/* ---------- Lime block: plan, build, run ---------- */}
        <section className="px-0 py-16 md:py-24">
          <div data-kx="enter" className={`${s.wipe} ${s.onPaper} overflow-hidden bg-(--k-sig)`}>
            <div data-kx="through" className="mx-auto max-w-[1600px] px-4 py-20 md:px-10 md:py-32">
              <p className={s.mono}>How we work</p>
              <h2 className={`${s.display} ${s.split} mt-8`}>
                <span className={`${s.splitL} block`}>Plan it.</span>
                <span className={`${s.splitR} ${s.outline} block text-right`}>Build it.</span>
                <span className={`${s.splitL} block md:pl-[12vw]`}>Run it.</span>
              </h2>
              <div className="mt-14 grid gap-8 md:mt-20 md:grid-cols-12">
                <p className="max-w-[44ch] text-[1.15rem] leading-relaxed font-medium md:col-span-6 md:col-start-7 md:text-[1.3rem]">
                  Strategy, design, engineering and operations sit under one roof, so nothing is lost between hand-offs. You get one plan, one team and one point of accountability from the first workshop to the system in production.
                </p>
                <div className="md:col-span-6 md:col-start-7">
                  <Link href="/about/how-we-work" className={`${s.btn} ${s.btnInk}`}>
                    How we work <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Practices ---------- */}
        <section className={`${s.onPaper} mx-auto max-w-[1600px] px-4 pt-12 pb-24 md:px-10 md:pt-16 md:pb-36`}>
          <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <p className={s.mono}>Services</p>
              <h2 data-kx-in className={`${s.rv} ${s.display} mt-6 text-[clamp(2.8rem,7.4vw,7.6rem)] text-balance`}>
                Every practice. One accountable team.
              </h2>
            </div>
            <p data-kx-in className={`${s.rv} max-w-[36ch] text-[1.05rem] leading-relaxed text-(--k-muted) md:col-span-4`} style={{ "--d": 2 } as Vars}>
              Open a practice to see what it covers. Use one, or bring several together under a single plan.
            </p>
          </div>
          <PracticeGrid items={practices} />
        </section>

        {/* ---------- Work ---------- */}
        <section className={`${s.onInk} bg-(--k-ink) pb-20 text-(--k-paper) md:pb-28`}>
          <div data-kx="through" aria-hidden="true" className={`${s.rowsWrap} pt-20 md:pt-28`}>
            <Row items={["Selected work", "Selected work", "Selected work"]} dir={-1} from="-25vw" outline />
          </div>
          <div className="mx-auto max-w-[1600px] px-4 md:px-10">
            <div className="mt-12 flex flex-wrap items-end justify-between gap-6 md:mt-16">
              <h2 className={`${s.display} ${s.displaySm} max-w-[22ch] text-[clamp(2rem,3.6vw,3.4rem)] text-balance`}>Products we have designed, built and run for clients.</h2>
            </div>
            <ul className="mt-10 border-t border-(--k-paper)/20">
              {projects.map((p, i) => (
                <li key={p.slug} data-kx-in className={`${s.rv} border-b border-(--k-paper)/20`} style={{ "--d": i % 3 } as Vars}>
                  <Link href={`/work/${p.slug}`} className={`${s.workRow} px-1 py-7 md:px-3 md:py-9`}>
                    <span className="grid items-center gap-x-8 gap-y-4 md:grid-cols-12">
                      <span className={`${s.display} ${s.workName} block md:col-span-6`}>{p.client}</span>
                      <span className={`${s.workDim} block text-[0.98rem] leading-snug text-(--k-paper)/65 md:col-span-4`}>
                        <span className={`${s.mono} mb-2 block`}>
                          {p.industry} / {p.country}
                        </span>
                        <span className="line-clamp-2">{p.summary}</span>
                      </span>
                      <span className="hidden justify-end md:col-span-2 md:flex" aria-hidden="true">
                        <span className="grid size-16 place-items-center rounded-full border-[1.5px] border-current">
                          <ArrowRight size={26} className={s.workArrow} />
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-12">
              <Link href="/work" className={s.btn}>
                All work <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- Industries ---------- */}
        <section className={`${s.onPaper} mx-auto max-w-[1600px] px-4 py-24 md:px-10 md:py-36`}>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className={s.mono}>Industries</p>
              <h2 className={`${s.display} ${s.displaySm} mt-6 text-[clamp(2.4rem,4.4vw,4.4rem)] text-balance`}>Built for how your sector works.</h2>
              <p className="mt-6 max-w-[34ch] leading-relaxed text-(--k-muted)">
                Rules, customers and legacy systems differ by industry. We learn yours before we write a line of code.
              </p>
            </div>
            <ul className={`${s.display} ${s.displaySm} flex flex-wrap content-start gap-x-[0.45em] gap-y-1 text-[clamp(1.9rem,4.2vw,4.4rem)] leading-[1.08] md:col-span-8`}>
              {industries.map((ind, i) => (
                <li key={ind.slug} data-kx-in className={s.rv} style={{ "--d": i % 4 } as Vars}>
                  <Link href={`/industries/${ind.slug}`} className={s.industry}>
                    {ind.name}
                  </Link>
                  {i < industries.length - 1 && <span className="ml-[0.45em] text-(--k-ink)/25" aria-hidden="true">/</span>}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Closing call ---------- */}
        <section className="pb-4">
          <div data-kx="enter" className={`${s.wipe} ${s.onPaper} overflow-hidden bg-(--k-sig)`}>
            <div className="mx-auto max-w-[1600px] px-4 py-20 md:px-10 md:py-32">
              <p className={s.mono}>Start a project</p>
              <h2 className={`${s.display} ${s.converge} mt-8`}>
                <span className={`${s.convergeL} block`}>Let&rsquo;s build</span>
                <span className={`${s.convergeR} ${s.outline} block text-right`}>what&rsquo;s next.</span>
              </h2>
              <div className="mt-14 grid gap-10 border-t-[1.5px] border-(--k-ink) pt-10 md:mt-20 md:grid-cols-12">
                <p className="max-w-[36ch] text-[1.15rem] leading-relaxed font-medium md:col-span-5">
                  Tell us what you are trying to do. We will come back with a plain answer on how we would approach it.
                </p>
                <div className="flex flex-col gap-3 md:col-span-7 md:items-end">
                  <a href={`mailto:${contact.email}`} className={`${s.display} ${s.industry} text-[clamp(1.7rem,4vw,3.6rem)] break-all`}>
                    {contact.email}
                  </a>
                  <a href={contact.phoneHref} className="text-[1.2rem] font-semibold underline-offset-4 hover:underline">
                    {contact.phone}
                  </a>
                  <Link href="/contact" className={`${s.btn} ${s.btnInk} mt-4 self-start md:self-end`}>
                    Contact us <ArrowUpRight size={18} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="overflow-hidden bg-(--k-ink) text-(--k-paper)">
        <div className="mx-auto max-w-[1600px] px-4 pt-16 md:px-10 md:pt-20">
          <div className="grid gap-10 md:grid-cols-12">
            <p className="max-w-[30ch] text-[1.05rem] leading-relaxed text-(--k-paper)/70 md:col-span-4">
              {site.legalName}. Technology consultancy, India based, working worldwide.
            </p>
            <nav aria-label="Footer" className="md:col-span-5">
              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[1.05rem] sm:grid-cols-3">
                {[...nav, { href: "/contact", label: "Contact" }].map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="hover:text-(--k-sig)">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-1 md:col-span-3 md:items-end">
              <a href={`mailto:${contact.email}`} className="hover:text-(--k-sig)">
                {contact.email}
              </a>
              <a href={contact.phoneHref} className="hover:text-(--k-sig)">
                {contact.phone}
              </a>
            </div>
          </div>
          <div className={`${s.mono} mt-14 flex flex-wrap justify-between gap-4 border-t border-(--k-paper)/15 pt-6 text-(--k-paper)/50`}>
            <span>
              &copy; {year} {site.legalName}
            </span>
            <span className="flex gap-6">
              <Link href="/privacy" className="hover:text-(--k-paper)">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-(--k-paper)">
                Terms
              </Link>
            </span>
          </div>
        </div>
        <div data-kx="end" aria-hidden="true" className="mt-8 overflow-hidden">
          <p className={`${s.display} ${s.wordmark} -mb-[0.06em] px-4 whitespace-nowrap md:px-8`}>Technicus</p>
        </div>
      </footer>
    </div>
  );
}
