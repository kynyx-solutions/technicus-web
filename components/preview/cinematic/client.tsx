"use client";

import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import s from "./styles";
import { clamp, motionOn, onScrollFrame, pinProgress } from "./scroll";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/work", label: "Work" },
  { href: "/insights", label: "Insights" },
  { href: "/careers", label: "Careers" },
  { href: "/about", label: "About" },
];

/** Page-wide effects: entry reveals, card spotlights, dark overscroll. */
export function CinematicMotion() {
  useEffect(() => {
    (window as Window & { __motionReady?: boolean }).__motionReady = true;
    const html = document.documentElement;
    const prevBg = html.style.background;
    html.style.background = "#0a0a0c";

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    document.querySelectorAll("[data-cine]").forEach((el) => io.observe(el));

    // Pointer-tracked light on cards.
    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest<HTMLElement>("[data-spot]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io.disconnect();
      document.removeEventListener("pointermove", onMove);
      html.style.background = prevBg;
    };
  }, []);
  return null;
}

export function CinematicHeader({ wordmark }: { wordmark: string }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    return onScrollFrame(() => {
      const el = ref.current;
      if (!el) return;
      const y = window.scrollY;
      el.dataset.solid = String(y > 40);
      if (Math.abs(y - lastY) > 6) {
        el.dataset.hidden = String(y > lastY && y > 600);
        lastY = y;
      }
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header ref={ref} className={s.header} data-solid={open ? "true" : undefined}>
        <div className={`${s.shell} flex h-[72px] items-center justify-between gap-6`}>
          <Link href="/preview/cinematic" className={s.wordmark} aria-label={`${wordmark} home`}>
            {wordmark}
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-8 text-[0.92rem] lg:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={s.navLink}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/contact" className={`${s.btn} hidden sm:inline-flex`}>
              Contact us <ArrowRight size={16} aria-hidden />
            </Link>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full border border-white/20 lg:hidden"
              aria-expanded={open}
              aria-controls="cine-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
            </button>
          </div>
        </div>
      </header>
      {open && (
        <div id="cine-menu" className={s.menu}>
          <nav aria-label="Mobile" className="flex flex-col">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
                {n.label}
              </Link>
            ))}
          </nav>
          <Link href="/contact" className={`${s.btn} ${s.btnAccent} mt-auto self-start`}>
            Contact us <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      )}
    </>
  );
}

/** Writes pinned-scroll progress (0..1) to a CSS variable on the section. */
function usePinVar(name: string, extra?: (p: number, el: HTMLElement) => void) {
  const ref = useRef<HTMLElement>(null);
  const extraRef = useRef(extra);
  useEffect(() => {
    extraRef.current = extra;
  });
  useEffect(() => {
    if (!motionOn()) return;
    return onScrollFrame(() => {
      const el = ref.current;
      if (!el) return;
      const p = pinProgress(el);
      el.style.setProperty(name, p.toFixed(4));
      extraRef.current?.(p, el);
    });
  }, [name]);
  return ref;
}

export function Statement({ children, className }: { children: ReactNode; className?: string }) {
  const ref = usePinVar("--p");
  return (
    <section ref={ref} className={`${s.statement} ${className ?? ""}`} aria-label="Our view">
      {children}
    </section>
  );
}

type Practice = { slug: string; name: string; summary: string; capabilities: { slug: string; name: string }[] };

/** Practices: on large screens the stage is pinned and each practice takes it in turn. */
export function PracticeStage({ practices, intro }: { practices: Practice[]; intro: ReactNode }) {
  const count = practices.length;
  const [active, setActive] = useState(0);
  const ref = usePinVar("--sp", (p, el) => {
    const seg = clamp(p * count, 0, count - 0.0001);
    const i = Math.floor(seg);
    setActive((a) => (a === i ? a : i));
    el.style.setProperty("--fill", (seg - i).toFixed(3));
  });
  return (
    <section ref={ref} className={s.practices} style={{ ["--count" as string]: count }} aria-labelledby="practices-title">
      <div className={`${s.shell} ${s.pStage} relative py-24 lg:py-0`}>
        <Orbit />
        <div className="relative">
          {intro}
          <ul className={`${s.pList} mt-12`}>
            {practices.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/services/${p.slug}`}
                  className={s.pItem}
                  data-active={i === active}
                  style={i === active ? undefined : { ["--fill" as string]: i < active ? 1 : 0 }}
                >
                  <span className={s.pBar} aria-hidden />
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={`${s.panels} relative mt-12 lg:mt-0`}>
          {practices.map((p, i) => (
            <article key={p.slug} className={s.panel} data-state={i === active ? "active" : i < active ? "past" : "next"}>
              <h3 className={`${s.display} ${s.panelName}`}>
                <span className={s.line}>
                  <span className={s.lineInner}>{p.name}</span>
                </span>
              </h3>
              <p className={`${s.panelFade} mt-6 max-w-[34ch] text-xl leading-snug text-white/70 md:text-2xl`} style={{ ["--d" as string]: 0 }}>
                {p.summary}
              </p>
              <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
                {p.capabilities.slice(0, 8).map((c, k) => (
                  <li key={c.slug} className={s.panelFade} style={{ ["--d" as string]: k + 1 }}>
                    <Link href={`/services/${p.slug}/${c.slug}`} className={s.capLink}>
                      {c.name}
                      <ArrowRight size={16} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className={`${s.panelFade} mt-8`} style={{ ["--d" as string]: 9 }}>
                <Link href={`/services/${p.slug}`} className={s.btn}>
                  Explore {p.name} <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Decorative rings that turn as the practices go by. */
function Orbit() {
  return (
    <svg className={s.orbit} viewBox="0 0 400 400" aria-hidden>
      <circle cx="200" cy="200" r="199" fill="none" stroke="rgba(243,241,236,0.08)" />
      <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(243,241,236,0.06)" strokeDasharray="2 6" />
      <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(243,241,236,0.05)" />
      <circle cx="200" cy="1" r="3" fill="#ff8a3d" />
      <circle cx="200" cy="1" r="12" fill="#ff8a3d" opacity="0.15" />
      <circle cx="350" cy="200" r="2" fill="rgba(243,241,236,0.6)" />
    </svg>
  );
}

/** Case studies: vertical scroll drives the track sideways while the stage is pinned. */
export function WorkRail({ count, head, children }: { count: number; head: ReactNode; children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = section.current;
    const tr = track.current;
    if (!sec || !tr || !motionOn()) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    let max = 0;
    let target = 0;
    let current = 0;
    let raf = 0;

    const measure = () => {
      if (!mq.matches) {
        sec.style.height = "";
        tr.style.transform = "";
        max = 0;
        return;
      }
      max = Math.max(0, tr.scrollWidth - window.innerWidth);
      sec.style.height = `${max + window.innerHeight}px`;
    };
    const step = () => {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.3) current = target;
      tr.style.transform = `translate3d(${-current}px,0,0)`;
      raf = current === target ? 0 : requestAnimationFrame(step);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(tr);
    mq.addEventListener("change", measure);
    const stop = onScrollFrame(() => {
      if (!max) return;
      const p = pinProgress(sec);
      sec.style.setProperty("--wp", p.toFixed(4));
      target = p * max;
      if (!raf) raf = requestAnimationFrame(step);
    });
    return () => {
      stop();
      ro.disconnect();
      mq.removeEventListener("change", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={section} id="work" className={s.work} style={{ ["--count" as string]: count }} aria-labelledby="work-title">
      <div className={s.workStage}>
        {head}
        <div ref={track} className={s.track}>
          {children}
        </div>
      </div>
    </section>
  );
}

/** Closing call: the horizon glow rises as the section comes into view. */
export function ClosingCall({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!motionOn()) return;
    return onScrollFrame(() => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = clamp((window.innerHeight - r.top) / (window.innerHeight * 0.95));
      el.style.setProperty("--cp", p.toFixed(4));
    });
  }, []);
  return (
    <section ref={ref} className={s.cta} aria-labelledby="cta-title">
      <div className={s.horizon} aria-hidden />
      {children}
    </section>
  );
}
