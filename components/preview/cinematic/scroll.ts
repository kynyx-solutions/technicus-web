// One shared requestAnimationFrame loop for every scroll-linked effect on the
// page, so a scroll event costs a single frame of work however many sections
// listen.

type Frame = () => void;

const subscribers = new Set<Frame>();
let frame = 0;

function run() {
  frame = 0;
  subscribers.forEach((fn) => fn());
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(run);
}

export function onScrollFrame(fn: Frame) {
  subscribers.add(fn);
  if (subscribers.size === 1) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  }
  schedule();
  return () => {
    subscribers.delete(fn);
    if (!subscribers.size) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** 0 when the element's top meets the viewport top, 1 when its bottom meets the viewport bottom. */
export function pinProgress(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const travel = r.height - window.innerHeight;
  return travel <= 0 ? 0 : clamp(-r.top / travel);
}

/** Motion is on when the root layout marked the page (no reduced-motion preference). */
export function motionOn() {
  return document.documentElement.classList.contains("js-motion");
}
