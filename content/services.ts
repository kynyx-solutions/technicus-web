export type Capability = {
  slug: string;
  name: string;
  services: string[];
};

export type Pillar = {
  slug: string;
  name: string;
  summary: string;
  capabilities: Capability[];
};

// Source: docs/SITE_STRUCTURE.md section 2 and docs/REVAMP_PLAN.md section 5.
// Summaries are working placeholders until the content phase.
export const pillars: Pillar[] = [
  {
    slug: "strategy-consulting",
    name: "Strategy and Consulting",
    summary: "Decide what to build, in what order, and why.",
    capabilities: [
      {
        slug: "digital-transformation",
        name: "Digital transformation",
        services: [
          "Digital transformation for traditional businesses",
          "IT and digital consulting",
        ],
      },
      {
        slug: "product-strategy",
        name: "Product strategy",
        services: [
          "Product discovery and MVP planning",
          "Technology partner for startups",
        ],
      },
      {
        slug: "technology-advisory",
        name: "Technology advisory",
        services: ["Technology audit", "Architecture and platform review"],
      },
    ],
  },
  {
    slug: "experience-design",
    name: "Experience Design",
    summary: "Design products and brands people understand and trust.",
    capabilities: [
      {
        slug: "ui-ux-design",
        name: "UI/UX design",
        services: ["UI/UX design", "Website design", "Mobile app design"],
      },
      {
        slug: "brand-identity",
        name: "Brand identity",
        services: [
          "Branding and logo",
          "Graphic and print design",
          "Packaging design",
        ],
      },
      {
        slug: "motion-and-3d",
        name: "Motion and 3D",
        services: [
          "Animated and 3D websites",
          "Motion graphics and explainer videos",
          "Illustration and 3D visuals",
        ],
      },
      {
        slug: "design-systems",
        name: "Design systems",
        services: ["Design systems"],
      },
    ],
  },
  {
    slug: "product-engineering",
    name: "Product Engineering",
    summary: "Build and ship software that holds up in production.",
    capabilities: [
      {
        slug: "web-development",
        name: "Web development",
        services: [
          "Business and corporate websites",
          "Landing pages",
          "WordPress and headless CMS sites",
          "Website redesign",
          "Progressive web apps",
          "Booking and appointment sites",
          "Multilingual sites",
        ],
      },
      {
        slug: "ecommerce",
        name: "E-commerce",
        services: [
          "Custom online stores",
          "Shopify and WooCommerce stores",
          "Multi-vendor marketplaces",
          "Payment, shipping and tax invoice integration",
          "Store maintenance",
        ],
      },
      {
        slug: "web-apps-and-saas",
        name: "Web apps and SaaS",
        services: [
          "Custom web applications",
          "SaaS product development",
          "Customer, dealer and employee portals",
          "Dashboards and admin panels",
          "API development and integrations",
          "Modernising old software",
        ],
      },
      {
        slug: "mobile-apps",
        name: "Mobile apps",
        services: [
          "Android apps",
          "iOS apps",
          "Cross-platform apps",
          "App publishing and app store optimisation",
          "Apps for wearables and TV",
          "App maintenance",
        ],
      },
      {
        slug: "enterprise-software",
        name: "Enterprise software",
        services: [
          "ERP",
          "CRM",
          "HR and payroll",
          "Billing and inventory",
          "Point of sale",
          "Education management",
          "Hospital and clinic management",
          "Hotel management",
          "Learning management and online exams",
          "Fleet and delivery tracking",
          "Real estate management",
        ],
      },
      {
        slug: "fintech-and-payments",
        name: "Fintech and payments",
        services: [
          "Payment gateway integration",
          "Wallet and bill payment platforms",
          "Subscription and invoicing systems",
          "Lending and collection software",
        ],
      },
      {
        slug: "emerging-technology",
        name: "Emerging technology",
        services: [
          "Internet of Things solutions",
          "AR and VR experiences",
          "Blockchain and smart contracts",
          "Game development",
        ],
      },
      {
        slug: "quality-engineering",
        name: "Quality engineering",
        services: [
          "Manual testing",
          "Automated testing",
          "Performance and load testing",
          "Accessibility testing",
        ],
      },
    ],
  },
  {
    slug: "ai-data",
    name: "AI and Data",
    summary: "Put AI and data to work on real business problems.",
    capabilities: [
      {
        slug: "generative-ai-and-agents",
        name: "Generative AI and agents",
        services: [
          "AI chatbots for websites and messaging",
          "Voice agents",
          "AI agents for enquiries and support",
          "AI features in existing software",
        ],
      },
      {
        slug: "automation",
        name: "Automation",
        services: [
          "Workflow and office automation",
          "Document reading and data entry automation",
        ],
      },
      {
        slug: "machine-learning",
        name: "Machine learning",
        services: [
          "Custom machine learning models",
          "Computer vision",
          "Recommendation and search",
        ],
      },
      {
        slug: "data-and-analytics",
        name: "Data and analytics",
        services: [
          "Business dashboards and reports",
          "Data warehouse and pipelines",
          "Website and marketing analytics setup",
          "Data migration and clean-up",
        ],
      },
    ],
  },
  {
    slug: "cloud-security",
    name: "Cloud and Security",
    summary: "Run systems that are fast, reliable and protected.",
    capabilities: [
      {
        slug: "cloud",
        name: "Cloud",
        services: [
          "Cloud setup and migration",
          "Server management and monitoring",
          "Backup and disaster recovery",
          "Speed optimisation",
        ],
      },
      {
        slug: "devops",
        name: "DevOps",
        services: ["CI/CD pipelines", "Release automation and reliability"],
      },
      {
        slug: "cybersecurity",
        name: "Cybersecurity",
        services: [
          "Security audit and penetration testing",
          "Hacked website clean-up",
          "Data protection compliance",
          "Secure code review",
          "Staff security awareness",
        ],
      },
    ],
  },
  {
    slug: "growth-marketing",
    name: "Growth and Marketing",
    summary: "Reach the right customers and turn attention into revenue.",
    capabilities: [
      {
        slug: "seo",
        name: "SEO",
        services: ["SEO", "Local SEO", "Conversion rate improvement"],
      },
      {
        slug: "performance-marketing",
        name: "Performance marketing",
        services: ["Search and social advertising", "Influencer marketing"],
      },
      {
        slug: "social-and-content",
        name: "Social and content",
        services: [
          "Social media marketing",
          "Content writing",
          "Photo and video production",
          "Online reputation management",
        ],
      },
      {
        slug: "marketing-automation",
        name: "Marketing automation",
        services: ["Marketing automation", "Email and messaging campaigns"],
      },
    ],
  },
  {
    slug: "managed-services",
    name: "Managed Services and Teams",
    summary: "Keep products running, and extend your team with ours.",
    capabilities: [
      {
        slug: "maintenance-and-support",
        name: "Maintenance and support",
        services: [
          "Website and app maintenance plans",
          "Round-the-clock support",
          "Speed, security and SEO audits",
          "Rescue and takeover of unfinished projects",
        ],
      },
      {
        slug: "dedicated-teams",
        name: "Dedicated teams",
        services: [
          "Dedicated developers",
          "Team extension",
          "White-label development for agencies",
          "Offshore development",
        ],
      },
    ],
  },
];

export function getPillar(slug: string) {
  return pillars.find((p) => p.slug === slug);
}

export function getCapability(pillarSlug: string, capabilitySlug: string) {
  return getPillar(pillarSlug)?.capabilities.find(
    (c) => c.slug === capabilitySlug,
  );
}

export function anchor(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
