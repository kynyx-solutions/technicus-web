// On-page SEO for every indexable page: the focus keyword, the search title,
// the meta description, and the two places the keyword appears on the page
// itself (`eyebrow`, the small line above the main heading, and `heading`, one
// section heading). Titles are 30 to 60 characters and descriptions 120 to
// 158, so search results show them in full.
//
// The admin can override any of this per page (SEO > Titles & descriptions, or
// the SEO tab of an article, case study or opening). This file is the default.

export type PageSeo = {
  focus: string;
  title: string;
  description: string;
  eyebrow?: string;
  heading?: string;
  /** A sentence under the keyword heading, where the page needs one. */
  intro?: string;
};

export const pageSeo: Record<string, PageSeo> = {
  /* ------------------------------------------------------- main pages --- */
  "/": {
    focus: "technology consultancy",
    title: "Technicus: technology consultancy for software",
    description:
      "Technicus is a technology consultancy that helps companies decide what to build, design it, engineer it and keep it running, from strategy to support.",
    heading: "Questions about our technology consultancy",
  },
  "/services": {
    focus: "technology services",
    title: "Technology services from strategy to support",
    description:
      "Technology services from one team: strategy, design, software engineering, AI and data, cloud and security, growth marketing and managed services.",
    eyebrow: "Technology services",
    heading: "How we deliver technology services",
  },
  "/technologies": {
    focus: "technology stack",
    title: "Our technology stack | Technicus",
    description:
      "The technology stack our teams use for web, mobile, cloud, data and AI, from React and Next.js to Python, AWS and Kubernetes, chosen to fit the problem.",
    eyebrow: "Our technology stack",
    heading: "Our technology stack by area",
  },
  "/industries": {
    focus: "industry solutions",
    title: "Industry solutions for twelve sectors | Technicus",
    description:
      "Industry solutions for education, healthcare, retail, finance, logistics and more: software built around how each sector works, its rules and its users.",
    eyebrow: "Industry solutions",
    heading: "Industry solutions we deliver",
  },
  "/work": {
    focus: "case studies",
    title: "Case studies: work we have shipped | Technicus",
    description:
      "Case studies from Technicus: e-commerce, booking, payments and websites built for clients in retail, hospitality, education and other industries.",
    eyebrow: "Case studies",
    heading: "Case studies by client",
  },
  "/insights": {
    focus: "technology insights",
    title: "Technology insights and guides | Technicus",
    description:
      "Technology insights for people who make software decisions: practical guides on AI projects, cloud migration, security, design briefs and team models.",
    eyebrow: "Technology insights",
    heading: "Technology insights and guides",
  },
  "/about": {
    focus: "technology partner",
    title: "About Technicus, your technology partner",
    description:
      "Technicus is a technology partner for startups and established companies: one team for strategy, design, engineering and support, founded in India.",
    eyebrow: "About Technicus, your technology partner",
    heading: "What we hold ourselves to as a technology partner",
  },
  "/about/how-we-work": {
    focus: "how we work",
    title: "How we work with clients | Technicus",
    description:
      "How we work: four stages from understanding the problem to running the system, with clear engagement models, regular reviews and code you own.",
    eyebrow: "How we work",
    heading: "How we work, in four stages",
  },
  "/about/trust": {
    focus: "data security",
    title: "Data security and confidentiality | Technicus",
    description:
      "How Technicus handles data security and confidentiality: named access, private repositories, no secrets in code, NDAs, and work that belongs to you.",
    eyebrow: "Data security and confidentiality",
    heading: "Data security in practice",
  },
  "/about/locations": {
    focus: "office locations",
    title: "Office locations and time zones | Technicus",
    description:
      "Technicus office locations, local times and how we work with clients in other countries and time zones, with overlapping hours agreed for each project.",
    eyebrow: "Office locations",
    heading: "Office locations",
  },
  "/careers": {
    focus: "careers at technicus",
    title: "Careers at Technicus: jobs in software",
    description:
      "Careers at Technicus: work directly with clients on products people depend on, in small teams of strategists, designers, engineers and data specialists.",
    eyebrow: "Careers at Technicus",
    heading: "Careers at Technicus: how we hire",
  },
  "/contact": {
    focus: "contact technicus",
    title: "Contact Technicus: start a project",
    description:
      "Contact Technicus to start a project, book a consultation or request an NDA. Send a short brief and you will hear back from someone who does the work.",
    eyebrow: "Contact Technicus",
    heading: "Contact Technicus directly",
  },
  "/india": {
    focus: "software development in india",
    title: "Software development in India | Technicus",
    description:
      "Software development in India for local businesses: websites, mobile apps, business software, design and digital marketing from our team in Bihar.",
    eyebrow: "Software development in India",
    heading: "Software development in India for local businesses",
  },

  /* ----------------------------------------------------------- pillars --- */
  "/services/strategy-consulting": {
    focus: "technology strategy consulting",
    title: "Technology strategy consulting | Technicus",
    description:
      "Technology strategy consulting that turns a business goal into a plan: priorities, costs, risks and a roadmap your team can deliver, before you build.",
    eyebrow: "Technology strategy consulting",
    heading: "Technology strategy consulting services",
  },
  "/services/experience-design": {
    focus: "experience design services",
    title: "Experience design services: UX, UI, brand",
    description:
      "Experience design services: UX research, UI design, brand identity, motion and design systems, built around the tasks your users need to complete.",
    eyebrow: "Experience design services",
    heading: "Our experience design services",
  },
  "/services/product-engineering": {
    focus: "software development services",
    title: "Software development services | Technicus",
    description:
      "Software development services for websites, web apps, mobile apps, e-commerce and business systems, with testing built in and source code you own.",
    eyebrow: "Software development services",
    heading: "Our software development services",
  },
  "/services/ai-data": {
    focus: "ai and data services",
    title: "AI and data services for business | Technicus",
    description:
      "AI and data services: AI assistants and agents, process automation, machine learning and analytics, each started with a defined problem and a measure.",
    eyebrow: "AI and data services",
    heading: "Our AI and data services",
  },
  "/services/cloud-security": {
    focus: "cloud and security services",
    title: "Cloud and security services | Technicus",
    description:
      "Cloud and security services: cloud setup and migration, DevOps and release automation, security testing and fixes, so systems stay fast and protected.",
    eyebrow: "Cloud and security services",
    heading: "Our cloud and security services",
  },
  "/services/growth-marketing": {
    focus: "digital marketing services",
    title: "Digital marketing services that measure | Technicus",
    description:
      "Digital marketing services: SEO, performance advertising, content and marketing automation, with tracking that connects spending to enquiries and sales.",
    eyebrow: "Digital marketing services",
    heading: "Our digital marketing services",
  },
  "/services/managed-services": {
    focus: "managed software services",
    title: "Managed software services and teams | Technicus",
    description:
      "Managed software services: maintenance and support for live websites and apps, and dedicated developers who work as part of your team, month by month.",
    eyebrow: "Managed software services",
    heading: "Our managed software services",
  },

  /* ------------------------------------------------------ capabilities --- */
  "/services/strategy-consulting/digital-transformation": {
    focus: "digital transformation services",
    title: "Digital transformation services | Technicus",
    description:
      "Digital transformation services that move work off paper, spreadsheets and disconnected tools, with a clear plan, the right systems and staff who use them.",
    eyebrow: "Digital transformation services",
    heading: "Our digital transformation services",
  },
  "/services/strategy-consulting/product-strategy": {
    focus: "product strategy services",
    title: "Product strategy services for new products",
    description:
      "Product strategy services that decide what your first release must do, who it is for and what it will cost, so a limited budget goes on what matters.",
    eyebrow: "Product strategy services",
    heading: "Our product strategy services",
  },
  "/services/strategy-consulting/technology-advisory": {
    focus: "technology advisory services",
    title: "Technology advisory services | Technicus",
    description:
      "Technology advisory services for leaders responsible for systems they did not build: independent reviews, architecture advice and a plan you can act on.",
    eyebrow: "Technology advisory services",
    heading: "Our technology advisory services",
  },
  "/services/experience-design/ui-ux-design": {
    focus: "ui/ux design services",
    title: "UI/UX design services for apps and websites",
    description:
      "UI/UX design services that make products easy to use: research, user flows, wireframes, prototypes and interface design tested with real users.",
    eyebrow: "UI/UX design services",
    heading: "Our UI/UX design services",
  },
  "/services/experience-design/brand-identity": {
    focus: "brand identity design",
    title: "Brand identity design services | Technicus",
    description:
      "Brand identity design that makes your business recognisable everywhere: logo, typography, colour, guidelines and templates your team can apply.",
    eyebrow: "Brand identity design",
    heading: "Our brand identity design services",
  },
  "/services/experience-design/motion-and-3d": {
    focus: "motion design and 3d",
    title: "Motion design and 3D for products | Technicus",
    description:
      "Motion design and 3D that explain your product faster than text: product animations, explainer videos, interactive 3D and motion for websites and apps.",
    eyebrow: "Motion design and 3D",
    heading: "Our motion design and 3D services",
  },
  "/services/experience-design/design-systems": {
    focus: "design system services",
    title: "Design system services for product teams",
    description:
      "Design system services that keep products consistent: shared components, tokens and usage rules in Figma and in code, so teams stop rebuilding screens.",
    eyebrow: "Design system services",
    heading: "Our design system services",
  },
  "/services/product-engineering/web-development": {
    focus: "web development services",
    title: "Web development services | Technicus",
    description:
      "Web development services for fast, secure business websites that are easy to update, rank well in search and turn visitors into enquiries.",
    eyebrow: "Web development services",
    heading: "Our web development services",
  },
  "/services/product-engineering/ecommerce": {
    focus: "e-commerce development",
    title: "E-commerce development services | Technicus",
    description:
      "E-commerce development for online stores that load fast and convert: storefronts, checkout, payments, inventory and integrations, on Shopify or custom.",
    eyebrow: "E-commerce development",
    heading: "Our e-commerce development services",
    intro: "Our e-commerce development covers the whole store, from catalogue and checkout to payments, stock and the systems behind them.",
  },
  "/services/product-engineering/web-apps-and-saas": {
    focus: "saas development",
    title: "SaaS development and custom web apps",
    description:
      "SaaS development and custom web applications: software built for your process or your product, with secure accounts, billing, integrations and testing.",
    eyebrow: "SaaS development",
    heading: "Our SaaS development services",
    intro: "Our SaaS development covers accounts, billing, integrations and the admin tools your team needs to run the product.",
  },
  "/services/product-engineering/mobile-apps": {
    focus: "mobile app development",
    title: "Mobile app development for iOS and Android",
    description:
      "Mobile app development for iOS and Android, native or cross-platform, for customers and staff, from design and build to app store release and support.",
    eyebrow: "Mobile app development",
    heading: "Our mobile app development services",
  },
  "/services/product-engineering/enterprise-software": {
    focus: "enterprise software development",
    title: "Enterprise software development | Technicus",
    description:
      "Enterprise software development that connects departments: ERP, CRM, internal tools and integrations, so the business works from one reliable source.",
    eyebrow: "Enterprise software development",
    heading: "Our enterprise software development services",
  },
  "/services/product-engineering/fintech-and-payments": {
    focus: "fintech software development",
    title: "Fintech software development | Technicus",
    description:
      "Fintech software development for payments, lending and wallets: secure transaction flows, provider integrations and controls built in from the start.",
    eyebrow: "Fintech software development",
    heading: "Our fintech software development services",
  },
  "/services/product-engineering/emerging-technology": {
    focus: "emerging technology",
    title: "Emerging technology: IoT, AR and blockchain",
    description:
      "Emerging technology projects with IoT devices, AR and VR, and blockchain, started with a small proof of value so you learn what works before scaling.",
    eyebrow: "Emerging technology",
    heading: "Our emerging technology services",
  },
  "/services/product-engineering/quality-engineering": {
    focus: "software testing services",
    title: "Software testing services | Technicus",
    description:
      "Software testing services that stop defects reaching users: test strategy, automated tests, performance and accessibility checks, and calmer releases.",
    eyebrow: "Software testing services",
    heading: "Our software testing services",
  },
  "/services/ai-data/generative-ai-and-agents": {
    focus: "generative ai development",
    title: "Generative AI development and AI agents",
    description:
      "Generative AI development: AI assistants and agents connected to your systems and documents, tested against real cases before they reach your customers.",
    eyebrow: "Generative AI development",
    heading: "Our generative AI development services",
  },
  "/services/ai-data/automation": {
    focus: "business process automation",
    title: "Business process automation | Technicus",
    description:
      "Business process automation that ends copying data between systems and chasing approvals, with workflows, integrations and AI where it helps.",
    eyebrow: "Business process automation",
    heading: "Our business process automation services",
  },
  "/services/ai-data/machine-learning": {
    focus: "machine learning development",
    title: "Machine learning development | Technicus",
    description:
      "Machine learning development that turns your data into forecasts, risk flags and recommendations, checked for accuracy and monitored in production.",
    eyebrow: "Machine learning development",
    heading: "Our machine learning development services",
  },
  "/services/ai-data/data-and-analytics": {
    focus: "data analytics services",
    title: "Data analytics services and dashboards",
    description:
      "Data analytics services that give every team the same numbers: data pipelines, warehouses and dashboards that answer questions in minutes, not weeks.",
    eyebrow: "Data analytics services",
    heading: "Our data analytics services",
  },
  "/services/cloud-security/cloud": {
    focus: "cloud consulting services",
    title: "Cloud consulting services | Technicus",
    description:
      "Cloud consulting services for AWS, Azure and Google Cloud: migration, architecture and cost control, so infrastructure is reliable and the bill makes sense.",
    eyebrow: "Cloud consulting services",
    heading: "Our cloud consulting services",
  },
  "/services/cloud-security/devops": {
    focus: "devops services",
    title: "DevOps services and CI/CD | Technicus",
    description:
      "DevOps services that make releases routine: CI/CD pipelines, infrastructure as code, monitoring and safe rollbacks, so you ship more often with less risk.",
    eyebrow: "DevOps services",
    heading: "Our DevOps services",
  },
  "/services/cloud-security/cybersecurity": {
    focus: "cybersecurity services",
    title: "Cybersecurity services and testing | Technicus",
    description:
      "Cybersecurity services: security reviews, penetration testing, fixes and compliance readiness, so you know where you are exposed and can prove it is fixed.",
    eyebrow: "Cybersecurity services",
    heading: "Our cybersecurity services",
  },
  "/services/growth-marketing/seo": {
    focus: "seo services",
    title: "SEO services that bring customers | Technicus",
    description:
      "SEO services that bring the right visitors: technical fixes, keyword research, content and local search, measured by enquiries and sales, not just traffic.",
    eyebrow: "SEO services",
    heading: "Our SEO services",
  },
  "/services/growth-marketing/performance-marketing": {
    focus: "performance marketing services",
    title: "Performance marketing services | Technicus",
    description:
      "Performance marketing services across Google, Meta and LinkedIn, with conversion tracking that shows which spend brings customers and which does not.",
    eyebrow: "Performance marketing services",
    heading: "Our performance marketing services",
  },
  "/services/growth-marketing/social-and-content": {
    focus: "content marketing services",
    title: "Content marketing services | Technicus",
    description:
      "Content marketing services that keep your channels active and distinct: content strategy, articles, social posts and video, written by human editors.",
    eyebrow: "Content marketing services",
    heading: "Our content marketing services",
  },
  "/services/growth-marketing/marketing-automation": {
    focus: "marketing automation services",
    title: "Marketing automation services | Technicus",
    description:
      "Marketing automation services that reply to leads in minutes, follow up without reminders and bring customers back, with CRM and email set up properly.",
    eyebrow: "Marketing automation services",
    heading: "Our marketing automation services",
  },
  "/services/managed-services/maintenance-and-support": {
    focus: "software maintenance and support",
    title: "Software maintenance and support services",
    description:
      "Software maintenance and support for live websites and apps: updates, security patches, monitoring and fixes, under an agreed service level.",
    eyebrow: "Software maintenance and support",
    heading: "Our software maintenance and support services",
  },
  "/services/managed-services/dedicated-teams": {
    focus: "dedicated development team",
    title: "Dedicated development team | Technicus",
    description:
      "A dedicated development team that works only on your product and follows your process: engineers, designers and testers you can interview first.",
    eyebrow: "Dedicated development team",
    heading: "How a dedicated development team works",
  },

  /* -------------------------------------------------------- industries --- */
  "/industries/education": {
    focus: "education software development",
    title: "Education software development | Technicus",
    description:
      "Education software development for schools, colleges and edtech: admissions, fees, learning platforms and online exams that staff and students can use.",
    eyebrow: "Education software development",
    heading: "How we help with education software development",
  },
  "/industries/healthcare": {
    focus: "healthcare software development",
    title: "Healthcare software development | Technicus",
    description:
      "Healthcare software development for clinics, hospitals and labs: online booking, payments, reports and records, with patient data handled carefully.",
    eyebrow: "Healthcare software development",
    heading: "How we help with healthcare software development",
  },
  "/industries/retail-ecommerce": {
    focus: "retail software development",
    title: "Retail software development and e-commerce",
    description:
      "Retail software development and e-commerce that keep stock, prices and orders consistent across shop, website, marketplace and phone.",
    eyebrow: "Retail software development",
    heading: "How we help with retail software development",
  },
  "/industries/hospitality-travel": {
    focus: "hospitality software development",
    title: "Hospitality software development | Technicus",
    description:
      "Hospitality software development for hotels, restaurants and travel: direct booking, payments, guest apps and channel integrations that cut commission.",
    eyebrow: "Hospitality software development",
    heading: "How we help with hospitality software development",
  },
  "/industries/automotive": {
    focus: "automotive software development",
    title: "Automotive software development | Technicus",
    description:
      "Automotive software development for dealers, rental and service businesses: online showrooms, booking, finance enquiries and service management.",
    eyebrow: "Automotive software development",
    heading: "How we help with automotive software development",
  },
  "/industries/real-estate": {
    focus: "real estate software development",
    title: "Real estate software development | Technicus",
    description:
      "Real estate software development: property listings, lead handling, CRM, virtual tours and tenant portals that answer buyers and tenants quickly.",
    eyebrow: "Real estate software development",
    heading: "How we help with real estate software development",
  },
  "/industries/financial-services": {
    focus: "financial software development",
    title: "Financial software development | Technicus",
    description:
      "Financial software development for lenders, payments and investment firms: onboarding, transactions and reporting built with security and controls.",
    eyebrow: "Financial software development",
    heading: "How we help with financial software development",
  },
  "/industries/manufacturing": {
    focus: "manufacturing software development",
    title: "Manufacturing software development: ERP, IoT",
    description:
      "Manufacturing software development that links planning, production, stock and sales: ERP, connected machines, dealer portals and quality checks.",
    eyebrow: "Manufacturing software development",
    heading: "How we help with manufacturing software development",
  },
  "/industries/logistics-transport": {
    focus: "logistics software development",
    title: "Logistics software development | Technicus",
    description:
      "Logistics software development for shippers, carriers and warehouses: tracking, transport and warehouse systems, route planning and partner integrations.",
    eyebrow: "Logistics software development",
    heading: "How we help with logistics software development",
  },
  "/industries/agriculture": {
    focus: "agriculture software development",
    title: "Agriculture software development | Technicus",
    description:
      "Agriculture software development for agribusiness: farmer apps, input ordering, traceability and data on crops and supply, built for rural connectivity.",
    eyebrow: "Agriculture software development",
    heading: "How we help with agriculture software development",
  },
  "/industries/public-sector": {
    focus: "public sector software development",
    title: "Public sector software development",
    description:
      "Public sector software development for government and non-profits: accessible online services, case management and reporting that everyone can use.",
    eyebrow: "Public sector software development",
    heading: "How we help with public sector software development",
  },
  "/industries/startups": {
    focus: "startup software development",
    title: "Startup software development: MVP to scale",
    description:
      "Startup software development from MVP to scale: build the smallest product that tests demand, learn fast, and avoid a rebuild when growth arrives.",
    eyebrow: "Startup software development",
    heading: "How we help with startup software development",
  },

  /* ------------------------------------------------------ case studies --- */
  "/work/sabstore": {
    focus: "e-commerce platform",
    title: "Sabstore e-commerce platform | Technicus",
    description:
      "Sabstore e-commerce platform: an online store built by Technicus for a retailer in India. See the services and the kind of work behind the project.",
    heading: "What went into the e-commerce platform",
  },
  "/work/dabbasabba": {
    focus: "online ordering service",
    title: "DabbaSabba online ordering service | Technicus",
    description:
      "DabbaSabba online ordering service for customised meal delivery, built by Technicus. See the services and the kind of work behind the project.",
    heading: "What went into the online ordering service",
  },
  "/work/carbyke": {
    focus: "booking platform",
    title: "Carbyke car and bike booking platform",
    description:
      "Carbyke booking platform for car and bike rental, built by Technicus for a vehicle rental business. See the services and the work behind the project.",
    heading: "What went into the booking platform",
  },
  "/work/paygini": {
    focus: "payment processing solution",
    title: "Paygini payment processing solution",
    description:
      "Paygini payment processing solution built by Technicus. See the fintech and payments services and the kind of engineering behind the project.",
    heading: "What went into the payment processing solution",
  },
  "/work/goal-360-degree": {
    focus: "educational institute",
    title: "Goal 360 Degree educational institute website",
    description:
      "Goal 360 Degree: a website for an educational institute, built by Technicus. See the web development services and the work behind the project.",
    heading: "What went into the educational institute website",
  },
  "/work/hotel-indraprastha": {
    focus: "website for a hotel",
    title: "Hotel Indraprastha: website for a hotel",
    description:
      "Hotel Indraprastha: a website for a hotel, built by Technicus for the hospitality and travel industry. See the services and the work behind it.",
    heading: "What went into the website for a hotel",
  },

  /* ---------------------------------------------------------- articles --- */
  "/insights/how-to-scope-a-first-ai-agent-project-so-it-reaches-production": {
    focus: "ai agent project",
    title: "How to scope your first AI agent project",
    description:
      "How to scope a first AI agent project so it reaches production: choose one task, define done, limit what the agent may do and plan the handover.",
  },
  "/insights/build-or-buy-how-to-decide-for-business-software": {
    focus: "build or buy",
    title: "Build or buy business software: how to decide",
    description:
      "Build or buy business software? Compare the real costs of each, the middle options, and the questions that settle most cases, then run the decision.",
  },
  "/insights/what-to-check-before-you-migrate-to-the-cloud": {
    focus: "migrate to the cloud",
    title: "What to check before you migrate to the cloud",
    description:
      "Before you migrate to the cloud: be clear about the reason, list every application, check data rules, estimate running costs and plan the way back.",
  },
  "/insights/how-to-brief-a-design-team-so-the-first-version-is-usable": {
    focus: "brief a design team",
    title: "How to brief a design team | Technicus",
    description:
      "How to brief a design team so the first version is usable: describe the people, rank the tasks, define success, share constraints and plan a test.",
  },
  "/insights/a-security-review-checklist-before-you-launch-a-web-application": {
    focus: "security review checklist",
    title: "Web app security review checklist | Technicus",
    description:
      "A security review checklist for launching a web application: sign-in, permissions, input, secrets, browser controls, dependencies, logging and privacy.",
  },
  "/insights/dedicated-team-or-fixed-scope-project-how-to-choose": {
    focus: "dedicated team",
    title: "Dedicated team or fixed-scope project?",
    description:
      "Dedicated team or fixed-scope project: how each model works, the two tests that decide between them, hybrid options and what to agree in either case.",
  },

  /* ------------------------------------------------------ local pages --- */
  "/web-designing-in-madhubani-bihar": {
    focus: "web designing in madhubani",
    title: "Web designing in Madhubani, Bihar | Technicus",
    description:
      "Web designing in Madhubani, Bihar by Technicus: modern, mobile-friendly websites for local businesses, designed and built by our team in Madhubani.",
    heading: "Why choose Technicus for web designing in Madhubani",
  },
  "/web-development-in-madhubani-bihar": {
    focus: "web development in madhubani",
    title: "Web development in Madhubani, Bihar",
    description:
      "Web development in Madhubani, Bihar: fast, secure websites and web applications for local businesses, built and supported by Technicus in Madhubani.",
    heading: "Why choose Technicus for web development in Madhubani",
  },
  "/app-development-in-bihar": {
    focus: "app development in bihar",
    title: "App development in Bihar | Technicus",
    description:
      "App development in Bihar: Android and iOS apps for businesses and institutions, designed, built and published by Technicus from Madhubani.",
    heading: "Why choose Technicus for app development in Bihar",
  },
  "/graphics-design-in-bihar": {
    focus: "graphics design in bihar",
    title: "Graphics design in Bihar | Technicus",
    description:
      "Graphics design in Bihar: logos, brand identity, brochures, packaging and social media designs for local businesses, from Technicus in Madhubani.",
    heading: "Why choose Technicus for graphics design in Bihar",
  },
  "/software-development-in-madhubani-bihar": {
    focus: "software development in madhubani",
    title: "Software development in Madhubani, Bihar",
    description:
      "Software development in Madhubani, Bihar: billing, inventory, school and business software built for how you work, by Technicus in Madhubani.",
    heading: "Why choose Technicus for software development in Madhubani",
  },
  "/digital-marketing": {
    focus: "digital marketing",
    title: "Digital marketing for local businesses",
    description:
      "Digital marketing for local businesses in Bihar and across India: SEO, Google and social media ads, and content that brings enquiries, from Technicus.",
    heading: "Why choose Technicus for digital marketing",
  },
};

/** Pages kept out of search results on purpose: placeholders and legal texts. */
export const noindexPaths = ["/about/leadership", "/privacy", "/terms", "/cookies", "/refund", "/insights/authors/technicus-editorial"];

/**
 * Keywords worth tracking that are rising in search, each tied to the page
 * that should rank for it. Shown as suggestions in Admin > SEO > Keywords.
 */
export const trendingKeywords: { term: string; page: string }[] = [
  { term: "ai agents for business", page: "/services/ai-data/generative-ai-and-agents" },
  { term: "ai agent development company", page: "/services/ai-data/generative-ai-and-agents" },
  { term: "llm integration services", page: "/services/ai-data/generative-ai-and-agents" },
  { term: "rag chatbot development", page: "/services/ai-data/generative-ai-and-agents" },
  { term: "ai automation agency", page: "/services/ai-data/automation" },
  { term: "workflow automation with ai", page: "/services/ai-data/automation" },
  { term: "ai consulting services", page: "/services/ai-data" },
  { term: "predictive analytics services", page: "/services/ai-data/machine-learning" },
  { term: "modern data stack consulting", page: "/services/ai-data/data-and-analytics" },
  { term: "cloud cost optimization", page: "/services/cloud-security/cloud" },
  { term: "platform engineering services", page: "/services/cloud-security/devops" },
  { term: "penetration testing services", page: "/services/cloud-security/cybersecurity" },
  { term: "soc 2 readiness", page: "/services/cloud-security/cybersecurity" },
  { term: "next.js development company", page: "/services/product-engineering/web-development" },
  { term: "headless commerce development", page: "/services/product-engineering/ecommerce" },
  { term: "shopify development agency", page: "/services/product-engineering/ecommerce" },
  { term: "mvp development company", page: "/industries/startups" },
  { term: "flutter app development", page: "/services/product-engineering/mobile-apps" },
  { term: "custom erp development", page: "/services/product-engineering/enterprise-software" },
  { term: "legacy system modernization", page: "/services/strategy-consulting/technology-advisory" },
  { term: "fractional cto services", page: "/services/strategy-consulting/technology-advisory" },
  { term: "design system agency", page: "/services/experience-design/design-systems" },
  { term: "generative engine optimization", page: "/services/growth-marketing/seo" },
  { term: "staff augmentation services", page: "/services/managed-services/dedicated-teams" },
  { term: "offshore development team india", page: "/services/managed-services/dedicated-teams" },
];
