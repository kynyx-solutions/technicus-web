import { useId } from "react";

// Abstract "system diagram" pictures: interface panels, charts and connected
// nodes on a faint dot grid, in the brand blues. One layout per kind, so each
// service area has its own picture. Used where there is no photograph yet.

export type ArtKind = "arch" | "rounded" | "triangle" | "hexagon" | "diamond" | "steps" | "rings";

/** The picture for each pillar, in the order of content/services.ts. */
export const PILLAR_ART: ArtKind[] = ["arch", "rounded", "triangle", "hexagon", "diamond", "steps", "rings"];

type Panel = { x: number; y: number; w: number; h: number; c: "lines" | "bars" | "chart" | "ring" | "avatar" | "grid" };
type Layout = { panels: Panel[]; links: [number, number][] };

const LAYOUTS: Record<ArtKind, Layout> = {
  arch: {
    panels: [
      { x: 30, y: 40, w: 150, h: 92, c: "lines" },
      { x: 220, y: 30, w: 150, h: 112, c: "chart" },
      { x: 120, y: 175, w: 170, h: 95, c: "bars" },
    ],
    links: [[0, 2], [1, 2]],
  },
  rounded: {
    panels: [
      { x: 40, y: 30, w: 200, h: 130, c: "grid" },
      { x: 260, y: 60, w: 110, h: 110, c: "ring" },
      { x: 70, y: 190, w: 250, h: 80, c: "lines" },
    ],
    links: [[0, 1], [0, 2]],
  },
  triangle: {
    panels: [
      { x: 30, y: 110, w: 110, h: 80, c: "avatar" },
      { x: 160, y: 30, w: 210, h: 120, c: "lines" },
      { x: 175, y: 175, w: 190, h: 95, c: "bars" },
    ],
    links: [[0, 1], [0, 2], [1, 2]],
  },
  hexagon: {
    panels: [
      { x: 30, y: 30, w: 130, h: 100, c: "ring" },
      { x: 185, y: 30, w: 185, h: 100, c: "chart" },
      { x: 30, y: 165, w: 340, h: 105, c: "bars" },
    ],
    links: [[0, 1], [1, 2]],
  },
  diamond: {
    panels: [
      { x: 150, y: 25, w: 100, h: 80, c: "ring" },
      { x: 30, y: 150, w: 140, h: 115, c: "grid" },
      { x: 230, y: 150, w: 140, h: 115, c: "lines" },
    ],
    links: [[0, 1], [0, 2]],
  },
  steps: {
    panels: [
      { x: 30, y: 45, w: 170, h: 100, c: "chart" },
      { x: 220, y: 30, w: 150, h: 75, c: "avatar" },
      { x: 220, y: 125, w: 150, h: 145, c: "lines" },
      { x: 30, y: 170, w: 170, h: 100, c: "bars" },
    ],
    links: [[0, 1], [0, 3], [1, 2]],
  },
  rings: {
    panels: [
      { x: 30, y: 30, w: 160, h: 110, c: "lines" },
      { x: 210, y: 30, w: 160, h: 110, c: "lines" },
      { x: 120, y: 170, w: 160, h: 100, c: "ring" },
    ],
    links: [[0, 2], [1, 2]],
  },
};

export function Art({
  kind,
  tone = "dark",
  className = "",
}: {
  kind: ArtKind;
  /** "dark" on navy backgrounds, "light" on white or light grey ones. */
  tone?: "dark" | "light";
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const dark = tone === "dark";
  const c = dark
    ? { dot: "rgba(245,243,238,0.1)", panel: "#26241f", stroke: "rgba(245,243,238,0.28)", ink: "rgba(245,243,238,0.2)", accent: "#e8553a", soft: "rgba(245,243,238,0.08)", link: "rgba(245,243,238,0.3)" }
      : { dot: "rgba(21,20,15,0.1)", panel: "#ffffff", stroke: "rgba(21,20,15,0.32)", ink: "rgba(21,20,15,0.15)", accent: "#d63a1e", soft: "rgba(21,20,15,0.06)", link: "rgba(21,20,15,0.32)" };
  const { panels, links } = LAYOUTS[kind];
  const centre = (p: Panel) => [p.x + p.w / 2, p.y + p.h / 2];

  return (
    <svg aria-hidden viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" className={className}>
      <defs>
        <pattern id={`${id}-dots`} width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.1" fill={c.dot} />
        </pattern>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor={dark ? "#000" : "#4f46e5"} floodOpacity={0} />
        </filter>
      </defs>
      <rect width="400" height="300" fill={`url(#${id}-dots)`} />

      {links.map(([a, b]) => {
        const [x1, y1] = centre(panels[a]);
        const [x2, y2] = centre(panels[b]);
        const mx = (x1 + x2) / 2;
        return (
          <g key={`${a}-${b}`}>
            <path d={`M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`} fill="none" stroke={c.link} strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx={x1} cy={y1} r="3.5" fill={c.accent} />
            <circle cx={x2} cy={y2} r="3.5" fill={c.accent} />
          </g>
        );
      })}

      {panels.map((p, i) => (
        <g key={i} filter={`url(#${id}-shadow)`}>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="1" fill={c.panel} stroke={c.stroke} />
          <rect x={p.x} y={p.y} width={p.w} height="14" rx="1" fill={c.soft} />
          <circle cx={p.x + 10} cy={p.y + 7} r="2" fill={c.accent} />
          <circle cx={p.x + 18} cy={p.y + 7} r="2" fill={c.ink} />
          <PanelBody p={p} c={c} />
        </g>
      ))}
    </svg>
  );
}

function PanelBody({ p, c }: { p: Panel; c: { ink: string; accent: string; soft: string } }) {
  const x = p.x + 12;
  const y = p.y + 24;
  const w = p.w - 24;
  const h = p.h - 34;
  switch (p.c) {
    case "lines":
      return (
        <g>
          {[0.9, 0.7, 0.8, 0.5].map((f, i) => (
            <rect key={i} x={x} y={y + i * (h / 4)} width={w * f} height="5" rx="2.5" fill={i === 0 ? c.accent : c.ink} />
          ))}
        </g>
      );
    case "bars": {
      const n = 7;
      const bw = w / (n * 1.6);
      return (
        <g>
          {[0.4, 0.65, 0.5, 0.85, 0.6, 0.95, 0.75].map((f, i) => (
            <rect key={i} x={x + i * bw * 1.6} y={y + h - h * f} width={bw} height={h * f} rx="2" fill={i === 5 ? c.accent : c.soft} />
          ))}
        </g>
      );
    }
    case "chart": {
      const pts = [0.7, 0.55, 0.62, 0.35, 0.42, 0.18, 0.25].map((f, i) => `${x + (i * w) / 6},${y + h * f}`);
      return (
        <g>
          <polyline points={pts.join(" ")} fill="none" stroke={c.accent} strokeWidth="2.2" strokeLinejoin="round" />
          <polygon points={`${x},${y + h} ${pts.join(" ")} ${x + w},${y + h}`} fill={c.soft} opacity="0.6" />
        </g>
      );
    }
    case "ring": {
      const r = Math.min(w, h) / 2 - 2;
      const cx = x + w / 2;
      const cy = y + h / 2;
      const circ = 2 * Math.PI * r;
      return (
        <g>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={c.soft} strokeWidth="7" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={c.accent} strokeWidth="7" strokeDasharray={`${circ * 0.68} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`} />
        </g>
      );
    }
    case "avatar":
      return (
        <g>
          <circle cx={x + 14} cy={y + 14} r="12" fill={c.soft} />
          <rect x={x + 34} y={y + 6} width={w - 40} height="5" rx="2.5" fill={c.accent} />
          <rect x={x + 34} y={y + 18} width={(w - 40) * 0.6} height="5" rx="2.5" fill={c.ink} />
          <rect x={x} y={y + 38} width={w} height="5" rx="2.5" fill={c.ink} />
        </g>
      );
    case "grid":
      return (
        <g>
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((col) => (
              <rect key={`${r}-${col}`} x={x + col * (w / 3)} y={y + r * (h / 3)} width={w / 3 - 6} height={h / 3 - 6} rx="3" fill={r === 0 && col === 1 ? c.accent : c.soft} />
            )),
          )}
        </g>
      );
  }
}
