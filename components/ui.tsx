import Link from "next/link";
import type { ReactNode } from "react";
import { Art, PILLAR_ART, type ArtKind } from "@/components/art";
import type { Faq, Step } from "@/content/copy/types";

/* ---------- Small pieces ---------- */

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`h-[1em] w-[1em] ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** The small round arrow button used beside "Explore" and on cards. */
export function ArrowCircle({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm transition-transform duration-300 group-hover:scale-110 ${
        tone === "dark" ? "bg-black text-white" : "bg-white text-black"
      } ${className}`}
    >
      <Arrow />
    </span>
  );
}

export function TalkButton({ tone = "dark", label = "Talk to us" }: { tone?: "dark" | "light"; label?: string }) {
  return (
    <Link href="/contact" data-magnetic className={tone === "dark" ? "btn-dark" : "btn-light"}>
      {label}
    </Link>
  );
}

/** A note for the team, shown only while developing. Never in a production build. */
export function DevNote({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <p className="my-8 rounded-xl border border-dashed border-indigo/50 bg-lavender px-4 py-3 font-mono text-xs leading-relaxed text-black">
      Needs content: {children}
    </p>
  );
}

export type Crumb = { href: string; name: string };

function Breadcrumbs({ crumbs, center }: { crumbs: Crumb[]; center?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-[0.95rem] opacity-60" data-reveal>
      <ol className={`flex flex-wrap gap-x-2 gap-y-1 ${center ? "justify-center" : ""}`}>
        <li>
          <Link href="/" className="sweep">
            Home
          </Link>
        </li>
        {crumbs.map((c, i) => (
          <li key={c.href} className="flex gap-2">
            <span aria-hidden>/</span>
            {i === crumbs.length - 1 ? (
              <span aria-current="page">{c.name}</span>
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
  light: "bg-white text-black",
  dark: "bg-black text-white",
  grey: "bg-fog text-black",
};

export function Hero({
  eyebrow,
  title,
  lead,
  crumbs,
  actions,
  tone = "light",
  align = "center",
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
  align?: "center" | "left";
  /** Layered shapes in the bottom corners, on dark heroes. */
  art?: ArtKind;
  /** A large rounded block under the text: a 3D panel or an image. */
  media?: ReactNode;
  children?: ReactNode;
}) {
  const center = align === "center";
  const dark = tone === "dark";
  return (
    <section data-tone={tone} className={`relative overflow-hidden ${toneClass[tone]} pt-36 md:pt-44 ${media ? "pb-20 md:pb-28" : "pb-24 md:pb-32"}`}>
      {art && (
        <>
          <Art kind={art} className="pointer-events-none absolute -bottom-2 -left-24 h-48 w-auto opacity-90 md:h-72" />
          <Art kind={art} className="pointer-events-none absolute -right-24 -bottom-2 h-48 w-auto opacity-90 md:h-72" />
        </>
      )}
      <div className={`relative ${center ? "inner text-center" : "shell"}`}>
        {crumbs && <Breadcrumbs crumbs={crumbs} center={center} />}
        {eyebrow && (
          <p className="mb-6 text-lg" data-reveal>
            {eyebrow}
          </p>
        )}
        <h1 className={`display ${center ? "mx-auto max-w-[21ch]" : "max-w-[15ch]"}`} data-split>
          {title}
        </h1>
        {lead && (
          <p className={`lead mt-8 max-w-[44rem] ${center ? "mx-auto" : ""} ${dark ? "text-white/85" : ""}`} data-reveal>
            {lead}
          </p>
        )}
        {actions && (
          <div className={`mt-10 flex flex-wrap gap-3 ${center ? "justify-center" : ""}`} data-reveal>
            <TalkButton tone={dark ? "light" : "dark"} />
            <Link href="/work" className={dark ? "btn-outline-light" : "btn-outline"} data-magnetic>
              See our work
            </Link>
          </div>
        )}
        {children}
      </div>
      {media && (
        <div className="shell mt-16 md:mt-20" data-reveal>
          {media}
        </div>
      )}
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
  wide,
  center,
}: {
  id?: string;
  title?: string;
  lead?: string;
  /** A button beside the title, such as "All work". */
  action?: ReactNode;
  children?: ReactNode;
  tone?: Tone;
  wide?: boolean;
  center?: boolean;
}) {
  return (
    <section id={id} data-tone={tone === "dark" ? "dark" : "light"} className={`panel ${toneClass[tone]} pt-14 pb-20 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32`}>
      <div className={wide ? "shell" : "inner"}>
        {(title || lead) && (
          <header
            className={`mb-10 md:mb-12 ${center ? "mx-auto max-w-3xl text-center" : "flex flex-wrap items-end justify-between gap-x-10 gap-y-6"}`}
          >
            <div className={center ? "" : "max-w-3xl"}>
              {title && (
                <h2 className="h2" data-split>
                  {title}
                </h2>
              )}
              {lead && (
                <p className={`lead mt-6 opacity-75 ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`} data-reveal>
                  {lead}
                </p>
              )}
            </div>
            {action && <div data-reveal>{action}</div>}
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
    <div className="grid gap-6 md:grid-cols-12 md:gap-10">
      <p className="label md:col-span-3 md:pt-2.5" data-reveal>
        {label}
      </p>
      <div className="md:col-span-9">
        <p className="text-[1.45rem] leading-[1.3] tracking-[-0.005em] md:text-[1.85rem]" data-reveal>
          {text}
        </p>
        {children}
      </div>
    </div>
  );
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-6 text-lg leading-relaxed md:text-xl md:leading-relaxed">
      {paragraphs.map((p) => (
        <p key={p} data-reveal>
          {p}
        </p>
      ))}
    </div>
  );
}

/* ---------- Service cards that stack while scrolling ---------- */

export type StackItem = {
  href: string;
  title: string;
  text: string;
  /** Position in content/services.ts, which picks the shape. */
  index: number;
  links?: { href: string; name: string }[];
};

const STACK_TONES = ["bg-coal text-white", "bg-black text-white", "bg-[#141414] text-white", "bg-smoke text-black", "bg-black text-white"];

export function ServiceStack({ items }: { items: StackItem[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => {
        const tone = STACK_TONES[i % STACK_TONES.length];
        const light = tone.includes("bg-smoke");
        return (
          <li
            key={item.href}
            data-stack-card
            className={`sticky origin-top overflow-hidden rounded-[22px] md:rounded-[26px] ${tone}`}
            style={{ top: `calc(104px + ${i * 10}px)` }}
          >
            <Link href={item.href} className="group relative grid min-h-[22rem] md:grid-cols-12 md:min-h-[21rem]">
              <div className="relative z-10 flex flex-col p-7 md:col-span-7 md:p-12 lg:p-14">
                <h3 className="h3 pr-12">{item.title}</h3>
                <p className={`mt-5 max-w-[30rem] text-[1.05rem] leading-relaxed ${light ? "text-black/70" : "text-white/80"}`}>{item.text}</p>
                {item.links && (
                  <p className={`mt-4 max-w-[30rem] text-[0.95rem] ${light ? "text-black/55" : "text-white/55"}`}>
                    {item.links.map((l) => l.name).join(" · ")}
                  </p>
                )}
                <span className="mt-auto inline-flex items-center gap-4 pt-8 text-[1.05rem]">
                  Explore
                  <ArrowCircle tone={light ? "dark" : "light"} />
                </span>
              </div>
              <Art
                kind={PILLAR_ART[item.index % PILLAR_ART.length]}
                tone={light ? "light" : "dark"}
                className="pointer-events-none absolute right-0 bottom-0 h-40 w-auto opacity-60 transition-transform duration-700 ease-out group-hover:scale-105 md:h-full md:max-h-[19rem] md:opacity-100"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- Lists ---------- */

export type RowItem = { href: string; title: string; text?: string; meta?: string; links?: { href: string; name: string }[] };

/** Rows separated by lines, each a link. */
export function Rows({ items }: { items: RowItem[] }) {
  return (
    <ul className="border-t border-current/15">
      {items.map((item) => (
        <li key={item.href} className="border-b border-current/15" data-reveal>
          <Link href={item.href} className="group grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10">
            <div className="md:col-span-6">
              <span className="h3 block transition-opacity duration-300 group-hover:opacity-60">{item.title}</span>
              {item.meta && <span className="label mt-3 block opacity-50">{item.meta}</span>}
            </div>
            <div className="flex items-start justify-between gap-6 md:col-span-6">
              {item.text && <span className="opacity-70">{item.text}</span>}
              <ArrowCircle className="hidden md:inline-flex" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export type CardItem = { href: string; title: string; text?: string; meta?: string; image?: string };

const PASTELS = ["bg-mint", "bg-lavender"];

/** Soft coloured cards, each a link. */
export function Cards({ items, columns = 3 }: { items: CardItem[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  return (
    <ul className={`grid gap-3 md:gap-4 ${cols}`}>
      {items.map((item, i) => (
        <li key={item.href} data-reveal>
          <Link
            href={item.href}
            className={`group flex h-full min-h-56 flex-col rounded-[20px] p-7 text-black transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 md:p-8 ${PASTELS[i % PASTELS.length]}`}
          >
            {item.meta && <span className="label opacity-60">{item.meta}</span>}
            <span className="mt-auto block pt-10 text-[1.45rem] leading-[1.15] font-medium tracking-[-0.01em]">{item.title}</span>
            {item.text && <span className="mt-3 block text-[0.98rem] leading-relaxed text-black/65">{item.text}</span>}
            <ArrowCircle className="mt-6" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Article cards: a coloured picture with the title below. */
export function PostCards({ items }: { items: CardItem[] }) {
  const kinds: ArtKind[] = ["hexagon", "arch", "triangle", "rings", "steps", "rounded"];
  const backgrounds = ["bg-lavender", "bg-mint", "bg-[#e6e9fb]"];
  return (
    <ul className="grid gap-x-4 gap-y-10 md:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.href} data-reveal>
          <Link href={item.href} className="group block">
            <span className={`relative block aspect-[4/3] overflow-hidden rounded-[20px] ${backgrounds[i % backgrounds.length]}`}>
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              ) : (
                <Art
                  kind={kinds[i % kinds.length]}
                  tone="light"
                  className="absolute inset-x-0 bottom-0 mx-auto h-[78%] w-auto transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
            </span>
            {item.meta && <span className="label mt-5 block opacity-55">{item.meta}</span>}
            <span className="mt-2 block text-[1.3rem] leading-snug font-medium tracking-[-0.01em] transition-opacity group-hover:opacity-70">
              {item.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export type WorkItem = { href: string; client: string; summary: string; meta: string };

/** Case studies in two columns, the second set lower, as in a gallery. */
export function WorkGrid({ items }: { items: WorkItem[] }) {
  const backgrounds = ["bg-[#e8e6f7]", "bg-mint", "bg-smoke", "bg-lavender"];
  const kinds: ArtKind[] = ["triangle", "arch", "hexagon", "rounded", "steps", "rings"];
  return (
    <ul className="grid gap-x-10 gap-y-14 md:grid-cols-2 md:gap-x-16 md:gap-y-24 md:pb-32 md:[&>li:nth-child(even)]:translate-y-32">
      {items.map((item, i) => (
        <li key={item.href} data-reveal>
          <Link href={item.href} data-cursor="View" className="group block">
            <span className={`relative flex aspect-[4/4.4] items-start overflow-hidden rounded-[20px] p-7 md:p-9 ${backgrounds[i % backgrounds.length]}`}>
              <Art
                kind={kinds[i % kinds.length]}
                tone="light"
                className="absolute inset-x-0 bottom-0 mx-auto h-[62%] w-auto transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="relative text-[clamp(1.8rem,3.4vw,2.6rem)] leading-none font-[560] tracking-[-0.025em] text-black">
                {item.client}
              </span>
            </span>
            <span className="mt-6 block text-lg leading-snug md:text-[1.2rem]">{item.summary}</span>
            <span className="label mt-2 block opacity-50">{item.meta}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Soft coloured blocks: steps, values, numbers. */
export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-3 md:grid-cols-2 md:gap-4">
      {steps.map((step, i) => (
        <li key={step.title} data-reveal className={`flex min-h-64 flex-col rounded-[20px] p-7 text-black md:p-9 ${PASTELS[(i + Math.floor(i / 2)) % 2]}`}>
          <h3 className="mt-auto pt-10 text-[1.55rem] leading-tight font-medium tracking-[-0.01em]">{step.title}</h3>
          <p className="mt-3 text-[1rem] leading-relaxed text-black/65">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function Features({ items, columns = 2 }: { items: Step[]; columns?: 2 | 4 }) {
  return (
    <ul className={`grid gap-x-10 gap-y-12 ${columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2"}`}>
      {items.map((item) => (
        <li key={item.title} data-reveal className="border-t border-current/15 pt-6">
          <h3 className="text-[1.3rem] leading-snug font-medium tracking-[-0.01em]">{item.title}</h3>
          <p className="mt-3 opacity-70">{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function Faqs({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="border-t border-current/15">
      {faqs.map((faq) => (
        <details key={faq.q} className="group border-b border-current/15" data-reveal>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 text-lg md:text-[1.3rem] [&::-webkit-details-marker]:hidden">
            {faq.q}
            <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6 shrink-0 transition-transform duration-300 group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 4v16M4 12h16" />
            </svg>
          </summary>
          <p className="max-w-3xl pb-8 text-[1.05rem] leading-relaxed opacity-70">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2.5">
      {items.map((item) => (
        <li key={item} data-reveal className="rounded-full border border-current/25 px-5 py-2.5 text-[1.05rem]">
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
        <li key={item} data-reveal className="flex gap-4 border-b border-current/15 py-5 text-lg">
          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Stats({ items }: { items: { value: number; suffix?: string; label: string }[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s, i) => (
        <li key={s.label} data-reveal className={`rounded-[20px] p-8 text-black ${PASTELS[i % 2]}`}>
          <p className="text-[4rem] leading-none font-normal tracking-[-0.03em]">
            <span data-count={s.value}>{s.value}</span>
            {s.suffix}
          </p>
          <p className="label mt-4">{s.label}</p>
        </li>
      ))}
    </ul>
  );
}

/** The dark band that closes every page except Contact. */
export function ClosingCall({
  line = "Have something to build or rethink?",
  lead = "Tell us where things stand today, what you are trying to achieve and what is getting in the way.",
}: {
  line?: string;
  lead?: string;
}) {
  return (
    <section data-tone="dark" className="panel overflow-hidden bg-black pt-20 pb-28 text-white md:pt-28 md:pb-40">
      <Art kind="triangle" className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-[85%] w-auto max-w-none opacity-80" />
      <div className="inner relative text-center">
        <h2 className="display mx-auto max-w-[16ch]" data-split>
          {line}
        </h2>
        <p className="lead mx-auto mt-8 max-w-[34rem] text-white/80" data-reveal>
          {lead}
        </p>
        <div className="mt-10" data-reveal>
          <TalkButton tone="light" label="Get in touch" />
        </div>
      </div>
    </section>
  );
}
