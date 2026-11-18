// Renders the showreel frame by frame from /studio/reel and encodes the video
// files the home page plays.
//
//   npm run dev              (in one terminal; needs public/_reel from reel:screens)
//   npm run reel:render      (in another)
//
// BASE=http://localhost:3000, SAMPLES=24 sub-frames per frame by default.
// Needs ffmpeg on the PATH.
import { execFileSync } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const base = process.env.BASE ?? "http://localhost:3000";
const samples = Number(process.env.SAMPLES ?? 24);
const frames = path.resolve(".reel/frames");
const out = path.resolve("public/showreel");

await rm(frames, { recursive: true, force: true });
await mkdir(frames, { recursive: true });
await mkdir(out, { recursive: true });

// Use the graphics card rather than software rendering.
const browser = await chromium.launch({
  channel: "chromium",
  args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-webgl"],
});
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on("console", (m) => m.type() === "error" && console.error(m.text()));
await page.goto(`${base}/studio/reel?capture`);
await page.waitForFunction(() => window.__reel, null, { timeout: 180_000 });
const gpu = await page.evaluate(() => {
  const gl = document.createElement("canvas").getContext("webgl2");
  const info = gl?.getExtension("WEBGL_debug_renderer_info");
  return info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : "unknown";
});
const { duration, fps } = await page.evaluate(() => ({ duration: window.__reel.duration, fps: window.__reel.fps }));
const count = Math.round(duration * fps);
console.log(`Rendering ${count} frames, ${samples} samples each, on ${gpu}`);

const started = Date.now();
for (let i = 0; i < count; i++) {
  const url = await page.evaluate(([t, s]) => window.__reel.frame(t, s), [i / fps, samples]);
  await writeFile(path.join(frames, `${String(i).padStart(4, "0")}.png`), Buffer.from(url.split(",")[1], "base64"));
  if (i % 30 === 0) console.log(`  frame ${i}/${count}  ${((Date.now() - started) / 1000).toFixed(0)}s`);
}
await browser.close();

const input = ["-y", "-v", "error", "-framerate", String(fps), "-i", path.join(frames, "%04d.png")];
const h264 = ["-c:v", "libx264", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an"];
execFileSync("ffmpeg", [...input, ...h264, "-crf", "21", path.join(out, "reel-1080.mp4")]);
execFileSync("ffmpeg", [...input, ...h264, "-crf", "24", "-vf", "scale=1280:-2", path.join(out, "reel-720.mp4")]);
// The poster is the moment the laptop screen is lit.
const poster = String(Math.round(2.5 * fps)).padStart(4, "0");
execFileSync("ffmpeg", ["-y", "-v", "error", "-i", path.join(frames, `${poster}.png`), "-q:v", "3", path.join(out, "poster.jpg")]);
console.log("Wrote public/showreel/reel-1080.mp4, reel-720.mp4 and poster.jpg");
