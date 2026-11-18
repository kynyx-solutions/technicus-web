"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

/**
 * A round cursor that follows the pointer on laptops and grows over links and
 * buttons. It inverts what is beneath it, so it reads on white and on black.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dot.current;
    if (!el) return;
    const allowed = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    ).matches;
    if (!allowed) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });

    const move = (e: MouseEvent) => {
      gsap.to(el, { opacity: 1, duration: 0.2, overwrite: "auto" });
      x(e.clientX);
      y(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a, button, summary, label, [data-cursor]");
      const big = target?.hasAttribute("data-cursor");
      gsap.to(el, { scale: big ? 6 : target ? 3.4 : 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
    };
    const out = () => gsap.to(el, { opacity: 0, duration: 0.2 });

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.documentElement.addEventListener("mouseleave", out);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.removeEventListener("mouseleave", out);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[70] hidden h-3.5 w-3.5 rounded-full bg-white opacity-0 mix-blend-difference lg:block"
    />
  );
}
