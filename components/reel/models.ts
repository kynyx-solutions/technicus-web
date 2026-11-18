// Devices for the showreel, modelled in code: a laptop, a phone and a monitor.
// Each one carries a screen that shows a page of the site.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { screenGeometry } from "./kit";

type Screen = { material: THREE.MeshBasicMaterial; setGlow: (k: number) => void };

function screen(tex: THREE.Texture, w: number, h: number, r: number): Screen & { mesh: THREE.Mesh } {
  const material = new THREE.MeshBasicMaterial({ map: tex });
  const mesh = new THREE.Mesh(screenGeometry(w, h, r), material);
  return { mesh, material, setGlow: (k) => material.color.setScalar(k) };
}

export function laptop(tex: THREE.Texture) {
  const W = 3.1;
  const D = 2.1;
  const T = 0.1;
  const body = new THREE.MeshPhysicalMaterial({
    color: 0x1e2029,
    metalness: 0.85,
    roughness: 0.34,
    clearcoat: 0.25,
    clearcoatRoughness: 0.5,
  });
  const dark = new THREE.MeshStandardMaterial({ color: 0x07080b, roughness: 0.75, metalness: 0.1 });
  const group = new THREE.Group();

  const base = new THREE.Mesh(new RoundedBoxGeometry(W, T, D, 5, 0.045), body);
  base.position.y = T / 2;
  group.add(base);

  // Keyboard: five rows of keys and a row with a space bar.
  const cols = 14;
  const pitch = (W * 0.84) / cols;
  const key = pitch * 0.82;
  const keys = new THREE.InstancedMesh(
    new RoundedBoxGeometry(key, 0.016, key, 2, 0.005),
    new THREE.MeshStandardMaterial({ color: 0x0b0c10, roughness: 0.5, metalness: 0.25 }),
    cols * 5 + 9,
  );
  const m = new THREE.Matrix4();
  const z0 = -D * 0.36;
  let n = 0;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < cols; col++) {
      m.makeTranslation((col - (cols - 1) / 2) * pitch, T + 0.006, z0 + row * pitch);
      keys.setMatrixAt(n++, m);
    }
  }
  const last = [0, 1, 2, 3, -1, 10, 11, 12, 13];
  for (const col of last) {
    if (col === -1) {
      const s = new THREE.Matrix4().makeScale((pitch * 6 - (pitch - key)) / key, 1, 1);
      m.makeTranslation(0, T + 0.006, z0 + 5 * pitch).multiply(s);
    } else {
      m.makeTranslation((col - (cols - 1) / 2) * pitch, T + 0.006, z0 + 5 * pitch);
    }
    keys.setMatrixAt(n++, m);
  }
  group.add(keys);

  const pad = new THREE.Mesh(
    new RoundedBoxGeometry(W * 0.36, 0.006, D * 0.25, 2, 0.02),
    new THREE.MeshPhysicalMaterial({ color: 0x25272f, metalness: 0.6, roughness: 0.42 }),
  );
  pad.position.set(0, T, D * 0.33);
  group.add(pad);

  // The lid turns on a hinge at the back of the base.
  const hinge = new THREE.Group();
  hinge.position.set(0, T, -D / 2 + 0.03);
  group.add(hinge);
  const LT = 0.06;
  const lid = new THREE.Mesh(new RoundedBoxGeometry(W, LT, D, 5, 0.028), body);
  lid.position.set(0, LT / 2, D / 2 - 0.03);
  hinge.add(lid);

  const bezel = new THREE.Mesh(screenGeometry(W - 0.05, D - 0.05, 0.06), dark);
  bezel.rotation.x = Math.PI / 2;
  bezel.position.set(0, -0.001, D / 2 - 0.03);
  hinge.add(bezel);

  const sw = W - 0.2;
  const sh = sw / 1.6;
  const display = screen(tex, sw, sh, 0.025);
  display.mesh.rotation.x = Math.PI / 2;
  display.mesh.position.set(0, -0.003, D / 2 - 0.03 + 0.04);
  hinge.add(display.mesh);

  return {
    group,
    /** Lid angle in radians: 0 is closed. */
    setOpen: (angle: number) => {
      hinge.rotation.x = -angle;
    },
    setGlow: display.setGlow,
    screenAspect: sh / sw,
  };
}

export function phone(tex: THREE.Texture) {
  const W = 0.74;
  const H = 1.56;
  const T = 0.085;
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new RoundedBoxGeometry(W, H, T, 6, 0.04),
    new THREE.MeshPhysicalMaterial({ color: 0x23252d, metalness: 0.9, roughness: 0.28, clearcoat: 0.6 }),
  );
  group.add(body);

  const glass = new THREE.Mesh(
    screenGeometry(W - 0.02, H - 0.02, 0.1),
    new THREE.MeshPhysicalMaterial({ color: 0x050507, roughness: 0.08, metalness: 0, clearcoat: 1 }),
  );
  glass.position.z = T / 2 + 0.001;
  group.add(glass);

  const sw = W - 0.07;
  const sh = H - 0.07;
  const display = screen(tex, sw, sh, 0.085);
  display.mesh.position.z = T / 2 + 0.003;
  group.add(display.mesh);

  const camera = new THREE.Mesh(
    new RoundedBoxGeometry(0.28, 0.28, 0.03, 3, 0.06),
    new THREE.MeshPhysicalMaterial({ color: 0x1a1b21, metalness: 0.7, roughness: 0.3 }),
  );
  camera.position.set(-W / 2 + 0.2, H / 2 - 0.2, -T / 2 - 0.012);
  group.add(camera);

  return { group, setGlow: display.setGlow, screenAspect: sh / sw };
}

export function monitor(tex: THREE.Texture) {
  const W = 3.4;
  const H = 2.05;
  const T = 0.08;
  const group = new THREE.Group();
  const plastic = new THREE.MeshPhysicalMaterial({
    color: 0xe4edf9,
    roughness: 0.32,
    metalness: 0,
    clearcoat: 0.7,
    clearcoatRoughness: 0.3,
  });
  const cast = (o: THREE.Mesh) => {
    o.castShadow = true;
    o.receiveShadow = true;
    return o;
  };

  const foot = cast(new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.05, 1.0, 3, 0.02), plastic));
  foot.position.y = 0.025;
  group.add(foot);

  const neck = cast(new THREE.Mesh(new RoundedBoxGeometry(0.55, 1.5, 0.06, 3, 0.025), plastic));
  neck.position.set(0, 0.8, -0.25);
  neck.rotation.x = -0.12;
  group.add(neck);

  const panel = cast(new THREE.Mesh(new RoundedBoxGeometry(W, H, T, 5, 0.035), plastic));
  panel.position.set(0, 1.72, 0);
  group.add(panel);

  const back = cast(new THREE.Mesh(new RoundedBoxGeometry(1.8, 1.1, 0.1, 4, 0.04), plastic));
  back.position.set(0, 1.62, -0.07);
  group.add(back);

  const sw = W - 0.08;
  const sh = H - 0.08;
  const display = screen(tex, sw, sh, 0.02);
  display.mesh.position.set(0, 1.72, T / 2 + 0.002);
  group.add(display.mesh);

  return { group, setGlow: display.setGlow, screenAspect: sh / sw, screenCenter: new THREE.Vector3(0, 1.72, 0) };
}
