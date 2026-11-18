// Takes the screenshots of the site that appear on the screens in the
// showreel, and writes them to public/_reel with a manifest.
//
// Run against a production server so development notes do not appear:
//   npm run build && npm run start      (in one terminal)
//   npm run reel:screens                (in another)
//
// BASE=http://localhost:3000 by default.
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const base = process.env.BASE ?? "http://localhost:3000";
const out = path.resolve("public/_reel");
const pillar = "/services/ai-data";

// Desktop views for the wall of tiles: [page, how far down the page].
const tiles = [
  ["/", 0],
  ["/", 1500],
  ["/services", 0],
  ["/services", 1100],
  [pillar, 0],
  ["/services/product-engineering", 0],
  ["/services/cloud-security", 900],
  ["/work", 0],
  ["/contact", 0],
  ["/contact", 650],
  ["/about", 0],
  ["/about/how-we-work", 0],
  ["/careers", 0],
  ["/insights", 0],
  ["/industries", 0],
  ["/technologies", 0],
];

async function settle(page) {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const browser = await chromium.launch();

// Reduced motion shows every element at once, with still pictures instead of 3D.
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
const page = await desktop.newPage();

async function tall(url, file, height) {
  await page.goto(base + url);
  await settle(page);
  const full = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: path.join(out, file), fullPage: true, clip: { x: 0, y: 0, width: 1440, height: Math.min(height, full) } });
}

// The laptop and phone sit in a night scene, so they show pages with dark heroes.
await tall("/services", "laptop.png", 5200);
await tall("/", "monitor.png", 4200);

const tileFiles = [];
for (const [i, [url, y]] of tiles.entries()) {
  await page.goto(base + url);
  await settle(page);
  const full = await page.evaluate(() => document.documentElement.scrollHeight);
  const top = Math.max(0, Math.min(y, full - 900));
  const file = `tile-${String(i + 1).padStart(2, "0")}.png`;
  await page.screenshot({ path: path.join(out, file), fullPage: true, clip: { x: 0, y: top, width: 1440, height: 900 } });
  tileFiles.push(file);
}

const mobile = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  reducedMotion: "reduce",
});
const phone = await mobile.newPage();
await phone.goto(base + pillar);
await settle(phone);
await phone.screenshot({ path: path.join(out, "phone.png"), fullPage: true, clip: { x: 0, y: 0, width: 390, height: 2600 } });

await writeFile(
  path.join(out, "manifest.json"),
  JSON.stringify({ laptop: "laptop.png", phone: "phone.png", monitor: "monitor.png", tiles: tileFiles }, null, 2),
);
await browser.close();
console.log(`Saved ${tileFiles.length + 3} screenshots to public/_reel`);
