import type { CapabilityCopy } from "./types";

export const capabilityCopyA: CapabilityCopy[] = [
  // Strategy and Consulting
  {
    pillar: "strategy-consulting",
    slug: "digital-transformation",
    lead: "Your business runs on paper, spreadsheets and disconnected tools, and you need a clear plan for moving it onto software that fits how you work.",
    why: "Manual processes cost more as a business grows. Information sits in separate files, the same data is entered several times, and managers wait for reports that are out of date when they arrive. Buying software without a plan often adds another disconnected tool to the pile. A transformation programme starts from your processes, decides which ones are worth changing first, and sequences the work so each phase pays for itself in saved effort or better information. It also prepares your people for the change, which is where many technology projects stall.",
    services: {
      "Digital transformation for traditional businesses": {
        text: "A structured programme for businesses that have grown on manual processes and now need connected systems. We map how work moves through your organisation, identify where software will make the largest difference, and plan the change in phases your team can absorb.",
        deliverables: [
          "Process maps of current operations",
          "Prioritised list of processes to digitise",
          "Phased roadmap with effort estimates",
          "Change and training plan for staff",
        ],
      },
      "IT and digital consulting": {
        text: "Independent advice on a specific technology decision, such as whether to buy or build, which platform to choose, or how to structure an internal team. It suits leaders who need an informed view before they commit budget.",
        deliverables: [
          "Written assessment of the options",
          "Recommendation with reasoning and trade-offs",
          "Cost drivers and risk register",
          "Vendor or platform shortlist where relevant",
        ],
      },
    },
    technologies: [
      "Miro",
      "FigJam",
      "Jira",
      "Confluence",
      "Microsoft 365",
      "Google Workspace",
      "Zoho",
      "Odoo",
      "Power BI",
    ],
    faqs: [
      {
        q: "Where do we start if nothing in our business is digital yet?",
        a: "We start with the process that causes the most delay or error, not with the largest system. A first phase with a narrow scope shows results quickly and teaches both sides how the organisation responds to change.",
      },
      {
        q: "Will you recommend off-the-shelf software or custom development?",
        a: "Either, depending on fit. Where a standard product covers your process well, we say so. We recommend custom work only where your way of operating is specific enough that standard products would force costly workarounds.",
      },
      {
        q: "Are we tied to you for the implementation?",
        a: "No. The roadmap and assessment are yours and are written so that any capable team can act on them. Many clients do ask us to build what we planned, but that is a separate decision.",
      },
      {
        q: "How do you handle staff who resist new systems?",
        a: "We involve the people who do the work from the first workshops, so the new process reflects what they know. The plan includes training, a period of parallel running where needed, and a named person on your side who owns adoption.",
      },
      {
        q: "What determines the cost of a consulting engagement?",
        a: "The number of departments and processes in scope, the number of people we need to interview, and the depth of the output you need. We agree on a fixed scope and fee before work starts.",
      },
    ],
  },
  {
    pillar: "strategy-consulting",
    slug: "product-strategy",
    lead: "You have a product idea and limited budget, and you need to know what the first release must contain to test it with real users.",
    why: "New products fail more often from building the wrong thing than from building it badly. A long feature list delays launch, uses up funding and hides the one question that matters, which is whether users want the core of the product. Product strategy narrows the idea to the smallest release that can answer that question. It also settles technical choices early, so the first version can grow into the full product without a rewrite.",
    services: {
      "Product discovery and MVP planning": {
        text: "A short, focused phase before development. We work with you to define the users, the problem, the core journeys and the features that belong in a first release. It suits founders and product heads who need a buildable scope and a reliable estimate.",
        deliverables: [
          "User and problem definition",
          "Prioritised feature list for the first release",
          "Wireframes or clickable prototype of core journeys",
          "Technical approach with effort estimate",
        ],
      },
      "Technology partner for startups": {
        text: "An ongoing arrangement in which we act as the technology function for an early-stage company. We make architecture decisions, build the product and advise on hiring, so non-technical founders can concentrate on customers and funding.",
        deliverables: [
          "Technology roadmap aligned to business milestones",
          "Product builds delivered in iterations",
          "Technical documentation for investors and future hires",
          "Guidance on forming an in-house team",
        ],
      },
    },
    technologies: [
      "Figma",
      "FigJam",
      "Miro",
      "Notion",
      "Jira",
      "Next.js",
      "Flutter",
      "Firebase",
      "PostgreSQL",
      "AWS",
    ],
    faqs: [
      {
        q: "Who owns the idea, the designs and the code?",
        a: "You do. Ownership of everything we produce for you is set out in the contract, and we sign a non-disclosure agreement before you share details if you want one.",
      },
      {
        q: "How do you decide what goes into the MVP?",
        a: "We rank features by how much they contribute to the core user journey and how much they cost to build. Anything not needed to test the main assumption moves to a later release, with the reasons recorded.",
      },
      {
        q: "Can we do discovery with you and build with someone else?",
        a: "Yes. The discovery output is a complete package that another team can build from. It is priced and delivered as a standalone piece of work.",
      },
      {
        q: "What happens when we hire our own developers?",
        a: "We plan for it from the start. The code is documented and kept in a repository you control, and we run a handover period in which your new team works alongside ours.",
      },
      {
        q: "How long does it take to get to a first release?",
        a: "It depends on the number of user roles, the integrations needed and how settled the requirements are. Discovery produces a schedule based on the actual scope, and we commit to dates only after that.",
      },
    ],
  },
  {
    pillar: "strategy-consulting",
    slug: "technology-advisory",
    lead: "You are responsible for a system you did not build, or one that has grown for years, and you need an independent view of its condition.",
    why: "Software accumulates problems that are invisible from the outside. Dependencies go unsupported, security gaps open, and design decisions that suited a small product begin to slow every change. Leaders often sense this through rising costs and slower delivery but lack the evidence to act. An audit or architecture review provides that evidence. It tells you what is sound, what is at risk and what to fix first, which is useful before an investment round, an acquisition, a rebuild decision or a change of supplier.",
    services: {
      "Technology audit": {
        text: "A structured examination of your code, infrastructure, security and development process. It suits organisations that have inherited a system, are considering a change of supplier, or need due diligence before an investment.",
        deliverables: [
          "Audit report with findings ranked by severity",
          "Code quality and dependency analysis",
          "Security and infrastructure observations",
          "Prioritised remediation plan",
        ],
      },
      "Architecture and platform review": {
        text: "A review of how your system is structured and whether that structure can support your plans for scale, new features or new markets. It answers whether to keep improving the current platform, restructure parts of it or replace it.",
        deliverables: [
          "Current architecture diagrams",
          "Assessment against your growth plans",
          "Target architecture recommendation",
          "Migration path with stages and risks",
        ],
      },
    },
    technologies: [
      "SonarQube",
      "Snyk",
      "OWASP ZAP",
      "Lighthouse",
      "k6",
      "Grafana",
      "GitHub",
      "AWS",
      "Docker",
      "Kubernetes",
    ],
    faqs: [
      {
        q: "What access do you need to run an audit?",
        a: "Read access to the source code, infrastructure configuration and any existing documentation, plus time with the people who maintain the system. We work under a non-disclosure agreement and do not need access to production customer data.",
      },
      {
        q: "Will the audit disrupt our team or our live system?",
        a: "No. The review is read-only and any load or security testing is run against a non-production environment unless you agree otherwise. We ask for a small number of interviews with your team.",
      },
      {
        q: "Our current supplier built the system. Will the audit be fair to them?",
        a: "The report describes what we find, with evidence, and separates serious issues from matters of preference. We are willing to walk your supplier through the findings so they can respond.",
      },
      {
        q: "Will you tell us to rebuild everything?",
        a: "Only if the evidence supports it, which is uncommon. Most systems are better served by targeted fixes and gradual restructuring, and the report sets out the cost and risk of each route.",
      },
      {
        q: "What drives the cost of an audit?",
        a: "The size of the codebase, the number of separate applications and services, and how deep you need us to go on security and performance. We size the work after a short initial look and quote a fixed fee.",
      },
    ],
  },

  // Experience Design
  {
    pillar: "experience-design",
    slug: "ui-ux-design",
    lead: "Users struggle to complete basic tasks in your product or website, and it is costing you sales, sign-ups or support time.",
    why: "People judge a product by how easily they can do what they came to do. When a journey is confusing they leave, call support or avoid the feature, and each of those outcomes has a cost. Design work done before development is also the cheapest place to find problems, because changing a prototype takes hours while changing shipped software takes a release. Good interface design shortens the build, reduces rework and gives the product a consistent logic that users learn once.",
    services: {
      "UI/UX design": {
        text: "End-to-end design for web applications, SaaS products and internal tools. We research your users, structure the journeys and design every screen and state. It suits teams building a new product or reworking one that users find hard to use.",
        deliverables: [
          "User journeys and wireframes",
          "High-fidelity screen designs",
          "Clickable prototype",
          "Developer handover file with specifications",
        ],
      },
      "Website design": {
        text: "Design for marketing and corporate websites, where the task is to explain what you do and move a visitor towards an enquiry or purchase. We plan the page structure and content hierarchy before the visual design.",
        deliverables: [
          "Sitemap and page wireframes",
          "Responsive page designs for desktop and mobile",
          "Style guide for type, colour and components",
          "Exported assets ready for development",
        ],
      },
      "Mobile app design": {
        text: "Interface design for Android and iOS apps that follows the conventions of each platform. We design for small screens, touch input, interrupted sessions and poor connectivity.",
        deliverables: [
          "App flow diagrams",
          "Screen designs for Android and iOS",
          "Interactive prototype for device testing",
          "Icon set and app store graphics",
        ],
      },
    },
    technologies: [
      "Figma",
      "FigJam",
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Maze",
      "Hotjar",
      "Material Design",
      "Apple Human Interface Guidelines",
      "Zeplin",
    ],
    faqs: [
      {
        q: "Do you test designs with real users?",
        a: "Yes, where the project allows it. We run task-based sessions on the prototype with people who match your users, and we revise the design based on where they hesitate or fail.",
      },
      {
        q: "Can you design for a product our own developers will build?",
        a: "Yes. We hand over a structured Figma file with components, spacing, states and notes, and we stay available to answer developer questions during the build.",
      },
      {
        q: "Who owns the design files?",
        a: "You do. The source files are transferred to your account at the end of the project, and the contract assigns the rights in the work to you.",
      },
      {
        q: "How many rounds of revision are included?",
        a: "We agree on the number of review rounds for each stage before starting. Feedback within a round is unlimited, and further rounds or changes of direction are handled through a simple change request.",
      },
      {
        q: "Do you design for accessibility?",
        a: "Yes. We check colour contrast, text size, touch target size and keyboard order against the Web Content Accessibility Guidelines as part of the design, not as a later fix.",
      },
    ],
  },
  {
    pillar: "experience-design",
    slug: "brand-identity",
    lead: "Your business looks different on every document, page and package, and customers do not recognise or remember it.",
    why: "A brand identity is a working tool. It lets customers recognise you quickly, signals what kind of organisation you are, and saves time because staff and suppliers do not have to make design decisions from scratch. Without one, every brochure, post and label is designed in isolation and the business looks smaller and less organised than it is. A defined identity with clear rules makes all later marketing faster and more consistent.",
    services: {
      "Branding and logo": {
        text: "A complete visual identity for a new business or one that has outgrown its original look. We start from your positioning and audience, then design the logo, colour, typography and rules for using them.",
        deliverables: [
          "Logo in all required formats and variations",
          "Colour palette and typography system",
          "Brand guidelines document",
          "Templates for stationery and social media",
        ],
      },
      "Graphic and print design": {
        text: "Design for the printed and digital material a business uses every day, such as brochures, catalogues, presentations, signage and advertisements. Files are prepared to the specifications of your printer or platform.",
        deliverables: [
          "Print-ready artwork files",
          "Digital versions for screen use",
          "Editable source files",
        ],
      },
      "Packaging design": {
        text: "Structural and graphic design for product packaging, labels and cartons. We design for shelf visibility, the information regulations require you to show, and the limits of the chosen print and material process.",
        deliverables: [
          "Packaging concepts and final artwork",
          "Dieline-accurate print files",
          "3D mock-ups for review and marketing",
          "Label variants for product ranges",
        ],
      },
    },
    technologies: [
      "Adobe Illustrator",
      "Adobe Photoshop",
      "Adobe InDesign",
      "Figma",
      "Blender",
      "Adobe Dimension",
      "Canva",
      "Pantone",
    ],
    faqs: [
      {
        q: "Do we get full rights to the logo and identity?",
        a: "Yes. On completion the rights in the final identity are assigned to you in writing, and you receive all source files. We recommend that you run a trademark search with a legal adviser before registration.",
      },
      {
        q: "How many logo concepts will we see?",
        a: "We present a small number of distinct directions, each with the reasoning behind it, and develop the one you choose. The exact number of concepts and revision rounds is agreed in the proposal.",
      },
      {
        q: "We already have a logo. Can you build an identity around it?",
        a: "Yes. We can keep or refine the existing mark and design the wider system around it, including colour, type, layouts and templates.",
      },
      {
        q: "Do you handle printing?",
        a: "We prepare files to your printer's specification and can check proofs with you. The print contract itself stays between you and the printer, so you control cost and quality directly.",
      },
      {
        q: "Does packaging design include regulatory content?",
        a: "We lay out the mandatory information you provide, such as ingredients, warnings and barcodes, in the required sizes and positions. You remain responsible for confirming the content with your regulatory adviser for each market.",
      },
    ],
  },
  {
    pillar: "experience-design",
    slug: "motion-and-3d",
    lead: "Your product is hard to explain in text and static images, and visitors leave before they understand it.",
    why: "Some products and ideas are understood faster when shown in motion or in three dimensions. A short animation can explain a process that takes a page of text, and an interactive 3D model lets a buyer examine a product they cannot hold. Used with purpose, motion directs attention and makes an interface feel responsive. Used carelessly, it slows pages and distracts, so the work has to balance visual effect against loading speed and accessibility.",
    services: {
      "Animated and 3D websites": {
        text: "Websites that use scroll-driven animation, interactive 3D models or WebGL scenes to present a product or story. They suit product launches, premium brands and anything with a physical form worth showing. We build with performance budgets so pages stay fast.",
        deliverables: [
          "Storyboard of the animated experience",
          "3D models and animation assets",
          "Developed and optimised website",
          "Fallback version for low-power devices",
        ],
      },
      "Motion graphics and explainer videos": {
        text: "Short animated videos that explain a product, service or process. We write the script, design the visuals, animate and add voice and sound. They are used on websites, in sales presentations and in advertising.",
        deliverables: [
          "Script and storyboard",
          "Finished video in required formats and ratios",
          "Subtitle files",
          "Source project files",
        ],
      },
      "Illustration and 3D visuals": {
        text: "Custom illustrations, icons and rendered 3D images for websites, apps and marketing. They give you a visual style of your own in place of stock imagery, and they show products that are difficult or costly to photograph.",
        deliverables: [
          "Illustration set in a consistent style",
          "3D product renders",
          "Vector and raster exports",
          "Editable source files",
        ],
      },
    },
    technologies: [
      "Adobe After Effects",
      "Blender",
      "Cinema 4D",
      "Three.js",
      "React Three Fiber",
      "GSAP",
      "Lottie",
      "Rive",
      "Spline",
      "Adobe Premiere Pro",
    ],
    faqs: [
      {
        q: "Will animation slow down our website?",
        a: "It can if it is not planned. We set a performance budget at the start, compress models and textures, load heavy assets only when needed, and provide a lighter version for slower devices.",
      },
      {
        q: "Do animated sites work on mobile phones?",
        a: "Yes. We design the mobile experience separately and test on mid-range devices, reducing or replacing effects that do not perform well on them.",
      },
      {
        q: "What do you need from us to make an explainer video?",
        a: "A clear brief on the audience and the one message the video must carry, plus access to someone who knows the product well. We write the script and you approve it before any animation starts, because changes are costly after that point.",
      },
      {
        q: "Can you create 3D models from our product drawings?",
        a: "Yes. We can work from CAD files, technical drawings or photographs. CAD files give the most accurate result and reduce modelling time.",
      },
      {
        q: "What drives the cost of motion and 3D work?",
        a: "Length, visual complexity, the number of 3D models, and whether voice-over or custom music is needed. We quote after agreeing on a storyboard or reference style, so the price reflects what will be produced.",
      },
    ],
  },
  {
    pillar: "experience-design",
    slug: "design-systems",
    lead: "Your product looks and behaves differently from screen to screen, and your teams rebuild the same components again and again.",
    why: "As a product grows, several designers and developers make similar decisions independently. Buttons multiply into many variants, spacing drifts, and each new feature takes longer because nothing is reused. A design system fixes those decisions once. It gives designers a shared library, gives developers matching coded components, and documents the rules for both. New screens are assembled from tested parts, the product stays consistent, and accessibility is built into the components instead of checked screen by screen.",
    services: {
      "Design systems": {
        text: "A shared library of design tokens, components and usage rules, built in Figma and in code. It suits organisations with more than one product or team, or a single product that has become inconsistent. We audit what exists, consolidate it and document how to use and extend it.",
        deliverables: [
          "Interface audit of existing products",
          "Design tokens for colour, type and spacing",
          "Figma component library",
          "Coded component library with documentation site",
        ],
      },
    },
    technologies: [
      "Figma",
      "Storybook",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Style Dictionary",
      "Radix UI",
      "Chromatic",
    ],
    faqs: [
      {
        q: "Do we need a design system for a single product?",
        a: "Not always. For a small product a well-organised Figma library and style guide may be enough. A full system earns its cost when several people or teams build on the same product over time.",
      },
      {
        q: "Can you build it on our existing front-end framework?",
        a: "Yes. The coded library is built in the framework your developers already use, so they can adopt components gradually without rewriting the product.",
      },
      {
        q: "How do we migrate existing screens to the new system?",
        a: "Gradually. We prioritise the most used components and screens, replace them in stages, and provide a migration guide so your team can continue at its own pace.",
      },
      {
        q: "Who maintains the system after you hand it over?",
        a: "Ideally a named owner on your side. We document how to propose, review and release changes, and we can provide continuing support if you do not have the capacity in-house.",
      },
      {
        q: "Does the system cover accessibility and dark mode?",
        a: "Yes. Components are built and tested for keyboard use, screen readers and colour contrast, and tokens are structured so that themes such as dark mode can be added without redesigning components.",
      },
    ],
  },

  // Product Engineering
  {
    pillar: "product-engineering",
    slug: "web-development",
    lead: "Your website is slow, hard to update or no longer represents your business, and it is not bringing in the enquiries it should.",
    why: "For many customers your website is the first and only impression before they decide to get in touch. A site that loads slowly, reads poorly on a phone or hides key information loses those visitors without anyone noticing. A site that staff cannot update goes stale. Well-built websites are fast, easy to find through search, simple for your team to edit and measurable, so you can see which pages produce enquiries and improve the ones that do not.",
    services: {
      "Business and corporate websites": {
        text: "Websites that present your organisation, services and credentials, and give visitors a clear route to contact you. They suit companies of any size that need a professional, fast and editable site.",
        deliverables: [
          "Designed and developed responsive website",
          "Content management system with editor training",
          "Analytics and search engine setup",
          "Hosting configuration and launch support",
        ],
      },
      "Landing pages": {
        text: "Single pages built for one campaign and one action, such as a sign-up, a download or a demo request. They suit marketing teams that need pages produced quickly and tested against each other.",
        deliverables: [
          "Designed and developed landing page",
          "Form with CRM or email integration",
          "Conversion tracking setup",
          "Variant for A/B testing",
        ],
      },
      "WordPress and headless CMS sites": {
        text: "Sites built on WordPress, or on a headless CMS with a separate front end, depending on how much editorial freedom and performance you need. We help you choose between them based on your content team and traffic.",
        deliverables: [
          "Configured CMS with custom content types",
          "Custom theme or front-end application",
          "Editor roles and publishing workflow",
          "Editor documentation",
        ],
      },
      "Website redesign": {
        text: "A rebuild of an existing site that keeps what works, including search rankings and useful content, and replaces what does not. It suits organisations whose site has become dated, slow or hard to maintain.",
        deliverables: [
          "Audit of current site and analytics",
          "New design and build",
          "Content migration",
          "URL redirect map to protect search rankings",
        ],
      },
      "Progressive web apps": {
        text: "Websites that behave like installed apps, with offline access, home screen installation and push notifications. They suit businesses that want an app-like experience without maintaining separate store apps.",
        deliverables: [
          "Installable web application",
          "Offline caching strategy",
          "Push notification setup",
          "Performance audit report",
        ],
      },
      "Booking and appointment sites": {
        text: "Websites that let customers book a time, a room or a service and pay online. They suit clinics, salons, consultants, venues and any business that sells time slots.",
        deliverables: [
          "Booking flow with live availability",
          "Calendar sync and staff schedules",
          "Online payment and confirmation messages",
          "Admin panel for managing bookings",
        ],
      },
      "Multilingual sites": {
        text: "Websites that serve content in several languages and regions, with correct handling of scripts, text direction, dates and currencies. They suit organisations that sell or operate across borders.",
        deliverables: [
          "Language and region site structure",
          "Translation workflow in the CMS",
          "Right-to-left layout support where needed",
          "Search engine tags for each language version",
        ],
      },
    },
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "WordPress",
      "Strapi",
      "Sanity",
      "Laravel",
      "Vercel",
      "Cloudflare",
    ],
    faqs: [
      {
        q: "Will we be able to update the site ourselves?",
        a: "Yes. Every site comes with a content management system set up for the pages you need to edit, and we train your team to use it. Structural changes still need a developer.",
      },
      {
        q: "Will a redesign hurt our search rankings?",
        a: "It should not if it is handled properly. We map every existing URL to its new address, keep page titles and content that perform well, and monitor search data after launch to catch any drop.",
      },
      {
        q: "Who owns the site, the domain and the hosting account?",
        a: "You do. Domains and hosting are registered in your name, and the code and content are yours. We hold access only for as long as you want us to maintain the site.",
      },
      {
        q: "Who writes the content?",
        a: "Either side. You can supply the text, or our writers can produce it from interviews with your team. Late content is the most common cause of delay, so we agree on responsibility at the start.",
      },
      {
        q: "What happens after the site goes live?",
        a: "We stay on call through an agreed warranty period to fix defects. After that you can take a maintenance plan covering updates, backups, security and small changes, or manage the site yourself.",
      },
    ],
  },
  {
    pillar: "product-engineering",
    slug: "ecommerce",
    lead: "You want to sell online, or your current store is losing orders to slow pages, a clumsy checkout or manual back-office work.",
    why: "An online store is an operation, not only a website. Orders, stock, payments, shipping and tax all have to agree with each other, and a failure in any one produces refunds, complaints or lost sales. Buyers abandon stores that are slow or ask for too much at checkout. A well-built store keeps the buying path short, keeps stock and order data accurate across systems, and gives you the reports needed to see which products and channels earn their place.",
    services: {
      "Custom online stores": {
        text: "Stores built to your catalogue, pricing rules and fulfilment process, where standard platforms would need heavy workarounds. They suit businesses with complex products, business-to-business pricing or unusual order flows.",
        deliverables: [
          "Storefront and checkout",
          "Admin panel for products, orders and customers",
          "Integrations with payment and shipping providers",
          "Sales and stock reports",
        ],
      },
      "Shopify and WooCommerce stores": {
        text: "Stores built on established platforms, with a custom theme and the right set of apps or plugins. They suit businesses that want to start selling sooner and keep running costs predictable.",
        deliverables: [
          "Configured store with custom theme",
          "Product catalogue setup and import",
          "Payment, shipping and tax configuration",
          "Staff training on store management",
        ],
      },
      "Multi-vendor marketplaces": {
        text: "Platforms where many sellers list products and you manage the marketplace. We build seller onboarding, catalogue approval, commission rules and payouts. They suit businesses creating a marketplace for a specific category or region.",
        deliverables: [
          "Buyer storefront",
          "Seller dashboard for listings and orders",
          "Commission and payout management",
          "Marketplace admin and dispute tools",
        ],
      },
      "Payment, shipping and tax invoice integration": {
        text: "Connecting an existing store to payment gateways, courier services and invoicing or accounting software. It removes manual steps between an order being placed and it being paid, shipped and recorded, in line with the tax rules of the countries you sell in.",
        deliverables: [
          "Payment gateway integration with refunds",
          "Shipping rate, label and tracking integration",
          "Automated tax-compliant invoices",
          "Sync with accounting software",
        ],
      },
      "Store maintenance": {
        text: "Ongoing care for a live store, covering platform and plugin updates, security patches, backups, performance and small changes. It suits store owners who do not have a developer on staff.",
        deliverables: [
          "Scheduled updates and security patches",
          "Backups with restore tests",
          "Uptime and performance monitoring",
          "Monthly activity report",
        ],
      },
    },
    technologies: [
      "Shopify",
      "WooCommerce",
      "Magento",
      "Next.js",
      "Laravel",
      "Node.js",
      "PostgreSQL",
      "Stripe",
      "PayPal",
      "Algolia",
    ],
    faqs: [
      {
        q: "Should we use Shopify, WooCommerce or a custom build?",
        a: "It depends on your catalogue, your pricing rules and how far your process differs from the standard. Platforms suit most stores and cost less to start. We recommend custom work only where the platform would get in your way.",
      },
      {
        q: "Can you move our existing store without losing data?",
        a: "Yes. We migrate products, customers and order history, test the result on a staging site, and redirect old URLs so search rankings and saved links continue to work.",
      },
      {
        q: "How is customer payment data kept safe?",
        a: "Card details are entered on the payment provider's hosted fields or pages and never stored on your servers. This keeps your store outside the most demanding parts of card security requirements.",
      },
      {
        q: "Can the store connect to our ERP or inventory system?",
        a: "In most cases, yes, provided the system offers an API or file export. We confirm what your system supports during scoping and design the sync so that stock and orders stay consistent in both.",
      },
      {
        q: "Can the store handle several currencies and countries?",
        a: "Yes. We set up currencies, regional pricing, tax rules and shipping zones for each market you sell in. You should confirm the tax treatment for each country with your accountant.",
      },
    ],
  },
  {
    pillar: "product-engineering",
    slug: "web-apps-and-saas",
    lead: "Your business needs software that does not exist off the shelf, or you are building a software product of your own to sell.",
    why: "Standard software fits standard processes. When your advantage lies in how you work, forcing that into a generic tool means spreadsheets on the side and manual steps in between. Custom web applications fit the process exactly and can be extended as the business changes. For companies selling software, the application is the product, and its architecture decides how quickly new features ship, what each customer costs to serve and whether larger customers will pass it through their security reviews.",
    services: {
      "Custom web applications": {
        text: "Browser-based software built around a specific business process, such as order management, approvals, scheduling or case handling. It suits organisations whose work does not fit packaged products.",
        deliverables: [
          "Deployed web application",
          "Source code in your repository",
          "Technical and user documentation",
          "Automated test suite",
        ],
      },
      "SaaS product development": {
        text: "Design and development of multi-tenant software sold on subscription. We build the product along with the parts every SaaS business needs: accounts, roles, billing, onboarding and usage tracking.",
        deliverables: [
          "Multi-tenant application",
          "Subscription billing and plan management",
          "Admin console for customer management",
          "Deployment pipeline and monitoring",
        ],
      },
      "Customer, dealer and employee portals": {
        text: "Secure sites where a defined group signs in to see their own information and carry out tasks, such as placing orders, raising tickets or downloading documents. They reduce calls and emails to your staff.",
        deliverables: [
          "Portal with role-based access",
          "Integration with your back-office systems",
          "Self-service features and notifications",
          "User management tools",
        ],
      },
      "Dashboards and admin panels": {
        text: "Internal screens that let your team see what is happening and manage data without asking a developer. They suit any business with a system whose data is currently reachable only through the database.",
        deliverables: [
          "Dashboard with charts and filters",
          "Data management screens",
          "Role and permission controls",
          "Export and scheduled reports",
        ],
      },
      "API development and integrations": {
        text: "Building APIs that let other systems use your data and functions, and connecting your software to third-party services. It suits organisations with systems that need to exchange data reliably.",
        deliverables: [
          "Documented REST or GraphQL API",
          "Authentication and rate limiting",
          "Third-party service integrations",
          "API reference documentation",
        ],
      },
      "Modernising old software": {
        text: "Moving a legacy application to current technology without stopping the business. We replace it in stages, keep data intact and run old and new side by side until the new system has proven itself.",
        deliverables: [
          "Assessment of the existing system",
          "Staged migration plan",
          "Rebuilt application modules",
          "Migrated and verified data",
        ],
      },
    },
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Laravel",
      "Python",
      "PostgreSQL",
      "Redis",
      "Docker",
      "AWS",
    ],
    faqs: [
      {
        q: "Do we own the source code?",
        a: "Yes. The code is written for you, kept in a repository you control, and assigned to you under the contract. Any open-source components we use are listed with their licences.",
      },
      {
        q: "How do you handle changes to requirements during the build?",
        a: "Changes are expected. Between iterations you can reprioritise the backlog, and anything that adds to the agreed scope is estimated and approved by you before we start on it.",
      },
      {
        q: "Can you work alongside our in-house developers?",
        a: "Yes. We can take a defined part of the system or join your team's workflow, using your repository, code review process and ticketing tools.",
      },
      {
        q: "How do you protect our data during development?",
        a: "We develop against anonymised or sample data wherever possible, restrict production access to named people, and keep credentials in a secrets manager. Access is removed when the engagement ends.",
      },
      {
        q: "Will the application cope as our user numbers grow?",
        a: "We design for the load you expect, with a clear path to scale beyond it, and we verify this with load tests before launch. We avoid building for extreme scale you may never need, because that adds cost with no return.",
      },
    ],
  },
  {
    pillar: "product-engineering",
    slug: "mobile-apps",
    lead: "Your customers or staff need to get things done on their phones, and a mobile website is not enough for what you want to offer.",
    why: "A mobile app makes sense when people use your service often, need it offline, or need device features such as the camera, location or notifications. An app also has costs a website does not: store review, operating system updates and a range of devices to support. The choice between native and cross-platform development affects budget, performance and how quickly features reach both platforms. Getting those decisions right at the start avoids paying for the app twice.",
    services: {
      "Android apps": {
        text: "Native Android applications for phones and tablets, built to work across the range of screen sizes and devices your users have. They suit products where Android is the main platform or where deep device integration is needed.",
        deliverables: [
          "Android app published to Google Play",
          "Source code and build configuration",
          "Back-end API and admin panel where needed",
          "Test report across target devices",
        ],
      },
      "iOS apps": {
        text: "Native applications for iPhone and iPad, built to Apple's interface guidelines and review requirements. They suit products whose users are mainly on Apple devices or that depend on Apple-specific features.",
        deliverables: [
          "iOS app published to the App Store",
          "Source code and build configuration",
          "Back-end API and admin panel where needed",
          "Test report across target devices",
        ],
      },
      "Cross-platform apps": {
        text: "One codebase that produces both Android and iOS apps. It suits most business apps, where sharing code lowers the cost of building and maintaining two platforms with little visible difference to users.",
        deliverables: [
          "Android and iOS apps from a shared codebase",
          "Store listings on both platforms",
          "Source code and documentation",
          "Automated build and release pipeline",
        ],
      },
      "App publishing and app store optimisation": {
        text: "Preparing and submitting an app to Google Play and the App Store, and improving its listing so more of the right people find and install it. It suits teams with a finished app and no experience of store requirements.",
        deliverables: [
          "Store accounts and listing setup",
          "Screenshots, descriptions and keywords",
          "Submission and review handling",
          "Listing performance report",
        ],
      },
      "Apps for wearables and TV": {
        text: "Applications for smartwatches and television platforms, either standalone or as companions to a phone app. They suit fitness, health, media and streaming products.",
        deliverables: [
          "Watch or TV application",
          "Sync with companion phone app",
          "Store submission for each platform",
          "Device compatibility report",
        ],
      },
      "App maintenance": {
        text: "Keeping a published app working as operating systems, devices and store policies change. It covers updates, crash monitoring, bug fixes and small improvements.",
        deliverables: [
          "Operating system compatibility updates",
          "Crash and performance monitoring",
          "Bug fixes and store resubmissions",
          "Periodic maintenance report",
        ],
      },
    },
    technologies: [
      "Flutter",
      "React Native",
      "Kotlin",
      "Swift",
      "SwiftUI",
      "Jetpack Compose",
      "Firebase",
      "Node.js",
      "Fastlane",
      "Wear OS",
    ],
    faqs: [
      {
        q: "Should we build native or cross-platform?",
        a: "Cross-platform suits most business apps and costs less to build and maintain. Native is the better choice where the app depends on heavy graphics, low-level device features or the newest platform capabilities. We give a recommendation after reviewing your feature list.",
      },
      {
        q: "Whose developer accounts is the app published under?",
        a: "Yours. The app is published from Apple and Google developer accounts that your organisation owns, so you keep control of the listing, the reviews and the revenue.",
      },
      {
        q: "What if the app stores reject our app?",
        a: "We review the app against store policies before submission to reduce that risk. If a rejection happens, we address the reason given and resubmit as part of the project.",
      },
      {
        q: "Does the app need a back end?",
        a: "Usually, if it has user accounts, shared data or notifications. We can build the back end and admin panel, or connect the app to APIs you already have.",
      },
      {
        q: "Can the app work without an internet connection?",
        a: "Yes, if it is designed for it. We decide with you which features must work offline, store that data on the device, and sync it when the connection returns, with rules for resolving conflicts.",
      },
    ],
  },
  {
    pillar: "product-engineering",
    slug: "enterprise-software",
    lead: "Your departments run on separate tools that do not share data, and you cannot get a single reliable picture of the business.",
    why: "Operational software is the record of how a business runs. When finance, sales, stock and staff data sit in separate systems, people reconcile them by hand, and the numbers still disagree. Packaged products solve this for standard processes but can be costly to license and awkward to adapt. Software built or configured around your own process gives every department one source of data, enforces the controls you need, and produces the reports management asks for without manual collation.",
    services: {
      ERP: {
        text: "A single system connecting finance, purchasing, inventory, production and sales. We build custom ERP or implement and extend an existing platform. It suits growing businesses that have outgrown separate tools.",
        deliverables: [
          "Configured or custom ERP modules",
          "Migrated master and transaction data",
          "Role-based access and approval workflows",
          "User training and manuals",
        ],
      },
      CRM: {
        text: "Software for managing leads, customers, sales pipelines and service requests. It suits sales and service teams that track customers in spreadsheets or inboxes and lose follow-ups as a result.",
        deliverables: [
          "Lead and pipeline management",
          "Customer records with interaction history",
          "Email, telephony and website integrations",
          "Sales reports and dashboards",
        ],
      },
      "HR and payroll": {
        text: "Systems for employee records, attendance, leave, payroll and appraisals. They suit organisations where payroll takes days of manual work each cycle. Statutory rules are configured for the countries you employ in.",
        deliverables: [
          "Employee database and self-service portal",
          "Attendance and leave management",
          "Payroll processing with payslips",
          "Statutory and management reports",
        ],
      },
      "Billing and inventory": {
        text: "Software that issues invoices and tracks stock across locations in real time. It suits traders, distributors and manufacturers who need stock, sales and purchase figures to agree.",
        deliverables: [
          "Invoicing with tax calculation",
          "Multi-location stock tracking",
          "Purchase and supplier management",
          "Stock, sales and ageing reports",
        ],
      },
      "Point of sale": {
        text: "Counter billing software for shops, restaurants and service outlets, working with barcode scanners, receipt printers and payment terminals. It keeps working when the internet connection drops and syncs later.",
        deliverables: [
          "Point of sale application",
          "Hardware integration",
          "Offline mode with sync",
          "Outlet and head office reports",
        ],
      },
      "Education management": {
        text: "Systems for schools, colleges and training institutes covering admissions, fees, attendance, timetables, examinations and communication with parents and students.",
        deliverables: [
          "Admissions and student records",
          "Fee collection and receipts",
          "Attendance, timetable and exam modules",
          "Parent and student portal or app",
        ],
      },
      "Hospital and clinic management": {
        text: "Software for patient registration, appointments, clinical records, pharmacy, laboratory and billing. Access to patient data is restricted by role and logged, in line with the privacy rules that apply to you.",
        deliverables: [
          "Patient registration and appointments",
          "Electronic medical records",
          "Pharmacy, laboratory and billing modules",
          "Access controls and audit logs",
        ],
      },
      "Hotel management": {
        text: "Systems for reservations, front desk, housekeeping, restaurant billing and guest accounts. They connect to booking channels so room availability stays consistent everywhere it is sold.",
        deliverables: [
          "Reservation and front desk module",
          "Housekeeping and room status tracking",
          "Channel manager integration",
          "Guest billing and reports",
        ],
      },
      "Learning management and online exams": {
        text: "Platforms for delivering courses, tracking progress and running assessments online. They suit training companies, educational institutions and businesses training their own staff.",
        deliverables: [
          "Course authoring and delivery platform",
          "Online exam engine with question banks",
          "Progress tracking and certificates",
          "Learner and instructor dashboards",
        ],
      },
      "Fleet and delivery tracking": {
        text: "Software that tracks vehicles and deliveries by GPS, plans routes and records proof of delivery. It suits logistics companies and businesses that run their own delivery vehicles.",
        deliverables: [
          "Live vehicle tracking dashboard",
          "Driver mobile app",
          "Route planning and dispatch",
          "Proof of delivery and trip reports",
        ],
      },
      "Real estate management": {
        text: "Systems for developers, brokers and property managers covering listings, enquiries, bookings, payment schedules, leases and maintenance requests.",
        deliverables: [
          "Property and unit inventory",
          "Lead and booking management",
          "Payment schedules and receipts",
          "Tenant or buyer portal",
        ],
      },
    },
    technologies: [
      "Laravel",
      "Node.js",
      "React",
      "Python",
      "PostgreSQL",
      "MySQL",
      "Odoo",
      "ERPNext",
      "Flutter",
      "AWS",
    ],
    faqs: [
      {
        q: "Should we buy a packaged product or have one built?",
        a: "If a packaged product fits most of your process at an acceptable licence cost, buy it and we can implement it. Custom development makes sense when your process is distinctive, or when licence fees for your user count exceed the cost of owning the software.",
      },
      {
        q: "How do you move data from our current system?",
        a: "We extract it, clean it, map it to the new structure and load it into a test environment for you to verify. The final migration is rehearsed before go-live so the cutover is predictable.",
      },
      {
        q: "Can it be hosted on our own servers?",
        a: "Yes. We can deploy to your own data centre, to a private cloud account that you own, or to a hosted environment, depending on your data residency and security requirements.",
      },
      {
        q: "How do you get staff to adopt the new system?",
        a: "We roll out module by module, train each group on the screens they will use, and stay on site or on call during the first live period. Feedback from that period is fixed quickly, because early frustrations decide adoption.",
      },
      {
        q: "Can the system connect to our accounting software and other tools?",
        a: "Yes, where those tools provide an API or a file-based exchange. Integrations are identified during scoping and included in the estimate.",
      },
    ],
  },
  {
    pillar: "product-engineering",
    slug: "fintech-and-payments",
    lead: "You need to collect, move or lend money through software, and errors or security gaps are not acceptable.",
    why: "Payment software has a lower tolerance for failure than almost any other kind. A missed callback means an order paid for but not fulfilled. A rounding error repeated across many transactions becomes a reconciliation problem. A security weakness becomes a regulatory matter. Building these systems requires careful handling of every transaction state, complete audit trails and a design that keeps sensitive data out of places it does not need to be. Done properly, it lets you take payments in more ways, collect on time and close your books without manual matching.",
    services: {
      "Payment gateway integration": {
        text: "Connecting your website, app or business system to one or more payment providers. We handle each payment method you need, along with failures, retries, refunds and reconciliation. It suits any business taking payments online.",
        deliverables: [
          "Integrated checkout with chosen providers",
          "Webhook handling for all payment states",
          "Refund and dispute workflows",
          "Reconciliation reports",
        ],
      },
      "Wallet and bill payment platforms": {
        text: "Platforms that hold stored value for users and let them pay bills, transfer money or buy services. We build the ledger, the user apps and the integrations with banking and biller partners. You hold the licences and partner agreements required in your market.",
        deliverables: [
          "Double-entry ledger and wallet engine",
          "User mobile and web applications",
          "Partner and biller integrations",
          "Admin console with transaction monitoring",
        ],
      },
      "Subscription and invoicing systems": {
        text: "Software that bills customers on a recurring basis, issues invoices and handles upgrades, proration and failed payments. It suits SaaS companies and any business with recurring revenue.",
        deliverables: [
          "Plan and pricing management",
          "Automated recurring billing and invoices",
          "Failed payment retry and reminder flows",
          "Revenue and churn reports",
        ],
      },
      "Lending and collection software": {
        text: "Systems that manage the life of a loan, from application and assessment through disbursal, repayment schedules and collection of overdue amounts. They suit lenders and finance companies replacing spreadsheets or ageing software.",
        deliverables: [
          "Loan origination and approval workflow",
          "Repayment schedules and interest calculation",
          "Collections tracking and field agent app",
          "Portfolio and regulatory reports",
        ],
      },
    },
    technologies: [
      "Stripe",
      "PayPal",
      "Adyen",
      "Braintree",
      "Node.js",
      "Java",
      "Laravel",
      "PostgreSQL",
      "Redis",
      "AWS",
    ],
    faqs: [
      {
        q: "Do you store card details on our servers?",
        a: "No. Card data is captured by the payment provider's hosted fields and replaced with tokens, so your systems never hold raw card numbers. This reduces both your risk and the scope of card security requirements that apply to you.",
      },
      {
        q: "Who is responsible for licences and regulatory approval?",
        a: "You are, as the operator of the financial service. We build the software to meet the technical requirements your regulator and partners set, and we work with your compliance adviser during design.",
      },
      {
        q: "Which payment provider should we use?",
        a: "The choice depends on the countries and currencies you sell in, the payment methods your customers prefer, fees and settlement terms. We compare the options with you and can integrate more than one for coverage and fallback.",
      },
      {
        q: "How do you make sure no transaction is lost or counted twice?",
        a: "Every payment request carries an idempotency key, every state change is written to an append-only ledger, and scheduled reconciliation compares our records with the provider's. Mismatches are flagged for review instead of being silently corrected.",
      },
      {
        q: "How is the system tested before it handles real money?",
        a: "We test against provider sandboxes with scripted scenarios for success, failure, timeout and dispute cases, and we recommend an independent security test before launch. Go-live starts with low limits that are raised as the system proves itself.",
      },
    ],
  },
  {
    pillar: "product-engineering",
    slug: "emerging-technology",
    lead: "You want to use connected devices, immersive media or blockchain in your business, and you need to know whether it will work before committing fully.",
    why: "Newer technologies carry more uncertainty than established ones. The hardware may not behave as specified, the user may not accept the experience, or a simpler approach may do the job. The sensible route is to prove the idea on a small scale, measure it and expand only if it holds. Where these technologies fit, they do things ordinary software cannot: they report on physical equipment, let people see a product in their own space, or create records that several parties can trust without a central authority.",
    services: {
      "Internet of Things solutions": {
        text: "Systems that connect sensors, machines and devices to software so you can monitor and control them remotely. We build device firmware, data pipelines and dashboards. They suit manufacturers, utilities, agriculture and facility operators.",
        deliverables: [
          "Device firmware and connectivity setup",
          "Cloud platform for device data",
          "Monitoring dashboard with alerts",
          "Device management and update tools",
        ],
      },
      "AR and VR experiences": {
        text: "Augmented and virtual reality applications for product visualisation, training and marketing. They suit retailers showing products in a customer's space, and organisations training staff on tasks that are costly or risky to practise for real.",
        deliverables: [
          "AR or VR application for target devices",
          "3D models and environments",
          "Interaction design and user testing results",
          "Deployment to app stores or headsets",
        ],
      },
      "Blockchain and smart contracts": {
        text: "Applications that record transactions or ownership on a blockchain, with smart contracts enforcing the rules. We first assess whether a blockchain is needed, since a conventional database is often the better choice.",
        deliverables: [
          "Suitability assessment",
          "Smart contracts with test suite",
          "Web or mobile application front end",
          "Security review report",
        ],
      },
      "Game development": {
        text: "Design and development of games for mobile, web and desktop, including educational and promotional games. We cover game design, art, programming and release.",
        deliverables: [
          "Game design document",
          "Playable builds at each milestone",
          "Art, animation and audio assets",
          "Store release and analytics setup",
        ],
      },
    },
    technologies: [
      "Unity",
      "Unreal Engine",
      "ARKit",
      "ARCore",
      "WebXR",
      "MQTT",
      "ESP32",
      "Raspberry Pi",
      "Solidity",
      "Ethereum",
    ],
    faqs: [
      {
        q: "Can we start with a proof of concept?",
        a: "Yes, and we recommend it. A proof of concept tests the riskiest assumption with the least spend, and its results tell you whether a full build is justified.",
      },
      {
        q: "Do you supply the hardware for IoT projects?",
        a: "We help you select sensors, boards and gateways and can build prototypes. For volume production we work with the hardware manufacturer you choose, and we provide the firmware and specifications.",
      },
      {
        q: "Does our project really need a blockchain?",
        a: "Often it does not. It is justified when several parties who do not fully trust each other need a shared record that none of them controls. We assess this openly before any development.",
      },
      {
        q: "Are smart contracts audited before deployment?",
        a: "Yes. We write automated tests and run static analysis, and for contracts that will hold value we recommend an independent third-party audit. A deployed contract is difficult to change, so this step should not be skipped.",
      },
      {
        q: "Which devices will an AR or VR experience run on?",
        a: "That is decided at the start, because it shapes the whole build. Phone-based AR reaches the widest audience, while headsets give deeper immersion to a smaller one. We choose with you based on who needs to use it.",
      },
    ],
  },
  {
    pillar: "product-engineering",
    slug: "quality-engineering",
    lead: "Defects keep reaching your users, releases are tense, and your team spends more time fixing than building.",
    why: "A defect found by a customer costs far more than one found before release. It takes support time, damages trust and interrupts planned work. Teams without structured testing either release slowly out of caution or release quickly and repair in production. Quality engineering replaces both with evidence. Defined test cases, automated regression checks and performance tests show what works before each release, so you can ship more often with fewer surprises.",
    services: {
      "Manual testing": {
        text: "Testers work through your application as users would, following written test cases and exploring beyond them. It suits new features, complex workflows and anything where human judgement of usability matters.",
        deliverables: [
          "Test plan and test cases",
          "Defect reports with steps to reproduce",
          "Device and browser coverage matrix",
          "Release readiness summary",
        ],
      },
      "Automated testing": {
        text: "Scripts that check your application's key functions on every code change. They suit products with frequent releases, where repeating the same manual checks each time is slow and unreliable.",
        deliverables: [
          "Automated test suite for web, mobile or API",
          "Integration with your CI pipeline",
          "Test result reporting",
          "Framework documentation for your team",
        ],
      },
      "Performance and load testing": {
        text: "Tests that measure how your system behaves under expected and peak traffic. They suit any business preparing for a launch, a campaign or seasonal demand, and any team investigating slow response times.",
        deliverables: [
          "Load test scenarios and scripts",
          "Results report with response times and limits",
          "Identified bottlenecks",
          "Tuning recommendations",
        ],
      },
      "Accessibility testing": {
        text: "An evaluation of your website or app against the Web Content Accessibility Guidelines, using automated tools and manual checks with assistive technology. It suits organisations with legal accessibility obligations or a commitment to serve all users.",
        deliverables: [
          "Accessibility audit report",
          "Issues ranked by severity with fix guidance",
          "Screen reader and keyboard test results",
          "Retest after fixes",
        ],
      },
    },
    technologies: [
      "Playwright",
      "Cypress",
      "Selenium",
      "Appium",
      "Postman",
      "JMeter",
      "k6",
      "BrowserStack",
      "axe",
      "Jira",
    ],
    faqs: [
      {
        q: "Can you test software that another team built?",
        a: "Yes. Independent testing is often more effective because the testers have no assumptions about how the software is meant to behave. We need access to a test environment and the requirements or user stories.",
      },
      {
        q: "Should we automate all of our tests?",
        a: "No. Automation pays off for stable, frequently repeated checks such as regression and API tests. New features and usability are better tested by people, so most products need a mix.",
      },
      {
        q: "Who maintains the automated tests after you write them?",
        a: "Either your team or ours. We write tests in a mainstream framework with documentation so your developers can maintain them, and we can continue under a support arrangement if you prefer.",
      },
      {
        q: "Do you use real customer data for testing?",
        a: "No. We test with synthetic or anonymised data. If a production issue can only be reproduced with real data, we agree on controlled access with you in writing first.",
      },
      {
        q: "How do your testers work with our developers?",
        a: "We join your existing workflow. Defects are logged in your tracker with steps, evidence and severity, and testers attend your stand-ups and planning sessions so testing keeps pace with development.",
      },
    ],
  },
];
