"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Plus, X } from "lucide-react";
import { s } from "./styles";

type Practice = { slug: string; name: string; summary: string; capabilities: { slug: string; name: string }[] };

const EASE = "transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)";

/** Transform that maps a full-viewport layer onto a rectangle. */
function toRect(r: DOMRect) {
  const sx = r.width / window.innerWidth;
  const sy = r.height / window.innerHeight;
  return `translate3d(${r.left}px, ${r.top}px, 0) scale(${sx}, ${sy})`;
}

/** Stops the page scrolling behind the sheet without a layout jump. */
function lockScroll(on: boolean) {
  const html = document.documentElement;
  const sw = window.innerWidth - html.clientWidth;
  html.style.overflow = on ? "hidden" : "";
  document.body.style.paddingRight = on && sw ? `${sw}px` : "";
}

/*
  Practice cards. Clicking one grows a lime layer from the card's rectangle to
  the whole viewport (a FLIP transform, interruptible because it is a CSS
  transition on transform), then the practice rises in. Escape or Close
  reverses it into the card and returns focus there.
*/
export function PracticeGrid({ items }: { items: Practice[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const bg = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const openRef = useRef(false);
  const startRect = useRef<DOMRect | null>(null);
  const reduced = useRef(false);

  const finish = useCallback(() => {
    if (openRef.current) return;
    const i = active;
    setActive(null);
    lockScroll(false);
    if (i !== null) cards.current[i]?.focus({ preventScroll: true });
  }, [active]);

  const show = (i: number) => {
    const card = cards.current[i];
    if (!card) return;
    reduced.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    startRect.current = card.getBoundingClientRect();
    lockScroll(true);
    openRef.current = true;
    setActive(i);
  };

  const hide = useCallback(() => {
    if (active === null) return;
    openRef.current = false;
    setOpen(false);
    const card = cards.current[active];
    const layer = bg.current;
    if (!layer || !card || reduced.current) return finish();
    layer.style.transition = EASE + " 0.12s";
    layer.style.transform = toRect(card.getBoundingClientRect());
  }, [active, finish]);

  // A new sheet starts on top of its card, then grows to the viewport.
  useLayoutEffect(() => {
    const layer = bg.current;
    if (active === null || !layer || !startRect.current) return;
    if (reduced.current) {
      layer.style.transform = "none";
      setOpen(true);
      return;
    }
    layer.style.transition = "none";
    layer.style.transform = toRect(startRect.current);
    void layer.getBoundingClientRect();
    const raf = requestAnimationFrame(() => {
      layer.style.transition = EASE;
      layer.style.transform = "none";
      setOpen(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [active]);

  // Reopening a card mid-close reverses the same transition.
  const reopen = () => {
    const layer = bg.current;
    if (!layer) return;
    openRef.current = true;
    layer.style.transition = EASE;
    layer.style.transform = "none";
    setOpen(true);
  };

  useEffect(() => {
    if (active === null) return;
    if (open) closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") hide();
      if (e.key === "Tab" && sheet.current) {
        const f = sheet.current.querySelectorAll<HTMLElement>("a[href], button");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, open, hide]);

  const p = active !== null ? items[active] : null;

  return (
    <>
      <ul className="grid gap-px bg-(--k-ink) p-px sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <li key={it.slug} className="flex">
            <button
              ref={(el) => {
                cards.current[i] = el;
              }}
              type="button"
              className={s.card}
              data-hidden={active === i}
              aria-haspopup="dialog"
              aria-expanded={active === i && open}
              onClick={() => (active === i && !open ? reopen() : show(i))}
            >
              <span className="flex items-start justify-between gap-4">
                <span className={`${s.mono} pt-1 text-(--k-muted)`}>Practice</span>
                <span className={s.cardPlus} aria-hidden="true">
                  <Plus size={20} strokeWidth={1.75} />
                </span>
              </span>
              <span className={`${s.cardBody} mt-10 block sm:mt-16`}>
                <span className={`${s.display} ${s.displaySm} ${s.cardName} block text-balance`}>{it.name}</span>
                <span className="mt-4 block max-w-[30ch] text-[0.98rem] leading-snug">{it.summary}</span>
                <span className={`${s.cardCaps} ${s.mono} mt-5 block !text-[0.66rem] leading-relaxed`}>
                  {it.capabilities.map((c) => c.name).join(" / ")}
                </span>
              </span>
            </button>
          </li>
        ))}
        <li className="flex">
          <Link href="/contact" className={`${s.cta} flex min-h-[16rem] sm:min-h-[21rem] w-full flex-col justify-between bg-(--k-ink) p-6 text-(--k-paper)`}>
            <span className={`${s.mono} opacity-60`}>Not sure yet?</span>
            <span>
              <span className={`${s.display} ${s.displaySm} block text-[clamp(2rem,2.9vw,2.9rem)] text-balance`}>Tell us the problem. We will find the practice.</span>
              <span className="mt-6 flex items-center gap-2 font-semibold">
                Talk to us <ArrowUpRight size={20} className={s.ctaArrow} aria-hidden="true" />
              </span>
            </span>
          </Link>
        </li>
      </ul>

      {p && (
        <>
          <div
            ref={bg}
            className={s.sheetBg}
            aria-hidden="true"
            onTransitionEnd={(e) => {
              if (e.propertyName === "transform" && e.target === bg.current) finish();
            }}
          />
          <div ref={sheet} className={s.sheet} data-open={open} role="dialog" aria-modal="true" aria-labelledby="k-sheet-title">
            <div className="mx-auto flex min-h-full max-w-[1600px] flex-col px-4 pt-4 pb-12 md:px-10 md:pt-6">
              <div className={`${s.sheetIn} flex items-center justify-between`}>
                <span className={s.mono}>Practice</span>
                <button
                  ref={closeBtn}
                  type="button"
                  onClick={hide}
                  className="group inline-flex items-center gap-3 rounded-full bg-(--k-ink) py-2.5 pr-3 pl-5 font-semibold text-(--k-sig)"
                >
                  Close
                  <span className="grid size-7 place-items-center rounded-full bg-(--k-sig) text-(--k-ink) transition-transform duration-500 group-hover:rotate-90">
                    <X size={16} strokeWidth={2.25} aria-hidden="true" />
                  </span>
                </button>
              </div>

              <div className="mt-12 grid flex-1 gap-12 md:mt-[8vh] lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-7">
                  <h3 id="k-sheet-title" className={`${s.display} ${s.sheetName} ${s.sheetIn} text-balance`} style={{ "--d": 0 } as React.CSSProperties}>
                    {p.name}
                  </h3>
                  <p className={`${s.sheetIn} mt-8 max-w-[26ch] text-[clamp(1.4rem,2.4vw,2.2rem)] leading-[1.15] font-medium tracking-[-0.02em]`} style={{ "--d": 1 } as React.CSSProperties}>
                    {p.summary}
                  </p>
                  <div className={`${s.sheetIn} mt-10 flex flex-wrap gap-3`} style={{ "--d": 2 } as React.CSSProperties}>
                    <Link href={`/services/${p.slug}`} className={`${s.btn} ${s.btnInk}`}>
                      Explore {p.name} <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                    <Link href="/contact" className={`${s.btn} ${s.btnGhost}`}>
                      Start a conversation
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 lg:pt-4">
                  <p className={`${s.mono} ${s.sheetIn}`} style={{ "--d": 2 } as React.CSSProperties}>
                    Capabilities
                  </p>
                  <ul className={`${s.sheetIn} mt-4 border-t-[1.5px] border-(--k-ink)`} style={{ "--d": 3 } as React.CSSProperties}>
                    {p.capabilities.map((c, i) => (
                      <li key={c.slug} className={`${s.sheetIn} border-b-[1.5px] border-(--k-ink)`} style={{ "--d": 3 + i } as React.CSSProperties}>
                        <Link href={`/services/${p.slug}/${c.slug}`} className={`${s.capLink} flex items-center justify-between gap-4 px-1 py-5`}>
                          <span className={`${s.capText} ${s.display} ${s.displaySm} text-[clamp(1.6rem,2.6vw,2.4rem)] !leading-none`}>{c.name}</span>
                          <ArrowRight size={24} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
