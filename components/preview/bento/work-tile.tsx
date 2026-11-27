"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Tile, useLoop, useTile } from "./tile";

export type WorkItem = { slug: string; client: string; industry: string; sector: string; summary: string; country: string };

const DWELL = 6;

/** Abstract cover, composed from the project's position so each one differs. No fake screenshots. */
function Cover({ item, n }: { item: WorkItem; n: number }) {
  const v = n % 3;
  return (
    <div className="bnt-cover relative h-full overflow-hidden rounded-[8px]" aria-hidden="true">
      <div className="bnt-cover-grid absolute inset-0" />
      <div
        className="bnt-cover-shape absolute"
        style={
          {
            width: "58%",
            aspectRatio: "1",
            right: v === 0 ? "-12%" : v === 1 ? "auto" : "18%",
            left: v === 1 ? "-10%" : "auto",
            top: v === 2 ? "-30%" : "14%",
            borderRadius: v === 1 ? "8px" : "999px",
            background: "#ff5a1f",
            "--bnt-sx": v === 1 ? "14px" : "-18px",
            "--bnt-sy": "-10px",
            "--bnt-sr": v === 1 ? "12deg" : "0deg",
          } as React.CSSProperties
        }
      />
      <div
        className="bnt-cover-shape absolute"
        style={
          {
            width: "34%",
            aspectRatio: "1",
            left: v === 1 ? "auto" : "10%",
            right: v === 1 ? "12%" : "auto",
            bottom: "-14%",
            borderRadius: v === 2 ? "8px" : "999px",
            boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.55)",
            "--bnt-sx": "16px",
            "--bnt-sy": "-14px",
            "--bnt-sr": "-8deg",
          } as React.CSSProperties
        }
      />
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
        <span className="bnt-display text-[44px] text-white min-[1100px]:text-[64px]">{item.client}</span>
      </div>
      <span className="absolute left-5 top-5 text-[12.5px] text-[#cfccc4]">{item.sector}</span>
    </div>
  );
}

function Carousel({ items }: { items: WorkItem[] }) {
  const { hover, reduced } = useTile();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const t = useRef(0);
  const fill = useRef<HTMLElement | null>(null);

  useLoop((dt) => {
    if (hover) return;
    t.current += dt / DWELL;
    if (t.current >= 1) {
      t.current = 0;
      setDir(1);
      setI((v) => (v + 1) % items.length);
    }
    if (fill.current) fill.current.style.transform = `scaleX(${t.current})`;
  }, 1);

  const go = (step: number) => {
    t.current = 0;
    if (fill.current) fill.current.style.transform = "scaleX(0)";
    setDir(step);
    setI((v) => (v + step + items.length) % items.length);
  };

  const p = items[i];
  const style = { "--bnt-dir": `${dir * 28}px` } as React.CSSProperties;

  return (
    <div className="grid h-full gap-5 min-[720px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[720px]:gap-7">
      <div className="flex min-h-0 flex-col">
        <p className="bnt-eyebrow">Selected work</p>
        <div key={p.slug} className="bnt-swap-x mt-6 min-[720px]:mt-auto" style={style}>
          <p className="text-[13px] text-[var(--bnt-muted)]">
            {p.industry} · {p.country}
          </p>
          <h3 className="bnt-display mt-2 text-[34px] min-[1100px]:text-[44px]">{p.client}</h3>
          <p className="bnt-body mt-3 line-clamp-4">{p.summary}</p>
          <Link href={`/work/${p.slug}`} className="bnt-link bnt-raise mt-5">
            Read the case study <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="mt-7 flex items-center gap-4">
          <div className="flex flex-1 gap-1.5" aria-hidden="true">
            {items.map((x, n) => (
              <span key={x.slug} className="bnt-bar" data-done={n < i || (reduced && n === i)}>
                <i
                  ref={
                    n === i
                      ? (el) => {
                          fill.current = el;
                        }
                      : undefined
                  }
                  style={n === i && !reduced ? { transform: "scaleX(0)" } : undefined}
                />
              </span>
            ))}
          </div>
          <div className="bnt-raise flex gap-2">
            <button type="button" className="bnt-ctl" onClick={() => go(-1)} aria-label="Previous case study">
              <ArrowLeft size={15} />
            </button>
            <button type="button" className="bnt-ctl" onClick={() => go(1)} aria-label="Next case study">
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
        <Link href="/work" className="bnt-raise mt-4 text-[13px] text-[var(--bnt-muted)] underline-offset-4 hover:text-[var(--bnt-ink)] hover:underline">
          All work
        </Link>
      </div>
      <div className="order-first min-h-[220px] min-[720px]:order-none">
        <div key={p.slug} className="bnt-swap h-full">
          <Cover item={p} n={i} />
        </div>
      </div>
    </div>
  );
}

export function WorkTile({ items, delay }: { items: WorkItem[]; delay?: number }) {
  return (
    <Tile area="work" delay={delay} label="Selected work" className="p-5 md:p-7">
      <Carousel items={items} />
    </Tile>
  );
}
