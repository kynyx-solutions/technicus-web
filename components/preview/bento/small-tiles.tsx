"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, MousePointer2 } from "lucide-react";
import { Tile, useLoop, useTile } from "./tile";
import { TileHead } from "./head";

/* ---------------- Design: a wireframe that resolves into a finished block ---------------- */

function Morph() {
  const { reduced } = useTile();
  const [state, setState] = useState<"wire" | "done">("done");
  const t = useRef(0);
  const started = useRef(false);

  useLoop((dt, speed) => {
    if (!started.current) {
      started.current = true;
      setState("wire");
      return;
    }
    t.current += dt * speed;
    const hold = state === "wire" ? 1.8 : 2.6;
    if (t.current > hold) {
      t.current = 0;
      setState((s) => (s === "wire" ? "done" : "wire"));
    }
  });

  const s = reduced ? "done" : state;
  return (
    <div className="bnt-ui mx-auto w-full max-w-[230px] p-3.5" data-state={s} aria-hidden="true">
      <div className="flex items-center gap-2">
        <span className="bnt-ui-el h-5 w-5 flex-none" data-k="av" style={{ "--i": 0 } as React.CSSProperties} />
        <span className="bnt-ui-el h-2 w-1/2" data-k="h" style={{ "--i": 1 } as React.CSSProperties} />
      </div>
      <div className="bnt-ui-el mt-3 h-[70px] overflow-hidden" data-k="img" style={{ "--i": 2 } as React.CSSProperties}>
        <svg className="bnt-ui-x absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0 0 L100 100 M100 0 L0 100" stroke="#b9b3a7" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="bnt-ui-shape absolute right-[14%] top-[18%] h-10 w-10 rounded-full bg-white" />
        <span className="bnt-ui-shape absolute bottom-[-8px] left-[12%] h-9 w-14 rounded-[4px] bg-[#121212]" />
      </div>
      <span className="bnt-ui-el mt-3 block h-1.5 w-[92%]" data-k="l" style={{ "--i": 3 } as React.CSSProperties} />
      <span className="bnt-ui-el mt-1.5 block h-1.5 w-[68%]" data-k="l" style={{ "--i": 4 } as React.CSSProperties} />
      <span className="bnt-ui-el mt-3.5 block h-6 w-20" data-k="btn" style={{ "--i": 5 } as React.CSSProperties} />
      {!reduced ? (
        <span
          className="bnt-ui-cursor text-[#121212]"
          style={{ transform: s === "done" ? "translate(78px, 168px)" : "translate(150px, 56px)" }}
        >
          <MousePointer2 size={16} fill="#fff" strokeWidth={1.6} />
        </span>
      ) : null}
    </div>
  );
}

export function DesignTile({ delay }: { delay?: number }) {
  return (
    <Tile area="dsgn" delay={delay} label="Experience design" className="p-5 md:p-6">
      <div className="grid h-full items-center gap-5 min-[480px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <TileHead eyebrow="Experience Design" title="From sketch to screens people trust." href="/services/experience-design" arrow={false} />
        <Morph />
      </div>
    </Tile>
  );
}

/* ---------------- AI and data: scattered inputs become ordered output ---------------- */

const VW = 240;
const VH = 150;
const LANES = [36, 62, 88, 114];
const N = 34;

function rand(i: number) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const seeds = Array.from({ length: N }, (_, i) => ({
  x0: (i / N) * VW,
  y: 14 + rand(i) * (VH - 28),
  lane: LANES[Math.floor(rand(i + 50) * LANES.length)],
  v: 22 + rand(i + 99) * 14,
  wob: rand(i + 7) * Math.PI * 2,
}));

function laneY(s: (typeof seeds)[number], x: number, time: number) {
  const mid = VW / 2;
  const raw = s.y + Math.sin(time * 1.4 + s.wob) * 4;
  if (x < mid - 10) return raw;
  const k = Math.min(1, (x - (mid - 10)) / 40);
  const e = 1 - Math.pow(1 - k, 3);
  return raw + (s.lane - raw) * e;
}

function Flow() {
  const refs = useRef<(SVGCircleElement | null)[]>([]);
  const xs = useRef(seeds.map((s) => s.x0));
  const time = useRef(0);

  useLoop((dt, speed) => {
    time.current += dt;
    seeds.forEach((s, i) => {
      let x = xs.current[i] + s.v * dt * speed;
      if (x > VW + 6) x -= VW + 12;
      xs.current[i] = x;
      const el = refs.current[i];
      if (!el) return;
      const y = laneY(s, x, time.current);
      el.setAttribute("cx", x.toFixed(1));
      el.setAttribute("cy", y.toFixed(1));
      el.setAttribute("fill", x > VW / 2 ? "#ff5a1f" : "#8c8981");
    });
  });

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="h-full w-full" aria-hidden="true">
      {LANES.map((y) => (
        <line key={y} x1={VW / 2 + 30} x2={VW} y1={y} y2={y} stroke="#2c2c2a" strokeWidth="1" />
      ))}
      <rect x={VW / 2 - 9} y={10} width={18} height={VH - 20} rx={4} fill="#1f1f1e" stroke="#3a3936" />
      {[0, 1, 2, 3, 4].map((k) => (
        <circle key={k} cx={VW / 2} cy={26 + k * 24} r={1.6} fill="#6d6a63" />
      ))}
      {seeds.map((s, i) => (
        <circle
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          cx={s.x0}
          cy={laneY(s, s.x0, 0)}
          r={3}
          fill={s.x0 > VW / 2 ? "#ff5a1f" : "#8c8981"}
        />
      ))}
    </svg>
  );
}

export function AiTile({ delay }: { delay?: number }) {
  return (
    <Tile area="ai" tone="dark" delay={delay} label="AI and data" className="p-5 md:p-6">
      <div className="grid h-full items-center gap-4 min-[480px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <TileHead eyebrow="AI and Data" title="AI put to work on real business problems." href="/services/ai-data" arrow={false} />
        <div className="h-[140px] min-[1100px]:h-full">
          <Flow />
        </div>
      </div>
    </Tile>
  );
}

/* ---------------- Managed services: a steady pulse after launch ---------------- */

const BEAT = "M0 30 H38 L44 30 L48 22 L52 30 L58 30 L62 6 L67 50 L72 24 L76 30 H120";

function Pulse() {
  const g = useRef<SVGGElement>(null);
  const x = useRef(0);
  useLoop((dt, speed) => {
    x.current = (x.current + 34 * dt * speed) % 120;
    if (g.current) g.current.style.transform = `translateX(${-x.current}px)`;
  });
  const beats = Array.from({ length: 8 }, (_, i) => i * 120);
  return (
    <svg viewBox="0 0 480 56" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="bnt-fade" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.65" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="bnt-mask">
          <rect width="480" height="56" fill="url(#bnt-fade)" />
        </mask>
      </defs>
      <g mask="url(#bnt-mask)">
        <g ref={g}>
          {beats.map((b) => (
            <path key={b} d={BEAT} transform={`translate(${b} 0)`} fill="none" stroke="#121212" strokeWidth="1.6" strokeLinejoin="round" />
          ))}
        </g>
      </g>
      <circle cx="420" cy="30" r="4" fill="#ff5a1f" className="bnt-loop bnt-ping" />
      <circle cx="420" cy="30" r="3.2" fill="#ff5a1f" />
    </svg>
  );
}

export function RunTile({ delay }: { delay?: number }) {
  return (
    <Tile area="run" delay={delay} label="Managed services" className="flex flex-col p-5 md:p-6">
      <TileHead
        eyebrow="Managed Services and Teams"
        title="We stay after launch."
        body="Support, monitoring and improvements, or a dedicated team that works as part of yours."
        href="/services/managed-services"
      />
      <div className="-mx-5 mt-auto h-[64px] pt-3 md:-mx-6">
        <Pulse />
      </div>
    </Tile>
  );
}

/* ---------------- Contact ---------------- */

export function ContactTile({ email, phone, phoneHref, delay }: { email: string; phone: string; phoneHref: string; delay?: number }) {
  return (
    <Tile area="cont" tone="accent" delay={delay} label="Start a project" className="p-5 md:p-7">
      <div className="flex h-full flex-col justify-between gap-6 min-[720px]:flex-row min-[720px]:items-end">
        <div>
          <p className="bnt-eyebrow">Start a project</p>
          <h3 className="bnt-display mt-3 max-w-[14ch] text-[36px] min-[1100px]:text-[46px]">
            <Link href="/contact" className="bnt-stretch">
              Tell us what you need to build.
            </Link>
          </h3>
        </div>
        <div className="flex flex-col items-start gap-3 min-[720px]:items-end">
          <a href={`mailto:${email}`} className="bnt-raise group inline-flex items-center gap-2 text-[20px] font-semibold tracking-[-0.02em] underline decoration-[1.5px] underline-offset-[6px] min-[1100px]:text-[24px]">
            {email}
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a href={phoneHref} className="bnt-raise text-[14.5px] text-[rgba(18,18,18,0.8)] hover:text-[var(--bnt-ink)]">
            {phone}
          </a>
          <span className="bnt-btn bnt-btn-ink mt-1 px-5 py-3 text-[14.5px]" aria-hidden="true">
            Start a project <ArrowRight size={16} />
          </span>
        </div>
      </div>
    </Tile>
  );
}
