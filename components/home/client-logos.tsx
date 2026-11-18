"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import type { Client } from "@/lib/cms";

const CELLS = 8;

/**
 * Client logos in a grid, as on the main reference. With more clients than
 * cells, one cell at a time swaps to the next logo with a short slide. Logos
 * are shown in grey and take their own colour on hover. Still for visitors who
 * ask for reduced motion, and paused while off screen.
 */
export function ClientLogos({ clients }: { clients: Client[] }) {
  const cells = Math.min(CELLS, clients.length);
  const [slots, setSlots] = useState(() => Array.from({ length: cells }, (_, i) => i));
  const root = useRef<HTMLUListElement>(null);
  const inner = useRef<(HTMLSpanElement | null)[]>([]);
  const next = useRef(cells);
  const shown = useRef(slots);
  useEffect(() => {
    shown.current = slots;
  }, [slots]);

  useEffect(() => {
    if (clients.length <= cells || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    let last = -1;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (root.current) io.observe(root.current);

    const timer = window.setInterval(() => {
      if (!visible || document.hidden) return;
      let cell = Math.floor(Math.random() * cells);
      if (cell === last) cell = (cell + 1) % cells;
      last = cell;
      // The next client that is not on screen.
      let pick = next.current % clients.length;
      for (let tries = 0; tries < clients.length && shown.current.includes(pick); tries++) pick = (pick + 1) % clients.length;
      next.current = pick + 1;
      const el = inner.current[cell];
      if (!el) return;
      gsap.to(el, {
        yPercent: -60,
        opacity: 0,
        duration: 0.45,
        ease: "power3.in",
        onComplete: () => {
          setSlots((s) => s.map((v, i) => (i === cell ? pick : v)));
          gsap.fromTo(el, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: "expo.out", delay: 0.05 });
        },
      });
    }, 2200);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
    };
  }, [clients.length, cells]);

  return (
    <ul ref={root} className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-y-16">
      {slots.map((index, cell) => {
        const c = clients[index];
        const body = c.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.logo} alt={c.name} loading="lazy" className="max-h-10 max-w-[70%] object-contain opacity-60 grayscale transition-[filter,opacity] duration-500 group-hover:opacity-100 group-hover:grayscale-0 md:max-h-12" />
        ) : (
          <span className="text-center text-xl font-medium tracking-[-0.01em] text-black/55 transition-colors group-hover:text-black md:text-2xl">{c.name}</span>
        );
        return (
          <li key={cell} className="group flex h-16 items-center justify-center overflow-hidden md:h-20" data-reveal>
            <span ref={(el) => void (inner.current[cell] = el)} className="flex h-full w-full items-center justify-center">
              {c.url ? (
                <a href={c.url} target="_blank" rel="noreferrer" aria-label={c.name} className="flex h-full w-full items-center justify-center">
                  {body}
                </a>
              ) : (
                body
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
