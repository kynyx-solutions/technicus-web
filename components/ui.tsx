import { BrainCircuit, CloudCog, Code2, Compass, LifeBuoy, PenTool, TrendingUp, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Art, PILLAR_ART, type ArtKind } from "@/components/art";
import { DotField } from "@/components/dot-field";
import type { Faq, Step } from "@/content/copy/types";

/*
  Editorial corporate: serif headlines, a quiet grotesk, hairline rules,
  square corners and one signal colour. See app/globals.css for the tokens
  and the motion utilities used here.
*/

/* ---------- Small pieces ---------- */

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`h-[1em] w-[1em] ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 12h15M13 6l6 6-6 6" strokeLinecap="square" />
    </svg>
  );
}

/** "Learn more" with an arrow that slides on hover. */
export function MoreLink({ label = "Learn more", className = "" }: { label?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-[0.9rem] font-medium ${className}`}>
      {label}
      <Arrow className="transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1.5" />
    </span>
  );
}

/** An arrow in a square, used at the end of list rows. Turns diagonal on hover. */
export function ArrowCircle({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center border transition-[background-color,color,border-color] duration-300 ${
        tone === "dark" ? "border-ink/15 text-ink group-hover:border-blue group-hover:bg-blue group-hover:text-white" : "border-paper/25 text-paper group-hover:border-paper group-hover:bg-paper group-hover:text-ink"
      } ${className}`}
    >
      <Arrow className="transition-transform duration-500 ease-(--ease-out-expo) group-hover:-rotate-45" />
    </span>
  );
}

export function TalkButton({ tone = "dark", label = "Talk to us" }: { tone?: "dark" | "light"; label?: string }) {
  return (
    <Link href="/contact" className={`${tone === "dark" ? "btn-dark" : "btn-light"} group`}>
      {label}
      <Arrow className="transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1" />
    </Link>
  );
}

/** A note for the team, shown only while developing. Never in a production build. */
export function DevNote({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") return null;
  return <p className="my-8 border border-dashed border-blue/50 bg-sky px-4 py-3 font-mono text-xs leading-relaxed text-ink">Needs content: {children}</p>;
}

export type Crumb = { href: string; name: string };

function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[0.82rem] text-muted">
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <li>
          <Link href="/" className="sweep">
            Home
          </Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2.5">
            <span aria-hidden className="text-ink/30">
              /
            </span>
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className="text-ink">
                {c.name}
              </span>
            ) : (
              <Link href={c.href} className="sweep">
                {c.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Page sections ---------- */

type Tone = "light" | "dark" | "grey";

const toneClass: Record<Tone, string> = {
  light: "bg-white text-ink",
  dark: "bg-navy text-paper",
  grey: "bg-paper text-ink",
};

const delay = (i: number) => ({ "--i": i }) as CSSProperties;

/** The heading, word by word, each rising out of its own mask. The closing
 *  words are set in italic, as an editor would stress them. */
function HeroTitle({ title, small }: { title: string; small: boolean }) {
  const words = title.split(/\s+/).filter(Boolean);
  const stressFrom = words.length > 4 ? words.length - 2 : words.length;
  return (
    <h1 className={`${small ? "display-sm" : "display"} max-w-[16ch]`}>
      {words.map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="mask-word">
            <span className={i >= stressFrom ? "italic" : ""} style={delay(i)}>
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </h1>
  );
}

/**
 * The top of every page, on paper. The heading builds in word by word over
 * the dot field (the brand motif); a hairline draws across beneath it, then
 * the lead and the actions settle in on either side of the rule.
 */
export function Hero({
  eyebrow,
  title,
  lead,
  crumbs,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  /** "Talk to us" and "See our work" buttons. */
  actions?: boolean;
  /** Kept for older call sites. */
  tone?: "light" | "dark";
  align?: "center" | "left";
  art?: ArtKind;
  media?: ReactNode;
  children?: ReactNode;
}) {
  const small = Boolean(crumbs);
  return (
    <section data-tone="light" className="relative isolate overflow-hidden bg-paper text-ink">
      <div className="absolute inset-y-0 right-0 -z-10 w-full md:w-[62%] [mask-image:linear-gradient(to_right,transparent,black_35%)]">
        <DotField />
      </div>
      <div className={`shell ${small ? "pt-12 pb-14 md:pt-16 md:pb-20" : "pt-16 pb-16 md:pt-28 md:pb-24"}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          {crumbs ? (
            <div className="hero-in" style={delay(0)}>
              <Breadcrumbs crumbs={crumbs} />
            </div>
          ) : (
            <span />
          )}
          {eyebrow && (
            <p className="label hero-in text-ink" style={delay(0)}>
              {eyebrow}
            </p>
          )}
        </div>
        <div className={small ? "mt-10 md:mt-14" : "mt-14 md:mt-20"}>
          <HeroTitle title={title} small={small} />
        </div>
        <div aria-hidden className="rule-draw mt-12 h-px bg-ink/20 md:mt-16" />
        <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
          {lead && (
            <p className="lead hero-in text-ink/75 md:col-span-7 lg:col-span-6" style={delay(1)}>
              {lead}
            </p>
          )}
          {actions && (
            <div className="hero-in flex flex-wrap gap-3 md:col-span-5 md:col-start-8 md:justify-end lg:col-span-6 lg:col-start-7" style={delay(2)}>
              <TalkButton />
              <Link href="/work" className="btn-outline">
                See our work
              </Link>
            </div>
          )}
        </div>
        {children && (
          <div className="hero-in" style={delay(3)}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * A page section. The label sits in a narrow left column and the heading in
 * the wide right one, on a hairline that spans the grid.
 */
export function Section({
  id,
  title,
  lead,
  action,
  children,
  tone = "light",
  center,
  eyebrow,
}: {
  id?: string;
  title?: string;
  lead?: string;
  action?: ReactNode;
  children?: ReactNode;
  tone?: Tone;
  wide?: boolean;
  center?: boolean;
  eyebrow?: string;
}) {
  const dark = tone === "dark";
  const hasHead = Boolean(title || lead);
  return (
    <section id={id} data-tone={dark ? "dark" : "light"} className={`relative ${toneClass[tone]} py-16 md:py-24`}>
      <div className="inner">
        {hasHead &&
          (center ? (
            <header className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
              {title && (
                <h2 className="h2" data-reveal>
                  {title}
                </h2>
              )}
              {lead && <p className={`lead mx-auto mt-5 max-w-2xl ${dark ? "text-paper/70" : "text-muted"}`}>{lead}</p>}
            </header>
          ) : (
            <header className={`mb-12 grid gap-6 border-t pt-6 md:mb-16 md:grid-cols-12 md:gap-10 ${dark ? "border-paper/15" : "border-ink/15"}`}>
              <div className="md:col-span-3">{eyebrow && <p className={`label ${dark ? "text-paper/80" : "text-ink"}`}>{eyebrow}</p>}</div>
              <div className="md:col-span-9">
                <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
                  {title && (
                    <h2 className="h2 max-w-[20ch]" data-reveal>
                      {title}
                    </h2>
                  )}
                  {action && <div data-reveal>{action}</div>}
                </div>
                {lead && (
                  <p className={`lead mt-5 max-w-2xl ${dark ? "text-paper/70" : "text-muted"}`} data-reveal>
                    {lead}
                  </p>
                )}
              </div>
            </header>
          ))}
        {children}
      </div>
    </section>
  );
}

/** A label on the left and a large serif paragraph on the right. */
export function Intro({ label, text, children }: { label: string; text: string; children?: ReactNode }) {
  return (
    <div className="grid gap-5 md:grid-cols-12 md:gap-10">
      <p className="label pt-2 text-ink md:col-span-3" data-reveal>
        {label}
      </p>
      <div className="md:col-span-9">
        <p className="max-w-[34ch] font-serif text-[1.65rem] leading-[1.22] tracking-[-0.02em] md:text-[2.2rem]" data-reveal>
          {text}
        </p>
        {children}
      </div>
    </div>
  );
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="max-w-[44rem] space-y-5 text-[1.05rem] leading-relaxed text-ink/75 md:text-lg">
      {paragraphs.map((p) => (
        <p key={p} data-reveal>
          {p}
        </p>
      ))}
    </div>
  );
}

/* ---------- Services ---------- */

export type StackItem = {
  href: string;
  title: string;
  text: string;
  /** Position in content/services.ts, which picks the icon. */
  index: number;
  links?: { href: string; name: string }[];
};

const PILLAR_ICONS: LucideIcon[] = [Compass, PenTool, Code2, BrainCircuit, CloudCog, TrendingUp, LifeBuoy];

/**
 * The service areas on a hairline grid. Hovering a cell fills it with ink
 * from the bottom edge; the text turns to paper and the arrow turns.
 */
export function ServiceStack({ items }: { items: StackItem[] }) {
  return (
    <ul className="ruled grid sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = PILLAR_ICONS[item.index % PILLAR_ICONS.length];
        return (
          <li key={item.href} data-reveal className="flex">
            <div className="card-fill group flex w-full flex-col p-7 md:p-8">
              <div className="flex items-start justify-between">
                <Icon size={26} strokeWidth={1.3} aria-hidden className="text-blue transition-colors duration-500" />
                <ArrowCircle className="transition-colors duration-500 group-hover:!border-paper/30 group-hover:!bg-transparent group-hover:!text-paper" />
              </div>
              <h3 className="mt-14 font-serif text-[1.65rem] leading-[1.08] tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-paper">
                <Link href={item.href} className="after:absolute after:inset-0">
                  {item.title}
                </Link>
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted transition-colors duration-500 group-hover:text-paper/70">{item.text}</p>
              {item.links && (
                <ul className="relative z-10 mt-6 space-y-1.5 border-t border-line pt-5 text-[0.86rem] transition-colors duration-500 group-hover:border-paper/15">
                  {item.links.slice(0, 4).map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="sweep text-ink/80 transition-colors duration-500 group-hover:text-paper/85">
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
      <li data-reveal className="flex">
        <div className="flex w-full flex-col justify-between bg-blue p-7 text-white md:p-8">
          <p className="label-plain text-white/80">Where to start</p>
          <div className="mt-14">
            <h3 className="font-serif text-[1.65rem] leading-[1.08] tracking-[-0.02em]">Not sure which of these you need?</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-white/80">Describe the problem. We will tell you plainly which mix fits, and what it would take.</p>
            <Link href="/contact" className="group mt-7 inline-flex items-center gap-3 border-b border-white/50 pb-1 text-[0.93rem] font-medium hover:border-white">
              Talk to us <Arrow className="transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </li>
    </ul>
  );
}

/* ---------- Lists ---------- */

export type RowItem = { href: string; title: string; text?: string; meta?: string; links?: { href: string; name: string }[] };

/** An index: rows on hairlines, each a link. The title slides on hover. */
export function Rows({ items }: { items: RowItem[] }) {
  return (
    <ul className="border-t border-current/15">
      {items.map((item) => (
        <li key={item.href} data-reveal className="border-b border-current/15">
          <Link href={item.href} className="group grid gap-3 py-7 md:grid-cols-12 md:gap-10 md:py-8">
            <div className="md:col-span-5">
              <span className="block font-serif text-[1.6rem] leading-[1.1] tracking-[-0.02em] transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-2 md:text-[1.9rem]">
                {item.title}
              </span>
              {item.meta && <span className="label-plain mt-3 block opacity-60">{item.meta}</span>}
            </div>
            <div className="flex items-start justify-between gap-8 md:col-span-7">
              {item.text && <span className="max-w-xl opacity-70">{item.text}</span>}
              <ArrowCircle className="hidden md:inline-flex" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export type CardItem = { href: string; title: string; text?: string; meta?: string; image?: string };

/** Link cards on a hairline grid. */
export function Cards({ items, columns = 3 }: { items: CardItem[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <ul className={`ruled grid ${cols}`}>
      {items.map((item) => (
        <li key={item.href} data-reveal className="flex">
          <Link href={item.href} className="card-press group flex w-full flex-col !border-0 p-7 text-ink md:p-8">
            {item.meta && <span className="label-plain mb-4 text-muted">{item.meta}</span>}
            <span className="block text-[1.15rem] font-medium tracking-[-0.015em]">{item.title}</span>
            {item.text && <span className="mt-3 block text-[0.95rem] leading-relaxed text-muted">{item.text}</span>}
            <MoreLink className="mt-auto pt-8 text-ink/70 group-hover:text-blue" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Article cards: a picture, then the title in the serif. */
export function PostCards({ items }: { items: CardItem[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-12 md:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.href} data-reveal>
          <Link href={item.href} className="group block text-ink">
            <span className="relative block aspect-[4/3] overflow-hidden bg-sky">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-[1.04]" />
              ) : (
                <Art kind={PILLAR_ART[(i + 2) % PILLAR_ART.length]} tone="light" className="absolute inset-0 h-full w-full p-6 transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-[1.04]" />
              )}
            </span>
            {item.meta && <span className="label-plain mt-5 block text-muted">{item.meta}</span>}
            <span className="mt-3 block font-serif text-[1.45rem] leading-[1.15] tracking-[-0.015em]">
              <span className="sweep">{item.title}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export type WorkItem = { href: string; client: string; summary: string; meta: string };

/** Case studies: a large plate with the client name, a caption beneath. */
export function WorkGrid({ items }: { items: WorkItem[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
      {items.map((item, i) => (
        <li key={item.href} data-reveal>
          <Link href={item.href} className="group block">
            <span className="relative flex aspect-[16/10] items-end overflow-hidden bg-sky p-7">
              <Art
                kind={PILLAR_ART[(i + 1) % PILLAR_ART.length]}
                tone="light"
                className="absolute inset-0 h-full w-full p-10 transition-transform duration-1000 ease-(--ease-out-expo) group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-ink opacity-0 transition-opacity duration-500 group-hover:opacity-90" />
              <span className="relative font-serif text-[2.2rem] leading-none tracking-[-0.03em] text-ink transition-colors duration-500 group-hover:text-paper md:text-[2.8rem]">
                {item.client}
              </span>
              <span className="absolute top-6 right-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <ArrowCircle tone="light" />
              </span>
            </span>
            <span className="mt-5 grid gap-2 border-t border-current/15 pt-4 md:grid-cols-12 md:gap-6">
              <span className="label-plain opacity-60 md:col-span-4">{item.meta}</span>
              <span className="leading-snug md:col-span-8">{item.summary}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Stages or principles on a hairline grid. No numbers: each opens with a
 *  short vermilion rule that draws across when it comes into view. */
export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ul className={`ruled grid md:grid-cols-2 ${steps.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {steps.map((step) => (
        <li key={step.title} data-reveal className="group flex flex-col bg-white p-7 text-ink md:p-8">
          <span aria-hidden className="block h-0.5 w-8 bg-blue transition-[width] duration-700 ease-(--ease-out-expo) group-hover:w-16" />
          <h3 className="mt-10 font-serif text-[1.65rem] leading-[1.08] tracking-[-0.02em]">{step.title}</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{step.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function Features({ items, columns = 2 }: { items: Step[]; columns?: 2 | 4 }) {
  return (
    <ul className={`grid gap-x-10 gap-y-10 ${columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2"}`}>
      {items.map((item) => (
        <li key={item.title} data-reveal className="border-t border-current/20 pt-5">
          <h3 className="h3">{item.title}</h3>
          <p className="mt-2 opacity-70">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function Faqs({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="border-t border-ink/15 text-ink">
      {faqs.map((faq) => (
        <details key={faq.q} className="group border-b border-ink/15" data-reveal>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-8 py-6 text-[1.1rem] font-medium tracking-[-0.01em] transition-colors duration-200 hover:text-blue md:text-[1.2rem] [&::-webkit-details-marker]:hidden">
            {faq.q}
            <span aria-hidden className="relative h-4 w-4 shrink-0">
              <span className="absolute top-1/2 left-0 h-px w-4 bg-current" />
              <span className="absolute top-0 left-1/2 h-4 w-px bg-current transition-transform duration-500 ease-(--ease-out-expo) group-open:scale-y-0" />
            </span>
          </summary>
          <p className="max-w-3xl pb-7 leading-relaxed text-muted">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} data-reveal className="border border-current/20 px-3.5 py-2 text-[0.9rem]">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="border-t border-current/15">
      {items.map((item) => (
        <li key={item} data-reveal className="flex gap-4 border-b border-current/15 py-4 text-[1.02rem]">
          <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 bg-blue" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Stats({ items }: { items: { value: number; suffix?: string; label: string }[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="grid border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s) => (
        <li key={s.label} data-reveal className="border-b border-ink/15 py-8 sm:pr-8 lg:border-b-0 lg:border-l lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
          <p className="font-serif text-[4rem] leading-none tracking-[-0.04em] tabular-nums">
            <span data-count={s.value}>{s.value}</span>
            <span className="text-blue">{s.suffix}</span>
          </p>
          <p className="mt-4 max-w-[16rem] text-[0.95rem] text-muted">{s.label}</p>
        </li>
      ))}
    </ul>
  );
}

/** Closes every page except Contact: one large serif line and a way in. */
export function ClosingCall({
  line = "Tell us what you are trying to build.",
  lead = "A short call is usually enough to see whether we are the right team. If we are not, we will say so.",
}: {
  line?: string;
  lead?: string;
}) {
  return (
    <section data-tone="light" className="bg-paper py-20 text-ink md:py-32">
      <div className="inner">
        <div className="grid gap-10 border-t border-ink/15 pt-8 md:grid-cols-12">
          <p className="label md:col-span-3" data-reveal>
            Start a conversation
          </p>
          <div className="md:col-span-9">
            <h2 className="display-sm max-w-[18ch]" data-reveal>
              {line}
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-9 md:items-end" data-reveal>
              <p className="lead text-ink/70 md:col-span-5">{lead}</p>
              <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
                <TalkButton label="Get in touch" />
                <Link href="/services" className="btn-outline">
                  Our services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
