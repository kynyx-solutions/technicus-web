"use client";

import { useEffect } from "react";

/**
 * Starts the reveal-on-scroll animations for this page. Uses the site-wide
 * `html.js-motion` flag (set before first paint only when motion is allowed),
 * so without scripts, or with reduced motion, everything is visible at once.
 */
export function RevealInit() {
  useEffect(() => {
    (window as unknown as { __motionReady?: boolean }).__motionReady = true;
    const els = document.querySelectorAll<HTMLElement>("[data-reveal], [data-vmask]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add("is-in");
          el.dataset.in = "true";
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
