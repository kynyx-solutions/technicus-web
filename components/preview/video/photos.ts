// Stock photography for the video-led preview, hotlinked from Unsplash.
//
// PLACEHOLDERS: every photo here is illustrative. None of them shows a client,
// a client's product or a Technicus office. Replace them with real brand film
// and real project imagery when it arrives.

export function unsplash(id: string, w = 2000, q = 80) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`;
}

/** Responsive srcset for a hotlinked Unsplash photo. */
export function unsplashSet(id: string, widths = [640, 1024, 1600, 2200]) {
  return widths.map((w) => `${unsplash(id, w, w > 1600 ? 75 : 80)} ${w}w`).join(", ");
}

export type HeroFrame = { id: string; label: string; alt: string };

/** The hero "film": stills that cross-fade until real footage exists. */
export const heroFrames: HeroFrame[] = [
  { id: "1573164713988-8665fc963095", label: "Infrastructure", alt: "An engineer with a laptop walking through a server room" },
  { id: "1531482615713-2afd69097998", label: "Engineering", alt: "Two engineers reviewing code together on a laptop" },
  { id: "1504384308090-c894fdcc538d", label: "Delivery", alt: "A large open-plan office with teams at work" },
  { id: "1451187580459-43490279c0fa", label: "Worldwide", alt: "The Earth at night seen from orbit, cities lit up" },
];

/** One photo per practice, keyed by pillar slug. */
export const practicePhotos: Record<string, string> = {
  "strategy-consulting": "1552664730-d307ca884978",
  "experience-design": "1581092160562-40aa08e78837",
  "product-engineering": "1555066931-4365d14bab8c",
  "ai-data": "1518770660439-4636190af475",
  "cloud-security": "1558494949-ef010cbdcc31",
  "growth-marketing": "1460925895917-afdab827c52f",
  "managed-services": "1551434678-e076c223a692",
};
export const practiceFallback = "1522071820081-009f0129c71c";

/** Case study photos by project slug, with an industry fallback. Illustrative only. */
const projectPhotos: Record<string, string> = {
  sabstore: "1441986300917-64674bd600d8",
  dabbasabba: "1546833999-b9f581a1996d",
  carbyke: "1449965408869-eaa3f722e40d",
  paygini: "1556742049-0cfed4f6a45d",
  "goal-360-degree": "1427504494785-3a9ca7044f45",
  "hotel-indraprastha": "1566073771259-6a8506099945",
};
const industryPhotos: Record<string, string> = {
  "retail-ecommerce": "1441986300917-64674bd600d8",
  "hospitality-travel": "1542314831-068cd1dbfeeb",
  automotive: "1503376780353-7e6692767b70",
  "financial-services": "1556740758-90de374c12ad",
  education: "1427504494785-3a9ca7044f45",
  healthcare: "1576091160550-2173dba999ef",
  "real-estate": "1560518883-ce09059eeffa",
  manufacturing: "1504328345606-18bbc8c9d7d1",
  "logistics-transport": "1586528116311-ad8dd3c8310d",
  agriculture: "1500382017468-9049fed747ef",
};
export function projectPhoto(slug: string, industrySlug?: string) {
  return projectPhotos[slug] ?? (industrySlug && industryPhotos[industrySlug]) ?? "1519389950473-47ba0277781c";
}

export const bandPhotos = {
  team: "1522071820081-009f0129c71c",
  workshop: "1542744173-8e7e53415bb0",
  city: "1486406146926-c627a92ad1ab",
};
