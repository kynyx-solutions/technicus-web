"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Quiet motion for every page. Pages stay plain server-rendered HTML and opt
 * in with data attributes:
 *
 *   data-reveal         block rises as it comes into view; siblings that
 *                       arrive together follow one after another
 *   data-count="120"    number counts up once when it comes into view
 *   .card-press         a soft spotlight follows the pointer over the card
 *
 * Visitors who ask for reduced motion see everything at once.
 */
export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // The card spotlight: one listener for the whole page, writing the pointer
  // position into the card under it. Mouse and pen only.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const card = (e.target as HTMLElement).closest<HTMLElement>(".card-press");
      if (!card) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    (window as Window & { __motionReady?: boolean }).__motionReady = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blocks = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));
    const counters = Array.from(el.querySelectorAll<HTMLElement>("[data-count]"));
    if (reduce) {
      blocks.forEach((b) => b.classList.add("is-in"));
      return;
    }

    const count = (node: HTMLElement) => {
      const end = Number(node.dataset.count) || 0;
      const start = performance.now();
      const tick = (now: number) => {
        // Critically damped spring (damping 1.0, response 0.6s): it eases in
        // naturally and settles without overshooting the real number.
        const t = (now - start) / 1000;
        const w = (2 * Math.PI) / 0.6;
        const k = t >= 1.2 ? 1 : 1 - (1 + w * t) * Math.exp(-w * t);
        node.textContent = String(Math.round(end * k));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const node = entry.target as HTMLElement;
          // Siblings that arrive together come in one after another.
          const siblings = node.parentElement ? Array.from(node.parentElement.children).filter((c) => c.hasAttribute("data-reveal")) : [];
          node.style.transitionDelay = `${Math.min(siblings.indexOf(node), 7) * 80}ms`;
          node.classList.add("is-in");
          if (node.dataset.count) count(node);
          io.unobserve(node);
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    blocks.forEach((b) => io.observe(b));
    counters.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [pathname]);

  return <div ref={root}>{children}</div>;
}
