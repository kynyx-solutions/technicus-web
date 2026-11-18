// Case studies.
//
// The six clients and their one-line descriptions come from the portfolio page
// of the old site. Nothing else is known here, so problem, approach, outcome,
// numbers and quotes are empty and the page hides those sections.
// CONFIRM with each client that they may be shown. See docs/CONTENT_TODO.md.

export type Project = {
  slug: string;
  client: string;
  /** What the client does, as stated on the old site. */
  sector: string;
  industry: string;
  /** Industry slug from content/site.ts, for linking. */
  industrySlug: string;
  /** Pillar slugs. */
  pillars: string[];
  country: string;
  summary: string;
  services: string[];
  technologies: string[];
  problem?: string;
  approach?: string;
  built?: string;
  outcomes?: { value: string; label: string }[];
  quote?: { text: string; name: string; role: string };
};

export const projects: Project[] = [
  {
    slug: "sabstore",
    client: "Sabstore",
    sector: "Online retail",
    industry: "Retail and e-commerce",
    industrySlug: "retail-ecommerce",
    pillars: ["product-engineering"],
    country: "India",
    summary: "An e-commerce platform for an online retailer.",
    services: ["E-commerce"],
    technologies: [],
  },
  {
    slug: "dabbasabba",
    client: "DabbaSabba",
    sector: "Customised tiffin service",
    industry: "Hospitality and travel",
    industrySlug: "hospitality-travel",
    pillars: ["product-engineering"],
    country: "India",
    summary: "An online ordering service for customised meal delivery.",
    services: ["Web development"],
    technologies: [],
  },
  {
    slug: "carbyke",
    client: "Carbyke",
    sector: "Vehicle rental",
    industry: "Automotive",
    industrySlug: "automotive",
    pillars: ["product-engineering"],
    country: "India",
    summary: "A booking platform for car and bike rental.",
    services: ["Web development"],
    technologies: [],
  },
  {
    slug: "paygini",
    client: "Paygini",
    sector: "Payment processing",
    industry: "Financial services",
    industrySlug: "financial-services",
    pillars: ["product-engineering"],
    country: "India",
    summary: "A payment processing solution.",
    services: ["Fintech and payments"],
    technologies: [],
  },
  {
    slug: "goal-360-degree",
    client: "Goal 360 Degree",
    sector: "Educational institute",
    industry: "Education",
    industrySlug: "education",
    pillars: ["product-engineering"],
    country: "India",
    summary: "A website for an educational institute.",
    services: ["Web development"],
    technologies: [],
  },
  {
    slug: "hotel-indraprastha",
    client: "Hotel Indraprastha",
    sector: "Hotel",
    industry: "Hospitality and travel",
    industrySlug: "hospitality-travel",
    pillars: ["experience-design", "product-engineering"],
    country: "India",
    summary: "A website for a hotel.",
    services: ["Web development"],
    technologies: [],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
