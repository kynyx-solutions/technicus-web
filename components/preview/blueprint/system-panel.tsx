"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check } from "lucide-react";

const stages = [
  { id: "plan", label: "Plan", log: "reading the brief and the current system" },
  { id: "build", label: "Build", log: "compiling web, api and workers" },
  { id: "test", label: "Test", log: "unit, integration and accessibility checks" },
  { id: "review", label: "Review", log: "peer review and security scan" },
  { id: "deploy", label: "Deploy", log: "rolling out behind the edge" },
] as const;

const DONE = stages.length;
const STEP_MS = 1150;
const HOLD_MS = 4200;
const FIRST_MS = 2100;

function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const reducedNow = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Node = { id: string; x: number; y: number; label: string; role: string; d: number };
const W = 96;
const H = 44;
const nodes: Node[] = [
  { id: "edge", x: 16, y: 128, label: "edge", role: "routing", d: 0 },
  { id: "web", x: 160, y: 58, label: "web", role: "interface", d: 380 },
  { id: "jobs", x: 160, y: 198, label: "workers", role: "background", d: 460 },
  { id: "api", x: 304, y: 128, label: "api", role: "services", d: 820 },
  { id: "ai", x: 448, y: 58, label: "ai", role: "models", d: 1220 },
  { id: "data", x: 448, y: 198, label: "data", role: "storage", d: 1300 },
];
const edges = [
  { d: "M112 150 H136 V80 H160", delay: 160 },
  { d: "M112 150 H136 V220 H160", delay: 220 },
  { d: "M256 80 H280 V150 H304", delay: 600 },
  { d: "M256 220 H280 V150 H304", delay: 660 },
  { d: "M400 150 H424 V80 H448", delay: 1000 },
  { d: "M400 150 H424 V220 H448", delay: 1060 },
];

function Diagram() {
  return (
    <svg viewBox="0 0 560 290" className="block h-auto w-full" aria-hidden="true" focusable="false">
      <defs>
        <pattern id="bp-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="rgba(242,241,236,0.16)" />
        </pattern>
      </defs>
      <rect width="560" height="290" fill="url(#bp-dots)" />

      {/* Private network boundary */}
      <rect
        x="290" y="36" width="264" height="230" fill="none"
        stroke="rgba(242,241,236,0.28)" strokeDasharray="4 4"
        className="bp-fade" style={{ ["--bp-d" as string]: "700ms" }}
      />
      <text x="298" y="28" className="bp-fade" style={{ ["--bp-d" as string]: "760ms" }}
        fill="rgba(242,241,236,0.5)" fontSize="10" letterSpacing="1" fontFamily="var(--bp-font-mono)">
        PRIVATE NETWORK
      </text>

      {/* Top dimension line */}
      <g className="bp-fade" style={{ ["--bp-d" as string]: "200ms" }} stroke="rgba(242,241,236,0.35)">
        <line x1="16" y1="14" x2="16" y2="22" />
        <line x1="256" y1="14" x2="256" y2="22" />
        <line x1="16" y1="18" x2="108" y2="18" />
        <line x1="164" y1="18" x2="256" y2="18" />
      </g>
      <text x="136" y="21" textAnchor="middle" fill="rgba(242,241,236,0.5)" fontSize="10" letterSpacing="1"
        fontFamily="var(--bp-font-mono)" className="bp-fade" style={{ ["--bp-d" as string]: "260ms" }}>
        PUBLIC
      </text>

      {edges.map((e) => (
        <path key={e.d} d={e.d} pathLength={1} fill="none" stroke="rgba(242,241,236,0.55)" strokeWidth="1.2"
          className="bp-draw" style={{ ["--bp-d" as string]: `${e.delay}ms` }} />
      ))}
      <g className="bp-fade" style={{ ["--bp-d" as string]: "1900ms" }}>
        {edges.map((e) => (
          <path key={e.d} d={e.d} pathLength={1} fill="none" stroke="var(--bp-accent)" strokeWidth="1.6"
            strokeLinecap="round" className="bp-flow" />
        ))}
      </g>

      {nodes.map((n) => (
        <g key={n.id} className="bp-pop" style={{ ["--bp-d" as string]: `${n.d}ms` }}>
          <rect x={n.x} y={n.y} width={W} height={H} fill="#171a17" stroke="rgba(242,241,236,0.6)" />
          <rect x={n.x - 3} y={n.y - 3} width={W + 6} height={H + 6} fill="none" stroke="var(--bp-accent)"
            strokeWidth="1.5" className={`bp-hl bp-hl-${n.id}`} />
          <circle cx={n.x + W} cy={n.y + H / 2} r="2.5" fill="#f2f1ec" />
          <circle cx={n.x} cy={n.y + H / 2} r="2.5" fill="#f2f1ec" />
          <text x={n.x + 10} y={n.y + 19} fill="#f2f1ec" fontSize="13" fontWeight="500" fontFamily="var(--bp-font-mono)">
            {n.label}
          </text>
          <text x={n.x + 10} y={n.y + 34} fill="rgba(242,241,236,0.5)" fontSize="9.5" letterSpacing="0.6"
            fontFamily="var(--bp-font-mono)">
            {n.role.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}

function StageIcon({ state }: { state: "idle" | "run" | "done" }) {
  if (state === "done")
    return (
      <span className="bp-swap grid size-5 place-items-center bg-[var(--bp-accent)] text-[var(--bp-ink)]">
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    );
  if (state === "run")
    return (
      <span className="bp-swap grid size-5 place-items-center">
        <svg viewBox="0 0 20 20" className="bp-spin size-4" aria-hidden="true">
          <circle cx="10" cy="10" r="7.5" fill="none" stroke="rgba(242,241,236,0.2)" strokeWidth="2" />
          <path d="M10 2.5 A7.5 7.5 0 0 1 17.5 10" fill="none" stroke="var(--bp-accent)" strokeWidth="2" />
        </svg>
      </span>
    );
  return <span className="grid size-5 place-items-center"><span className="size-1.5 bg-white/30" /></span>;
}

/** Hero panel: an architecture drawing that draws itself, then a release
 *  pipeline that runs stage by stage. Loops while on screen. */
export function SystemPanel() {
  const reduced = useSyncExternalStore(subscribeMotion, reducedNow, () => false);
  const [step, setStep] = useState(-1);
  const [visible, setVisible] = useState(true);
  const [tabHidden, setTabHidden] = useState(false);
  const started = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const active = visible && !tabHidden && !reduced;

  useEffect(() => {
    if (!active) return;
    let delay: number;
    if (step === -1) delay = started.current ? 500 : FIRST_MS;
    else if (step === DONE) delay = HOLD_MS;
    else delay = STEP_MS;
    const t = window.setTimeout(() => {
      started.current = true;
      setStep((s) => (s >= DONE ? -1 : s + 1));
    }, delay);
    return () => window.clearTimeout(t);
  }, [step, active]);

  const current = reduced ? DONE : step;
  const stageId = current >= 0 && current < DONE ? stages[current].id : current === DONE ? "done" : "idle";
  const status = current === DONE ? "Released" : current >= 0 ? "Running" : "Queued";
  const logLine =
    current === DONE ? "release complete, watching the system" : current >= 0 ? stages[current].log : "waiting for a change on main";

  return (
    <div
      ref={root}
      className="bp-sys relative border border-[var(--bp-ink)] bg-[var(--bp-night)] text-[#f2f1ec] shadow-[10px_10px_0_0_rgba(18,20,18,0.08)]"
      data-stage={stageId}
      data-paused={active ? undefined : ""}
    >
      <div className="flex items-center justify-between border-b border-[var(--bp-night-line)] px-4 py-2.5">
        <span className="bp-label text-white/60">System · overview</span>
        <span className="bp-label flex items-center gap-2 text-white/80" aria-live="polite">
          <span className={`size-1.5 ${current === DONE ? "bg-[var(--bp-accent)]" : "bp-blink bg-white/70"}`} aria-hidden="true" />
          {status}
        </span>
      </div>

      <div className="px-3 pt-4 pb-2 sm:px-5">
        <Diagram />
      </div>

      <div className="border-t border-[var(--bp-night-line)]">
        <div className="flex items-center justify-between px-4 pt-3 sm:px-5">
          <span className="bp-label text-white/50">Pipeline · main</span>
          <span className="bp-label text-white/40">Every change, same path</span>
        </div>
        <ol className="grid grid-cols-5 gap-px px-4 pt-3 sm:px-5" aria-label="Release pipeline">
          {stages.map((s, i) => {
            const state = current > i ? "done" : current === i ? "run" : "idle";
            return (
              <li key={s.id} className="min-w-0">
                <StageIcon key={state} state={state} />
                <span className={`mt-2 block truncate text-[13px] font-medium ${state === "idle" ? "text-white/45" : "text-white"}`}>
                  {s.label}
                </span>
                <span className="bp-label mt-0.5 block truncate text-[10px] text-white/40">
                  {state === "done" ? "passed" : state === "run" ? "running" : "queued"}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="mx-4 mt-3 h-px bg-white/10 sm:mx-5" aria-hidden="true">
          <div
            className="bp-bar h-px bg-[var(--bp-accent)]"
            style={{ transform: `scaleX(${Math.max(0, Math.min(current + (current < DONE ? 0.5 : 0), DONE)) / DONE})` }}
          />
        </div>
        <p className="bp-mono flex min-h-11 items-center gap-2 px-4 py-3 text-[12px] text-white/70 sm:px-5">
          <span className="text-[var(--bp-accent)]" aria-hidden="true">›</span>
          <span key={logLine} className="bp-swap truncate">{logLine}</span>
        </p>
      </div>
    </div>
  );
}
