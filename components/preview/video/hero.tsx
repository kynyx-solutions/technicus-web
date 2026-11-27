"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { s } from "./styles";
import { heroFrames, unsplash, unsplashSet, type HeroFrame } from "./photos";
import { useReducedMotion, useScrollFrame } from "./motion";

const FRAME_MS = 6500;

// Each still drifts in a different direction so the sequence feels filmed.
const drift = [
  { "--ox": "60%", "--oy": "40%", "--tx": "-2%", "--ty": "-1%" },
  { "--ox": "30%", "--oy": "50%", "--tx": "1.5%", "--ty": "-1.5%" },
  { "--ox": "50%", "--oy": "70%", "--tx": "-1%", "--ty": "1.5%" },
  { "--ox": "50%", "--oy": "45%", "--tx": "0%", "--ty": "-2%" },
] as unknown as CSSProperties[];

type Props = {
  frames?: HeroFrame[];
  /**
   * BRAND FILM SLOT. When real footage exists, pass it here, e.g.
   * `video={{ src: "/media/technicus-reel.mp4", poster: "/media/reel-poster.jpg" }}`.
   * The video then replaces the photo sequence and the progress bars are hidden.
   */
  video?: { src: string; poster?: string };
};

export function Hero({ frames = heroFrames, video }: Props) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [paused, setPaused] = useState(false);
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const playing = !video && !reduced && frames.length > 1;

  const go = (next: number) => {
    if (next === index) return;
    setPrev(index);
    setIndex(next);
  };
  const advance = () => go((index + 1) % frames.length);

  // Pause the film when it is off screen or the tab is hidden.
  useEffect(() => {
    if (!playing) return;
    const el = section.current!;
    let visible = true;
    const sync = () => setPaused(!visible || document.hidden);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [playing]);

  // Scroll: the image layer sinks slower than the page, the copy lifts and fades.
  const onScroll = useCallback(() => {
    const y = scrollY;
    const vh = innerHeight;
    if (y > vh * 1.2) return;
    if (media.current) media.current.style.transform = `translate3d(0, ${y * 0.38}px, 0) scale(${1 + (y / vh) * 0.06})`;
    if (content.current) {
      content.current.style.transform = `translate3d(0, ${y * -0.12}px, 0)`;
      content.current.style.opacity = String(Math.max(0, 1 - (y / vh) * 1.5));
    }
  }, []);
  useScrollFrame(onScroll, !reduced);

  return (
    <section
      ref={section}
      className={`${s.hero} ${playing ? "" : s.heroStill}`}
      data-paused={paused}
      aria-labelledby="hero-title"
    >
      <div ref={media} className={s.heroMedia}>
        {video ? (
          <div className={s.frame} data-state="active">
            <video src={video.src} poster={video.poster} autoPlay={!reduced} muted loop playsInline aria-hidden="true" />
          </div>
        ) : (
          frames.map((f, i) => (
            <div
              key={f.id}
              className={s.frame}
              data-state={i === index ? "active" : i === prev ? "prev" : "idle"}
              style={drift[i % drift.length]}
              aria-hidden={i !== index}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={unsplash(f.id, 2000)}
                srcSet={unsplashSet(f.id, [800, 1280, 2000, 2600])}
                sizes="100vw"
                alt={i === 0 ? f.alt : ""}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
                decoding="async"
              />
            </div>
          ))
        )}
      </div>
      <div className={s.scrim} />
      <div className={s.grain} />

      <div ref={content} className={`${s.shell} ${s.heroContent}`}>
        <p className={`${s.eyebrow} ${s.heroFade}`} data-vmask>
          Technology consultancy · India and worldwide
        </p>
        <h1 id="hero-title" className={`${s.heroTitle} ${s.mask}`} data-vmask style={{ marginTop: 28 }}>
          <span className={s.line}>
            <span className={s.lineInner} style={{ "--d": 0 } as CSSProperties}>
              We build what
            </span>
          </span>
          <span className={s.line}>
            <span className={s.lineInner} style={{ "--d": 1 } as CSSProperties}>
              serious business
            </span>
          </span>
          <span className={s.line}>
            <span className={s.lineInner} style={{ "--d": 2 } as CSSProperties}>
              <em>runs on.</em>
            </span>
          </span>
        </h1>
        <div className={s.heroFade} data-vmask>
          <p className={s.heroLede}>
            Strategy, design, engineering, AI and cloud from one accountable team. We help organisations decide what to build, then build it properly and keep it running.
          </p>
          <div className={s.heroActions}>
            <Link href="/contact" className={s.btn}>
              Start a conversation <ArrowRight size={18} />
            </Link>
            <Link href="#work" className={s.textLink}>
              See our work
            </Link>
          </div>
        </div>
      </div>

      <div className={s.heroBar}>
        <div className={`${s.shell} ${s.heroBarRow}`}>
          {playing ? (
            <div className={s.progress} role="group" aria-label="Hero film">
              {frames.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  className={s.progressItem}
                  aria-current={i === index}
                  aria-label={`Show ${f.label.toLowerCase()} scene`}
                  onClick={() => go(i)}
                >
                  <span className={s.track}>
                    <span
                      // The key restarts the fill animation each time this scene starts.
                      key={i === index ? `run-${index}-${prev}` : "idle"}
                      className={s.fill}
                      data-run={i === index}
                      data-done={i < index}
                      style={{ "--dur": `${FRAME_MS}ms` } as CSSProperties}
                      onAnimationEnd={i === index ? advance : undefined}
                    />
                  </span>
                  <span className={s.progressLabel}>{f.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <span />
          )}
          <span className={s.scrollCue} aria-hidden="true">
            Scroll <span />
          </span>
        </div>
      </div>
    </section>
  );
}
