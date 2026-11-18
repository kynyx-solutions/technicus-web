// Small helpers shared by the showreel scenes: timing curves, seeded random
// numbers, rounded shapes, scrolling screens and studio lighting.
import * as THREE from "three";

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** 0 before `a`, 1 after `b`, linear in between. */
export const span = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const mix = (a: number, b: number, k: number) => a + (b - a) * k;
export const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);
export const easeIn = (k: number) => k * k * k;
export const easeOutExpo = (k: number) => (k >= 1 ? 1 : 1 - Math.pow(2, -10 * k));

/** Deterministic random numbers, so every render of the reel is identical. */
export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A rectangle with circular corners, centred on the origin. */
export function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x0 = -w / 2;
  const y0 = -h / 2;
  const x1 = w / 2;
  const y1 = h / 2;
  s.moveTo(x0 + r, y0);
  s.lineTo(x1 - r, y0);
  s.absarc(x1 - r, y0 + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x1, y1 - r);
  s.absarc(x1 - r, y1 - r, r, 0, Math.PI / 2, false);
  s.lineTo(x0 + r, y1);
  s.absarc(x0 + r, y1 - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x0, y0 + r);
  s.absarc(x0 + r, y0 + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** Texture coordinates from position, so a picture fills the shape exactly. */
export function fitUV(g: THREE.BufferGeometry, w: number, h: number) {
  const p = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5);
  uv.needsUpdate = true;
  return g;
}

/** A flat rounded screen facing +z. */
export function screenGeometry(w: number, h: number, r: number) {
  return fitUV(new THREE.ShapeGeometry(roundedRect(w, h, r), 10), w, h);
}

/** Shows a window of a tall page screenshot and scrolls it. */
export class ScrollScreen {
  readonly tex: THREE.Texture;
  private repeat: number;

  constructor(source: THREE.Texture, screenAspect: number) {
    this.tex = source.clone();
    this.tex.needsUpdate = true;
    const img = source.image as { width: number; height: number };
    this.repeat = Math.min(1, (img.width * screenAspect) / img.height);
    this.tex.repeat.set(1, this.repeat);
    this.set(0);
  }

  /** 0 shows the top of the page, 1 the bottom. */
  set(k: number) {
    this.tex.offset.y = (1 - this.repeat) * (1 - clamp01(k));
  }
}

export type Softbox = {
  pos: [number, number, number];
  size: [number, number];
  color: THREE.ColorRepresentation;
  intensity: number;
};

/** Reflections from a few soft light panels, as in a photo studio. */
export function studioEnv(renderer: THREE.WebGLRenderer, background: THREE.ColorRepresentation, boxes: Softbox[]) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(background);
  const geometries: THREE.BufferGeometry[] = [];
  for (const b of boxes) {
    const g = new THREE.PlaneGeometry(b.size[0], b.size[1]);
    geometries.push(g);
    const m = new THREE.Mesh(
      g,
      new THREE.MeshBasicMaterial({ color: new THREE.Color(b.color).multiplyScalar(b.intensity), side: THREE.DoubleSide }),
    );
    m.position.set(...b.pos);
    m.lookAt(0, 0, 0);
    scene.add(m);
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  const texture = pmrem.fromScene(scene, 0.03).texture;
  pmrem.dispose();
  geometries.forEach((g) => g.dispose());
  return texture;
}

/** A vertical colour gradient, used for skies and backdrops. */
export function gradientTexture(stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 512;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 512);
  for (const [at, color] of stops) grad.addColorStop(at, color);
  g.fillStyle = grad;
  g.fillRect(0, 0, 4, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
