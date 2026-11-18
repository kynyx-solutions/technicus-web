"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Art, type ArtKind } from "@/components/art";
import type { Target } from "./particles";
import { detectTier, type Tier } from "./store";

// The 3D code is a separate download, fetched only when a panel comes near the
// screen.
const Particles = dynamic(() => import("./particles"), { ssr: false });

type Props = {
  targets: Target[];
  /** The still picture for devices that do not get 3D, and while loading. */
  fallback: ArtKind;
  label?: string;
  className?: string;
};

/** A rounded dark media panel holding a 3D scene. */
export function SceneBox({ targets, fallback, label, className = "" }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const [tier, setTier] = useState<Tier | null>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setNear(true);
          setTier((t) => t ?? detectTier());
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const live = near && tier !== null && tier !== "none";

  return (
    <div
      ref={box}
      aria-hidden
      className={`relative overflow-hidden rounded-[20px] bg-[radial-gradient(80%_70%_at_50%_100%,#2a2b52_0%,#0b0b12_70%)] md:rounded-[28px] ${className}`}
    >
      <Art
        kind={fallback}
        tone="dark"
        className={`absolute inset-x-0 bottom-0 mx-auto h-[70%] w-auto transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}
      />
      {live && (
        <div className="absolute inset-0">
          <Particles tier={tier} targets={targets} running={visible} />
        </div>
      )}
      {label && <p className="label absolute bottom-5 left-6 text-white/50">{label}</p>}
    </div>
  );
}
