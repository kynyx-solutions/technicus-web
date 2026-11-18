"use client";

import { useEffect, useRef, useState } from "react";
import type { Reel, ReelManifest } from "./reel";

declare global {
  interface Window {
    __reel?: { duration: number; fps: number; frame: (t: number, samples: number) => string };
  }
}

/**
 * Plays the showreel live for previewing, and lets scripts/reel/render.mjs
 * render it frame by frame (with ?capture). Development only.
 */
export function ReelStudio() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState("Loading…");

  useEffect(() => {
    let raf = 0;
    let reel: Reel | null = null;
    let cancelled = false;

    (async () => {
      const { Reel, FPS } = await import("./reel");
      const manifest: ReelManifest = await fetch("/_reel/manifest.json").then((r) => {
        if (!r.ok) throw new Error("No screenshots yet. Run: npm run reel:screens");
        return r.json();
      });
      const font = getComputedStyle(document.body).fontFamily;
      await Promise.all(["400", "500", "560", "600"].map((w) => document.fonts.load(`${w} 40px ${font}`)));
      if (cancelled || !canvas.current) return;
      reel = new Reel(canvas.current, 1920, 1080);
      await reel.load(manifest, font);
      if (cancelled) return;
      const r = reel;
      window.__reel = {
        duration: r.duration,
        fps: FPS,
        frame: (t, samples) => {
          r.frame(t, samples);
          return canvas.current!.toDataURL("image/png");
        },
      };
      setStatus("");
      if (new URLSearchParams(location.search).has("capture")) return;
      const start = performance.now();
      const loop = () => {
        r.frame(((performance.now() - start) / 1000) % r.duration, 1);
        raf = requestAnimationFrame(loop);
      };
      loop();
    })().catch((e: unknown) => setStatus(e instanceof Error ? e.message : String(e)));

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      reel?.dispose();
      delete window.__reel;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center bg-black">
      <canvas ref={canvas} width={1920} height={1080} className="max-h-full w-full object-contain" />
      {status && <p className="absolute text-white">{status}</p>}
    </div>
  );
}
