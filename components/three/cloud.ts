import * as THREE from "three";
import { offices } from "@/content/company";
import { buildShapes, onGlobe, type Shapes } from "./shapes";
import type { SceneMode } from "./store";

const vertexShader = /* glsl */ `
  attribute float aRand;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vRand;
  void main() {
    vRand = aRand;
    vec3 p = position;
    // A small drift so the shape is never completely still.
    p += 0.035 * vec3(
      sin(uTime * 0.6 + aRand * 40.0),
      cos(uTime * 0.5 + aRand * 55.0),
      sin(uTime * 0.7 + aRand * 70.0)
    );
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.6 + aRand * 0.8) / -mv.z;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAccent;
  uniform float uOpacity;
  varying float vRand;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.15, d);
    vec3 color = mix(uBase, uAccent, step(0.7, vRand));
    gl_FragColor = vec4(color, a * uOpacity * (0.55 + 0.45 * vRand));
  }
`;

// Size and spin of the object for each kind of shape.
const LAYOUT: Record<SceneMode, { scale: number; spin: number }> = {
  hero: { scale: 1, spin: 0.1 },
  pillar: { scale: 1, spin: 0.16 },
  globe: { scale: 1.05, spin: 0.08 },
  gallery: { scale: 1.2, spin: 0 },
  notfound: { scale: 1.05, spin: 0 },
};

export type Frame = {
  dt: number;
  time: number;
  pointerX: number;
  pointerY: number;
  pixelRatio: number;
};

/**
 * The particle object: every point, the globe markers and the per-frame
 * movement. Kept outside React so that the frame loop can change it freely.
 */
export class ParticleCloud {
  readonly group = new THREE.Group();
  private readonly geometry = new THREE.BufferGeometry();
  private readonly material: THREE.ShaderMaterial;
  private readonly markers = new THREE.Group();
  private readonly markerGeometry = new THREE.SphereGeometry(0.05, 16, 16);
  private readonly markerMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  private readonly shapes: Shapes;
  private readonly speed: Float32Array;
  private mode: SceneMode = "hero";
  private index = 0;

  constructor(
    private readonly count: number,
    private readonly interactive: boolean,
  ) {
    this.shapes = buildShapes(count);
    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.shapes.idle.slice(), 3));
    const rand = new Float32Array(count);
    this.speed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      rand[i] = Math.random();
      this.speed[i] = 1.6 + Math.random() * 3.2;
    }
    this.geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 24 },
        uPixelRatio: { value: 1 },
        uOpacity: { value: 0 },
        uBase: { value: new THREE.Color("#ffffff") },
        uAccent: { value: new THREE.Color("#8d89e8") },
      },
    });
    const points = new THREE.Points(this.geometry, this.material);
    points.frustumCulled = false;
    this.group.add(points);

    for (const office of offices) {
      const mesh = new THREE.Mesh(this.markerGeometry, this.markerMaterial);
      mesh.position.set(...onGlobe(office.lat, office.lon, 1.52));
      this.markers.add(mesh);
    }
    this.markers.scale.setScalar(0);
    this.group.add(this.markers);
  }

  /** Chooses the shape the particles move towards. */
  setTarget(mode: SceneMode, index = 0) {
    this.mode = mode;
    this.index = index;
  }

  update(f: Frame) {
    const mode = this.mode;
    const target =
      mode === "pillar" ? this.shapes.pillars[Math.min(this.index, this.shapes.pillars.length - 1)] : this.shapes[mode];

    // Move every particle part of the way to its place in the current shape.
    const position = this.geometry.attributes.position as THREE.BufferAttribute;
    const arr = position.array as Float32Array;
    for (let i = 0; i < this.count; i++) {
      const k = Math.min(1, this.speed[i] * f.dt);
      const o = i * 3;
      arr[o] += (target[o] - arr[o]) * k;
      arr[o + 1] += (target[o + 1] - arr[o + 1]) * k;
      arr[o + 2] += (target[o + 2] - arr[o + 2]) * k;
    }
    position.needsUpdate = true;

    const layout = LAYOUT[mode];
    const g = this.group;
    const ease = Math.min(1, f.dt * 2.5);
    g.scale.setScalar(g.scale.x + (layout.scale - g.scale.x) * ease);

    if (layout.spin === 0) {
      // Come to rest facing the viewer, by the shortest way round.
      const rest = Math.round(g.rotation.y / (Math.PI * 2)) * Math.PI * 2;
      g.rotation.y += (rest - g.rotation.y) * ease;
    } else {
      g.rotation.y += layout.spin * f.dt;
    }
    const tiltX = this.interactive ? f.pointerY * -0.2 : 0;
    const tiltZ = this.interactive ? f.pointerX * 0.1 : 0;
    g.rotation.x += (tiltX - g.rotation.x) * ease;
    g.rotation.z += (tiltZ - g.rotation.z) * ease;

    const u = this.material.uniforms;
    u.uTime.value = f.time;
    u.uPixelRatio.value = f.pixelRatio;
    u.uOpacity.value += (0.95 - u.uOpacity.value) * ease;

    const m = this.markers;
    const s = m.scale.x + ((mode === "globe" ? 1 : 0) - m.scale.x) * ease;
    m.scale.setScalar(s);
    m.visible = s > 0.02;
    const pulse = 1 + 0.35 * Math.sin(f.time * 3);
    for (const child of m.children) child.scale.setScalar(pulse);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.markerGeometry.dispose();
    this.markerMaterial.dispose();
  }
}
