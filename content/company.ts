// Company facts and shared copy.
//
// CONFIRM: every value marked "from the old site" was copied from the 2016
// website and must be checked by the owner before launch. Anything not known is
// left empty, and the page hides that part. See docs/CONTENT_TODO.md.

export const contact = {
  email: "info@technicus.in", // from the old site
  phone: "+91 85560 93704", // from the old site
  phoneHref: "tel:+918556093704",
  whatsappHref: "https://wa.me/918556093704", // assumes the same number is on WhatsApp
  linkedin: "", // not known
  x: "https://twitter.com/technicusinfo", // from the old site
  facebook: "https://www.facebook.com/technicusinfotech", // from the old site
};

export type Office = {
  city: string;
  country: string;
  lines: string[];
  timeZone: string;
  lat: number;
  lon: number;
  hq?: boolean;
};

// Only offices that exist. The old site also listed a branch at a university
// campus in Phagwara, Punjab; it is left out until the owner confirms it.
export const offices: Office[] = [
  {
    city: "Madhubani",
    country: "India",
    lines: ["Jai Maa Bhagwati Kutir, 8/128", "Janta Press Lane, Ganga Sagar Chowk", "Madhubani, Bihar 847211"], // from the old site
    timeZone: "Asia/Kolkata",
    lat: 26.35,
    lon: 86.07,
    hq: true,
  },
];

/** Real numbers only. Empty until the owner supplies them; the sections hide. */
export const stats: { value: number; suffix?: string; label: string }[] = [];

/** Client names approved for the logo band. Empty until permission is given. */
export const clientNames: string[] = [];

/** Client quotes with name, role and company. Empty until supplied. */
export const quotes: { text: string; name: string; role: string; company: string }[] = [];

export const positioning = {
  statement: "Technology consultancy for organisations that build on software",
  lead: "We help companies decide what to build, design it well, engineer it properly and keep it running. Strategy, design, engineering, AI, cloud and growth, from one team.",
};

export const method = [
  {
    title: "Understand",
    text: "We start with your business, your users and your constraints. You get a clear statement of the problem and what a good outcome looks like.",
  },
  {
    title: "Plan",
    text: "We set scope, architecture, team and milestones, and agree how progress and quality will be measured.",
  },
  {
    title: "Build",
    text: "Design and engineering work in short cycles. You see working software regularly and can change direction early.",
  },
  {
    title: "Run",
    text: "We launch, monitor and improve. Support, maintenance and further development continue for as long as you need them.",
  },
];

export const engagementModels = [
  {
    title: "Fixed scope",
    text: "A defined result for an agreed price. Fits work where the requirements are clear and unlikely to change.",
  },
  {
    title: "Time and materials",
    text: "You pay for the time spent, with regular reviews. Fits products that are still taking shape.",
  },
  {
    title: "Dedicated team",
    text: "A team that works only on your product and follows your process. Fits long-running development.",
  },
  {
    title: "Retainer",
    text: "A set amount of capacity each month for support, improvements and advice.",
  },
];

// DRAFT: values are the owner's to set. These are a starting point.
export const values = [
  { title: "Say what is true", text: "We tell clients what we know, what we do not know and what we would do in their place." },
  { title: "Solve the real problem", text: "We ask why before we ask what. The right answer is sometimes a smaller project." },
  { title: "Build to last", text: "We write software that the next team can read, test and change." },
  { title: "Stay responsible", text: "We stay with what we ship. Launch is the middle of the work, not the end." },
];

export const communication = [
  "A named lead for every engagement, who you can reach directly.",
  "A regular review, weekly or fortnightly, with working software to look at.",
  "Written updates in the tool your team already uses.",
  "Working hours arranged to overlap with yours.",
];

export const quality = [
  "Code review on every change.",
  "Automated tests for the parts that must not break.",
  "Accessibility and performance checked before release, not after.",
  "Source code, documentation and credentials handed over to you.",
];

export const technologies: { group: string; items: string[] }[] = [
  { group: "Front end", items: ["React", "Next.js", "Vue", "Angular", "TypeScript", "Tailwind CSS", "Three.js", "GSAP"] },
  { group: "Back end", items: ["Node.js", "PHP and Laravel", "Python and Django", "Java and Spring", ".NET", "Go", "GraphQL", "REST"] },
  { group: "Mobile", items: ["Swift", "Kotlin", "Flutter", "React Native"] },
  { group: "Cloud", items: ["AWS", "Microsoft Azure", "Google Cloud", "Cloudflare", "Docker", "Kubernetes", "Terraform"] },
  { group: "Data", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "BigQuery", "Snowflake", "dbt"] },
  { group: "AI", items: ["Large language models", "Retrieval and search", "PyTorch", "TensorFlow", "scikit-learn", "OpenCV"] },
  { group: "Commerce platforms", items: ["Shopify", "WooCommerce", "Magento", "Headless commerce"] },
  { group: "Testing", items: ["Playwright", "Cypress", "Jest", "k6", "Postman"] },
];
