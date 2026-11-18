// Point-cloud shapes, generated in code. Each function fills a Float32Array with
// x, y, z for every particle. The scene moves particles from one shape to the next.

type Fill = (i: number, n: number, out: Float32Array, o: number) => void;

const TAU = Math.PI * 2;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

// Deterministic pseudo-random, so shapes are identical on every visit.
function rand(i: number, salt = 0) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function build(n: number, fill: Fill) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) fill(i, n, out, i * 3);
  return out;
}

function set(out: Float32Array, o: number, x: number, y: number, z: number) {
  out[o] = x;
  out[o + 1] = y;
  out[o + 2] = z;
}

function onSphere(i: number, n: number, r: number): [number, number, number] {
  const y = 1 - (i / (n - 1)) * 2;
  const rad = Math.sqrt(1 - y * y);
  const t = i * GOLDEN;
  return [Math.cos(t) * rad * r, y * r, Math.sin(t) * rad * r];
}

/** Hero: a sphere whose surface is pushed in and out, like a slow planet. */
const hero: Fill = (i, n, out, o) => {
  const [x, y, z] = onSphere(i, n, 1);
  const bump = 1.45 + 0.16 * Math.sin(x * 4.2 + y * 2.1) * Math.cos(z * 3.7) + 0.05 * rand(i);
  set(out, o, x * bump, y * bump, z * bump);
};

/** Strategy: three tilted orbits around a core. */
const orbits: Fill = (i, n, out, o) => {
  if (i % 9 === 0) {
    const [x, y, z] = onSphere(i, n, 0.32);
    return set(out, o, x, y, z);
  }
  const ring = i % 3;
  const t = rand(i) * TAU;
  const r = 1.0 + ring * 0.38 + (rand(i, 2) - 0.5) * 0.04;
  const tilt = [0.35, -0.9, 1.25][ring];
  const x = Math.cos(t) * r;
  const zz = Math.sin(t) * r;
  set(out, o, x, zz * Math.sin(tilt), zz * Math.cos(tilt));
};

/** Design: a flowing sheet. */
const sheet: Fill = (i, n, out, o) => {
  const side = Math.ceil(Math.sqrt(n));
  const u = (i % side) / side - 0.5;
  const v = Math.floor(i / side) / side - 0.5;
  const x = u * 3.6;
  const z = v * 3.6;
  set(out, o, x, 0.42 * Math.sin(x * 1.7) * Math.cos(z * 1.5) + 0.18 * Math.sin(z * 3.1), z);
};

/** Engineering: a cube built as a lattice. */
const lattice: Fill = (i, n, out, o) => {
  const cells = 5;
  const step = 2.4 / cells;
  const axis = i % 3;
  const a = Math.floor(rand(i, 1) * (cells + 1)) * step - 1.2;
  const b = Math.floor(rand(i, 2) * (cells + 1)) * step - 1.2;
  const c = rand(i, 3) * 2.4 - 1.2;
  if (axis === 0) set(out, o, c, a, b);
  else if (axis === 1) set(out, o, a, c, b);
  else set(out, o, a, b, c);
};

/** AI: a network of nodes with links between them. */
const NODES: [number, number, number][] = Array.from({ length: 14 }, (_, k) => onSphere(k, 14, 1.35));
const network: Fill = (i, n, out, o) => {
  const a = NODES[Math.floor(rand(i, 1) * NODES.length)];
  if (i % 3 === 0) {
    const [x, y, z] = onSphere(i, n, 0.16 + rand(i, 4) * 0.06);
    return set(out, o, a[0] + x, a[1] + y, a[2] + z);
  }
  const b = NODES[Math.floor(rand(i, 2) * NODES.length)];
  const t = rand(i, 3);
  set(out, o, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
};

/** Cloud and security: a ring that encloses. */
const torus: Fill = (i, n, out, o) => {
  const u = rand(i, 1) * TAU;
  const v = rand(i, 2) * TAU;
  const R = 1.25;
  const r = 0.46;
  set(out, o, (R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u));
};

/** Growth: a spiral that widens as it rises. */
const spiral: Fill = (i, n, out, o) => {
  const t = i / n;
  const angle = t * TAU * 5;
  const r = 0.25 + t * 1.3 + (rand(i) - 0.5) * 0.08;
  set(out, o, Math.cos(angle) * r, t * 2.8 - 1.4 + (rand(i, 2) - 0.5) * 0.06, Math.sin(angle) * r);
};

/** Managed services: a continuous loop, a figure of eight. */
const loop: Fill = (i, n, out, o) => {
  const t = (i / n) * TAU;
  const s = 1.7 / (1 + Math.sin(t) ** 2);
  const jx = (rand(i, 1) - 0.5) * 0.22;
  const jy = (rand(i, 2) - 0.5) * 0.22;
  const jz = (rand(i, 3) - 0.5) * 0.22;
  set(out, o, s * Math.cos(t) + jx, s * Math.sin(t) * Math.cos(t) + jy, Math.sin(t * 2) * 0.35 + jz);
};

/** Globe: lines of latitude and longitude. */
export const GLOBE_RADIUS = 1.5;
const globe: Fill = (i, n, out, o) => {
  const r = GLOBE_RADIUS;
  if (i % 2 === 0) {
    const lat = ((Math.floor(rand(i, 1) * 13) - 6) / 6) * (Math.PI / 2) * 0.92;
    const lon = rand(i, 2) * TAU;
    set(out, o, r * Math.cos(lat) * Math.cos(lon), r * Math.sin(lat), r * Math.cos(lat) * Math.sin(lon));
  } else {
    const lon = (Math.floor(rand(i, 3) * 24) / 24) * TAU;
    const lat = (rand(i, 4) - 0.5) * Math.PI;
    set(out, o, r * Math.cos(lat) * Math.cos(lon), r * Math.sin(lat), r * Math.cos(lat) * Math.sin(lon));
  }
};

/** Converts latitude and longitude in degrees to a point on the globe. */
export function onGlobe(latDeg: number, lonDeg: number, r = GLOBE_RADIUS): [number, number, number] {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (-lonDeg * Math.PI) / 180;
  return [r * Math.cos(lat) * Math.cos(lon), r * Math.sin(lat), r * Math.cos(lat) * Math.sin(lon)];
}

/** Work gallery: six frames in a grid, at slightly different depths. */
const frames: Fill = (i, n, out, o) => {
  const k = i % 6;
  const cx = ((k % 3) - 1) * 1.45;
  const cy = (Math.floor(k / 3) - 0.5) * 1.15;
  const w = 0.6;
  const h = 0.42;
  const t = rand(i, 1);
  const edge = Math.floor(rand(i, 2) * 4);
  let x = 0;
  let y = 0;
  if (edge === 0) [x, y] = [t * 2 * w - w, h];
  else if (edge === 1) [x, y] = [t * 2 * w - w, -h];
  else if (edge === 2) [x, y] = [w, t * 2 * h - h];
  else [x, y] = [-w, t * 2 * h - h];
  if (i % 5 === 0) [x, y] = [(rand(i, 3) - 0.5) * 2 * w, (rand(i, 4) - 0.5) * 2 * h];
  set(out, o, cx + x, cy + y, (k % 2) * 0.35 - 0.17);
};

/** Idle: a wide, thin field of dust for pages where people read. */
const dust: Fill = (i, n, out, o) => {
  set(out, o, (rand(i, 1) - 0.5) * 9, (rand(i, 2) - 0.5) * 5.5, (rand(i, 3) - 0.5) * 4);
};

/** Draws text on a 2D canvas and returns particle positions inside the letters. */
function fromText(text: string, n: number) {
  const w = 600;
  const h = 240;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return build(n, dust);
  ctx.fillStyle = "#000";
  ctx.font = "700 220px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, w / 2, h / 2 + 10);
  const data = ctx.getImageData(0, 0, w, h).data;
  const inside: number[] = [];
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      if (data[(y * w + x) * 4 + 3] > 128) inside.push(x, y);
    }
  }
  if (inside.length === 0) return build(n, dust);
  const count = inside.length / 2;
  return build(n, (i, _n, out, o) => {
    const p = Math.floor(rand(i, 1) * count) * 2;
    set(out, o, (inside[p] / w - 0.5) * 4.2, -(inside[p + 1] / h - 0.5) * 1.7, (rand(i, 2) - 0.5) * 0.25);
  });
}

const PILLAR_SHAPES: Fill[] = [orbits, sheet, lattice, network, torus, spiral, loop];

export type Shapes = {
  idle: Float32Array;
  hero: Float32Array;
  globe: Float32Array;
  gallery: Float32Array;
  notfound: Float32Array;
  pillars: Float32Array[];
};

export function buildShapes(n: number): Shapes {
  return {
    idle: build(n, dust),
    hero: build(n, hero),
    globe: build(n, globe),
    gallery: build(n, frames),
    notfound: fromText("404", n),
    pillars: PILLAR_SHAPES.map((fill) => build(n, fill)),
  };
}
