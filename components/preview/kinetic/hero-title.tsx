"use client";

import { useEffect, useRef, useState } from "react";
import { s } from "./styles";

const INTERVAL = 2600;

/*
  The hero headline: "We build / [word] / that hold up." The middle word rolls
  to the next on a timer, pauses while hovered or focused, while the hero is off
  screen or the tab is hidden, and never moves under reduced motion. Screen
  readers get the whole sentence once; the rolling copy is hidden from them.
*/
export function HeroTitle({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(true);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    return () => {
      mq.removeEventListener("change", sync);
      io.disconnect();
    };
  }, []);

  const running = !still && !paused && visible;

  const advance = () => {
    setPrev(index);
    setIndex((index + 1) % words.length);
  };

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const sentence = `We build ${words.slice(0, -1).join(", ")} and ${words[words.length - 1]} that hold up.`;

  return (
    <h1
      ref={ref}
      className={`${s.display} ${s.heroTitle}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className={s.srOnly}>{sentence}</span>
      <span aria-hidden="true" className="block">
        <span className={`${s.mask} ${s.heroLineA}`}>
          <span className={s.rise} style={{ "--d": 0 } as React.CSSProperties}>
            We
          </span>{" "}
          <span className={s.rise} style={{ "--d": 1 } as React.CSSProperties}>
            build
          </span>
        </span>
        <span className={s.heroLineB + " block"}>
          <span className={s.slot}>
            <span className={`${s.rise} ${s.slotSpacer}`} style={{ "--d": 2 } as React.CSSProperties}>
              {longest}
            </span>
            {words.map((w, i) => (
              <span
                key={w}
                className={s.slotWord}
                data-state={i === index ? "current" : i === prev ? "prev" : "next"}
              >
                <span className={s.rise} style={{ "--d": 2 } as React.CSSProperties}>
                  {w}
                </span>
              </span>
            ))}
          </span>
        </span>
        <span className={`${s.mask} ${s.heroLineC} text-right`}>
          <span className={s.rise} style={{ "--d": 3 } as React.CSSProperties}>
            that
          </span>{" "}
          <span className={s.rise} style={{ "--d": 4 } as React.CSSProperties}>
            hold
          </span>{" "}
          <span className={`${s.rise} ${s.outline}`} style={{ "--d": 5 } as React.CSSProperties}>
            up.
          </span>
        </span>
      </span>
      {!still && (
        <span aria-hidden="true" className={`${s.timer} mt-5 block w-40 md:mt-7 md:w-56`} data-paused={!running}>
          <span key={index} onAnimationEnd={advance} style={{ "--dur": `${INTERVAL}ms` } as React.CSSProperties} />
        </span>
      )}
    </h1>
  );
}
