// Renders the showreel one frame at a time. Each frame is the average of
// several sub-frames spread across the shutter time and jittered by a fraction
// of a pixel, which gives real motion blur and smooth edges, as an offline
// renderer would.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { nightShot, roomShot, sphereShot, wallShot, type ReelTextures, type Shot } from "./shots";

export type ReelManifest = { laptop: string; phone: string; monitor: string; tiles: string[] };

export const FPS = 30;

function halton(i: number, base: number) {
  let f = 1;
  let r = 0;
  while (i > 0) {
    f /= base;
    r += f * (i % base);
    i = Math.floor(i / base);
  }
  return r;
}

export class Reel {
  readonly renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private renderPass: RenderPass;
  private bloom: UnrealBloomPass;
  private output = new OutputPass();
  private accum: THREE.WebGLRenderTarget;
  private blend: FullScreenQuad;
  private blendMat: THREE.ShaderMaterial;
  private shots: Shot[] = [];
  private textures: THREE.Texture[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    private width: number,
    private height: number,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(width, height, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    const target = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples: 4 });
    this.composer = new EffectComposer(this.renderer, target);
    this.composer.renderToScreen = false;
    this.renderPass = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
    this.bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0, 0, 1);
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloom);

    this.accum = new THREE.WebGLRenderTarget(width, height, { type: THREE.FloatType });
    this.blendMat = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: null }, uWeight: { value: 1 } },
      vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
      fragmentShader:
        "uniform sampler2D tDiffuse; uniform float uWeight; varying vec2 vUv; void main() { gl_FragColor = vec4(texture2D(tDiffuse, vUv).rgb * uWeight, uWeight); }",
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
      blendEquation: THREE.AddEquation,
      depthTest: false,
      depthWrite: false,
    });
    this.blend = new FullScreenQuad(this.blendMat);
    this.output.renderToScreen = true;
  }

  async load(manifest: ReelManifest, font: string) {
    const loader = new THREE.TextureLoader();
    const anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    const get = async (file: string) => {
      const t = await loader.loadAsync(`/_reel/${file}`);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = anisotropy;
      this.textures.push(t);
      return t;
    };
    const [laptop, phone, monitor, ...tiles] = await Promise.all(
      [manifest.laptop, manifest.phone, manifest.monitor, ...manifest.tiles].map(get),
    );
    const tex: ReelTextures = { laptop, phone, monitor, tiles, font };
    this.shots = [nightShot, sphereShot, wallShot, roomShot].map((make) => make(this.renderer, tex));
    // Compile every scene once so the first frame of each shot is not slow.
    for (const s of this.shots) {
      s.update(0);
      this.renderer.compile(s.scene, s.camera);
    }
  }

  get duration() {
    return this.shots.reduce((sum, s) => sum + s.duration, 0);
  }

  /** The shot playing at time t, and the time within it. */
  private at(t: number): [Shot, number] {
    let start = 0;
    for (const s of this.shots) {
      if (t < start + s.duration) return [s, t - start];
      start += s.duration;
    }
    const last = this.shots[this.shots.length - 1];
    return [last, last.duration - 1e-4];
  }

  /**
   * Draws the frame at time t. `samples` sub-frames are averaged across half
   * a frame of shutter time. Sub-frames never cross a cut.
   */
  frame(t: number, samples = 12) {
    const [shot, local] = this.at(t);
    const r = this.renderer;
    r.toneMapping = shot.toneMapping;
    r.toneMappingExposure = shot.exposure;
    this.renderPass.scene = shot.scene;
    this.renderPass.camera = shot.camera;
    const [strength, radius, threshold] = shot.bloom;
    this.bloom.enabled = strength > 0;
    this.bloom.strength = strength;
    this.bloom.radius = radius;
    this.bloom.threshold = threshold;

    const shutter = 0.5 / FPS;
    r.setRenderTarget(this.accum);
    r.setClearColor(0x000000, 0);
    r.clear();
    for (let i = 0; i < samples; i++) {
      const offset = samples > 1 ? (i / (samples - 1) - 0.5) * shutter : 0;
      const lt = Math.min(Math.max(local + offset, 0), shot.duration - 1e-4);
      shot.update(lt);
      if (samples > 1) {
        const jx = halton(i + 1, 2) - 0.5;
        const jy = halton(i + 1, 3) - 0.5;
        shot.camera.setViewOffset(this.width, this.height, jx, jy, this.width, this.height);
      }
      this.composer.render();
      this.blendMat.uniforms.tDiffuse.value = this.composer.readBuffer.texture;
      this.blendMat.uniforms.uWeight.value = 1 / samples;
      r.setRenderTarget(this.accum);
      r.autoClear = false;
      this.blend.render(r);
      r.autoClear = true;
    }
    shot.camera.clearViewOffset();
    this.output.render(r, null as unknown as THREE.WebGLRenderTarget, this.accum, 0, false);
  }

  dispose() {
    this.textures.forEach((t) => t.dispose());
    this.composer.dispose();
    this.accum.dispose();
    this.blend.dispose();
    this.renderer.dispose();
  }
}
