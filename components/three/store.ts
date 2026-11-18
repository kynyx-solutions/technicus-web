export type SceneMode = "hero" | "pillar" | "globe" | "gallery" | "notfound";

export type Tier = "full" | "lite" | "none";

/** Decides how much 3D a device gets. See docs/REVAMP_PLAN.md, rules for 3D. */
export function detectTier(): Tier {
  if (typeof window === "undefined") return "none";
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "none";
  if (nav.connection?.saveData) return "none";
  if ((nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2) return "none";
  try {
    const canvas = document.createElement("canvas");
    if (!canvas.getContext("webgl2") && !canvas.getContext("webgl")) return "none";
  } catch {
    return "none";
  }
  const small = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  if (small || (nav.deviceMemory ?? 8) <= 4) return "lite";
  return "full";
}
