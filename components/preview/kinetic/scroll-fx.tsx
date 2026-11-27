"use client";

import { useEffect } from "react";

/*
  One shared scroll engine for the page. Every element marked data-kx gets a
  --p custom property between 0 and 1, eased towards its scroll target each
  frame so motion stays smooth. CSS turns --p into transforms. Modes:
    through  0 when the element's top meets the viewport bottom, 1 when its
             bottom leaves the top
    enter    0 when the top meets the viewport bottom, 1 when it reaches 20%
    exit     0 while the top is at the viewport top, 1 once scrolled past
    end      0 when the top meets the viewport bottom, 1 when fully in view
    read     0 when the top reaches 80% of the viewport, 1 when the bottom
             reaches 55%
  Elements marked data-kx-in get data-in once they come into view.
  Nothing runs under reduced motion: the CSS fallbacks show the finished state.
*/
export function ScrollFX({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    root.dataset.motion = "on";

    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-kx]")).map((el) => ({
      el,
      mode: el.dataset.kx ?? "through",
      cur: -1,
      target: 0,
    }));

    const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const measure = () => {
      const vh = window.innerHeight;
      for (const it of items) {
        const r = it.el.getBoundingClientRect();
        let t: number;
        if (it.mode === "enter") t = (vh - r.top) / (vh * 0.8);
        else if (it.mode === "exit") t = -r.top / Math.max(r.height, 1);
        else if (it.mode === "end") t = (vh - r.top) / Math.max(r.height, 1);
        else if (it.mode === "read") t = (vh * 0.8 - r.top) / (r.height + vh * 0.25);
        else t = (vh - r.top) / (vh + r.height);
        it.target = clamp(t);
      }
    };

    let raf = 0;
    const tick = () => {
      raf = 0;
      let moving = false;
      for (const it of items) {
        if (it.cur < 0) it.cur = it.target;
        const d = it.target - it.cur;
        if (Math.abs(d) > 0.0004) {
          it.cur += d * 0.13;
          moving = true;
        } else it.cur = it.target;
        it.el.style.setProperty("--p", it.cur.toFixed(4));
      }
      if (moving) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    root.querySelectorAll("[data-kx-in]").forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io.disconnect();
      delete root.dataset.motion;
    };
  }, [rootId]);

  return null;
}
