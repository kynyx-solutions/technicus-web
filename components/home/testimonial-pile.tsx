"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import type { Testimonial } from "@/lib/cms";

gsap.registerPlugin(useGSAP, ScrollTrigger, Draggable, InertiaPlugin);

// Where each card comes to rest, as a share of the stage's half width and
// height, with its tilt. The pile reads as tossed, not arranged.
const SPOTS = [
  { x: -0.62, y: -0.55, r: -9 },
  { x: 0.0, y: -0.85, r: 3 },
  { x: 0.6, y: -0.5, r: 8 },
  { x: -0.34, y: 0.45, r: -6 },
  { x: 0.36, y: 0.5, r: 7 },
  { x: -0.9, y: 0.55, r: -12 },
  { x: 0.92, y: 0.6, r: 11 },
  { x: 0.02, y: 0.05, r: -2 },
  { x: -0.2, y: -0.2, r: 5 },
  { x: 0.22, y: 0.2, r: -5 },
];
const CARD = 288;
const TONES = ["bg-mint", "bg-lavender"];

function Quote({ t }: { t: Testimonial }) {
  return (
    <>
      <svg aria-hidden viewBox="0 0 32 24" className="h-5 w-auto text-black/25">
        <path fill="currentColor" d="M0 24V14C0 6.3 4.4 1.6 12 0l1.6 3.4C9.4 4.8 7.3 7.4 7 10.8h6V24H0Zm18 0V14c0-7.7 4.4-12.4 12-14l1.6 3.4c-4.2 1.4-6.3 4-6.6 7.4h6V24H18Z" />
      </svg>
      <blockquote className="mt-3 line-clamp-6 text-[0.98rem] leading-snug text-black/85">&ldquo;{t.text}&rdquo;</blockquote>
      <figcaption className="mt-auto border-t border-black/10 pt-4">
        {t.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.logo} alt={t.company || t.name} draggable={false} className="mb-2 h-6 w-auto max-w-[9rem] object-contain object-left" />
        ) : null}
        <span className="block text-[0.9rem] font-medium">{t.name}</span>
        <span className="block text-[0.82rem] text-black/55">{[t.role, t.company].filter(Boolean).join(", ")}</span>
      </figcaption>
    </>
  );
}

/**
 * Client testimonials as cards that fly in one after another while the section
 * is held in place, landing on a tilted pile, as on the main reference. Once
 * they land they can be picked up and thrown around. Phones get a row of cards
 * to swipe; reduced motion gets the finished pile with no movement.
 */
export function TestimonialPile({ items }: { items: Testimonial[] }) {
  const section = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const list = items.slice(0, SPOTS.length);

  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
      const grips = gsap.utils.toArray<HTMLElement>("[data-grip]", el);
      const place = (i: number) => {
        const s = SPOTS[i];
        const w = Math.max(0, el.clientWidth / 2 - CARD / 2 - 16);
        const h = Math.max(0, el.clientHeight / 2 - CARD / 2 - 8);
        return { x: s.x * w, y: s.y * h, rotation: s.r };
      };
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: reduce)", () => {
        cards.forEach((c, i) => gsap.set(c, place(i)));
      });

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        cards.forEach((c, i) => gsap.set(c, { x: () => place(i).x * 0.4, y: () => window.innerHeight * 0.9, rotation: (i % 2 ? 1 : -1) * (18 + i * 4) }));
        const tl = gsap.timeline({
          scrollTrigger: {
            // Hold the whole section, heading included, while the cards land.
            trigger: section.current?.closest("section") ?? section.current,
            start: "top top",
            end: () => `+=${window.innerHeight * (0.35 * cards.length + 0.4)}`,
            pin: section.current?.closest("section") ?? true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        cards.forEach((c, i) => {
          tl.to(c, { x: () => place(i).x, y: () => place(i).y, rotation: SPOTS[i].r, ease: "power3.out", duration: 1 }, i * 0.55);
        });
        tl.to({}, { duration: 0.4 });

        // Cards can be picked up and thrown once they have landed.
        let top = cards.length;
        // Bounds are applied on pick-up, not at creation: while the cards wait
        // below the screen to fly in, bounds would drag them up out of place.
        const drags = Draggable.create(grips, {
          type: "x,y",
          inertia: true,
          edgeResistance: 0.75,
          onPress() {
            this.applyBounds(el);
            (this.target as HTMLElement).closest<HTMLElement>("[data-card]")!.style.zIndex = String(++top);
            gsap.to(this.target, { scale: 1.04, duration: 0.25 });
          },
          onRelease() {
            gsap.to(this.target, { scale: 1, duration: 0.4 });
          },
        });
        return () => drags.forEach((d) => d.kill());
      });
      return () => mm.revert();
    },
    { scope: section, dependencies: [list.length] },
  );

  return (
    <div ref={section} className="relative">
      {/* Phones: a row of cards to swipe. */}
      <ul className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 md:hidden">
        {list.map((t, i) => (
          <li key={i} className={`flex min-h-[19rem] w-[82%] shrink-0 snap-center flex-col rounded-[18px] p-6 ${TONES[i % 2]}`}>
            <figure className="flex h-full flex-col">
              <Quote t={t} />
            </figure>
          </li>
        ))}
      </ul>

      {/* Larger screens: the pile. */}
      <div ref={stage} className="relative hidden h-[min(38rem,calc(100vh-15rem))] min-h-[30rem] md:block" aria-label="Client testimonials">
        {list.map((t, i) => (
          <div key={i} data-card className="absolute top-1/2 left-1/2 -mt-[9rem] -ml-[9rem]" style={{ zIndex: i + 1 }}>
            <figure data-grip className={`flex h-[18rem] w-[18rem] cursor-grab flex-col rounded-[18px] p-6 shadow-[0_1px_0_rgba(0,0,0,0.04),0_18px_40px_-24px_rgba(0,0,0,0.25)] select-none active:cursor-grabbing ${TONES[i % 2]}`}>
              <Quote t={t} />
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}
