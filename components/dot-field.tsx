"use client";

import { useEffect, useRef } from "react";

/**
 * The hero motif: a precise field of dots.
 *
 * A slow diagonal swell passes through it (one cycle takes about 25 seconds,
 * so it never pulls the eye). Under the pointer the dots part, grow and turn
 * vermilion, like a lens. The lens follows the pointer on a critically damped
 * spring, so it glides rather than jumps, and fades in and out instead of
 * switching. Touch screens get the swell only; reduced motion gets a still
 * field. Drawing stops while the hero is off screen or the tab is hidden.
 */
export function DotField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const GAP = 22;
    const INK = [21, 20, 15];
    const SIGNAL = [214, 58, 30];
    const LENS = 110;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let dots: { x: number; y: number }[] = [];

    const layout = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const ox = (w % GAP) / 2 + GAP / 2;
      const oy = (h % GAP) / 2 + GAP / 2;
      for (let y = oy; y < h; y += GAP) for (let x = ox; x < w; x += GAP) dots.push({ x, y });
    };

    // Pointer, lens position and lens strength, each on a critically damped spring.
    const omega = (2 * Math.PI) / 0.45;
    const lens = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, s: 0, vs: 0, ts: 0 };
    const spring = (x: number, v: number, t: number, dt: number) => {
      const a = omega * omega * (t - x) - 2 * omega * v;
      v += a * dt;
      return [x + v * dt, v] as const;
    };

    const draw = (time: number, dt: number) => {
      [lens.x, lens.vx] = spring(lens.x, lens.vx, lens.tx, dt);
      [lens.y, lens.vy] = spring(lens.y, lens.vy, lens.ty, dt);
      [lens.s, lens.vs] = spring(lens.s, lens.vs, lens.ts, dt);
      const t = time / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const swell = reduce ? 0 : Math.pow((Math.sin(d.x * 0.006 + d.y * 0.004 - t * 0.25) + 1) / 2, 6);
        let x = d.x;
        let y = d.y;
        let k = 0;
        if (lens.s > 0.001) {
          const dx = d.x - lens.x;
          const dy = d.y - lens.y;
          const dist = Math.hypot(dx, dy);
          k = Math.exp(-(dist * dist) / (2 * LENS * LENS)) * lens.s;
          if (dist > 0.01) {
            const push = k * 7;
            x += (dx / dist) * push;
            y += (dy / dist) * push;
          }
        }
        const r = 1 + swell * 0.9 + k * 2.2;
        const mix = Math.min(1, Math.max(0, (k - 0.25) / 0.5));
        const c = INK.map((v, i) => Math.round(v + (SIGNAL[i] - v) * mix));
        const a = 0.2 + swell * 0.18 + k * 0.7;
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${Math.min(1, a)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let frame = 0;
    let last = 0;
    let visible = true;
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000 || 0.016);
      last = now;
      draw(now, dt);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || frame || !visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    layout();
    draw(0, 0.016);
    start();

    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now(), 0.016);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const area = canvas.closest("section") ?? canvas;
    const onMove = (e: Event) => {
      const p = e as PointerEvent;
      if (p.pointerType === "touch") return;
      const r = canvas.getBoundingClientRect();
      const x = p.clientX - r.left;
      const y = p.clientY - r.top;
      // Jump straight to the pointer on entry, so the lens does not sweep in from a corner.
      if (lens.s < 0.02) {
        lens.x = x;
        lens.y = y;
      }
      lens.tx = x;
      lens.ty = y;
      lens.ts = 1;
    };
    const onLeave = () => {
      lens.ts = 0;
    };
    if (fine && !reduce) {
      area.addEventListener("pointermove", onMove, { passive: true });
      area.addEventListener("pointerleave", onLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none block h-full w-full ${className}`} />;
}
