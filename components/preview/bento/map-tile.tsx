"use client";

import { useRef } from "react";
import { Tile, useLoop } from "./tile";
import { TileHead } from "./head";
import { dots, H, project, W } from "./world";

// Regions only, unlabelled: the arcs say "we work across time zones", not "we have clients here".
const targets: [number, number][] = [
  [-0.1, 51.5],
  [-74, 40.7],
  [55.3, 25.2],
  [103.8, 1.3],
  [151.2, -33.9],
  [36.8, -1.3],
  [8.7, 50.1],
  [-79.4, 43.7],
];

type Arc = { d: string; p0: [number, number]; c: [number, number]; p1: [number, number] };

function arcs(origin: [number, number]): Arc[] {
  const p0 = project(origin[0], origin[1]);
  return targets.map(([lon, lat]) => {
    const p1 = project(lon, lat);
    const mx = (p0[0] + p1[0]) / 2;
    const my = (p0[1] + p1[1]) / 2;
    const dist = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
    const c: [number, number] = [mx, my - dist * 0.38];
    return { d: `M${p0[0]} ${p0[1]} Q${c[0]} ${c[1]} ${p1[0]} ${p1[1]}`, p0, c, p1 };
  });
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const CYCLE = 9; // seconds for the whole set
const DRAW = 1.5;
const STAY = 2.6;
const FADE = 0.7;

function Map({ origin }: { origin: [number, number] }) {
  const list = arcs(origin);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const heads = useRef<(SVGCircleElement | null)[]>([]);
  const ends = useRef<(SVGCircleElement | null)[]>([]);
  const time = useRef(0);
  const home = project(origin[0], origin[1]);

  useLoop((dt, speed) => {
    time.current = (time.current + dt * speed) % CYCLE;
    list.forEach((a, i) => {
      const start = (i * CYCLE) / list.length;
      let t = time.current - start;
      if (t < 0) t += CYCLE;
      let draw = 0;
      let alpha = 0;
      if (t < DRAW) {
        draw = ease(t / DRAW);
        alpha = 1;
      } else if (t < DRAW + STAY) {
        draw = 1;
        alpha = 1;
      } else if (t < DRAW + STAY + FADE) {
        draw = 1;
        alpha = 1 - (t - DRAW - STAY) / FADE;
      }
      const p = paths.current[i];
      const h = heads.current[i];
      const e = ends.current[i];
      if (p) {
        p.style.strokeDashoffset = String(1 - draw);
        p.style.opacity = String(alpha);
      }
      if (h) {
        const u = draw;
        const x = (1 - u) * (1 - u) * a.p0[0] + 2 * (1 - u) * u * a.c[0] + u * u * a.p1[0];
        const y = (1 - u) * (1 - u) * a.p0[1] + 2 * (1 - u) * u * a.c[1] + u * u * a.p1[1];
        h.setAttribute("cx", x.toFixed(1));
        h.setAttribute("cy", y.toFixed(1));
        h.style.opacity = String(draw > 0 && draw < 1 ? 1 : 0);
      }
      if (e) {
        const arrived = t >= DRAW && alpha > 0;
        const k = arrived ? Math.min(1, (t - DRAW) / 0.5) : 0;
        e.style.opacity = String(arrived ? alpha : 0);
        e.setAttribute("r", (2.6 + k * 1.2).toFixed(2));
      }
    });
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <g>
        {dots.map((d, i) =>
          d.home ? null : <circle key={i} cx={d.x} cy={d.y} r={2.05} fill="#d4cfc4" />,
        )}
        {dots.map((d, i) => (d.home ? <circle key={`h${i}`} cx={d.x} cy={d.y} r={2.5} fill="#ff5a1f" /> : null))}
      </g>
      <g fill="none" stroke="#121212" strokeWidth={1.4} strokeLinecap="round">
        {list.map((a, i) => (
          <path
            key={i}
            ref={(el) => {
              paths.current[i] = el;
            }}
            d={a.d}
            pathLength={1}
            strokeDasharray="1 1"
            style={{ strokeDashoffset: 0 }}
          />
        ))}
      </g>
      {list.map((a, i) => (
        <circle
          key={`e${i}`}
          ref={(el) => {
            ends.current[i] = el;
          }}
          cx={a.p1[0]}
          cy={a.p1[1]}
          r={3.4}
          fill="#121212"
        />
      ))}
      {list.map((a, i) => (
        <circle
          key={`h${i}`}
          ref={(el) => {
            heads.current[i] = el;
          }}
          cx={a.p1[0]}
          cy={a.p1[1]}
          r={4}
          fill="#ff5a1f"
          style={{ opacity: 0 }}
        />
      ))}
      <circle className="bnt-ping bnt-loop" cx={home[0]} cy={home[1]} r={8} fill="#ff5a1f" />
      <circle cx={home[0]} cy={home[1]} r={4.5} fill="#121212" stroke="#fff" strokeWidth={1.5} />
    </svg>
  );
}

export function MapTile({ origin, delay }: { origin: [number, number]; delay?: number }) {
  return (
    <Tile area="map" delay={delay} label="Where we work" className="flex flex-col p-5 md:p-7">
      <TileHead
        eyebrow="Where we work"
        title="Based in India. Working worldwide."
        body="Delivery led from India, for clients across time zones."
        href="/about"
        large
      />
      <div className="relative mt-4 min-h-[190px] flex-1">
        <div className="absolute inset-0">
          <Map origin={origin} />
        </div>
      </div>
    </Tile>
  );
}
