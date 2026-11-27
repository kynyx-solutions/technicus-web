"use client";

import { useEffect, useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

/** True when the visitor has asked for less motion. False on the server. */
export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => matchMedia(query).matches,
    () => false,
  );
}

// One shared requestAnimationFrame loop for every scroll-linked effect, so the
// page reads layout once per frame however many sections listen.
type Fn = () => void;
const subscribers = new Set<Fn>();
let frame = 0;
function tick() {
  frame = 0;
  subscribers.forEach((fn) => fn());
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(tick);
}

/** Calls `fn` once per frame while the page scrolls or resizes. */
export function useScrollFrame(fn: Fn, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    subscribers.add(fn);
    if (subscribers.size === 1) {
      addEventListener("scroll", schedule, { passive: true });
      addEventListener("resize", schedule);
    }
    schedule();
    return () => {
      subscribers.delete(fn);
      if (!subscribers.size) {
        removeEventListener("scroll", schedule);
        removeEventListener("resize", schedule);
      }
    };
  }, [fn, enabled]);
}

/**
 * Progress of an element through the viewport: 0 when its top meets the
 * bottom of the screen, 1 when its bottom leaves the top.
 */
export function viewProgress(el: Element) {
  const r = el.getBoundingClientRect();
  const vh = innerHeight;
  return Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
}
