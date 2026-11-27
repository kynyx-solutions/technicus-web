import type { CSSProperties } from "react";

/*
 * Scroll-scrubbed styling with no per-element JavaScript.
 *
 * The canvas root carries a single custom property, --p: the story position in
 * stage units (0 = the idea, 7 = ongoing care). Every element derives its own
 * opacity, transform or stroke-dashoffset from --p with CSS math, so the scroll
 * loop writes exactly one value per frame and the browser does the rest. The
 * same markup renders a static stage by fixing --p, which is how the phone,
 * reduced-motion and no-JS versions work.
 */

export type Style = CSSProperties & Record<`--${string}`, string | number>;

const num = (n: number) => +n.toFixed(4);

/** Linear 0..1 ramp of --p between a and b. */
export function ramp(a: number, b: number) {
  const off = a < 0 ? `+ ${num(-a)}` : `- ${num(a)}`;
  return `clamp(0, (var(--p) ${off}) / ${num(b - a)}, 1)`;
}

/** Declares --{name}r (linear) and --{name} (smoothstep eased) on an element. */
export function eased(name: string, a: number, b: number): Style {
  const r = `var(--${name}r)`;
  return {
    [`--${name}r`]: ramp(a, b),
    [`--${name}`]: `calc(${r} * ${r} * (3 - 2 * ${r}))`,
  } as Style;
}

type Fx = {
  /** Window where the element arrives. */
  in: [number, number];
  /** Window where it leaves (optional; otherwise it stays). */
  out?: [number, number];
  /** Rise from this many units below. */
  y?: number;
  /** Slide in from this many units to the side. */
  x?: number;
  /** Start scale; uses a slight overshoot so blocks "snap" into place. */
  snap?: number;
  /** Plain start scale, no overshoot. */
  scale?: number;
  /** Draw the stroke (element needs pathLength={1}). */
  draw?: boolean;
  /** Keep full opacity (only drawing or moving). */
  solid?: boolean;
  /** Maximum opacity. */
  max?: number;
};

/** Style object for an element that enters (and optionally leaves) with the scroll. */
export function fx(o: Fx): Style {
  const s: Style = { ...eased("i", o.in[0], o.in[1]) };
  const inV = "var(--i)";
  let vis = inV;
  if (o.out) {
    Object.assign(s, eased("o", o.out[0], o.out[1]));
    vis = `${inV} * (1 - var(--o))`;
  }
  const max = o.max ?? 1;
  if (o.draw) {
    s.strokeDasharray = "1 1";
    s.strokeDashoffset = "calc(1 - var(--i))";
    // Hide the round cap dot that remains at zero length.
    s.opacity = `calc(min(1, var(--ir) * 12) * ${max}${o.out ? " * (1 - var(--o))" : ""})`;
  } else if (!o.solid) {
    s.opacity = `calc(${vis} * ${max})`;
  } else if (o.out) {
    s.opacity = `calc(1 - var(--o))`;
  }
  const t: string[] = [];
  if (o.x || o.y) {
    t.push(`translate(calc((1 - ${inV}) * ${o.x ?? 0}px), calc((1 - ${inV}) * ${o.y ?? 0}px))`);
  }
  if (o.snap !== undefined) {
    // Ease-out-back on the linear ramp: overshoots a touch, then settles.
    s["--u"] = "calc(var(--ir) - 1)";
    const bk = "(1 + 2.4 * var(--u) * var(--u) * var(--u) + 1.4 * var(--u) * var(--u))";
    t.push(`scale(calc(${o.snap} + ${num(1 - o.snap)} * ${bk}))`);
  } else if (o.scale !== undefined) {
    t.push(`scale(calc(${o.scale} + ${num(1 - o.scale)} * ${inV}))`);
  }
  if (t.length) {
    s.transform = t.join(" ");
    s.transformBox = "fill-box";
    s.transformOrigin = "center";
  }
  return s;
}

/** Staggered windows: item k of a group. */
export const stagger = (a: number, b: number, k: number, step: number): [number, number] => [
  num(a + k * step),
  num(b + k * step),
];
