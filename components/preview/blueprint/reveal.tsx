"use client";

import { useEffect } from "react";

/** Fades sections in as they enter. Content stays visible without JS, because
 *  the hidden state only applies once this has marked the root. */
export function Reveal({ root }: { root: string }) {
  useEffect(() => {
    const el = document.getElementById(root);
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(".bp-reveal"));
    const io = new IntersectionObserver(
      (list) => {
        for (const e of list) {
          if (e.isIntersecting) {
            e.target.classList.add("bp-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    // Anything already on screen shows at once, without a fade.
    const vh = window.innerHeight;
    for (const item of items) {
      if (item.getBoundingClientRect().top < vh) item.classList.add("bp-in");
      else io.observe(item);
    }
    el.setAttribute("data-reveal", "");
    return () => io.disconnect();
  }, [root]);
  return null;
}
