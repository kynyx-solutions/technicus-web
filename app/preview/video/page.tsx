import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Archivo, Instrument_Serif } from "next/font/google";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { pillars } from "@/content/services";
import { industries } from "@/content/site";
import { getContactInfo, getProjects } from "@/lib/cms";
import { s } from "@/components/preview/video/styles";
import "@/components/preview/video/video.css";
import { Header } from "@/components/preview/video/header";
import { Hero } from "@/components/preview/video/hero";
import { Statement } from "@/components/preview/video/statement";
import { ParallaxSection } from "@/components/preview/video/parallax";
import { Practices } from "@/components/preview/video/practices";
import { CaseStudies } from "@/components/preview/video/case-studies";
import { Footer } from "@/components/preview/video/footer";
import { RevealInit } from "@/components/preview/video/reveal";
import { bandPhotos } from "@/components/preview/video/photos";

// Archivo (with its width axis) for type, Instrument Serif for editorial accents.
const sans = Archivo({ subsets: ["latin"], variable: "--vf-sans", axes: ["wdth"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], variable: "--vf-serif", weight: "400", style: ["normal", "italic"], display: "swap" });

export const metadata: Metadata = {
  title: "Preview: video-led premium",
};

function MaskTitle({ id, lines, className }: { id?: string; lines: string[]; className: string }) {
  return (
    <h2 id={id} className={`${className} ${s.mask}`} data-vmask>
      {lines.map((l, i) => (
        <span key={i} className={s.line}>
          <span className={s.lineInner} style={{ "--d": i } as CSSProperties}>
            {l}
          </span>
        </span>
      ))}
    </h2>
  );
}

export default async function VideoPreview() {
  const [projects, contact] = await Promise.all([getProjects(), getContactInfo()]);
  const pillarNames = Object.fromEntries(pillars.map((p) => [p.slug, p.name]));
  const spelled = ["No", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
  const practiceCount = spelled[pillars.length] ?? String(pillars.length);
  const capabilityCount = pillars.reduce((n, p) => n + p.capabilities.length, 0);

  const facts = [
    { value: pillars.length, label: "Practices under one roof" },
    { value: capabilityCount, label: "Specialist capabilities" },
    { value: industries.length, label: "Industries we serve" },
    { value: projects.length, label: "Published case studies" },
  ];

  return (
    <div className={`${sans.variable} ${serif.variable} ${s.root}`}>
      <RevealInit />
      <Header />

      <main>
        <Hero />

        {/* Editorial statement */}
        <section className={`${s.light} ${s.statement}`} aria-labelledby="approach-title">
          <div className={s.shell}>
            <div className={s.statementGrid}>
              <div>
                <h2 id="approach-title" className={s.eyebrow}>
                  Our approach
                </h2>
              </div>
              <div>
                <Statement text="Most organisations do not need more technology. They need the *right* technology, built well and run properly. That is the work we do, from the first strategy session to the system your customers use *every day.*" />
                <div className={s.facts}>
                  {facts.map((f, i) => (
                    <div key={f.label} className={s.fact} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                      <div className={s.factValue}>{f.value}</div>
                      <div className={s.factLabel}>{f.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Parallax photo band */}
        <ParallaxSection photo={bandPhotos.team} className={s.band} scrimClassName={s.bandScrim} labelledBy="band-title">
          <div className={`${s.shell} ${s.bandContent}`}>
            <p className={s.eyebrow}>How we work</p>
            <MaskTitle id="band-title" className={s.bandTitle} lines={["One team, from the", "first workshop to", "the live system."]} />
            <p className={s.bandText} data-reveal>
              Strategists, designers and engineers work side by side on your problem. No hand-offs between agencies, no gaps in responsibility, and overlapping hours with your team wherever you are.
            </p>
          </div>
        </ParallaxSection>

        {/* Practices */}
        <section className={s.practices} aria-labelledby="practices-title">
          <div className={s.shell}>
            <div className={s.sectionHead}>
              <div>
                <p className={s.eyebrow}>What we do</p>
                <MaskTitle id="practices-title" className={s.h2} lines={[`${practiceCount} practices.`, "One standard."]} />
              </div>
              <div>
                <p className={s.headNote} style={{ color: "var(--muted)" }} data-reveal>
                  Every engagement draws on the practices it needs, led by people who stay with the work until it is delivered.
                </p>
                <Link href="/services" className={s.textLink} style={{ marginTop: 20 }}>
                  All services
                </Link>
              </div>
            </div>
            <Practices pillars={pillars} />
          </div>
        </section>

        {/* Case studies */}
        <section id="work" className={`${s.light} ${s.work}`} aria-labelledby="work-title">
          <div className={s.shell}>
            <div className={s.sectionHead}>
              <div>
                <p className={s.eyebrow}>Selected work</p>
                <MaskTitle id="work-title" className={s.h2} lines={["Work that is", "in use today."]} />
              </div>
              <div>
                <p className={s.headNote} style={{ color: "rgba(11,12,14,0.66)" }} data-reveal>
                  Platforms, products and services we have designed and built for clients in retail, finance, education, hospitality and mobility.
                </p>
                <Link href="/work" className={s.textLink} style={{ marginTop: 20 }}>
                  All case studies
                </Link>
              </div>
            </div>
            <CaseStudies projects={projects} pillarNames={pillarNames} />
            <p className={s.photoNote}>Photography is illustrative.</p>
          </div>
        </section>

        {/* Industries */}
        <section className={s.industries} aria-labelledby="industries-title">
          <div className={s.shell}>
            <div className={s.sectionHead} style={{ marginBottom: 0 }}>
              <div>
                <p className={s.eyebrow}>Industries</p>
                <MaskTitle id="industries-title" className={s.h2} lines={["Built around how", "your sector works."]} />
              </div>
              <p className={s.headNote} style={{ color: "var(--muted)" }} data-reveal>
                Rules, users and systems differ from one industry to the next. We start from yours.
              </p>
            </div>
          </div>
          <div className={s.marquee} aria-hidden="true">
            {[...industries, ...industries].map((ind, i) => (
              <span key={i} data-dup={i >= industries.length ? "" : undefined}>
                {ind.name}
              </span>
            ))}
          </div>
          <div className={s.shell}>
            <ul className={s.industryGrid}>
              {industries.map((ind) => (
                <li key={ind.slug}>
                  <Link href={`/industries/${ind.slug}`} className={s.industryLink}>
                    {ind.name}
                    <ArrowUpRight size={18} strokeWidth={1.5} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ height: "clamp(96px, 11vw, 160px)" }} />
        </section>

        {/* Closing call to action */}
        <ParallaxSection photo={bandPhotos.city} className={s.cta} scrimClassName={s.ctaScrim} depth={0.08} labelledBy="cta-title">
          <div className={`${s.shell} ${s.ctaContent}`}>
            <p className={s.eyebrow}>Start a project</p>
            <h2 id="cta-title" className={`${s.ctaTitle} ${s.mask}`} data-vmask style={{ marginTop: 24 }}>
              <span className={s.line}>
                <span className={s.lineInner}>Have something</span>
              </span>
              <span className={s.line}>
                <span className={s.lineInner} style={{ "--d": 1 } as CSSProperties}>
                  important <em>to build?</em>
                </span>
              </span>
            </h2>
            <div className={s.ctaRow} data-reveal>
              <Link href="/contact" className={s.btn}>
                Talk to our team <ArrowRight size={18} />
              </Link>
              <div className={s.ctaContact}>
                <a href={`mailto:${contact.email}`} className={s.textLink}>
                  {contact.email}
                </a>
                <a href={contact.phoneHref} className={s.textLink}>
                  {contact.phone}
                </a>
              </div>
            </div>
          </div>
        </ParallaxSection>
      </main>

      <Footer pillars={pillars} contact={contact} />
    </div>
  );
}
