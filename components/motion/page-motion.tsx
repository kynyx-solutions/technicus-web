"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const EASE = "expo.out";

// The first page a visitor opens must not be covered while scripts load, so the
// transition panel only plays on navigations inside the site.
let navigated = false;

/**
 * Runs once per page view. Pages stay plain server-rendered HTML; they opt in
 * to effects with data attributes:
 *
 *   data-split                 headline revealed line by line
 *   data-reveal                block fades and rises in
 *   data-parallax="0.15"       moves slower or faster than the page
 *   data-count="120"           number counts up once
 *   data-magnetic              pulls toward the cursor (laptops)
 *   data-hscroll + data-track  sideways scroll while pinned (laptops)
 *   data-stack-card            shrinks as the next stacked card slides over it
 */
export function PageMotion({ children }: { children: ReactNode }) {
  // Keyed by address, so every navigation, including one between two pages of
  // the same section, starts the transition and the scroll animations afresh.
  const pathname = usePathname();
  return <PageView key={pathname}>{children}</PageView>;
}

function PageView({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const withCurtain = navigated;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      navigated = true;
      (window as Window & { __motionReady?: boolean }).__motionReady = true;
      const lead = withCurtain ? 0.45 : 0.1;
      const q = <T extends HTMLElement>(selector: string) => gsap.utils.toArray<T>(selector, el);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-reveal]"), { opacity: 1 });
        gsap.set(q("[data-split]"), { visibility: "visible" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Page transition: a panel covers the screen and lifts away.
        if (curtain.current) {
          gsap.fromTo(
            curtain.current,
            { yPercent: 0 },
            { yPercent: -100, duration: 0.85, ease: "expo.inOut", onComplete: () => gsap.set(curtain.current, { display: "none" }) },
          );
        }
        const firstScreen = (node: Element) => node.getBoundingClientRect().top < window.innerHeight;

        q("[data-split]").forEach((heading) => {
          SplitText.create(heading, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit(self) {
              gsap.set(heading, { visibility: "visible" });
              return gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.1,
                ease: EASE,
                stagger: 0.09,
                delay: firstScreen(heading) ? lead : 0,
                scrollTrigger: { trigger: heading, start: "top 90%", once: true },
              });
            },
          });
        });

        const reveals = q("[data-reveal]");
        gsap.set(reveals, { y: 36 });
        ScrollTrigger.batch(reveals, {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: EASE,
              stagger: 0.07,
              delay: firstScreen(batch[0]) ? lead + 0.15 : 0,
              overwrite: true,
            }),
        });

        q("[data-parallax]").forEach((node) => {
          const amount = Number(node.dataset.parallax || 0.15);
          gsap.fromTo(
            node,
            { yPercent: amount * 100 },
            { yPercent: -amount * 100, ease: "none", scrollTrigger: { trigger: node, scrub: true } },
          );
        });

        q("[data-count]").forEach((node) => {
          const end = Number(node.dataset.count);
          const value = { n: 0 };
          gsap.to(value, {
            n: end,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: node, start: "top 90%", once: true },
            onUpdate: () => {
              node.textContent = Math.round(value.n).toLocaleString("en");
            },
          });
        });

        // Stacked service cards: each card shrinks a little as the next one
        // slides over it.
        const cards = q("[data-stack-card]");
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card, {
            scale: 0.94,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 30%", scrub: true },
          });
        });
      });

      // Laptop-only effects.
      mm.add("(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        q("[data-hscroll]").forEach((wrap) => {
          const track = wrap.querySelector<HTMLElement>("[data-track]");
          if (!track) return;
          const distance = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
          gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "center center",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
        });

        const cleanups: (() => void)[] = [];
        q("[data-magnetic]").forEach((node) => {
          const x = gsap.quickTo(node, "x", { duration: 0.5, ease: "power3.out" });
          const y = gsap.quickTo(node, "y", { duration: 0.5, ease: "power3.out" });
          const move = (e: MouseEvent) => {
            const r = node.getBoundingClientRect();
            x((e.clientX - (r.left + r.width / 2)) * 0.3);
            y((e.clientY - (r.top + r.height / 2)) * 0.3);
          };
          const leave = () => {
            x(0);
            y(0);
          };
          node.addEventListener("mousemove", move);
          node.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            node.removeEventListener("mousemove", move);
            node.removeEventListener("mouseleave", leave);
          });
        });
        return () => cleanups.forEach((fn) => fn());
      });

    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {withCurtain && (
        <div
          ref={curtain}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60] hidden bg-black motion-safe:block"
        />
      )}
      {children}
    </div>
  );
}
