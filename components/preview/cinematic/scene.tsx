"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { clamp, onScrollFrame } from "./scroll";

/*
  Hero scene: a sphere of points joined into a network. A band of light sweeps
  across it, signals run along a few of the links, it leans towards the pointer
  on a damped spring, and as the hero scrolls away it turns, comes closer and
  breaks apart. The render loop stops whenever the hero is off screen or the
  tab is hidden. With reduced motion it draws a single still frame.
*/

const ACCENT = new THREE.Color("#ff8a3d");

const pointVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScatter;
  uniform float uPixel;
  attribute float aRand;
  attribute vec3 aDir;
  varying float vHi;
  varying float vDepth;
  varying float vRand;
  void main() {
    vec3 p = position + aDir * uScatter * (0.5 + aRand * 1.6);
    p *= 1.0 + 0.014 * sin(uTime * 0.7 + aRand * 6.2831);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float s = dot(normalize(position), normalize(vec3(0.55, 1.0, 0.25)));
    float band = 1.0 - abs(fract(s * 0.9 - uTime * 0.07) - 0.5) * 2.0;
    vHi = smoothstep(0.9, 1.0, band);
    vDepth = smoothstep(-10.0, -4.5, mv.z);
    vRand = aRand;
    gl_PointSize = (1.1 + aRand * 1.5 + vHi * 2.6) * uPixel * (6.5 / -mv.z);
  }
`;

const pointFragment = /* glsl */ `
  uniform vec3 uAccent;
  uniform float uFade;
  varying float vHi;
  varying float vDepth;
  varying float vRand;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    float warm = max(vHi, step(0.94, vRand));
    vec3 col = mix(vec3(0.93, 0.92, 0.9), uAccent, warm);
    gl_FragColor = vec4(col, a * (0.18 + 0.82 * vDepth) * (0.55 + 0.45 * warm) * uFade);
  }
`;

const lineVertex = /* glsl */ `
  uniform float uTime;
  uniform float uScatter;
  attribute float aRand;
  attribute vec3 aDir;
  attribute float aT;
  attribute float aEdge;
  varying float vHi;
  varying float vDepth;
  varying float vT;
  varying float vEdge;
  void main() {
    vec3 p = position + aDir * uScatter * (0.5 + aRand * 1.6);
    p *= 1.0 + 0.014 * sin(uTime * 0.7 + aRand * 6.2831);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float s = dot(normalize(position), normalize(vec3(0.55, 1.0, 0.25)));
    float band = 1.0 - abs(fract(s * 0.9 - uTime * 0.07) - 0.5) * 2.0;
    vHi = smoothstep(0.86, 1.0, band);
    vDepth = smoothstep(-10.0, -4.5, mv.z);
    vT = aT;
    vEdge = aEdge;
  }
`;

const lineFragment = /* glsl */ `
  uniform vec3 uAccent;
  uniform float uFade;
  uniform float uTime;
  uniform float uScatter;
  varying float vHi;
  varying float vDepth;
  varying float vT;
  varying float vEdge;
  void main() {
    float pulse = 0.0;
    if (vEdge > 0.86) {
      float head = fract(uTime * (0.25 + vEdge * 0.3) + vEdge * 13.0);
      pulse = smoothstep(0.16, 0.0, abs(vT - head));
    }
    float base = 0.07 + 0.11 * vDepth;
    vec3 col = mix(vec3(0.9), uAccent, clamp(vHi + pulse, 0.0, 1.0));
    float a = (base + vHi * 0.32 + pulse * 0.85) * uFade * (1.0 - clamp(uScatter * 0.6, 0.0, 0.85));
    gl_FragColor = vec4(col, a);
  }
`;

const dustVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixel;
  attribute float aRand;
  varying float vA;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.15 + aRand * 6.2831) * 0.12;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vA = 0.25 + 0.5 * aRand;
    gl_PointSize = (0.8 + aRand * 1.2) * uPixel * (6.0 / -mv.z);
  }
`;

const dustFragment = /* glsl */ `
  uniform float uFade;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(vec3(0.85), smoothstep(0.5, 0.0, d) * vA * 0.5 * uFade);
  }
`;

function randomUnit() {
  const u = Math.random() * 2 - 1;
  const t = Math.random() * Math.PI * 2;
  const r = Math.sqrt(1 - u * u);
  return [r * Math.cos(t), u, r * Math.sin(t)] as const;
}

export function HeroScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const hero = host?.parentElement;
    if (!host || !hero) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // No WebGL: the CSS glow behind the hero stands in.
    }
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    const group = new THREE.Group();
    scene.add(group);

    // Points on a Fibonacci sphere, lightly jittered so it reads as organic.
    const N = small ? 560 : 1400;
    const R = 1.9;
    const pos = new Float32Array(N * 3);
    const rand = new Float32Array(N);
    const dir = new Float32Array(N * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      const j = R * (1 + (Math.random() - 0.5) * 0.06);
      pos.set([Math.cos(th) * r * j, y * j, Math.sin(th) * r * j], i * 3);
      rand[i] = Math.random();
      const [dx, dy, dz] = randomUnit();
      // Scatter mostly outward so the sphere opens rather than smears.
      dir.set([dx * 0.6 + Math.cos(th) * r, dy * 0.6 + y, dz * 0.6 + Math.sin(th) * r], i * 3);
    }

    const shared = {
      uTime: { value: 0 },
      uScatter: { value: reduced ? 0 : 2.2 },
      uFade: { value: reduced ? 1 : 0 },
      uPixel: { value: dpr },
      uAccent: { value: ACCENT },
    };

    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pointGeo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    pointGeo.setAttribute("aDir", new THREE.BufferAttribute(dir, 3));
    const blend = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending };
    const pointMat = new THREE.ShaderMaterial({ uniforms: shared, vertexShader: pointVertex, fragmentShader: pointFragment, ...blend });
    group.add(new THREE.Points(pointGeo, pointMat));

    // Links: each point to its nearest neighbours within a radius.
    const maxDist = R * (small ? 0.2 : 0.135);
    const seg: number[] = [];
    const segRand: number[] = [];
    const segDir: number[] = [];
    const segT: number[] = [];
    const segEdge: number[] = [];
    for (let i = 0; i < N; i++) {
      const near: [number, number][] = [];
      for (let k = i + 1; k < N; k++) {
        const dx = pos[i * 3] - pos[k * 3];
        const dy = pos[i * 3 + 1] - pos[k * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[k * 3 + 2];
        const d = dx * dx + dy * dy + dz * dz;
        if (d < maxDist * maxDist) near.push([d, k]);
      }
      near.sort((a, b) => a[0] - b[0]);
      for (const [, k] of near.slice(0, 2)) {
        const e = Math.random();
        for (const [idx, t] of [[i, 0], [k, 1]] as const) {
          seg.push(pos[idx * 3], pos[idx * 3 + 1], pos[idx * 3 + 2]);
          segDir.push(dir[idx * 3], dir[idx * 3 + 1], dir[idx * 3 + 2]);
          segRand.push(rand[idx]);
          segT.push(t);
          segEdge.push(e);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
    lineGeo.setAttribute("aDir", new THREE.Float32BufferAttribute(segDir, 3));
    lineGeo.setAttribute("aRand", new THREE.Float32BufferAttribute(segRand, 1));
    lineGeo.setAttribute("aT", new THREE.Float32BufferAttribute(segT, 1));
    lineGeo.setAttribute("aEdge", new THREE.Float32BufferAttribute(segEdge, 1));
    const lineMat = new THREE.ShaderMaterial({ uniforms: shared, vertexShader: lineVertex, fragmentShader: lineFragment, ...blend });
    group.add(new THREE.LineSegments(lineGeo, lineMat));

    // Far dust for depth.
    const D = small ? 160 : 420;
    const dust = new Float32Array(D * 3);
    const dustRand = new Float32Array(D);
    for (let i = 0; i < D; i++) {
      const [x, y, z] = randomUnit();
      const r = 3 + Math.random() * 5;
      dust.set([x * r * 1.6, y * r, z * r - 2], i * 3);
      dustRand[i] = Math.random();
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
    dustGeo.setAttribute("aRand", new THREE.BufferAttribute(dustRand, 1));
    const dustMat = new THREE.ShaderMaterial({ uniforms: shared, vertexShader: dustVertex, fragmentShader: dustFragment, ...blend });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // Layout: sphere sits right of the headline on wide screens, centred and
    // lower on narrow ones.
    let baseX = 0;
    let baseY = 0;
    let baseZ = 7.5;
    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const wide = camera.aspect > 1.15;
      // Pull back on tall screens so the whole sphere fits the width.
      baseZ = camera.aspect < 0.95 ? 7.5 * (0.95 / camera.aspect) * 0.92 : 7.5;
      shared.uPixel.value = dpr * (baseZ / 7.5);
      const halfH = baseZ * Math.tan((camera.fov * Math.PI) / 360);
      baseX = wide ? Math.min(2.2, camera.aspect * 0.95) : 0;
      baseY = wide ? 0.05 : Math.max(0.6, halfH - R - 0.75);
      camera.position.z = baseZ;
      if (reduced) draw(0);
    };

    // Pointer, on a damped spring.
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0, vx: 0, vy: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    let scroll = 0; // 0 at top, 1 when the hero has scrolled away
    let scrollSmooth = 0;
    const stopScroll = onScrollFrame(() => {
      const r = hero.getBoundingClientRect();
      scroll = clamp(-r.top / Math.max(1, r.height));
      if (!reduced) hero.style.setProperty("--hp", scroll.toFixed(4));
    });

    let spin = 0;
    const start = performance.now();
    function draw(dt: number) {
      const t = (performance.now() - start) / 1000;
      shared.uTime.value = reduced ? 8 : t;

      if (!reduced) {
        const k = 1 - Math.pow(1 - 0.045, dt);
        const damp = Math.pow(0.86, dt);
        cur.vx = (cur.vx + (target.x - cur.x) * k) * damp;
        cur.vy = (cur.vy + (target.y - cur.y) * k) * damp;
        cur.x += cur.vx * dt;
        cur.y += cur.vy * dt;
        scrollSmooth += (scroll - scrollSmooth) * (1 - Math.pow(0.88, dt));
        spin += 0.0011 * dt;
        // Intro: points fly in and settle over ~2.4s.
        const intro = clamp(t / 2.4);
        const ease = 1 - Math.pow(1 - intro, 4);
        const s = scrollSmooth;
        shared.uScatter.value = (1 - ease) * 2.2 + s * s * 2.4;
        shared.uFade.value = clamp(t / 1.2) * (1 - clamp((s - 0.55) / 0.45) * 0.9);
        group.rotation.y = spin + cur.x * 0.38 + s * 1.5 + (1 - ease) * -1.2;
        group.rotation.x = 0.18 + cur.y * 0.22 + s * 0.35;
        group.position.x = baseX * (1 - s * 0.7) + cur.x * 0.08;
        group.position.y = baseY - cur.y * 0.06 + s * 0.4;
        camera.position.z = baseZ - s * 2.6 * (baseZ / 7.5);
        dustPoints.rotation.y = spin * 0.4 + cur.x * 0.12;
        dustPoints.rotation.x = cur.y * 0.06;
      } else {
        group.rotation.set(0.18, 0.6, 0);
        group.position.set(baseX, baseY, 0);
      }
      renderer.render(scene, camera);
    }

    let raf = 0;
    let last = 0;
    let visible = true;
    const loop = (now: number) => {
      const dt = last ? Math.min(3, (now - last) / 16.667) : 1;
      last = now;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (reduced || raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(host);
    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduced) window.addEventListener("pointermove", onPointer, { passive: true });
    if (reduced) draw(0);
    else play();
    host.dataset.ready = "true";

    return () => {
      pause();
      stopScroll();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      [pointGeo, lineGeo, dustGeo, pointMat, lineMat, dustMat].forEach((o) => o.dispose());
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={hostRef} aria-hidden className="absolute inset-0" />;
}
