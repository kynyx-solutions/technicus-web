"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Tile, useLoop, useTile } from "./tile";
import { TileHead } from "./head";

export type IndustryItem = { slug: string; name: string };

const SPEEDS = [16, -12, 19, -14, 13];

function Row({ items, i }: { items: IndustryItem[]; i: number }) {
  const track = useRef<HTMLDivElement>(null);
  const half = useRef(0);
  const x = useRef(-((i * 97) % 200));

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      // The period includes one flex gap (8px) between the halves.
      half.current = (el.scrollWidth + 8) / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useLoop((dt, speed) => {
    const h = half.current;
    if (!h || !track.current) return;
    x.current -= SPEEDS[i % SPEEDS.length] * dt * speed;
    // Wrap into (-h, 0] so the duplicated half takes over seamlessly.
    x.current = ((x.current % h) - h) % h;
    track.current.style.transform = `translate3d(${x.current.toFixed(2)}px,0,0)`;
  }, 3);

  // Two identical halves so the loop is seamless. Only the first half is focusable.
  const seq = [...items, ...items];
  return (
    <div className="bnt-marquee overflow-hidden py-1">
      <div ref={track} className="bnt-pill-row flex w-max gap-2">
        {seq.map((it, n) => {
          const copy = n >= items.length;
          return (
            <Link
              key={n}
              href={`/industries/${it.slug}`}
              className="bnt-pill bnt-raise"
              tabIndex={copy ? -1 : undefined}
              aria-hidden={copy ? true : undefined}
            >
              {it.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Drift({ items }: { items: IndustryItem[] }) {
  const { reduced } = useTile();
  if (reduced) {
    return (
      <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
        {items.map((it) => (
          <li key={it.slug}>
            <Link href={`/industries/${it.slug}`} className="bnt-pill bnt-raise !px-3 !py-1.5 !text-[13.5px]">
              {it.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  }
  const rows: IndustryItem[][] = [[], [], []];
  items.forEach((it, n) => rows[n % rows.length].push(it));
  return (
    <div className="-mx-5 mt-auto flex flex-col gap-3 pt-6 md:-mx-7">
      {rows.map((r, i) => (
        <Row key={i} items={r} i={i} />
      ))}
    </div>
  );
}

export function IndustriesTile({ items, delay }: { items: IndustryItem[]; delay?: number }) {
  return (
    <Tile area="ind" tone="paper" delay={delay} label="Industries" className="flex flex-col p-5 md:p-7">
      <TileHead
        eyebrow="Industries"
        title="Sector knowledge that shortens the brief."
        body={`From education to public sector, across ${items.length} industries.`}
        href="/industries"
        arrow
      />
      <Drift items={items} />
    </Tile>
  );
}
