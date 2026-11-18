"use client";

import { useEffect, useRef } from "react";

/**
 * The showreel video in a rounded panel, as on the main reference. It plays
 * only while on screen, and not at all for visitors who ask for reduced
 * motion: they see the poster. Phones get the smaller file.
 *
 * The video is rendered from code: see components/reel and scripts/reel.
 */
export function Showreel({ className = "" }: { className?: string }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reduce.matches) v.play().catch(() => {});
      else v.pause();
    });
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  return (
    <div aria-hidden className={`relative overflow-hidden rounded-[20px] bg-black md:rounded-[28px] ${className}`}>
      <video
        ref={video}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="auto"
        poster="/showreel/poster.jpg"
      >
        <source src="/showreel/reel-720.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/showreel/reel-1080.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
