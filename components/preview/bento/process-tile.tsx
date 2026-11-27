"use client";

import { useRef, useState } from "react";
import { Tile, useLoop, useTile } from "./tile";
import { TileHead } from "./head";

const stages = [
  { name: "Understand", line: "Your business, users and constraints, before any proposal." },
  { name: "Plan", line: "A scoped roadmap with priorities, costs and owners." },
  { name: "Build", line: "Small, regular releases you can see and test." },
  { name: "Run", line: "Monitoring, support and steady improvement." },
];

const LAP = 9; // seconds for one pass

function Timeline() {
  const { reduced } = useTile();
  const [now, setNow] = useState(-1);
  const p = useRef(0);
  const marker = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLoop((dt, speed) => {
    p.current = (p.current + (dt * speed) / LAP) % 1.12; // a short rest at the end
    const v = Math.min(1, p.current);
    const w = track.current?.offsetWidth ?? 0;
    if (marker.current) {
      marker.current.style.transform = `translateX(${v * w}px)`;
      marker.current.style.opacity = p.current > 1.08 ? "0" : "1";
    }
    if (fill.current) fill.current.style.transform = `scaleX(${v})`;
    const s = Math.min(stages.length - 1, Math.floor(v * stages.length));
    if (s !== now) setNow(s);
  });

  const active = (i: number) => reduced || now < 0 || i <= now;

  return (
    <div className="mt-6 min-[1100px]:mt-auto">
      <div ref={track} className="bnt-track" aria-hidden="true">
        <span ref={fill} className="bnt-track-fill" style={{ transform: reduced || now < 0 ? "scaleX(1)" : "scaleX(0)" }} />
        {stages.map((s, i) => (
          <span key={s.name} className="bnt-node" style={{ left: `calc(${i} * (100% + 24px) / 4 + 6px)` }} data-on={active(i)} data-now={i === now} />
        ))}
        {!reduced ? <span ref={marker} className="bnt-marker" style={{ opacity: now < 0 ? 0 : 1 }} /> : null}
      </div>
      <ol className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 min-[720px]:grid-cols-4">
        {stages.map((s, i) => (
          <li key={s.name} className="bnt-stage" data-on={active(i)}>
            <h4 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--bnt-muted)]">{s.name}</h4>
            <p className="mt-1 text-[13.5px] leading-[1.45] text-[#75726b]">{s.line}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ProcessTile({ delay }: { delay?: number }) {
  return (
    <Tile area="proc" delay={delay} label="How we work" className="flex flex-col p-5 md:p-7">
      <TileHead eyebrow="How we work" title="Clear stages, and you see progress at each one." />
      <Timeline />
    </Tile>
  );
}
