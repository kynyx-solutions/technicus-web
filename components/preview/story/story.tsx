"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { StoryCanvas } from "./canvas";

export type StoryStage = {
  key: string;
  slug: string;
  practice: string;
  title: string;
  body: string;
  capabilities: string[];
};

export type RailItem = { slug: string; label: string };

/** Static position for a stage: mid-hold, every element of that stage in place. */
const hold = (i: number) => i + 0.5;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/*
 * The pinned story. On wide screens with motion allowed, the text column
 * scrolls normally while one canvas stays pinned beside it; a single rAF loop
 * turns the scroll position into --p, smoothed by a critically damped spring.
 * Elsewhere each stage shows its own canvas inline (static, or scrubbed as it
 * enters on phones).
 */
export function Story({ stages, rail, stageToRail }: { stages: StoryStage[]; rail: RailItem[]; stageToRail: number[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const board = boardRef.current;
    const fill = fillRef.current;
    if (!root || !board || !fill) return;
    const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-sty-step]"));
    const inlines = Array.from(root.querySelectorAll<HTMLElement>("[data-sty-inline]"));
    const labels = Array.from(root.querySelectorAll<HTMLElement>("[data-sty-label]"));
    const first = steps[0];
    if (!first) return;

    const mqPin = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: no-preference)");

    let vh = window.innerHeight;
    let stepH = first.offsetHeight || vh;
    let x = 0;
    let v = 0;
    let last = 0;
    let raf = 0;
    let inView = false;
    let active = -1;
    const shown = new Set<HTMLElement>();
    const last8 = stages.length;

    const target = () => clamp((vh / 2 - first.getBoundingClientRect().top) / stepH, -0.6, last8);

    const railPos = (s: number) => {
      const i = clamp(Math.floor(s), 0, last8 - 1);
      const j = clamp(i + 1, 0, last8 - 1);
      const f = clamp(s - i, 0, 1);
      return stageToRail[i] + (stageToRail[j] - stageToRail[i]) * f;
    };

    const write = (p: number) => {
      board.style.setProperty("--p", p.toFixed(4));
      const r = railPos(p);
      fill.style.transform = `scaleX(${clamp((r + 0.5) / rail.length, 0, 1).toFixed(4)})`;
      const a = stageToRail[clamp(Math.floor(p), 0, last8 - 1)];
      if (a !== active) {
        active = a;
        labels.forEach((el, k) => {
          if (k === a) el.setAttribute("data-active", "");
          else el.removeAttribute("data-active");
        });
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!inView || document.hidden) {
        last = 0;
        return;
      }
      if (mqPin.matches) {
        const t = target();
        const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
        last = now;
        // Critically damped spring: follows the scroll closely, never overshoots.
        const w = 11;
        v += (-w * w * (x - t) - 2 * w * v) * dt;
        x += v * dt;
        const settled = Math.abs(x - t) < 2e-4 && Math.abs(v) < 2e-3;
        if (settled) {
          x = t;
          v = 0;
        }
        write(x);
        if (!settled) raf = requestAnimationFrame(frame);
        else last = 0;
        return;
      }
      last = 0;
      if (!mqMotion.matches || !shown.size) return;
      // Phones: each inline canvas scrubs its own stage as it comes into view.
      const els = Array.from(shown);
      const tops = els.map((el) => el.getBoundingClientRect().top);
      els.forEach((el, k) => {
        const i = Number(el.dataset.styInline);
        const local = clamp((vh * 0.92 - tops[k]) / (vh * 0.5), 0, 1);
        el.style.setProperty("--p", (i - 0.5 + local).toFixed(4));
      });
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const reset = () => {
      inlines.forEach((el) => el.style.setProperty("--p", String(hold(Number(el.dataset.styInline)))));
      vh = window.innerHeight;
      stepH = first.offsetHeight || vh;
      x = target();
      v = 0;
      write(x);
      kick();
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? false;
        root.dataset.run = inView && !document.hidden ? "1" : "0";
        if (inView) kick();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(root);

    const ioInline = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const el = e.target as HTMLElement;
        if (e.isIntersecting) shown.add(el);
        else shown.delete(el);
      });
      kick();
    });
    inlines.forEach((el) => ioInline.observe(el));

    const ro = new ResizeObserver(() => {
      vh = window.innerHeight;
      stepH = first.offsetHeight || vh;
      kick();
    });
    ro.observe(first);

    const onVis = () => {
      root.dataset.run = inView && !document.hidden ? "1" : "0";
      if (!document.hidden) kick();
    };

    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    document.addEventListener("visibilitychange", onVis);
    mqPin.addEventListener("change", reset);
    mqMotion.addEventListener("change", reset);

    x = target();
    write(x);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ioInline.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      document.removeEventListener("visibilitychange", onVis);
      mqPin.removeEventListener("change", reset);
      mqMotion.removeEventListener("change", reset);
    };
  }, [stages.length, rail.length, stageToRail]);

  return (
    <section ref={rootRef} className="sty-story" data-run="1" aria-labelledby="sty-story-title">
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html:
              ".sty-story .sty-stage{display:none!important}.sty-story .sty-step-art{display:block!important}@media (min-width:1024px){.sty-story .sty-grid{display:block!important}.sty-story .sty-step{display:grid!important;min-height:0!important;padding-block:72px!important;border-bottom:1px solid var(--sty-line)!important}.sty-story .sty-story-head{margin-bottom:40px!important}}",
          }}
        />
      </noscript>

      <div className="sty-wrap sty-story-head">
        <p className="sty-eyebrow">How a product gets built</p>
        <h2 id="sty-story-title" className="sty-display sty-h2">
          Watch an idea become a product, then keep scrolling to see who looks after it.
        </h2>
      </div>

      <div className="sty-wrap sty-grid">
        <div className="sty-steps">
          {stages.map((s, i) => (
            <article key={s.key} id={`sty-${s.key}`} className="sty-step" data-sty-step aria-labelledby={`sty-${s.key}-h`}>
              <div className="sty-step-copy">
                <p className="sty-kicker">
                  <span className="sty-kicker-mark" aria-hidden="true" />
                  {s.practice}
                </p>
                <h3 id={`sty-${s.key}-h`} className="sty-display sty-h3">
                  {s.title}
                </h3>
                <p className="sty-body">{s.body}</p>
                <ul className="sty-caps" aria-label={`${s.practice} capabilities`}>
                  {s.capabilities.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
                <Link href={`/services/${s.slug}`} className="sty-textlink">
                  Explore {s.practice}
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
                </Link>
              </div>
              <div className="sty-step-art" data-sty-inline={i} style={{ "--p": hold(i) } as React.CSSProperties}>
                <StoryCanvas />
              </div>
            </article>
          ))}
        </div>

        <div className="sty-stage">
          <div className="sty-stage-inner">
            <StoryCanvas ref={boardRef} p={-0.5} className="sty-board-pinned" />
            <nav className="sty-rail" aria-label="Story progress">
              <span className="sty-rail-track" aria-hidden="true">
                <span ref={fillRef} className="sty-rail-fill" />
              </span>
              <ol className="sty-rail-list">
                {rail.map((r, k) => {
                  const stage = stages[stageToRail.indexOf(k)];
                  return (
                    <li key={r.slug}>
                      <a href={`#sty-${stage?.key}`} className="sty-rail-label" data-sty-label>
                        {r.label}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
