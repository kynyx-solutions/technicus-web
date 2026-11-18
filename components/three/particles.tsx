"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { ParticleCloud } from "./cloud";
import type { SceneMode, Tier } from "./store";

export type Target = { mode: SceneMode; index?: number };

/**
 * One 3D panel. With `cycle`, the shape changes every few seconds through the
 * list, like a showreel; otherwise it holds `target`.
 */
function Cloud({ count, interactive, targets }: { count: number; interactive: boolean; targets: Target[] }) {
  const cloud = useMemo(() => new ParticleCloud(count, interactive), [count, interactive]);
  useEffect(() => () => cloud.dispose(), [cloud]);

  useFrame((state, delta) => {
    const step = targets.length > 1 ? Math.floor(state.clock.elapsedTime / 3.6) % targets.length : 0;
    const t = targets[step];
    cloud.setTarget(t.mode, t.index ?? 0);
    cloud.update({
      dt: Math.min(delta, 0.05),
      time: state.clock.elapsedTime,
      pointerX: state.pointer.x,
      pointerY: state.pointer.y,
      pixelRatio: state.gl.getPixelRatio(),
    });
  });

  return <primitive object={cloud.group} />;
}

export default function Particles({
  tier,
  targets,
  running,
}: {
  tier: Exclude<Tier, "none">;
  targets: Target[];
  /** False while the panel is off screen: the frame loop stops. */
  running: boolean;
}) {
  const full = tier === "full";
  return (
    <Canvas
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      dpr={full ? [1, 2] : 1}
      frameloop={running ? "always" : "never"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <Cloud count={full ? 11000 : 3800} interactive={full} targets={targets} />
    </Canvas>
  );
}
