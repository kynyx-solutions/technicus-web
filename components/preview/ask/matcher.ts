// Deterministic, client-side brief matcher for the AI-first homepage preview.
// No network calls and no keys: keyword and synonym lists per capability and
// industry are scored against the visitor's words, and the answer is composed
// from templates. Everything it links to comes from the real content files.

export type AskCapability = { slug: string; name: string; services: string[] };
export type AskPillar = { slug: string; name: string; summary: string; capabilities: AskCapability[] };
export type AskProject = {
  slug: string;
  client: string;
  sector: string;
  industry: string;
  industrySlug: string;
  pillars: string[];
  services: string[];
  summary: string;
  country: string;
};
export type AskIndustry = { slug: string; name: string };
export type AskData = { pillars: AskPillar[]; projects: AskProject[]; industries: AskIndustry[] };

export type MatchedPractice = {
  slug: string;
  name: string;
  summary: string;
  role: "lead" | "support";
  /** Capabilities inside the practice that the brief touched. */
  capabilities: { slug: string; name: string }[];
  reason: string;
};

export type AskAnswer = {
  query: string;
  understood: boolean;
  text: string;
  practices: MatchedPractice[];
  projects: AskProject[];
  industry?: AskIndustry;
};

/* ------------------------------------------------------------------ */
/* Vocabulary                                                          */
/* ------------------------------------------------------------------ */

type Lexicon = Record<string, [string, number][]>;

// Weighted keywords per capability slug. Multi-word phrases score higher than
// loose single words. Plurals are handled by the matcher.
const CAPABILITY_WORDS: Lexicon = {
  // Strategy and Consulting
  "digital-transformation": [["digital transformation", 5], ["digitise", 4], ["digitize", 4], ["go digital", 4], ["paperwork", 3], ["paper based", 4], ["excel sheet", 3], ["spreadsheet", 2], ["modernise our business", 4], ["traditional business", 4], ["transform", 2]],
  "product-strategy": [["mvp", 5], ["minimum viable", 5], ["product idea", 5], ["startup idea", 5], ["an idea", 3], ["validate", 3], ["product discovery", 5], ["roadmap", 3], ["prototype", 3], ["launch a product", 4], ["new product", 3], ["what to build", 4], ["technology partner", 4], ["cto", 3], ["founder", 3]],
  "technology-advisory": [["audit", 2], ["technology audit", 5], ["tech audit", 5], ["architecture", 4], ["review our", 2], ["second opinion", 5], ["choose a platform", 4], ["which technology", 4], ["tech stack", 4], ["advice", 3], ["advise", 3], ["consult", 3], ["strategy", 3]],
  // Experience Design
  "ui-ux-design": [["ui", 4], ["ux", 4], ["user experience", 5], ["user interface", 5], ["redesign", 3], ["design", 2], ["hard to use", 5], ["confusing", 4], ["usability", 5], ["wireframe", 4], ["figma", 4], ["look better", 4], ["looks outdated", 5], ["outdated", 3]],
  "brand-identity": [["brand", 3], ["branding", 5], ["logo", 5], ["identity", 3], ["rebrand", 5], ["packaging", 5], ["brochure", 4], ["print", 3], ["visual identity", 5], ["name and logo", 5]],
  "motion-and-3d": [["animation", 4], ["animated", 4], ["3d", 5], ["motion", 4], ["explainer video", 5], ["illustration", 4], ["video", 2]],
  "design-systems": [["design system", 6], ["component library", 5], ["consistent design", 4], ["style guide", 4]],
  // Product Engineering
  "web-development": [["website", 4], ["web site", 4], ["landing page", 5], ["wordpress", 5], ["headless", 4], ["cms", 3], ["corporate site", 5], ["company site", 5], ["booking site", 5], ["booking", 3], ["appointment", 4], ["multilingual", 5], ["pwa", 5], ["progressive web app", 5], ["webpage", 4], ["site", 2], ["portfolio site", 4]],
  ecommerce: [["online store", 6], ["online shop", 6], ["ecommerce", 6], ["e commerce", 6], ["shopify", 6], ["woocommerce", 6], ["store", 3], ["shop", 3], ["sell online", 6], ["selling online", 6], ["sell", 2], ["marketplace", 5], ["multi vendor", 6], ["checkout", 5], ["cart", 4], ["catalogue", 4], ["catalog", 4], ["products online", 4], ["d2c", 5], ["dtc", 5]],
  "web-apps-and-saas": [["web app", 5], ["web application", 5], ["saas", 6], ["platform", 3], ["portal", 5], ["dashboard", 3], ["admin panel", 5], ["api", 4], ["integration", 3], ["integrate", 3], ["legacy", 4], ["old software", 5], ["subscription software", 5], ["customer portal", 6], ["dealer portal", 6], ["software", 2], ["tool", 1], ["internal tool", 5]],
  "mobile-apps": [["mobile app", 6], ["app", 2], ["android", 6], ["ios", 6], ["iphone", 5], ["play store", 5], ["app store", 5], ["flutter", 5], ["react native", 5], ["cross platform", 5], ["wearable", 5], ["smartwatch", 5], ["tv app", 5], ["phone", 2], ["mobile", 3]],
  "enterprise-software": [["erp", 6], ["crm", 6], ["hrms", 6], ["payroll", 6], ["inventory", 5], ["billing", 5], ["point of sale", 6], ["pos", 4], ["school management", 6], ["hospital management", 6], ["clinic management", 6], ["hotel management", 6], ["lms", 6], ["learning management", 6], ["online exam", 6], ["fleet", 5], ["delivery tracking", 6], ["property management", 6], ["attendance", 4], ["internal system", 4], ["management system", 5]],
  "fintech-and-payments": [["payment", 4], ["payment gateway", 6], ["upi", 5], ["wallet", 5], ["fintech", 6], ["lending", 6], ["loan", 5], ["invoicing", 5], ["invoice", 4], ["subscription", 3], ["bill payment", 6], ["collections", 4], ["recurring billing", 6]],
  "emerging-technology": [["iot", 6], ["internet of things", 6], ["sensor", 5], ["device", 2], ["ar", 3], ["vr", 5], ["augmented reality", 6], ["virtual reality", 6], ["metaverse", 4], ["blockchain", 6], ["smart contract", 6], ["web3", 6], ["nft", 5], ["game", 5], ["gaming", 5]],
  "quality-engineering": [["testing", 5], ["qa", 5], ["quality assurance", 6], ["test automation", 6], ["automated test", 6], ["load test", 6], ["bugs", 4], ["buggy", 5], ["crashes", 4], ["crashing", 4], ["accessibility", 5], ["wcag", 6]],
  // AI and Data
  "generative-ai-and-agents": [["ai", 4], ["artificial intelligence", 5], ["chatbot", 6], ["chat bot", 6], ["bot", 3], ["assistant", 4], ["ai assistant", 6], ["agent", 4], ["ai agent", 6], ["llm", 6], ["gpt", 5], ["chatgpt", 5], ["claude", 5], ["genai", 6], ["generative", 5], ["voice agent", 6], ["voice bot", 6], ["whatsapp bot", 6], ["answer questions", 4], ["customer support", 3], ["support tickets", 3], ["knowledge base", 4], ["copilot", 5], ["rag", 4]],
  automation: [["automate", 6], ["automation", 5], ["automating", 6], ["manual work", 5], ["manual process", 5], ["repetitive", 5], ["data entry", 6], ["ocr", 6], ["read documents", 5], ["invoices automatically", 6], ["workflow", 4], ["save time", 3], ["zapier", 4], ["rpa", 6]],
  "machine-learning": [["machine learning", 6], ["ml", 4], ["model", 3], ["predict", 5], ["prediction", 5], ["forecast", 5], ["computer vision", 6], ["image recognition", 6], ["detect", 3], ["recommendation", 5], ["recommend", 3], ["personalisation", 5], ["personalization", 5], ["search", 1], ["fraud detection", 6]],
  "data-and-analytics": [["data", 3], ["analytics", 5], ["dashboard", 4], ["see sales", 5], ["sales report", 6], ["across stores", 4], ["across branches", 4], ["report", 3], ["reporting", 5], ["kpi", 5], ["metrics", 4], ["business intelligence", 6], ["bi", 4], ["power bi", 6], ["tableau", 6], ["data warehouse", 6], ["pipeline", 3], ["google analytics", 5], ["ga4", 6], ["tracking", 3], ["data migration", 6], ["clean up data", 5], ["insight", 3]],
  // Cloud and Security
  cloud: [["cloud", 6], ["aws", 6], ["azure", 6], ["gcp", 6], ["google cloud", 6], ["server", 5], ["servers", 5], ["hosting", 5], ["migrate", 3], ["migration", 3], ["data centre", 5], ["data center", 5], ["on premise", 5], ["backup", 5], ["disaster recovery", 6], ["downtime", 5], ["slow", 5], ["speed", 5], ["faster", 4], ["performance", 3], ["load time", 6], ["scale", 3], ["scaling", 4], ["traffic", 2], ["uptime", 5]],
  devops: [["devops", 6], ["ci cd", 6], ["cicd", 6], ["pipeline", 2], ["deployment", 5], ["deploy", 4], ["releases", 4], ["release", 3], ["kubernetes", 6], ["docker", 6], ["infrastructure", 4], ["terraform", 6], ["monitoring", 4]],
  cybersecurity: [["security", 5], ["secure", 4], ["cybersecurity", 6], ["cyber security", 6], ["hacked", 6], ["hack", 4], ["malware", 6], ["breach", 6], ["penetration", 6], ["pen test", 6], ["vapt", 6], ["vulnerability", 6], ["gdpr", 6], ["dpdp", 6], ["compliance", 5], ["iso 27001", 6], ["soc 2", 6], ["phishing", 6], ["protect", 3]],
  // Growth and Marketing
  seo: [["seo", 6], ["search engine", 5], ["google ranking", 6], ["rank", 4], ["ranking", 4], ["organic", 5], ["search", 2], ["found on google", 6], ["google", 2], ["local seo", 6], ["conversion", 4], ["conversion rate", 6], ["visibility", 3]],
  "performance-marketing": [["leads", 5], ["lead generation", 6], ["more customers", 5], ["ads", 5], ["advertising", 5], ["google ads", 6], ["meta ads", 6], ["facebook ads", 6], ["ppc", 6], ["campaign", 3], ["influencer", 6], ["paid", 3], ["sales", 2], ["grow", 2], ["growth", 2], ["enquiries", 3]],
  "social-and-content": [["social media", 6], ["instagram", 5], ["linkedin", 4], ["content", 3], ["blog", 4], ["copywriting", 5], ["content writing", 6], ["photoshoot", 5], ["photography", 5], ["video production", 5], ["reviews", 4], ["reputation", 5]],
  "marketing-automation": [["email marketing", 6], ["newsletter", 5], ["email campaign", 6], ["whatsapp marketing", 6], ["drip", 5], ["nurture", 5], ["hubspot", 5], ["mailchimp", 5], ["marketing automation", 6], ["follow up", 3], ["sms", 4]],
  // Managed Services and Teams
  "maintenance-and-support": [["maintenance", 6], ["maintain", 5], ["support", 2], ["24 7", 5], ["round the clock", 5], ["keep it running", 6], ["updates", 3], ["broken", 4], ["fix", 3], ["fix my", 4], ["take over", 5], ["takeover", 5], ["unfinished", 6], ["previous developer", 6], ["agency left", 6], ["rescue", 6], ["stuck project", 6]],
  "dedicated-teams": [["dedicated team", 6], ["dedicated developer", 6], ["hire developer", 6], ["hire a developer", 6], ["hire", 4], ["developers", 4], ["team extension", 6], ["extend our team", 6], ["staff augmentation", 6], ["offshore", 6], ["outsource", 5], ["outsourcing", 5], ["white label", 6], ["agency partner", 5], ["more engineers", 5], ["engineers", 3]],
};

// Practices that usually belong alongside a lead capability, with the reason
// shown on the card. Only added when the brief did not already bring them in.
const COMPANIONS: Record<string, { pillar: string; capability: string; reason: string }[]> = {
  ecommerce: [
    { pillar: "growth-marketing", capability: "seo", reason: "So the store is found and visits turn into orders." },
    { pillar: "experience-design", capability: "ui-ux-design", reason: "A storefront and checkout that feel effortless on a phone." },
  ],
  "web-development": [{ pillar: "experience-design", capability: "ui-ux-design", reason: "Clear structure and design before a line of code." }],
  "mobile-apps": [{ pillar: "experience-design", capability: "ui-ux-design", reason: "Screens and flows tested with real users early." }],
  "web-apps-and-saas": [{ pillar: "experience-design", capability: "ui-ux-design", reason: "Interfaces your users can learn without a manual." }],
  "generative-ai-and-agents": [{ pillar: "product-engineering", capability: "web-apps-and-saas", reason: "Connecting the assistant to your existing systems and data." }],
  automation: [{ pillar: "product-engineering", capability: "web-apps-and-saas", reason: "Integrations with the tools your team already uses." }],
  cloud: [{ pillar: "managed-services", capability: "maintenance-and-support", reason: "Monitoring and support once everything is live." }],
  cybersecurity: [{ pillar: "managed-services", capability: "maintenance-and-support", reason: "Ongoing checks so fixes stay fixed." }],
  seo: [{ pillar: "growth-marketing", capability: "performance-marketing", reason: "Paid search alongside organic while rankings build." }],
  "performance-marketing": [{ pillar: "ai-data", capability: "data-and-analytics", reason: "Tracking set up properly, so you know what each lead costs." }],
  "product-strategy": [{ pillar: "experience-design", capability: "ui-ux-design", reason: "A clickable prototype to test the idea with users." }],
  "brand-identity": [{ pillar: "product-engineering", capability: "web-development", reason: "A website that carries the new identity." }],
};

// The opening of the answer, written per capability. Plain English, no prices,
// no durations.
const OPENERS: Record<string, string> = {
  "digital-transformation": "We would start by mapping how work actually moves through your business today, then replace the slowest manual steps with simple software your team will use.",
  "product-strategy": "We would begin with a short discovery: who it is for, the one problem it must solve, and the smallest version worth putting in front of real users.",
  "technology-advisory": "We would review your current systems and decisions with fresh eyes, then give you a clear, written view of what to keep, what to change and in what order.",
  "ui-ux-design": "We would start with your users: how they find things, where they get stuck, and what they need to do in the fewest steps, then design the screens around that.",
  "brand-identity": "We would define what the brand needs to say and to whom, then build an identity, from logo to colour and type, that holds up everywhere it appears.",
  "motion-and-3d": "We would use motion and 3D where it explains something or earns attention, and keep it fast enough that it never gets in the way.",
  "design-systems": "We would audit what you have, then build a shared library of components and rules so every new screen is quicker to make and consistent by default.",
  "web-development": "We would plan the structure and content first, then build a fast, accessible site your team can update without calling a developer.",
  ecommerce: "We would plan the catalogue, checkout, payments and shipping first, then build a store that loads quickly on mobile and is simple for your team to run day to day.",
  "web-apps-and-saas": "We would agree the core workflows and data model first, then build the product in small, working releases so you see progress and can steer it.",
  "mobile-apps": "We would decide early whether native or cross-platform suits you, design the key journeys, then build, test on real devices and handle the store submission.",
  "enterprise-software": "We would map the processes the system has to run, from approvals to reports, then build or configure it around how your teams actually work.",
  "fintech-and-payments": "We would treat money movement with the care it needs: reliable payment flows, clear reconciliation and security designed in from the start.",
  "emerging-technology": "We would start with a focused pilot that proves the idea works in the real world before committing to a wider rollout.",
  "quality-engineering": "We would find where things break today, then put the right mix of manual and automated testing in place so releases stop being a gamble.",
  "generative-ai-and-agents": "We would start with the questions or tasks the assistant should handle, ground it in your own documents and data, and set clear rules for when it hands over to a person.",
  automation: "We would find the repetitive steps that eat your team's time, automate the ones that are safe to automate, and keep a person in the loop where judgement matters.",
  "machine-learning": "We would first check that your data can support the model, then build and measure it against a simple baseline before it goes anywhere near production.",
  "data-and-analytics": "We would bring your data into one reliable place, agree the handful of numbers that matter, and build reports people trust and actually open.",
  cloud: "We would assess what you run today, plan the move or the fix with no surprises, and set up monitoring and backups so it stays fast and available.",
  devops: "We would automate how code gets tested and released, so shipping becomes routine, reversible and far less stressful.",
  cybersecurity: "We would test where you are exposed, fix the most serious issues first, and leave you with practical habits and checks that keep you protected.",
  seo: "We would fix the technical basics first, then build pages around what your customers actually search for, and measure the leads they bring in.",
  "performance-marketing": "We would set up proper tracking first, then run focused campaigns on the channels where your buyers already are, and cut spend on whatever does not convert.",
  "social-and-content": "We would agree a clear voice and a realistic rhythm, then produce content that is useful to your audience rather than noise.",
  "marketing-automation": "We would map the moments that matter in a customer's journey and set up timely, personal follow-ups so fewer leads go cold.",
  "maintenance-and-support": "We would review the current state of the product, stabilise anything urgent, then look after updates, security and fixes on an ongoing basis.",
  "dedicated-teams": "We would match you with engineers who fit your stack and ways of working, and they would join your rituals and tools as part of your team.",
};

const INDUSTRY_WORDS: Record<string, string[]> = {
  education: ["school", "college", "university", "student", "teacher", "education", "coaching", "institute", "edtech", "course", "exam", "tuition", "learning"],
  healthcare: ["hospital", "clinic", "doctor", "patient", "health", "healthcare", "medical", "pharmacy", "diagnostic", "dental", "wellness", "telemedicine"],
  "retail-ecommerce": ["clothing", "fashion", "apparel", "boutique", "retail", "retailer", "jewellery", "jewelry", "cosmetics", "beauty", "grocery", "furniture", "shoes", "online store", "ecommerce", "e commerce", "d2c", "brand store"],
  "hospitality-travel": ["hotel", "resort", "restaurant", "cafe", "food", "meal", "tiffin", "travel", "tour", "tourism", "homestay", "catering", "hospitality"],
  automotive: ["car", "bike", "vehicle", "automotive", "dealership", "garage", "rental car", "scooter", "ev"],
  "real-estate": ["real estate", "property", "properties", "builder", "developer project", "apartment", "rental", "broker", "realty"],
  "financial-services": ["bank", "banking", "finance", "fintech", "loan", "lending", "insurance", "payment", "payments", "wallet", "nbfc", "investment", "accounting"],
  manufacturing: ["factory", "manufacturing", "manufacturer", "plant", "production line", "industrial", "machinery"],
  "logistics-transport": ["logistics", "delivery", "courier", "fleet", "transport", "shipping company", "warehouse", "trucking", "supply chain"],
  agriculture: ["farm", "farmer", "agriculture", "agri", "crop", "dairy"],
  "public-sector": ["government", "ngo", "non profit", "nonprofit", "charity", "public sector", "municipal", "foundation"],
  startups: ["startup", "start up", "founder", "mvp", "seed", "pre seed", "bootstrapped"],
};

const STOP = new Set(["and", "the", "for", "with", "our", "your", "a", "an", "of", "to", "in", "on", "we", "my", "i", "is", "it", "be", "app", "apps", "site", "sites", "and", "or", "development", "design", "management", "services"]);

/* ------------------------------------------------------------------ */
/* Matching                                                            */
/* ------------------------------------------------------------------ */

function normalise(s: string) {
  return ` ${s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;
}

function escape(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const patternCache = new Map<string, RegExp>();
/** Whole-word match that tolerates simple plurals ("stores", "businesses"). */
function has(text: string, phrase: string) {
  let re = patternCache.get(phrase);
  if (!re) {
    const p = normalise(phrase).trim();
    re = new RegExp(` ${escape(p)}(s|es)? `);
    patternCache.set(phrase, re);
  }
  return re.test(text);
}

type CapScore = { pillar: AskPillar; cap: AskCapability; score: number };

function scoreCapabilities(text: string, pillars: AskPillar[]): CapScore[] {
  const out: CapScore[] = [];
  for (const pillar of pillars) {
    for (const cap of pillar.capabilities) {
      let score = 0;
      for (const [word, weight] of CAPABILITY_WORDS[cap.slug] ?? []) if (has(text, word)) score += weight;
      // Words from the real service names add a small signal, so new services
      // added to content/services.ts are picked up without touching this file.
      const words = new Set(
        [cap.name, ...cap.services]
          .join(" ")
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter((w) => w.length > 3 && !STOP.has(w)),
      );
      for (const w of words) if (has(text, w)) score += 1;
      if (score > 0) out.push({ pillar, cap, score });
    }
  }
  return out.sort((a, b) => b.score - a.score);
}

function detectIndustry(text: string, industries: AskIndustry[]) {
  let best: { ind: AskIndustry; score: number } | undefined;
  for (const ind of industries) {
    const score = (INDUSTRY_WORDS[ind.slug] ?? []).reduce((n, w) => n + (has(text, w) ? (w.includes(" ") ? 2 : 1) : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { ind, score };
  }
  return best?.ind;
}

/**
 * Builds an answer for a brief.
 *
 * CLAUDE ENDPOINT: this is the single place to swap in a real model later.
 * Replace the body with a call to a server route (for example
 * `POST /api/ask` using the Anthropic SDK with streaming), keep the same
 * `AskAnswer` shape, and pass the practice and project lists as context so the
 * model can only recommend real pages. The UI already streams `text`
 * character by character and renders practices and projects from this object.
 */
export function respond(query: string, data: AskData): AskAnswer {
  const text = normalise(query);
  const caps = scoreCapabilities(text, data.pillars);
  const industry = detectIndustry(text, data.industries);

  if (!caps.length || caps[0].score < 2) {
    return {
      query,
      understood: false,
      text: industry
        ? `We work with ${industry.name.toLowerCase()} organisations, but I need a little more to point you to the right team. Try describing the outcome you want, such as more bookings, a new app or less manual work, or pick one of the suggestions below.`
        : "I could not place that one yet. Try describing the outcome you want, such as an online store, an AI assistant or a faster website, or pick one of the suggestions below. A specialist is also happy to talk it through.",
      practices: [],
      projects: [],
      industry,
    };
  }

  // Pillar score: strongest capability plus half of the rest.
  const byPillar = new Map<string, { pillar: AskPillar; caps: CapScore[]; score: number }>();
  for (const c of caps) {
    const entry = byPillar.get(c.pillar.slug) ?? { pillar: c.pillar, caps: [], score: 0 };
    entry.score += entry.caps.length ? c.score * 0.5 : c.score;
    entry.caps.push(c);
    byPillar.set(c.pillar.slug, entry);
  }
  const ranked = [...byPillar.values()].sort((a, b) => b.score - a.score);
  const top = ranked[0];
  const chosen = ranked.filter((p, i) => i === 0 || p.score >= top.score * 0.45).slice(0, 3);
  const lead = top.caps[0].cap;

  const practices: MatchedPractice[] = chosen.map((p, i) => ({
    slug: p.pillar.slug,
    name: p.pillar.name,
    summary: p.pillar.summary,
    role: i === 0 ? "lead" : "support",
    capabilities: p.caps
      .filter((c, j) => j === 0 || c.score >= Math.max(3, p.caps[0].score * 0.5))
      .slice(0, 3)
      .map((c) => ({ slug: c.cap.slug, name: c.cap.name })),
    reason: p.pillar.summary,
  }));

  // Fill up to three with companions that usually belong with the lead work.
  for (const comp of COMPANIONS[lead.slug] ?? []) {
    if (practices.length >= 3) break;
    if (practices.some((p) => p.slug === comp.pillar)) continue;
    const pillar = data.pillars.find((p) => p.slug === comp.pillar);
    const cap = pillar?.capabilities.find((c) => c.slug === comp.capability);
    if (!pillar || !cap) continue;
    practices.push({ slug: pillar.slug, name: pillar.name, summary: pillar.summary, role: "support", capabilities: [{ slug: cap.slug, name: cap.name }], reason: comp.reason });
  }

  // Case studies: same industry counts most, then a shared lead capability.
  const capNames = new Set(practices[0].capabilities.map((c) => c.name.toLowerCase()));
  const practiceSlugs = new Set(practices.map((p) => p.slug));
  const projects = data.projects
    .map((p) => {
      let s = 0;
      if (industry && p.industrySlug === industry.slug) s += 4;
      if (p.services.some((x) => capNames.has(x.toLowerCase()))) s += 3;
      if (p.pillars.some((x) => practiceSlugs.has(x))) s += 1;
      if (has(text, p.sector) || has(text, p.client)) s += 3;
      return { p, s };
    })
    .filter((x) => x.s >= 3)
    .sort((a, b) => b.s - a.s)
    .slice(0, 2)
    .map((x) => x.p);

  const sentences = [OPENERS[lead.slug] ?? `${top.pillar.name} would lead this: ${top.pillar.summary.toLowerCase()}`];
  const supports = practices.slice(1).map((p) => p.name);
  if (supports.length === 1) sentences.push(`Our ${top.pillar.name} team would lead, joined by ${supports[0]}, working as one team.`);
  if (supports.length === 2) sentences.push(`Our ${top.pillar.name} team would lead, joined by ${supports[0]}, plus ${supports[1]}, working as one team.`);
  if (industry && projects.some((p) => p.industrySlug === industry.slug)) {
    sentences.push(`We have built for ${industry.name.toLowerCase()} before, and you can see that work below.`);
  } else if (industry) {
    sentences.push(`A specialist can talk through what tends to matter most in ${industry.name.toLowerCase()}.`);
  }

  return { query, understood: true, text: sentences.join(" "), practices, projects, industry };
}
