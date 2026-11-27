"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";

type TileState = { active: boolean; hover: boolean; reduced: boolean };
const TileCtx = createContext<TileState>({ active: false, hover: false, reduced: true });

/** Whether the tile is on screen (and the tab visible), hovered, and whether motion is reduced. */
export function useTile() {
  return useContext(TileCtx);
}

const RM = "(prefers-reduced-motion: reduce)";
function subscribeRM(cb: () => void) {
  const m = window.matchMedia(RM);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
/** Server snapshot is "reduced", so the HTML always carries the finished, static state. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribeRM, () => window.matchMedia(RM).matches, () => true);
}

function subscribeVis(cb: () => void) {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}
function usePageVisible() {
  return useSyncExternalStore(subscribeVis, () => document.visibilityState === "visible", () => false);
}

/**
 * Runs `cb(dt, speed)` every frame while the tile is on screen and motion is allowed.
 * `speed` eases toward 2.2 while the tile is hovered (critically damped, so it never overshoots).
 */
export function useLoop(cb: (dt: number, speed: number) => void, hoverSpeed = 2.2) {
  const { active, hover } = useTile();
  const cbRef = useRef(cb);
  const hoverRef = useRef(hover);
  useEffect(() => {
    cbRef.current = cb;
    hoverRef.current = hover;
  });
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    let speed = hoverRef.current ? hoverSpeed : 1;
    const tick = (t: number) => {
      const dt = Math.min(0.064, (t - last) / 1000);
      last = t;
      const target = hoverRef.current ? hoverSpeed : 1;
      speed += (target - speed) * (1 - Math.exp(-dt * 7));
      cbRef.current(dt, speed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, hoverSpeed]);
}

type Tone = "light" | "dark" | "paper" | "accent";

export function Tile({
  area,
  tone = "light",
  delay = 0,
  className = "",
  label,
  children,
}: {
  area: string;
  tone?: Tone;
  delay?: number;
  className?: string;
  label?: string;
  children: React.ReactNode;
}) {
  const cell = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const reduced = useReducedMotion();
  const visible = usePageVisible();

  useEffect(() => {
    const el = cell.current;
    if (!el) return;
    const reveal = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          reveal.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    const live = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    reveal.observe(el);
    live.observe(el);
    return () => {
      reveal.disconnect();
      live.disconnect();
    };
  }, []);

  const setPress = (on: boolean) => {
    const c = card.current;
    if (!c) return;
    if (on) c.dataset.press = "true";
    else delete c.dataset.press;
  };

  const onMove = (e: React.PointerEvent) => {
    const c = card.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", `${e.clientX - r.left}px`);
    c.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const state: TileState = { active: inView && visible && !reduced, hover, reduced };

  return (
    <section
      ref={cell}
      aria-label={label}
      className="bnt-cell"
      data-shown={shown}
      data-live={state.active}
      style={{ gridArea: area, ["--bnt-delay" as string]: `${delay}ms` }}
    >
      <div
        ref={card}
        className={`bnt-card bnt-tone-${tone} ${className}`}
        data-hover={hover}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={() => {
          setHover(false);
          setPress(false);
        }}
        onPointerMove={onMove}
        onPointerDown={(e) => {
          // Controls inside the tile give their own feedback.
          if ((e.target as HTMLElement).closest("button")) return;
          setPress(true);
        }}
        onPointerUp={() => setPress(false)}
        onPointerCancel={() => setPress(false)}
        onFocus={() => setHover(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setHover(false);
        }}
      >
        <div className="bnt-spot" aria-hidden="true" />
        <TileCtx.Provider value={state}>{children}</TileCtx.Provider>
      </div>
    </section>
  );
}
