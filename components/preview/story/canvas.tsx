import type { Ref } from "react";
import { eased, fx, stagger, type Style } from "./fx";

/*
 * The product canvas: one SVG scene that morphs from a pencil sketch to a
 * running, growing, cared-for product as --p goes from 0 to 8. Purely visual
 * (aria-hidden); the story text carries the meaning. Coordinates are in a
 * fixed 800 x 600 view box; the browser frame sits at 100,70 (600 x 430).
 */

const INK = "#16150f";
const PAPER = "#f4f1ea";
const ACCENT = "#e5462a";
const GRAPHITE = "#5a554b";
const LINE = "#ddd7cb";
const WIRE = "#d9d3c7";
const SAND = "#efdcc6";
const GREEN = "#5bd38a";

/* ---------------------------------------------------------------- sketch */

const sketchStrokes = [
  // frame outline and top rule
  "M104 76 C 250 70, 520 79, 696 73 C 700 200, 694 380, 698 497 C 520 502, 260 494, 102 499 C 98 380, 106 200, 104 76",
  "M106 106 C 300 102, 500 109, 694 104",
  // headline and copy
  "M134 172 C 200 167, 300 176, 372 170",
  "M134 200 C 190 196, 262 204, 330 199",
  "M134 238 q 10 -5 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0",
  "M134 254 q 10 -5 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0",
  // button
  "M136 290 C 136 275, 224 276, 226 290 C 226 305, 138 306, 136 290",
  // image box with a cross
  "M420 158 L 668 154 L 671 306 L 422 309 Z",
  "M426 163 L 664 301 M 666 160 L 427 304",
  // three cards
  "M131 332 L 300 329 L 302 470 L 129 472 Z",
  "M316 330 L 486 332 L 484 471 L 318 469 Z",
  "M502 331 L 670 329 L 672 470 L 500 472 Z",
  // nav
  "M132 125 L 196 123 M 520 124 L 548 124 M 566 125 L 594 124 M 612 124 L 664 125",
];

const pencilStrokes = [
  // red pencil: circle the headline, arrow in from a margin note, a star
  "M122 192 C 112 150, 392 144, 394 184 C 396 224, 126 230, 120 196",
  "M600 40 C 548 52, 470 96, 404 150",
  "M404 150 L 420 148 M 404 150 L 409 135",
  "M612 30 l 26 0 M 612 42 l 44 0 M 612 54 l 18 0",
  "M232 512 l 0 22 M 221 517 l 22 12 M 221 529 l 22 -12",
];

/* ------------------------------------------------------------- interface */

type Box = { x: number; y: number; w: number; h: number; r?: number };

const wire: Box[] = [
  { x: 130, y: 120, w: 70, h: 12, r: 4 },
  { x: 520, y: 121, w: 30, h: 8, r: 4 },
  { x: 564, y: 121, w: 30, h: 8, r: 4 },
  { x: 608, y: 117, w: 62, h: 16, r: 8 },
  { x: 130, y: 162, w: 250, h: 20, r: 5 },
  { x: 130, y: 190, w: 200, h: 20, r: 5 },
  { x: 130, y: 232, w: 230, h: 7, r: 3.5 },
  { x: 130, y: 247, w: 190, h: 7, r: 3.5 },
  { x: 130, y: 276, w: 96, h: 28, r: 14 },
  { x: 420, y: 156, w: 250, h: 150, r: 10 },
  { x: 130, y: 330, w: 170, h: 140, r: 10 },
  { x: 315, y: 330, w: 170, h: 140, r: 10 },
  { x: 500, y: 330, w: 170, h: 140, r: 10 },
];

const cards = [130, 315, 500];
const cardIcon = [INK, ACCENT, SAND];

/* --------------------------------------------------------- code & data */

type Tok = [string, string?];
const C = { k: "#ff8f74", s: "#e9c99b", t: "#f4f1ea", m: "#8d877b", f: "#b9d6cc" };
const code: { indent: number; toks: Tok[] }[] = [
  { indent: 0, toks: [["export default async function ", C.k], ["Home", C.f], ["() {", C.m]] },
  { indent: 1, toks: [["const ", C.k], ["plan = ", C.t], ["await ", C.k], ["getPlan", C.f], ["(user);", C.m]] },
  { indent: 1, toks: [["return ", C.k], ["(", C.m]] },
  { indent: 2, toks: [["<Page>", C.f]] },
  { indent: 3, toks: [["<Hero ", C.f], ["title", C.t], ["={copy.title} ", C.m], ["cta", C.t], ["=", C.m], ['"Start"', C.s], [" />", C.f]] },
  { indent: 3, toks: [["<Grid>", C.f]] },
  { indent: 4, toks: [["{plan.items.", C.m], ["map", C.f], ["((item) => (", C.m]] },
  { indent: 5, toks: [["<Card ", C.f], ["key", C.t], ["={item.id} {...item} ", C.m], ["/>", C.f]] },
  { indent: 4, toks: [["))}", C.m]] },
  { indent: 3, toks: [["</Grid>", C.f]] },
  { indent: 2, toks: [["</Page>", C.f]] },
  { indent: 1, toks: [[");", C.m]] },
  { indent: 0, toks: [["}", C.m]] },
];

const records = [0, 1, 2, 3, 4, 5, 6];
const streams = [208, 285, 362];

/* --------------------------------------------------------------- growth */

const people: { x: number; y: number; accent: boolean }[] = [
  [178, 112], [92, 196], [140, 300], [84, 388], [150, 478], [236, 548], [352, 566], [470, 556],
  [588, 562], [686, 512], [728, 418], [676, 330], [742, 246], [668, 150], [598, 106], [112, 112],
].map(([x, y], k) => ({ x, y, accent: k % 5 === 2 }));

/* ----------------------------------------------------------------- care */

const loopR = 228;
const pt = (deg: number, r = loopR) => {
  const a = (deg * Math.PI) / 180;
  return [+(400 + Math.cos(a) * r).toFixed(1), +(285 + Math.sin(a) * r).toFixed(1)] as const;
};
const loopPath = (() => {
  const [sx, sy] = pt(-80);
  const [ex, ey] = pt(235);
  return `M ${sx} ${sy} A ${loopR} ${loopR} 0 1 1 ${ex} ${ey}`;
})();
const loopHead = (() => {
  const [ex, ey] = pt(235);
  const [ax, ay] = pt(226, loopR - 13);
  const [bx, by] = pt(226, loopR + 13);
  return `M ${ax} ${ay} L ${ex} ${ey} L ${bx} ${by}`;
})();
const helpers = [
  { deg: 290, icon: "chat" },
  { deg: 20, icon: "cog" },
  { deg: 110, icon: "team" },
  { deg: 200, icon: "pulse" },
] as const;

function HelperIcon({ icon }: { icon: (typeof helpers)[number]["icon"] }) {
  const s = { fill: "none", stroke: INK, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  if (icon === "chat") return <path {...s} d="M-10 -8 h20 a3 3 0 0 1 3 3 v10 a3 3 0 0 1 -3 3 h-10 l-6 5 v-5 h-4 a3 3 0 0 1 -3 -3 v-10 a3 3 0 0 1 3 -3 z" />;
  if (icon === "cog")
    return (
      <g {...s}>
        <circle r="5" />
        <path d="M0 -11 v4 M0 7 v4 M-11 0 h4 M7 0 h4 M-7.8 -7.8 l2.8 2.8 M5 5 l2.8 2.8 M7.8 -7.8 l-2.8 2.8 M-5 5 l-2.8 2.8" />
      </g>
    );
  if (icon === "team")
    return (
      <g {...s}>
        <circle cx="-5" cy="-4" r="4" />
        <circle cx="6" cy="-3" r="3.4" />
        <path d="M-13 10 c0 -6 4 -9 8 -9 s8 3 8 9 M5 3 c4 0 8 2 8 7" />
      </g>
    );
  return <path {...s} d="M-13 0 h6 l3 -8 l5 16 l3 -8 h9" />;
}

/* ------------------------------------------------------------ the scene */

const browserMotion: Style = {
  ...eased("c1", 2.7, 3.15),
  ...eased("c2", 3.75, 4.15),
  ...eased("a1", 3.75, 4.2),
  ...eased("a2", 4.7, 5.15),
  ...eased("l1", 4.75, 5.2),
  ...eased("l2", 5.75, 6.15),
  ...eased("g1", 5.75, 6.2),
  ...eased("g2", 6.75, 7.15),
  ...eased("k1", 6.75, 7.2),
  "--code": "calc(var(--c1) * (1 - var(--c2)))",
  "--ai": "calc(var(--a1) * (1 - var(--a2)))",
  "--live": "calc(var(--l1) * (1 - var(--l2)))",
  "--grow": "calc(var(--g1) * (1 - var(--g2)))",
  transform:
    "translate(calc((var(--ai) * 90 - var(--code) * 150) * 1px), calc((var(--grow) * 15 - var(--live) * 110) * 1px)) " +
    "scale(calc(1 - 0.2 * var(--code) - 0.28 * var(--ai) - 0.4 * var(--live) - 0.22 * var(--grow) - 0.44 * var(--k1)))",
  transformBox: "view-box",
  transformOrigin: "400px 285px",
};

const loopSpin: Style = {
  transform: "rotate(calc(var(--p) * 22deg))",
  transformBox: "view-box",
  transformOrigin: "400px 285px",
};

export function StoryCanvas({ p, ref, className = "" }: { p?: number; ref?: Ref<HTMLDivElement>; className?: string }) {
  const rootStyle = p === undefined ? undefined : ({ "--p": p } as Style);
  return (
    <div ref={ref} className={`sty-board ${className}`} style={rootStyle} aria-hidden="true">
      <div className="sty-board-night" style={fx({ in: [2.7, 3.1], out: [5.75, 6.15] })} />
      <svg viewBox="0 0 800 600" className="sty-svg" focusable="false">
        {/* ---------- sketch on paper ---------- */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" style={fx({ in: [-1, -0.9], out: [0.75, 1.05], solid: true })}>
          {sketchStrokes.map((d, k) => (
            <path key={k} d={d} pathLength={1} stroke={GRAPHITE} strokeWidth={2.2} style={fx({ in: stagger(-0.4, -0.05, k, 0.035), draw: true })} />
          ))}
          {pencilStrokes.map((d, k) => (
            <path key={k} d={d} pathLength={1} stroke={ACCENT} strokeWidth={2.6} style={fx({ in: stagger(0.0, 0.25, k, 0.04), draw: true })} />
          ))}
        </g>

        {/* ---------- growth: reach rings and visitors (behind the product) ---------- */}
        <g style={fx({ in: [5.85, 6.2], out: [6.7, 7.0] })}>
          {[0, 1, 2].map((k) => (
            <circle key={k} cx="400" cy="300" r="250" fill="none" stroke={ACCENT} strokeWidth="1.2" className="sty-ripple" style={{ animationDelay: `${k * -1.3}s` }} />
          ))}
        </g>

        {/* ---------- care: the loop ---------- */}
        <g style={fx({ in: [6.8, 7.0], solid: true })}>
          <g style={loopSpin}>
            <circle cx="400" cy="285" r={loopR} fill="none" stroke={LINE} strokeWidth="1" strokeDasharray="2 7" style={fx({ in: [6.85, 7.2] })} />
            <path d={loopPath} pathLength={1} fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" style={fx({ in: [6.85, 7.35], draw: true })} />
            <path d={loopHead} fill="none" stroke={ACCENT} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={fx({ in: [7.25, 7.4] })} />
          </g>
        </g>

        {/* ---------- live: links, racks, monitoring ---------- */}
        <g style={fx({ in: [4.8, 5.0], out: [5.7, 6.0], solid: true })}>
          {["M400 306 C 400 340, 230 330, 230 370", "M400 306 L 400 370", "M400 306 C 400 340, 570 330, 570 370"].map((d, k) => (
            <path key={k} d={d} pathLength={1} fill="none" stroke="#6f6a5f" strokeWidth="1.5" style={fx({ in: stagger(5.0, 5.3, k, 0.04), draw: true })} />
          ))}
          {[170, 340, 510].map((x, k) => (
            <g key={x} style={fx({ in: stagger(4.85, 5.2, k, 0.06), y: 40 })}>
              <rect x={x} y="370" width="120" height="112" rx="9" fill="#23211c" stroke="#3b3932" />
              {[0, 1, 2].map((r) => (
                <g key={r}>
                  <rect x={x + 10} y={382 + r * 32} width="100" height="22" rx="4" fill="#2e2c26" />
                  <rect x={x + 20} y={390 + r * 32} width="34" height="2.5" rx="1" fill="#55524a" />
                  <rect x={x + 20} y={396 + r * 32} width="22" height="2.5" rx="1" fill="#55524a" />
                  <g style={fx({ in: stagger(5.2, 5.3, k * 3 + r, 0.025), snap: 0.2 })}>
                    <circle cx={x + 98} cy={393 + r * 32} r="7" fill={GREEN} opacity="0.18" />
                    <circle cx={x + 98} cy={393 + r * 32} r="4" fill={GREEN} className="sty-blink" style={{ animationDelay: `${((k * 3 + r) * 0.37) % 2}s` }} />
                  </g>
                </g>
              ))}
            </g>
          ))}
          <g style={fx({ in: [5.15, 5.35], snap: 0.4 })}>
            <path d="M400 322 l 14 5 v 9 c 0 9 -6 14 -14 17 c -8 -3 -14 -8 -14 -17 v -9 z" fill={ACCENT} />
            <path d="M394 337 l 4 4 l 8 -8" fill="none" stroke={PAPER} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <line x1="60" y1="540" x2="740" y2="540" stroke="#34322c" strokeWidth="1" style={fx({ in: [5.0, 5.2] })} />
          <path
            d="M60 540 L 250 540 L 262 540 L 274 514 L 288 562 L 300 528 L 310 540 L 470 540 L 482 522 L 494 554 L 504 540 L 740 540"
            pathLength={1}
            fill="none"
            stroke={ACCENT}
            strokeWidth="2"
            strokeLinejoin="round"
            style={fx({ in: [5.1, 5.5], draw: true })}
          />
          <g style={fx({ in: [5.35, 5.5] })}>
            <rect x="58" y="518" width="2" height="44" fill={PAPER} opacity="0.5" className="sty-scan" />
          </g>
        </g>

        {/* ---------- AI: records and data flowing in ---------- */}
        <g style={fx({ in: [3.85, 4.2], out: [4.7, 5.0], solid: true })}>
          {records.map((r) => (
            <g key={r} style={fx({ in: stagger(3.85, 4.15, r, 0.03), x: -30 })}>
              <rect x="30" y={150 + r * 42} width="104" height="28" rx="6" fill="#26241f" stroke="#3b3932" />
              <circle cx="46" cy={164 + r * 42} r="5" fill={r % 3 === 1 ? ACCENT : "#8d877b"} />
              <rect x="58" y={160 + r * 42} width={52 - (r % 3) * 9} height="3" rx="1.5" fill="#8d877b" />
              <rect x="58" y={166 + r * 42} width={34 + (r % 2) * 12} height="3" rx="1.5" fill="#55524a" />
            </g>
          ))}
          {streams.map((y, k) => (
            <g key={y} style={fx({ in: stagger(4.0, 4.3, k, 0.05) })}>
              <line x1="140" y1={y} x2="272" y2={y} stroke="#3b3932" strokeWidth="1" strokeDasharray="2 5" />
              {[0, 1, 2, 3].map((d) => (
                <circle key={d} cx="140" cy={y} r={d === 1 ? 4 : 3} fill={d === 1 ? ACCENT : PAPER} className="sty-flow" style={{ animationDelay: `${-(d * 0.55 + k * 0.3)}s` }} />
              ))}
            </g>
          ))}
        </g>

        {/* ---------- the product ---------- */}
        <g style={browserMotion}>
          <g style={fx({ in: [0.7, 1.1] })}>
            <rect x="106" y="78" width="600" height="430" rx="16" fill={INK} opacity="0.08" />
            <rect x="100" y="70" width="600" height="430" rx="16" fill="#fff" stroke={LINE} />
            <path d="M100 104 h600" stroke={LINE} />
            <circle cx="122" cy="87" r="4.5" fill="#e4ded2" />
            <circle cx="138" cy="87" r="4.5" fill="#e4ded2" />
            <circle cx="154" cy="87" r="4.5" fill="#e4ded2" />
            <rect x="300" y="80" width="200" height="14" rx="7" fill="#f1ede5" />
          </g>

          {/* wireframe */}
          <g style={fx({ in: [0.8, 0.9], out: [2.25, 2.45], solid: true })}>
            {wire.map((b, k) => (
              <rect key={k} x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r} fill={WIRE} style={fx({ in: stagger(0.8, 1.12, k, 0.026), snap: 0.82 })} />
            ))}
            <path d="M420 156 L 670 306 M 670 156 L 420 306" stroke="#c9c2b4" strokeWidth="1.2" style={fx({ in: [1.2, 1.4] })} />
          </g>

          {/* polished interface */}
          <g>
            <g style={fx({ in: [1.75, 2.0] })}>
              <rect x="130" y="120" width="12" height="12" rx="3" fill={ACCENT} />
              <rect x="148" y="122" width="52" height="8" rx="4" fill={INK} />
              <rect x="520" y="122" width="30" height="6" rx="3" fill="#b8b1a3" />
              <rect x="564" y="122" width="30" height="6" rx="3" fill="#b8b1a3" />
              <rect x="608" y="117" width="62" height="16" rx="8" fill={INK} />
            </g>
            <rect x="130" y="162" width="250" height="20" rx="4" fill={INK} style={fx({ in: stagger(1.78, 2.05, 1, 0.04), x: -12 })} />
            <rect x="130" y="190" width="200" height="20" rx="4" fill={INK} style={fx({ in: stagger(1.78, 2.05, 2, 0.04), x: -12 })} />
            <g style={fx({ in: stagger(1.78, 2.05, 3, 0.04) })}>
              <rect x="130" y="232" width="230" height="6" rx="3" fill="#bdb6a8" />
              <rect x="130" y="247" width="190" height="6" rx="3" fill="#bdb6a8" />
            </g>
            <g style={fx({ in: stagger(1.78, 2.05, 4, 0.04), snap: 0.8 })}>
              <rect x="130" y="276" width="96" height="28" rx="14" fill={ACCENT} />
              <rect x="152" y="288" width="40" height="4" rx="2" fill="#fff" />
              <path d="M200 286 l 4 4 l -4 4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            </g>
            <g style={fx({ in: stagger(1.78, 2.15, 3, 0.04), scale: 0.94 })}>
              <rect x="420" y="156" width="250" height="150" rx="10" fill={SAND} />
              <circle cx="612" cy="200" r="22" fill={ACCENT} />
              <path d="M440 306 v-56 a34 34 0 0 1 68 0 v56 z" fill={INK} />
              <path d="M520 306 v-80 a30 30 0 0 1 60 0 v80 z" fill="#fff" opacity="0.7" />
              <path d="M590 306 v-40 a26 26 0 0 1 52 0 v40 z" fill={INK} opacity="0.85" />
            </g>
            {cards.map((x, k) => (
              <g key={x} style={fx({ in: stagger(1.95, 2.3, k, 0.05), y: 14 })}>
                <rect x={x} y="330" width="170" height="140" rx="10" fill="#fff" stroke="#e6e0d5" />
                <rect x={x + 16} y="346" width="28" height="28" rx="7" fill={cardIcon[k]} />
                <rect x={x + 16} y="392" width="110" height="8" rx="4" fill={INK} />
                <rect x={x + 16} y="410" width="128" height="5" rx="2.5" fill="#c9c2b4" />
                <rect x={x + 16} y="422" width="96" height="5" rx="2.5" fill="#c9c2b4" />
                <rect x={x + 16} y="446" width="40" height="5" rx="2.5" fill={ACCENT} />
              </g>
            ))}
          </g>

          {/* AI feature: an assistant panel and a highlighted recommendation */}
          <g style={fx({ in: [3.95, 4.35], y: 16, scale: 0.92 })}>
            <rect x="420" y="156" width="250" height="150" rx="10" fill="#fff" stroke={ACCENT} strokeWidth="1.5" />
            <circle cx="448" cy="186" r="14" fill="#fdebe6" />
            <circle cx="448" cy="186" r="14" fill="none" stroke={ACCENT} className="sty-pulse" />
            <path d="M448 177 c 1.2 5 3.8 7.8 9 9 c -5.2 1.2 -7.8 4 -9 9 c -1.2 -5 -3.8 -7.8 -9 -9 c 5.2 -1.2 7.8 -4 9 -9 z" fill={ACCENT} />
            <rect x="472" y="178" width="126" height="7" rx="3.5" fill={INK} />
            <rect x="472" y="191" width="92" height="5" rx="2.5" fill="#bdb6a8" />
            <rect x="436" y="216" width="218" height="38" rx="8" fill="#f8f5ef" />
            <rect x="448" y="228" width="150" height="5" rx="2.5" fill="#9b9486" />
            <rect x="448" y="239" width="110" height="5" rx="2.5" fill="#c9c2b4" />
            <rect x="436" y="266" width="62" height="24" rx="12" fill={ACCENT} />
            <rect x="504" y="266" width="76" height="24" rx="12" fill="#f6e3dc" />
            <rect x="586" y="266" width="68" height="24" rx="12" fill="#f6e3dc" />
            <rect x="452" y="276" width="30" height="4" rx="2" fill="#fff" />
            <rect x="520" y="276" width="44" height="4" rx="2" fill={ACCENT} opacity="0.6" />
            <rect x="602" y="276" width="36" height="4" rx="2" fill={ACCENT} opacity="0.6" />
          </g>
          <g style={fx({ in: [4.15, 4.4] })}>
            <rect x="313" y="328" width="174" height="144" rx="11" fill="none" stroke={ACCENT} strokeWidth="2" />
            <circle cx="470" cy="346" r="5" fill={ACCENT} />
          </g>

          {/* care: everything checked and looked after */}
          {cards.map((x, k) => (
            <g key={x} style={fx({ in: stagger(7.05, 7.25, k, 0.07), snap: 0.3 })}>
              <circle cx={x + 150} cy="350" r="10" fill={INK} />
              <path d={`M${x + 145} 350 l 3.5 3.5 l 6.5 -7`} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
        </g>

        {/* ---------- code panel (over the product) ---------- */}
        <g style={fx({ in: [2.75, 3.15], out: [3.7, 4.0], x: 70 })}>
          <rect x="425" y="104" width="360" height="404" rx="14" fill="#25231e" stroke="#3b3932" />
          <circle cx="447" cy="125" r="4" fill="#4a473f" />
          <circle cx="461" cy="125" r="4" fill="#4a473f" />
          <circle cx="475" cy="125" r="4" fill="#4a473f" />
          <text x="500" y="129" className="sty-mono" fontSize="11" fill="#8d877b">
            app/page.tsx
          </text>
          <path d="M425 142 h360" stroke="#3b3932" />
          {code.map((l, k) => (
            <text key={k} x={445 + l.indent * 14} y={170 + k * 25} className="sty-mono" fontSize="11.2" style={fx({ in: stagger(2.92, 3.0, k, 0.04), x: -6 })}>
              {l.toks.map(([t, c], j) => (
                <tspan key={j} fill={c ?? C.t}>
                  {t}
                </tspan>
              ))}
            </text>
          ))}
          <rect x="445" y="482" width="7" height="14" fill={ACCENT} className="sty-caret" style={fx({ in: [3.45, 3.5] })} />
        </g>

        {/* ---------- growth: search and visitors ---------- */}
        <g style={fx({ in: [5.8, 5.9], out: [6.7, 7.0], solid: true })}>
          <g style={fx({ in: [5.85, 6.15], y: -20 })}>
            <rect x="250" y="28" width="300" height="42" rx="21" fill="#fff" stroke={LINE} />
            <circle cx="276" cy="48" r="7" fill="none" stroke={INK} strokeWidth="2" />
            <path d="M281 53 l 6 6" stroke={INK} strokeWidth="2" strokeLinecap="round" />
            <rect x="298" y="45" width="150" height="7" rx="3.5" fill={INK} style={{ ...fx({ in: [6.0, 6.3], solid: true }), transform: "scaleX(var(--i))", transformBox: "fill-box", transformOrigin: "0 50%" }} />
            <rect x="454" y="40" width="2" height="17" fill={ACCENT} className="sty-caret" />
            <rect x="500" y="38" width="40" height="22" rx="11" fill={ACCENT} />
            <path d="M514 49 h12 M522 45 l4 4 l-4 4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <line x1="400" y1="72" x2="400" y2="130" stroke={ACCENT} strokeWidth="1.5" strokeDasharray="3 5" style={fx({ in: [6.15, 6.35] })} />
          {people.map((m, k) => (
            <g key={k} style={fx({ in: stagger(5.9, 6.25, k, 0.01), x: (m.x - 400) * 0.6, y: (m.y - 300) * 0.6 })}>
              <circle cx={m.x} cy={m.y - 8} r="6.5" fill={m.accent ? ACCENT : INK} />
              <path d={`M${m.x - 11} ${m.y + 12} a11 11 0 0 1 22 0 z`} fill={m.accent ? ACCENT : INK} />
            </g>
          ))}
        </g>

        {/* ---------- care: the people who keep it running ---------- */}
        <g>
          {helpers.map((h, k) => {
            const [x, y] = pt(h.deg);
            return (
              <g key={h.icon} style={fx({ in: stagger(7.0, 7.25, k, 0.06), snap: 0.5 })}>
                <circle cx={x} cy={y} r="27" fill={PAPER} stroke={INK} strokeWidth="1.5" />
                <g transform={`translate(${x} ${y})`}>
                  <HelperIcon icon={h.icon} />
                </g>
              </g>
            );
          })}
          <g fill="none" stroke={ACCENT} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M700 58 c -15 0 -24 11 -24 23 c 0 9 6 13 9 19 v 7 h 30 v -7 c 3 -6 9 -10 9 -19 c 0 -12 -9 -23 -24 -23" pathLength={1} style={fx({ in: [7.25, 7.45], draw: true })} />
            <path d="M688 114 h24 M692 122 h16 M700 40 v-10 M672 50 l-7 -7 M728 50 l7 -7" pathLength={1} style={fx({ in: [7.35, 7.5], draw: true })} />
          </g>
        </g>
      </svg>
    </div>
  );
}
