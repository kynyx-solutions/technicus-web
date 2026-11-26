import { BrainCircuit, CloudCog, Code2, Compass, LifeBuoy, PenTool, TrendingUp, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Art, PILLAR_ART, type ArtKind } from "@/components/art";
import type { Faq, Step } from "@/content/copy/types";

/* ---------- Small pieces ---------- */

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`h-[1em] w-[1em] ${className}`} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** "Learn more" with an arrow that moves on hover. */
export function MoreLink({ label = "Learn more", className = "" }: { label?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[0.92rem] font-semibold text-blue ${className}`}>
      {label}
      <Arrow className="transition-transform duration-200 group-hover:translate-x-1" />
    </span>
  );
}

/** A small square arrow button, used beside list items. */
export function ArrowCircle({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors duration-200 ${
        tone === "dark" ? "bg-sky text-blue group-hover:bg-blue group-hover:text-white" : "bg-white/10 text-white group-hover:bg-white group-hover:text-navy"
      } ${className}`}
    >
      <Arrow />
    </span>
  );
}

export function TalkButton({ tone = "dark", label = "Talk to us" }: { tone?: "dark" | "light"; label?: string }) {
  return (
    <Link href="/contact" className={tone === "dark" ? "btn-dark" : "btn-light"}>
      {label}
    </Link>
  );
}

/** A note for the team, shown only while developing. Never in a production build. */
export function DevNote({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <p className="my-8 rounded-md border border-dashed border-blue/50 bg-sky px-4 py-3 font-mono text-xs leading-relaxed text-ink">
      Needs content: {children}
    </p>
  );
}

export type Crumb = { href: string; name: string };

function Breadcrumbs({ crumbs, dark }: { crumbs: Crumb[]; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`mb-6 text-[0.85rem] ${dark ? "text-white/60" : "text-muted"}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex items-center gap-2">
            <span aria-hidden>›</span>
            {i === crumbs.length - 1 ? (
              <span aria-current="page" className={dark ? "text-white" : "text-ink"}>
                {c.name}
              </span>
            ) : (
              <Link href={c.href} className="hover:underline">
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
  dark: "bg-navy text-white",
  grey: "bg-mist text-ink",
};

/**
 * The top of every page: breadcrumbs, a small blue label, the heading, a lead
 * and buttons on the left; a picture or panel on the right when there is one.
 */
export function Hero({
  eyebrow,
  title,
  lead,
  crumbs,
  actions,
  tone = "light",
  art,
  media,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  /** "Talk to us" and "See our work" buttons. */
  actions?: boolean;
  tone?: "light" | "dark";
  /** Kept for older call sites; text is always left-aligned. */
  align?: "center" | "left";
  /** A system diagram on the right, when there is no media. */
  art?: ArtKind;
  /** A picture or panel on the right. */
  media?: ReactNode;
  children?: ReactNode;
}) {
  const dark = tone === "dark";
  const side = media ?? (art ? <Art kind={art} tone={dark ? "dark" : "light"} className="h-full max-h-[380px] w-full" /> : null);
  return (
    <section data-tone={tone} className={`relative overflow-hidden ${dark ? "bg-navy text-white" : "bg-white text-ink"}`}>
      <div className={`pointer-events-none absolute inset-0 ${dark ? "grid-pattern-dark" : "grid-pattern"} [mask-image:linear-gradient(to_bottom,black,transparent)]`} />
      {dark && <div className="pointer-events-none absolute -top-40 right-0 h-[28rem] w-[28rem] rounded-full bg-blue/25 blur-3xl" />}
      <div className={`shell relative grid items-center gap-12 py-14 md:py-20 ${side ? "lg:grid-cols-12" : ""}`}>
        <div className={side ? "lg:col-span-7" : "max-w-4xl"}>
          {crumbs && <Breadcrumbs crumbs={crumbs} dark={dark} />}
          {eyebrow && <p className={`label mb-4 ${dark ? "text-[#8fb2ff]" : "text-blue"}`}>{eyebrow}</p>}
          <h1 className="display max-w-[22ch]">{title}</h1>
          {lead && <p className={`lead mt-6 max-w-[42rem] ${dark ? "text-white/80" : "text-muted"}`}>{lead}</p>}
          {actions && (
            <div className="mt-9 flex flex-wrap gap-3">
              <TalkButton tone={dark ? "light" : "dark"} />
              <Link href="/work" className={dark ? "btn-outline-light" : "btn-outline"}>
                See our work
              </Link>
            </div>
          )}
          {children}
        </div>
        {side && <div className="lg:col-span-5">{side}</div>}
      </div>
    </section>
  );
}

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
  /** A button beside the title, such as "All work". */
  action?: ReactNode;
  children?: ReactNode;
  tone?: Tone;
  /** Kept for older call sites. */
  wide?: boolean;
  center?: boolean;
  /** A small blue label above the title. */
  eyebrow?: string;
}) {
  const dark = tone === "dark";
  return (
    <section id={id} data-tone={dark ? "dark" : "light"} className={`relative ${toneClass[tone]} py-16 md:py-20 lg:py-24`}>
      <div className="inner">
        {(title || lead) && (
          <header className={`mb-10 md:mb-12 ${center ? "mx-auto max-w-3xl text-center" : "flex flex-wrap items-end justify-between gap-x-10 gap-y-6"}`}>
            <div className={center ? "" : "max-w-3xl"}>
              {eyebrow && <p className={`label mb-3 ${dark ? "text-[#8fb2ff]" : "text-blue"}`}>{eyebrow}</p>}
              {title && <h2 className="h2">{title}</h2>}
              {lead && <p className={`lead mt-4 ${dark ? "text-white/75" : "text-muted"} ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{lead}</p>}
            </div>
            {action && <div>{action}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

/** A small label on the left and a large paragraph on the right. */
export function Intro({ label, text, children }: { label: string; text: string; children?: ReactNode }) {
  return (
    <div className="grid gap-5 md:grid-cols-12 md:gap-10">
      <p className="label pt-1.5 text-blue md:col-span-4" data-reveal>
        {label}
      </p>
      <div className="md:col-span-8">
        <p className="font-heading text-[1.35rem] leading-[1.4] font-medium tracking-[-0.01em] md:text-[1.6rem]" data-reveal>
          {text}
        </p>
        {children}
      </div>
    </div>
  );
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-5 text-[1.05rem] leading-relaxed text-muted md:text-lg">
      {paragraphs.map((p) => (
        <p key={p} data-reveal>
          {p}
        </p>
      ))}
    </div>
  );
}

/* ---------- Services as a grid of cards ---------- */

export type StackItem = {
  href: string;
  title: string;
  text: string;
  /** Position in content/services.ts, which picks the icon. */
  index: number;
  links?: { href: string; name: string }[];
};

const PILLAR_ICONS: LucideIcon[] = [Compass, PenTool, Code2, BrainCircuit, CloudCog, TrendingUp, LifeBuoy];

/** The service areas as cards, with a closing card that invites a conversation. */
export function ServiceStack({ items }: { items: StackItem[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = PILLAR_ICONS[item.index % PILLAR_ICONS.length];
        return (
          <li key={item.href} data-reveal>
            <div className="group relative flex h-full flex-col rounded-xl border border-line bg-white p-6 transition-[border-color,box-shadow] duration-200 hover:border-blue/40 hover:shadow-[0_12px_32px_-16px_rgba(26,86,219,0.35)]">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky text-blue">
                <Icon size={22} strokeWidth={1.8} aria-hidden />
              </span>
              <h3 className="h3 mt-5 text-ink">
                <Link href={item.href} className="after:absolute after:inset-0 hover:text-blue">
                  {item.title}
                </Link>
              </h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{item.text}</p>
              {item.links && (
                <ul className="relative z-10 mt-4 space-y-1.5 border-t border-line pt-4 text-[0.88rem]">
                  {item.links.slice(0, 4).map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-ink/80 hover:text-blue">
                        {l.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <MoreLink label="Explore" className="mt-auto pt-5" />
            </div>
          </li>
        );
      })}
      <li data-reveal>
        <div className="grid-pattern-dark flex h-full flex-col justify-between rounded-xl bg-navy p-6 text-white">
          <div>
            <h3 className="h3">Not sure where to start?</h3>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-white/75">Tell us the problem. We will tell you plainly which mix of services fits, and what it would take.</p>
          </div>
          <Link href="/contact" className="btn-light mt-6 self-start">
            Talk to us
          </Link>
        </div>
      </li>
    </ul>
  );
}

/* ---------- Lists ---------- */

export type RowItem = { href: string; title: string; text?: string; meta?: string; links?: { href: string; name: string }[] };

/** Rows separated by lines, each a link. */
export function Rows({ items }: { items: RowItem[] }) {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
      {items.map((item) => (
        <li key={item.href} data-reveal>
          <Link href={item.href} className="group grid gap-3 p-6 transition-colors hover:bg-mist md:grid-cols-12 md:gap-8 md:p-7">
            <div className="md:col-span-4">
              <span className="h3 block text-ink group-hover:text-blue">{item.title}</span>
              {item.meta && <span className="label mt-2 block text-muted">{item.meta}</span>}
            </div>
            <div className="flex items-start justify-between gap-6 md:col-span-8">
              {item.text && <span className="text-muted">{item.text}</span>}
              <ArrowCircle className="hidden md:inline-flex" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export type CardItem = { href: string; title: string; text?: string; meta?: string; image?: string };

/** White cards with a border, each a link. */
export function Cards({ items, columns = 3 }: { items: CardItem[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <ul className={`grid gap-5 ${cols}`}>
      {items.map((item) => (
        <li key={item.href} data-reveal>
          <Link
            href={item.href}
            className="group flex h-full flex-col rounded-xl border border-line bg-white p-6 text-ink transition-[border-color,box-shadow] duration-200 hover:border-blue/40 hover:shadow-[0_12px_32px_-16px_rgba(26,86,219,0.35)] md:p-7"
          >
            {item.meta && <span className="label mb-3 text-blue">{item.meta}</span>}
            <span className="h3 block group-hover:text-blue">{item.title}</span>
            {item.text && <span className="mt-3 block text-[0.95rem] leading-relaxed text-muted">{item.text}</span>}
            <MoreLink className="mt-auto pt-6" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Article cards: a picture with the title below. */
export function PostCards({ items }: { items: CardItem[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.href} data-reveal>
          <Link href={item.href} className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white text-ink transition-shadow duration-200 hover:shadow-[0_12px_32px_-16px_rgba(26,86,219,0.35)]">
            <span className="relative block aspect-[16/9] overflow-hidden bg-sky">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              ) : (
                <Art kind={PILLAR_ART[(i + 2) % PILLAR_ART.length]} tone="light" className="absolute inset-0 h-full w-full p-4" />
              )}
            </span>
            <span className="flex flex-1 flex-col p-6">
              {item.meta && <span className="label text-blue">{item.meta}</span>}
              <span className="h3 mt-2 block group-hover:text-blue">{item.title}</span>
              <MoreLink label="Read" className="mt-auto pt-5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export type WorkItem = { href: string; client: string; summary: string; meta: string };

/** Case studies as cards in a grid. */
export function WorkGrid({ items }: { items: WorkItem[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.href} data-reveal>
          <Link href={item.href} className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white text-ink transition-shadow duration-200 hover:shadow-[0_12px_32px_-16px_rgba(26,86,219,0.35)]">
            <span className="grid-pattern-dark relative flex aspect-[16/10] items-end overflow-hidden bg-navy p-6">
              <Art kind={PILLAR_ART[(i + 1) % PILLAR_ART.length]} tone="dark" className="absolute inset-0 h-full w-full p-6 opacity-70 transition-transform duration-500 group-hover:scale-[1.03]" />
              <span className="relative font-heading text-[1.6rem] leading-none font-bold tracking-[-0.02em] text-white">{item.client}</span>
            </span>
            <span className="flex flex-1 flex-col p-6">
              <span className="label text-blue">{item.meta}</span>
              <span className="mt-2 block text-[1.02rem] leading-snug">{item.summary}</span>
              <MoreLink label="View case study" className="mt-auto pt-5" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Stages or principles as cards with a blue rule on top. No numbers. */
export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ul className={`grid gap-5 md:grid-cols-2 ${steps.length % 4 === 0 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {steps.map((step) => (
        <li key={step.title} data-reveal className="flex flex-col rounded-xl border border-line bg-white p-6 text-ink">
          <span aria-hidden className="mb-5 block h-1 w-10 rounded-full bg-blue" />
          <h3 className="h3">{step.title}</h3>
          <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{step.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function Features({ items, columns = 2 }: { items: Step[]; columns?: 2 | 4 }) {
  return (
    <ul className={`grid gap-x-10 gap-y-8 ${columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2"}`}>
      {items.map((item) => (
        <li key={item.title} data-reveal className="border-l-2 border-blue pl-5">
          <h3 className="h3">{item.title}</h3>
          <p className="mt-2 opacity-75">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function Faqs({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white text-ink">
      {faqs.map((faq) => (
        <details key={faq.q} className="group" data-reveal>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 font-heading text-[1.05rem] font-semibold md:text-[1.12rem] [&::-webkit-details-marker]:hidden">
            {faq.q}
            <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-sky text-blue transition-transform duration-200 group-open:rotate-45">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <p className="max-w-3xl px-6 pb-6 leading-relaxed text-muted">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li key={item} data-reveal className="rounded-md border border-current/15 bg-current/[0.03] px-3.5 py-2 text-[0.92rem]">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} data-reveal className="flex gap-3 text-[1.02rem]">
          <svg aria-hidden viewBox="0 0 24 24" className="mt-1 h-5 w-5 shrink-0 text-blue" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="m5 12 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Stats({ items }: { items: { value: number; suffix?: string; label: string }[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="grid divide-y divide-line overflow-hidden rounded-xl border border-line bg-white text-ink sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
      {items.map((s) => (
        <li key={s.label} data-reveal className="p-7">
          <p className="font-heading text-[2.8rem] leading-none font-bold tracking-[-0.03em] text-blue">
            <span data-count={s.value}>{s.value}</span>
            {s.suffix}
          </p>
          <p className="mt-3 text-[0.95rem] text-muted">{s.label}</p>
        </li>
      ))}
    </ul>
  );
}

/** The navy band that closes every page except Contact. */
export function ClosingCall({
  line = "Have something to build or rethink?",
  lead = "Tell us where things stand today, what you are trying to achieve and what is getting in the way.",
}: {
  line?: string;
  lead?: string;
}) {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="inner">
        <div className="grid-pattern-dark relative grid gap-8 overflow-hidden rounded-2xl bg-navy p-8 text-white md:p-14 lg:grid-cols-12 lg:items-center">
          <div className="pointer-events-none absolute -right-20 -bottom-24 h-80 w-80 rounded-full bg-blue/30 blur-3xl" />
          <div className="relative lg:col-span-8">
            <h2 className="h2">{line}</h2>
            <p className="lead mt-4 max-w-2xl text-white/75">{lead}</p>
          </div>
          <div className="relative flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
            <TalkButton tone="light" label="Get in touch" />
            <Link href="/services" className="btn-outline-light">
              Our services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
