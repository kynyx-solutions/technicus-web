import { useId } from "react";

// Abstract layered shapes, one kind per service pillar, drawn as SVG. Each is
// four nested copies of a shape rising from the bottom edge, darker outside and
// lighter inside. Used on the stacked service cards, dark heroes and as the
// fallback when a device does not get 3D.

export type ArtKind = "arch" | "rounded" | "triangle" | "hexagon" | "diamond" | "steps" | "rings";

/** The shape for each pillar, in the order of content/services.ts. */
export const PILLAR_ART: ArtKind[] = ["arch", "rounded", "triangle", "hexagon", "diamond", "steps", "rings"];

const W = 400;
const H = 300;

// Path of one layer at scale s (0 to 1), standing on the bottom edge, centred.
function layer(kind: ArtKind, s: number): string {
  const cx = W / 2;
  const b = H;
  const w = 360 * s;
  const h = 290 * s;
  const l = cx - w / 2;
  const r = cx + w / 2;
  const t = b - h;
  switch (kind) {
    case "arch":
      return `M${l} ${b} L${l} ${b - h + w / 2} A${w / 2} ${w / 2} 0 0 1 ${r} ${b - h + w / 2} L${r} ${b} Z`;
    case "rounded": {
      const rad = Math.min(w, h) * 0.22;
      return `M${l} ${b} L${l} ${t + rad} Q${l} ${t} ${l + rad} ${t} L${r - rad} ${t} Q${r} ${t} ${r} ${t + rad} L${r} ${b} Z`;
    }
    case "triangle":
      return `M${l} ${b} L${cx} ${t} L${r} ${b} Z`;
    case "hexagon":
      return `M${l} ${b} L${l} ${t + h * 0.35} L${cx} ${t} L${r} ${t + h * 0.35} L${r} ${b} Z`;
    case "diamond":
      return `M${l} ${b} L${l + w * 0.18} ${t + h * 0.3} L${cx} ${t} L${r - w * 0.18} ${t + h * 0.3} L${r} ${b} Z`;
    case "steps": {
      const s3 = h / 3;
      const w3 = w / 3;
      return `M${l} ${b} L${l} ${b - s3} L${l + w3} ${b - s3} L${l + w3} ${b - 2 * s3} L${l + 2 * w3} ${b - 2 * s3} L${l + 2 * w3} ${t} L${r} ${t} L${r} ${b} Z`;
    }
    case "rings":
      return `M${l} ${b} A${w / 2} ${h} 0 0 1 ${r} ${b} Z`;
  }
}

const SCALES = [1, 0.76, 0.53, 0.31];

export function Art({
  kind,
  tone = "dark",
  className = "",
}: {
  kind: ArtKind;
  /** "dark" for black backgrounds, "light" for white or grey ones. */
  tone?: "dark" | "light";
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const stops =
    tone === "dark"
      ? [
          ["#14152a", "#2b2c50"],
          ["#1d1e3a", "#3a3a68"],
          ["#2a2a50", "#4e4c82"],
          ["#3a3966", "#67639a"],
        ]
      : [
          ["#dfe2f3", "#c9cdea"],
          ["#d3d7ef", "#b9bee4"],
          ["#c4c8e8", "#a7acda"],
          ["#b3b8e0", "#9196cd"],
        ];
  return (
    <svg aria-hidden viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax meet" className={className}>
      <defs>
        {stops.map(([top, bottom], i) => (
          <linearGradient key={i} id={`${id}-g${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={bottom} />
            <stop offset="1" stopColor={top} />
          </linearGradient>
        ))}
      </defs>
      {SCALES.map((s, i) => (
        <path
          key={s}
          d={layer(kind, s)}
          fill={`url(#${id}-g${i})`}
          stroke={tone === "dark" ? "rgba(255,255,255,0.08)" : "rgba(76,74,134,0.12)"}
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}
