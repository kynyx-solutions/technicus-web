"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { s } from "./styles";
import { projectPhoto, unsplash, unsplashSet } from "./photos";
import { useReducedMotion } from "./motion";

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  industrySlug?: string;
  sector: string;
  summary: string;
  country: string;
  pillars: string[];
};

type Opened = { index: number; vars: CSSProperties };

/** Clip and transform values that place the full-screen view exactly over a card's image. */
function fromRect(r: DOMRect): CSSProperties {
  const vw = innerWidth;
  const vh = innerHeight;
  const k = Math.max(r.width / vw, r.height / vh);
  const dx = r.left + r.width / 2 - vw / 2;
  const dy = r.top + r.height / 2 - vh / 2;
  return {
    "--t": `${r.top}px`,
    "--r": `${vw - r.right}px`,
    "--b": `${vh - r.bottom}px`,
    "--l": `${r.left}px`,
    "--m": `translate3d(${dx}px, ${dy}px, 0) scale(${k})`,
  } as CSSProperties;
}

/**
 * Large photographic case study cards. Clicking one expands its photograph
 * from the card to the full viewport (a FLIP: measured from the card's rect,
 * played as a transform plus clip so the photo never distorts). Closing
 * reverses it from wherever it is, so the motion is interruptible.
 *
 * PLACEHOLDER IMAGERY: the photographs are illustrative stock images chosen
 * per industry. They do not show the clients or their products. Replace them
 * with real project imagery when it arrives.
 */
export function CaseStudies({ projects, pillarNames }: { projects: CaseStudy[]; pillarNames: Record<string, string> }) {
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState<Opened | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const mediaRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggers = useRef<(HTMLAnchorElement | null)[]>([]);
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const timer = useRef<number>(0);

  const open = (index: number) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    const media = mediaRefs.current[index];
    if (!media) return;
    clearTimeout(timer.current);
    setIsOpen(false);
    setOpened({ index, vars: fromRect(media.getBoundingClientRect()) });
  };

  // Play the expansion on the frame after the overlay mounts at the card's rect.
  useLayoutEffect(() => {
    if (!opened || isOpen) return;
    const el = dialog.current;
    if (!el) return;
    void el.offsetWidth; // commit the starting position
    const id = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(id);
    // Only when a new card opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const finish = useCallback(() => {
    clearTimeout(timer.current);
    setOpened((cur) => {
      if (cur) triggers.current[cur.index]?.focus({ preventScroll: true });
      return null;
    });
  }, []);

  const close = useCallback(() => {
    if (!opened) return;
    const media = mediaRefs.current[opened.index];
    if (media) setOpened({ ...opened, vars: fromRect(media.getBoundingClientRect()) });
    setIsOpen(false);
    if (reduced) finish();
    else timer.current = window.setTimeout(finish, 1100); // in case transitionend is missed
  }, [opened, reduced, finish]);

  // While open: lock page scroll, focus the close button, trap focus, close on Esc.
  useEffect(() => {
    if (!opened) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "Tab" && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>("a[href], button");
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
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
    };
  }, [opened, close]);

  const p = opened ? projects[opened.index] : null;

  return (
    <>
      <ul className={s.workGrid}>
        {projects.map((proj, i) => {
          const photo = projectPhoto(proj.slug, proj.industrySlug);
          return (
            <li key={proj.slug} data-reveal>
              <a
                ref={(el) => {
                  triggers.current[i] = el;
                }}
                href={`/work/${proj.slug}`}
                className={s.card}
                onClick={open(i)}
                aria-haspopup="dialog"
              >
                <div
                  ref={(el) => {
                    mediaRefs.current[i] = el;
                  }}
                  className={s.cardMedia}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={unsplash(photo, 1400)}
                    srcSet={unsplashSet(photo, [640, 1000, 1400, 1800])}
                    sizes="(min-width: 768px) 55vw, 100vw"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <div className={s.cardShade} />
                  <div className={s.cardReveal} aria-hidden="true">
                    <span>Open case study</span>
                    <span>
                      <ArrowUpRight size={20} strokeWidth={1.75} />
                    </span>
                  </div>
                </div>
                <div className={s.cardMeta}>
                  <div>
                    <h3 className={s.cardClient}>{proj.client}</h3>
                    <p className={s.cardSector}>{proj.sector}</p>
                  </div>
                  <span className={s.cardIndustry}>{proj.industry}</span>
                </div>
              </a>
            </li>
          );
        })}
      </ul>

      {opened && p && (
        <div
          ref={dialog}
          className={s.overlay}
          data-open={isOpen}
          style={opened.vars}
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-title"
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && e.propertyName === "clip-path" && !isOpen) finish();
          }}
        >
          <div className={s.overlayMedia} style={{ transform: isOpen ? "none" : "var(--m)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={unsplash(projectPhoto(p.slug, p.industrySlug), 2200)} alt="" decoding="async" />
          </div>
          <div className={s.overlayScrim} />
          <button ref={closeBtn} type="button" className={s.closeBtn} onClick={close}>
            Close <X size={20} strokeWidth={1.5} />
          </button>
          <div className={`${s.shell} ${s.overlayBody}`}>
            <p className={`${s.eyebrow} ${s.overlayIn}`} style={{ "--d": 0 } as CSSProperties}>
              Case study · {p.industry}
            </p>
            <h2 id="case-title" className={`${s.overlayTitle} ${s.overlayIn}`} style={{ "--d": 1 } as CSSProperties}>
              {p.client}
            </h2>
            <p className={`${s.overlaySummary} ${s.overlayIn}`} style={{ "--d": 2 } as CSSProperties}>
              {p.summary}
            </p>
            <dl className={`${s.overlayFacts} ${s.overlayIn}`} style={{ "--d": 3 } as CSSProperties}>
              <div>
                <dt>Client</dt>
                <dd>{p.client}</dd>
              </div>
              <div>
                <dt>Sector</dt>
                <dd>{p.sector}</dd>
              </div>
              <div>
                <dt>Country</dt>
                <dd>{p.country}</dd>
              </div>
              <div>
                <dt>Practice</dt>
                <dd>{p.pillars.map((x) => pillarNames[x] ?? x).join(", ")}</dd>
              </div>
            </dl>
            <div className={`${s.heroActions} ${s.overlayIn}`} style={{ "--d": 4 } as CSSProperties}>
              <Link href={`/work/${p.slug}`} className={s.btn}>
                Read the case study <ArrowRight size={18} />
              </Link>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Illustrative photograph</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
