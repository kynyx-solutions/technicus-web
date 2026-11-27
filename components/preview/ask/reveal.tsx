"use client";

import { useEffect, useRef } from "react";

/** Fades a section up once it scrolls into view. Without JavaScript it is simply visible. */
export function Reveal({ children, className = "", as: Tag = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "section" | "li" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.add("ask-reveal");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("ask-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement & HTMLLIElement>} className={className}>
      {children}
    </Tag>
  );
}
