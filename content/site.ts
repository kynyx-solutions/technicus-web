// Shared site data. Everything marked "placeholder" is replaced in the content phase.

export const site = {
  name: "Technicus",
  legalName: "Technicus Infotech LLP",
  description: "Technology consultancy. Strategy, design, engineering, AI, cloud and growth.",
  url: "https://www.technicusinfotech.com", // placeholder until the main domain is confirmed
};

export const industries = [
  { slug: "education", name: "Education" },
  { slug: "healthcare", name: "Healthcare" },
  { slug: "retail-ecommerce", name: "Retail and e-commerce" },
  { slug: "hospitality-travel", name: "Hospitality and travel" },
  { slug: "automotive", name: "Automotive" },
  { slug: "real-estate", name: "Real estate" },
  { slug: "financial-services", name: "Financial services" },
  { slug: "manufacturing", name: "Manufacturing" },
  { slug: "logistics-transport", name: "Logistics and transport" },
  { slug: "agriculture", name: "Agriculture" },
  { slug: "public-sector", name: "Public sector and non-profits" },
  { slug: "startups", name: "Startups" },
];

export const aboutPages = [
  { href: "/about", name: "Company" },
  { href: "/about/leadership", name: "Leadership" },
  { href: "/about/how-we-work", name: "How we work" },
  { href: "/about/trust", name: "Trust" },
  { href: "/about/locations", name: "Locations" },
];

// Local pages keep their existing URLs so current search rankings are not lost.
export const localPages = [
  {
    slug: "web-designing-in-madhubani-bihar",
    name: "Web designing in Madhubani, Bihar",
    global: "/services/experience-design/ui-ux-design",
  },
  {
    slug: "web-development-in-madhubani-bihar",
    name: "Web development in Madhubani, Bihar",
    global: "/services/product-engineering/web-development",
  },
  {
    slug: "app-development-in-bihar",
    name: "App development in Bihar",
    global: "/services/product-engineering/mobile-apps",
  },
  {
    slug: "graphics-design-in-bihar",
    name: "Graphics design in Bihar",
    global: "/services/experience-design/brand-identity",
  },
  {
    slug: "software-development-in-madhubani-bihar",
    name: "Software development in Madhubani, Bihar",
    global: "/services/product-engineering/enterprise-software",
  },
  {
    slug: "digital-marketing",
    name: "Digital marketing",
    global: "/services/growth-marketing",
  },
];

export const legalPages = [
  { href: "/privacy", name: "Privacy" },
  { href: "/terms", name: "Terms" },
  { href: "/cookies", name: "Cookies" },
  { href: "/refund", name: "Refund" },
];
