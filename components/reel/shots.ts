// The four shots of the showreel. Each one is a scene, a camera and an update
// function that poses everything for a moment in the shot, so any frame can be
// rendered on its own.
import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import {
  ScrollScreen,
  easeIn,
  easeInOut,
  easeOut,
  easeOutExpo,
  fitUV,
  gradientTexture,
  mix,
  rng,
  roundedRect,
  span,
  studioEnv,
} from "./kit";
import { laptop, monitor, phone } from "./models";

export type Shot = {
  name: string;
  duration: number;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  toneMapping: THREE.ToneMapping;
  exposure: number;
  /** Bloom strength, radius and threshold. */
  bloom: [number, number, number];
  update: (t: number) => void;
};

export type ReelTextures = {
  laptop: THREE.Texture;
  phone: THREE.Texture;
  monitor: THREE.Texture;
  tiles: THREE.Texture[];
  font: string;
};

const ASPECT = 16 / 9;

/* ------------------------------------------------------------------------ */
/* 1. Night dunes: a laptop opens and a phone floats in.                     */
/* ------------------------------------------------------------------------ */
export function nightShot(renderer: THREE.WebGLRenderer, tex: ReelTextures): Shot {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030306);
  scene.fog = new THREE.FogExp2(0x0b0d1d, 0.05);
  scene.environment = studioEnv(renderer, 0x000000, [
    { pos: [0, 5, -7], size: [12, 2.5], color: 0x9aa5ff, intensity: 1.3 },
    { pos: [-8, 2, 3], size: [3, 7], color: 0x3c4590, intensity: 0.5 },
    { pos: [6, 6, 6], size: [4, 2], color: 0xffffff, intensity: 0.35 },
  ]);
  scene.environmentIntensity = 0.7;

  // A sky that glows faintly at the horizon.
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(140, 50),
    new THREE.MeshBasicMaterial({
      map: gradientTexture([
        [0, "#000000"],
        [0.5, "#05060f"],
        [0.7, "#1d2250"],
        [0.78, "#2e3577"],
        [1, "#0b0d1d"],
      ]),
      fog: false,
    }),
  );
  sky.position.set(0, 6, -38);
  scene.add(sky);

  // Dunes with soft ridges, lit from behind so the crests catch the light.
  const noise = new ImprovedNoise();
  const dunesGeo = new THREE.PlaneGeometry(90, 60, 420, 280);
  dunesGeo.rotateX(-Math.PI / 2);
  const p = dunesGeo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i);
    const n = noise.noise(x * 0.06, z * 0.07, 1.3);
    const ridge = 1 - Math.abs(Math.sin(x * 0.17 + z * 0.06 + n * 2.8));
    const y = ridge * ridge * 1.5 + noise.noise(x * 0.22, z * 0.22, 4.1) * 0.3 + n * 0.8 - 1.9;
    p.setY(i, y);
  }
  dunesGeo.computeVertexNormals();
  const dunes = new THREE.Mesh(
    dunesGeo,
    new THREE.MeshStandardMaterial({ color: 0x1b1e33, roughness: 0.68, metalness: 0 }),
  );
  dunes.position.z = -8;
  scene.add(dunes);

  const rim = new THREE.DirectionalLight(0x8e9aff, 3.6);
  rim.position.set(-3, 4, -14);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0x3a3f80, 0.7);
  fill.position.set(4, 3, 8);
  scene.add(fill);
  scene.add(new THREE.AmbientLight(0x10121f, 0.6));

  const lap = laptop(tex.laptop);
  const lapScreen = new ScrollScreen(tex.laptop, lap.screenAspect);
  // The screen material was built with the plain texture; swap in the scrolling one.
  scene.add(lap.group);
  lap.group.traverse((o) => {
    if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshBasicMaterial && o.material.map === tex.laptop) {
      o.material.map = lapScreen.tex;
    }
  });

  const ph = phone(tex.phone);
  const phScreen = new ScrollScreen(tex.phone, ph.screenAspect);
  ph.group.traverse((o) => {
    if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshBasicMaterial && o.material.map === tex.phone) {
      o.material.map = phScreen.tex;
    }
  });
  scene.add(ph.group);

  const camera = new THREE.PerspectiveCamera(30, ASPECT, 0.1, 200);
  const duration = 3.4;

  return {
    name: "night",
    duration,
    scene,
    camera,
    toneMapping: THREE.ACESFilmicToneMapping,
    exposure: 1.05,
    bloom: [0.3, 0.5, 1.5],
    update(t) {
      const k = easeInOut(span(t, 0, duration));
      lap.setOpen(mix(0.15, 1.92, easeInOut(span(t, 0.05, 1.5))));
      lap.setGlow(easeOut(span(t, 0.7, 1.5)));
      lapScreen.set(easeInOut(span(t, 1.8, 3.3)) * 0.3);
      lap.group.position.set(0.35, 0.95 + Math.sin(t * 1.3) * 0.05, 0);
      lap.group.rotation.set(0.14 + 0.04 * Math.sin(t * 0.9), mix(-0.9, -0.4, k), -0.12);

      const pin = easeOut(span(t, 0.15, 1.7));
      ph.group.position.set(mix(-1.7, -2.05, pin), mix(4.4, 2.45, pin) + Math.sin(t * 1.7) * 0.04, 0.55);
      ph.group.rotation.set(0.12, mix(-0.7, 0.32, k), mix(0.55, 0.2, pin));
      ph.setGlow(easeOut(span(t, 0.6, 1.4)));
      phScreen.set(easeInOut(span(t, 1.6, 3.2)) * 0.45);

      camera.position.set(mix(2.3, 0.7, k), mix(2.5, 2.15, k), mix(7.4, 6.3, k));
      camera.lookAt(mix(0.0, -0.45, k), mix(1.45, 1.65, k), 0);
      dunes.position.x = -t * 0.3;
    },
  };
}

/* ------------------------------------------------------------------------ */
/* 2. A light page: a sphere rises, cracks open and shows a glowing core.    */
/* ------------------------------------------------------------------------ */
function pageTexture(font: string) {
  const W = 2560;
  const H = 1440;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#ebe8e3";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#000";
  g.textBaseline = "middle";

  g.font = `600 46px ${font}`;
  g.fillText("technicus", 140, 116);

  const pw = 236;
  const ph = 74;
  const px = W - 140 - pw;
  g.beginPath();
  g.roundRect(px, 116 - ph / 2, pw, ph, ph / 2);
  g.fill();
  g.font = `500 30px ${font}`;
  const items = ["Services", "Industries", "Work", "Insights", "About"];
  const gap = 66;
  const total = items.reduce((s, it) => s + g.measureText(it).width, 0) + gap * (items.length - 1);
  let x = px - 72 - total;
  for (const it of items) {
    g.fillText(it, x, 116);
    x += g.measureText(it).width + gap;
  }
  g.fillStyle = "#fff";
  g.textAlign = "center";
  g.fillText("Talk to us", px + pw / 2, 117);

  g.fillStyle = "#000";
  g.font = `560 156px ${font}`;
  g.letterSpacing = "-4px";
  ["Technology consultancy", "for organisations that", "build on software"].forEach((line, i) =>
    g.fillText(line, W / 2, 470 + i * 164),
  );
  g.letterSpacing = "0px";
  g.fillStyle = "rgba(0,0,0,0.62)";
  g.font = `400 40px ${font}`;
  g.fillText("We help companies decide what to build, design it well,", W / 2, 1000);
  g.fillText("engineer it properly and keep it running.", W / 2, 1056);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

type Chunk = { mesh: THREE.Mesh; dir: THREE.Vector3; axis: THREE.Vector3; speed: number; spin: number; home: THREE.Vector3 };

/** A hollow sphere cut into pieces that fit together until they fly apart. */
function shell(radius: number, thickness: number, pieces: number, material: THREE.Material, seed: number) {
  const random = rng(seed);
  const ico = new THREE.IcosahedronGeometry(1, 7);
  const src = ico.index ? ico.toNonIndexed() : ico;
  const pos = src.attributes.position;
  const faces = pos.count / 3;

  const seeds: THREE.Vector3[] = [];
  for (let i = 0; i < pieces; i++) {
    const z = random() * 2 - 1;
    const a = random() * Math.PI * 2;
    const r = Math.sqrt(1 - z * z);
    seeds.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, z));
  }

  const buckets: number[][] = seeds.map(() => []);
  const va = new THREE.Vector3();
  const vb = new THREE.Vector3();
  const vc = new THREE.Vector3();
  const centre = new THREE.Vector3();
  for (let f = 0; f < faces; f++) {
    va.fromBufferAttribute(pos, f * 3);
    vb.fromBufferAttribute(pos, f * 3 + 1);
    vc.fromBufferAttribute(pos, f * 3 + 2);
    centre.copy(va).add(vb).add(vc).normalize();
    // Wobble the borders a little so the cracks are not straight lines.
    centre.x += (random() - 0.5) * 0.04;
    let best = 0;
    let bestDot = -2;
    seeds.forEach((s, i) => {
      const d = s.dot(centre);
      if (d > bestDot) {
        bestDot = d;
        best = i;
      }
    });
    buckets[best].push(f);
  }

  const chunks: Chunk[] = [];
  const inner = radius - thickness;
  for (const list of buckets) {
    if (!list.length) continue;
    const positions: number[] = [];
    const normals: number[] = [];
    const mid = new THREE.Vector3();
    const push = (v: THREE.Vector3, n: THREE.Vector3) => {
      positions.push(v.x, v.y, v.z);
      normals.push(n.x, n.y, n.z);
    };
    for (const f of list) {
      const a = new THREE.Vector3().fromBufferAttribute(pos, f * 3).normalize();
      const b = new THREE.Vector3().fromBufferAttribute(pos, f * 3 + 1).normalize();
      const c = new THREE.Vector3().fromBufferAttribute(pos, f * 3 + 2).normalize();
      mid.add(a).add(b).add(c);
      const [ao, bo, co] = [a, b, c].map((v) => v.clone().multiplyScalar(radius));
      const [ai, bi, ci] = [a, b, c].map((v) => v.clone().multiplyScalar(inner));
      push(ao, a);
      push(bo, b);
      push(co, c);
      push(ai, a.clone().negate());
      push(ci, c.clone().negate());
      push(bi, b.clone().negate());
      for (const [po, qo, pi, qi] of [
        [ao, bo, ai, bi],
        [bo, co, bi, ci],
        [co, ao, ci, ai],
      ]) {
        const n = new THREE.Vector3().subVectors(qo, po).cross(new THREE.Vector3().subVectors(pi, po)).normalize().negate();
        push(po, n);
        push(pi, n);
        push(qo, n);
        push(qo, n);
        push(pi, n);
        push(qi, n);
      }
    }
    mid.normalize().multiplyScalar(radius - thickness / 2);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    g.translate(-mid.x, -mid.y, -mid.z);
    const mesh = new THREE.Mesh(g, material);
    mesh.position.copy(mid);
    const dir = mid.clone().normalize();
    // Pieces fly mostly outward, with a pull toward the camera.
    dir.z += 0.12;
    dir.normalize();
    chunks.push({
      mesh,
      dir,
      home: mid.clone(),
      axis: new THREE.Vector3(random() - 0.5, random() - 0.5, random() - 0.5).normalize(),
      speed: 1.8 + random() * 3.2,
      spin: 0.6 + random() * 2.2,
    });
  }
  ico.dispose();
  return chunks;
}

const coreVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const coreFragment = /* glsl */ `
  uniform float uTime;
  uniform float uGlow;
  varying vec3 vNormal;
  varying vec3 vPos;
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
      mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float a = 0.5;
    float s = 0.0;
    for (int i = 0; i < 5; i++) {
      s += a * noise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return s;
  }
  void main() {
    float facing = abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
    float rim = pow(1.0 - facing, 2.2);
    float n = fbm(vPos * 2.4 + vec3(0.0, uTime * 0.7, uTime * 0.35));
    vec3 deep = vec3(0.03, 0.015, 0.26);
    vec3 mid = vec3(0.22, 0.14, 1.0);
    vec3 hot = vec3(1.0, 0.96, 1.0);
    vec3 c = mix(deep, mid, smoothstep(0.3, 0.68, n));
    c = mix(c, hot, smoothstep(0.6, 0.82, n) * 0.9);
    c += mid * rim * 1.4;
    c += hot * pow(facing, 6.0) * 0.35;
    gl_FragColor = vec4(c * uGlow, 1.0);
  }
`;

export function sphereShot(renderer: THREE.WebGLRenderer, tex: ReelTextures): Shot {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xebe8e3);
  scene.environment = studioEnv(renderer, 0x3a3836, [
    { pos: [-5, 5, 5], size: [6, 4], color: 0xffffff, intensity: 1.6 },
    { pos: [6, 1, 4], size: [3, 5], color: 0xfff6ec, intensity: 0.7 },
  ]);
  scene.environmentIntensity = 0.6;

  const page = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), new THREE.MeshBasicMaterial({ map: pageTexture(tex.font) }));
  scene.add(page);

  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(-5, 4, 5);
  scene.add(key);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb9b2c4, 0.45));
  const inner = new THREE.PointLight(0x7d6dff, 0, 7, 2);
  scene.add(inner);

  const ball = new THREE.Group();
  scene.add(ball);
  const clay = new THREE.MeshStandardMaterial({ color: 0xf3f1ed, roughness: 0.62, metalness: 0, side: THREE.DoubleSide });
  const R = 1.3;
  const chunks = shell(R, 0.12, 46, clay, 7);
  chunks.forEach((c) => ball.add(c.mesh));
  const coreMat = new THREE.ShaderMaterial({
    vertexShader: coreVertex,
    fragmentShader: coreFragment,
    uniforms: { uTime: { value: 0 }, uGlow: { value: 0 } },
  });
  const core = new THREE.Mesh(new THREE.SphereGeometry(R * 0.8, 96, 64), coreMat);
  ball.add(core);
  ball.add(inner);

  const camera = new THREE.PerspectiveCamera(45, ASPECT, 0.1, 100);
  const duration = 3.0;
  const q = new THREE.Quaternion();
  const look = new THREE.Vector3();

  return {
    name: "sphere",
    duration,
    scene,
    camera,
    toneMapping: THREE.NeutralToneMapping,
    exposure: 1,
    bloom: [0.7, 0.6, 1.3],
    update(t) {
      const rise = easeOutExpo(span(t, 0, 1.1));
      ball.position.set(0, mix(-6.2, -0.9, rise), 2.2);
      ball.rotation.set(0.3, t * 0.5, 0.1);

      const crack = easeOut(span(t, 0.95, 1.3));
      const burst = easeOutExpo(span(t, 1.3, 3.0));
      for (const c of chunks) {
        const d = crack * 0.035 + burst * c.speed;
        c.mesh.position.copy(c.home).addScaledVector(c.dir, d);
        q.setFromAxisAngle(c.axis, burst * c.spin);
        c.mesh.quaternion.copy(q);
      }
      coreMat.uniforms.uTime.value = t;
      coreMat.uniforms.uGlow.value = mix(0, 1.8, easeOut(span(t, 0.9, 1.5))) + burst * 0.9;
      core.scale.setScalar(1 + burst * 0.12);
      inner.intensity = mix(0, 25, easeOut(span(t, 0.95, 1.6)));

      // The camera starts square on the page, then turns down to the sphere
      // and pushes in. In the last moments it whips upward into the next shot.
      const turn = easeInOut(span(t, 0.7, 2.0));
      const push = easeInOut(span(t, 1.2, 3.0));
      camera.position.set(mix(0, 0.6, turn), mix(0, -0.5, turn), mix(10, 7.2, turn) - push * 1.4);
      look.set(0, mix(0, ball.position.y, turn), mix(0, 2.2, turn));
      camera.lookAt(look);
      camera.rotateZ(mix(0, -0.12, turn));
      camera.rotateY(-easeIn(span(t, 2.72, 3.0)) * 0.8);
    },
  };
}

/* ------------------------------------------------------------------------ */
/* 3. A tilted wall of pages from the site.                                  */
/* ------------------------------------------------------------------------ */
export function wallShot(renderer: THREE.WebGLRenderer, tex: ReelTextures): Shot {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf2f0ec);
  scene.environment = studioEnv(renderer, 0xe8e6e2, [
    { pos: [-3, 6, 6], size: [6, 4], color: 0xffffff, intensity: 2 },
  ]);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9d4cc, 0.8));
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(3, 6, 6);
  scene.add(key);

  const TW = 3.2;
  const TH = 2.0;
  const GAP = 0.3;
  const COLS = 11;
  const ROWS = 7;
  const geo = fitUV(
    new THREE.ExtrudeGeometry(roundedRect(TW, TH, 0.13), { depth: 0.06, bevelEnabled: false, curveSegments: 8 }),
    TW,
    TH,
  );
  const side = new THREE.MeshStandardMaterial({ color: 0xd6d3ce, roughness: 0.6 });
  const mats = tex.tiles.map((t) => new THREE.MeshBasicMaterial({ map: t }));
  const random = rng(11);

  const wall = new THREE.Group();
  scene.add(wall);
  const tiles: { mesh: THREE.Mesh; phase: number; delay: number }[] = [];
  let prev = -1;
  const above: number[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let pick = Math.floor(random() * mats.length);
      for (let tries = 0; tries < 10 && (pick === prev || pick === above[c]); tries++) {
        pick = Math.floor(random() * mats.length);
      }
      prev = pick;
      above[c] = pick;
      const mesh = new THREE.Mesh(geo, [mats[pick], side]);
      // Every other row is shifted sideways, like bricks.
      mesh.position.set((c - (COLS - 1) / 2) * (TW + GAP) + (r % 2) * (TW + GAP) * 0.5, (r - (ROWS - 1) / 2) * (TH + GAP), 0);
      wall.add(mesh);
      tiles.push({ mesh, phase: random() * Math.PI * 2, delay: random() * 0.35 });
    }
  }

  const camera = new THREE.PerspectiveCamera(38, ASPECT, 0.1, 100);
  const duration = 2.6;

  return {
    name: "wall",
    duration,
    scene,
    camera,
    toneMapping: THREE.NeutralToneMapping,
    exposure: 1,
    bloom: [0, 0, 1],
    update(t) {
      const k = easeInOut(span(t, 0, duration));
      wall.rotation.set(-0.5, 0.22, mix(0.22, 0.06, k));
      wall.position.set(mix(1.6, -1.2, k), mix(-1.2, 0.8, k), 0);
      for (const tile of tiles) {
        const settle = easeOutExpo(span(t, tile.delay, tile.delay + 0.9));
        tile.mesh.position.z = mix(1.4, 0, settle) + Math.sin(t * 2 + tile.phase) * 0.06;
      }
      camera.position.set(0, 0, mix(9.5, 8.2, k));
      camera.rotation.set(0, 0, 0);
      // Arrive with a fast sideways whip that settles, continuing the turn
      // that ended the previous shot.
      camera.rotateY(mix(0.7, 0, easeOutExpo(span(t, 0, 0.5))));
    },
  };
}

/* ------------------------------------------------------------------------ */
/* 4. A monitor in a pale blue room.                                         */
/* ------------------------------------------------------------------------ */
export function roomShot(renderer: THREE.WebGLRenderer, tex: ReelTextures): Shot {
  const blue = 0xb4cdf0;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(blue);
  scene.fog = new THREE.Fog(blue, 9, 26);
  scene.environment = studioEnv(renderer, 0x5f7aa3, [
    { pos: [-5, 7, 5], size: [6, 5], color: 0xffffff, intensity: 1.4 },
    { pos: [6, 3, 2], size: [3, 6], color: 0xe6f0ff, intensity: 0.8 },
  ]);
  scene.environmentIntensity = 0.7;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x9ab8e6, 0.7));
  const sun = new THREE.DirectionalLight(0xffffff, 1.8);
  sun.position.set(-4, 9, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -6;
  sun.shadow.camera.right = 6;
  sun.shadow.camera.top = 6;
  sun.shadow.camera.bottom = -6;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    new THREE.MeshStandardMaterial({ color: 0xc9dbf5, roughness: 0.7 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(2.5, 2.5, 0.1, 128),
    new THREE.MeshPhysicalMaterial({ color: 0xe8f1fd, roughness: 0.12, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08 }),
  );
  platform.position.y = 0.05;
  platform.receiveShadow = true;
  platform.castShadow = true;
  scene.add(platform);

  const pillar = new THREE.MeshStandardMaterial({ color: 0xdce8f9, roughness: 0.85, emissive: 0x9ab8e6, emissiveIntensity: 0.3 });
  const pillarGeo = new THREE.BoxGeometry(0.9, 14, 0.9);
  for (let i = 0; i < 11; i++) {
    const a = mix(-1.25, 1.25, i / 10);
    const r = 9.5 + (i % 2) * 1.5;
    const m = new THREE.Mesh(pillarGeo, pillar);
    m.position.set(Math.sin(a) * r, 7, -Math.cos(a) * r + 1.5);
    m.rotation.y = -a;
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
  }

  const mon = monitor(tex.monitor);
  const screenScroll = new ScrollScreen(tex.monitor, mon.screenAspect);
  mon.group.traverse((o) => {
    if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshBasicMaterial && o.material.map === tex.monitor) {
      o.material.map = screenScroll.tex;
    }
  });
  mon.group.position.y = 0.1;
  mon.group.rotation.y = 0.18;
  scene.add(mon.group);

  const camera = new THREE.PerspectiveCamera(34, ASPECT, 0.1, 100);
  const duration = 3.0;

  return {
    name: "room",
    duration,
    scene,
    camera,
    toneMapping: THREE.NeutralToneMapping,
    exposure: 1,
    bloom: [0, 0, 1],
    update(t) {
      const k = easeInOut(span(t, 0, duration));
      const a = mix(0.75, 0.2, k);
      const r = mix(7.0, 5.4, k);
      camera.position.set(Math.sin(a) * r, mix(2.4, 2.05, k), Math.cos(a) * r);
      camera.lookAt(0, mix(1.55, 1.8, k), 0);
      screenScroll.set(easeInOut(span(t, 0.7, 1.5)) * 0.16 + easeInOut(span(t, 1.8, 2.7)) * 0.2);
    },
  };
}
