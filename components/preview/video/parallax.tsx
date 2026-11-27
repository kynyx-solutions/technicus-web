"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { s } from "./styles";
import { unsplash, unsplashSet } from "./photos";
import { useReducedMotion, useScrollFrame, viewProgress } from "./motion";

type Props = {
  photo: string;
  alt?: string;
  className: string;
  scrimClassName: string;
  /** Strength of the drift, as a share of the frame height. */
  depth?: number;
  children: ReactNode;
  id?: string;
  labelledBy?: string;
};

/**
 * A full-bleed photograph that moves slower than the page and eases out of a
 * slight zoom as it passes, with content on top. Static with reduced motion.
 */
export function ParallaxSection({ photo, alt = "", className, scrimClassName, depth = 0.1, children, id, labelledBy }: Props) {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);

  const update = useCallback(() => {
    const el = section.current;
    const m = media.current;
    if (!el || !m) return;
    const r = el.getBoundingClientRect();
    if (r.bottom < -100 || r.top > innerHeight + 100) return;
    const p = viewProgress(el); // 0..1
    const shift = (p - 0.5) * 2 * depth * r.height; // px
    const scale = 1.12 - p * 0.1;
    m.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`;
  }, [depth]);
  useScrollFrame(update, !reduced);

  return (
    <section ref={section} id={id} className={className} aria-labelledby={labelledBy}>
      <div ref={media} className={s.bandMedia}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={unsplash(photo, 2000)} srcSet={unsplashSet(photo)} sizes="100vw" alt={alt} loading="lazy" decoding="async" />
      </div>
      <div className={scrimClassName} />
      {children}
    </section>
  );
}
