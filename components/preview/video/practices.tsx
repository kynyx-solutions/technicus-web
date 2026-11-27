"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { s } from "./styles";
import { practiceFallback, practicePhotos, unsplash } from "./photos";

type Practice = { slug: string; name: string; summary: string; capabilities: { slug: string; name: string }[] };

/**
 * Practices as an interactive list. Hovering or focusing a practice
 * cross-fades its photograph in the sticky frame beside the list.
 */
export function Practices({ pillars }: { pillars: Practice[] }) {
  const [active, setActive] = useState(0);
  const current = pillars[active];

  return (
    <div className={s.practiceGrid}>
      <ul className={s.practiceList}>
        {pillars.map((p, i) => {
          const photo = practicePhotos[p.slug] ?? practiceFallback;
          return (
            <li key={p.slug} className={s.practiceItem} data-active={i === active}>
              <Link
                href={`/services/${p.slug}`}
                className={s.practiceLink}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className={s.practiceName}>{p.name}</span>
                <span className={s.practiceArrow} aria-hidden="true">
                  <ArrowUpRight size={20} strokeWidth={1.5} />
                </span>
              </Link>
              <div className={s.practiceMobile}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={unsplash(photo, 900, 75)} alt="" loading="lazy" decoding="async" />
                <p>{p.summary}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={s.stage} aria-hidden="true">
        <div className={s.stageFrame}>
          {pillars.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={p.slug}
              className={s.stageImg}
              data-active={i === active}
              src={unsplash(practicePhotos[p.slug] ?? practiceFallback, 1200)}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ))}
          <div className={s.stageScrim} />
          <div className={s.stageCaption}>
            <div key={current.slug} className={s.stageSwap}>
              <p className={s.eyebrow}>{current.name}</p>
              <p className={s.stageSummary} style={{ marginTop: 16 }}>
                {current.summary}
              </p>
              <ul className={s.capList}>
                {current.capabilities.map((c) => (
                  <li key={c.slug}>{c.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
