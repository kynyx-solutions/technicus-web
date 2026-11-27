"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { Tile, useLoop, useTile } from "./tile";

export type PracticeItem = { slug: string; name: string; summary: string; capabilities: string[] };

const DWELL = 4.2; // seconds per practice

function Cycler({ items }: { items: PracticeItem[] }) {
  const { hover, reduced } = useTile();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const fill = useRef<HTMLElement | null>(null);
  const t = useRef(0);

  // Hold still while someone is reading (hover or focus inside the tile).
  useLoop((dt) => {
    if (paused || hover) return;
    t.current += dt / DWELL;
    if (t.current >= 1) {
      t.current = 0;
      setI((v) => (v + 1) % items.length);
    }
    if (fill.current) fill.current.style.transform = `scaleX(${t.current})`;
  }, 1);

  const go = (n: number) => {
    t.current = 0;
    if (fill.current) fill.current.style.transform = "scaleX(0)";
    setI(n);
  };

  const p = items[i];
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <p className="bnt-eyebrow">Our practices</p>
        {!reduced ? (
          <button
            type="button"
            className="bnt-ctl bnt-raise !h-8 !w-8"
            onClick={() => setPaused((v) => !v)}
            aria-label={paused ? "Resume cycling through practices" : "Pause cycling through practices"}
          >
            {paused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        ) : null}
      </div>
      <ul className="mt-5 flex flex-col" aria-label="Choose a practice">
        {items.map((x, n) => (
          <li key={x.slug}>
            <button
              type="button"
              className="bnt-pname bnt-raise"
              onClick={() => go(n)}
              aria-current={n === i ? "true" : undefined}
              data-on={n === i}
            >
              <span>{x.name}</span>
              <span className="bnt-bar" aria-hidden="true">
                <i
                  ref={
                    n === i
                      ? (el) => {
                          fill.current = el;
                        }
                      : undefined
                  }
                  style={n === i ? { transform: reduced ? "scaleX(1)" : "scaleX(0)" } : undefined}
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div key={p.slug} className="bnt-swap mt-auto pt-5">
        <h3 className="bnt-display text-[32px] min-[1100px]:text-[34px]">{p.name}</h3>
        <p className="bnt-body mt-2.5 text-[15px]">{p.summary}</p>
        <Link href={`/services/${p.slug}`} className="bnt-link bnt-raise mt-4">
          Explore the practice <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export function PracticesTile({ items, delay }: { items: PracticeItem[]; delay?: number }) {
  return (
    <Tile area="prac" delay={delay} label="Our practices" className="p-5 md:p-7">
      <Cycler items={items} />
    </Tile>
  );
}
