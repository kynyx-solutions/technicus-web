"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Quiet motion for every page. Pages stay plain server-rendered HTML and opt
 * in with data attributes:
 *
 *   data-reveal         block fades up as it comes into view
 *   data-count="120"    number counts up once when it comes into view
 *
 * Visitors who ask for reduced motion see everything at once.
 */
export function PageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
        const k = Math.min(1, (now - start) / 1200);
        node.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 3))));
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
          node.style.transitionDelay = `${Math.min(siblings.indexOf(node), 6) * 60}ms`;
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
