import type { IndustryCopy } from "./types";

export const industryCopy: IndustryCopy[] = [
  {
    slug: "education",
    lead: "Teaching, admissions and administration now run on software as much as on classrooms. Institutions need systems that staff can manage and that students and parents will use without training.",
    challenges: [
      {
        title: "Records spread across disconnected tools",
        text: "Admissions, fees, attendance and results often sit in separate spreadsheets and products. Staff re-enter the same data, and nobody has one reliable view of a student.",
      },
      {
        title: "Online learning that students abandon",
        text: "A learning platform that is slow, confusing or awkward on a phone gets ignored. Course completion depends on the experience as much as on the content.",
      },
      {
        title: "Exams and assessment at scale",
        text: "Online exams bring heavy load at fixed times and little tolerance for failure. Question banks, timing, marking and result publication all have to hold up on the day.",
      },
      {
        title: "Student data that needs protecting",
        text: "Institutions hold personal data about minors, families and staff. Access is often shared too widely, and the rules on how that data is handled differ by country.",
      },
    ],
    solutions: [
      {
        title: "Education management systems",
        text: "We build and integrate systems for admissions, fees, timetables, attendance and results, so each record is entered once and every department works from the same data.",
        links: [
          "/services/product-engineering/enterprise-software",
          "/services/product-engineering/web-apps-and-saas",
        ],
      },
      {
        title: "Learning platforms and online exams",
        text: "We design and build learning management and exam platforms, then load test them against the peak you expect before the first exam goes live.",
        links: [
          "/services/product-engineering/enterprise-software",
          "/services/product-engineering/quality-engineering",
        ],
      },
      {
        title: "Apps and portals for students and parents",
        text: "We design mobile apps and portals for timetables, fee payment, results and notices, with interfaces that work for first-time users on low-cost phones.",
        links: [
          "/services/product-engineering/mobile-apps",
          "/services/experience-design/ui-ux-design",
        ],
      },
      {
        title: "Admissions enquiries and reporting",
        text: "We set up AI assistants that answer routine admissions questions from your published information and pass the rest to staff, and dashboards that show enquiries, enrolment and fee collection.",
        links: [
          "/services/ai-data/generative-ai-and-agents",
          "/services/ai-data/data-and-analytics",
        ],
      },
    ],
  },
  {
    slug: "healthcare",
    lead: "Patients expect to book, pay and receive reports online, while providers remain responsible for some of the most sensitive data there is. The software has to be convenient and careful at once.",
    challenges: [
      {
        title: "Appointments and front-desk load",
        text: "Phone-based booking fills reception time and leads to missed slots and no-shows. Patients want to book, reschedule and get reminders without calling.",
      },
      {
        title: "Clinical and billing systems that do not connect",
        text: "Registration, clinical notes, laboratory, pharmacy and billing frequently run as separate systems. Staff copy data between them, and errors follow.",
      },
      {
        title: "Privacy and regulatory obligations",
        text: "Health data is regulated in most countries, and the rules differ between them. Systems need access control, audit trails and encryption that match the law where you operate.",
      },
      {
        title: "Paperwork that takes time from care",
        text: "Referral letters, insurance forms and scanned reports are read and keyed in by hand. The work is slow, repetitive and prone to mistakes.",
      },
    ],
    solutions: [
      {
        title: "Hospital and clinic management software",
        text: "We build and integrate systems covering registration, appointments, billing, pharmacy and laboratory records, shaped around how your staff already work.",
        links: [
          "/services/product-engineering/enterprise-software",
          "/services/product-engineering/web-apps-and-saas",
        ],
      },
      {
        title: "Patient booking, portals and apps",
        text: "We design booking sites, patient portals and mobile apps that let people manage appointments and view reports, and that older or less confident users can follow.",
        links: [
          "/services/product-engineering/web-development",
          "/services/product-engineering/mobile-apps",
          "/services/experience-design/ui-ux-design",
        ],
      },
      {
        title: "Security review and data protection",
        text: "We audit applications and infrastructure, test them for weaknesses and help you put in place the controls your data protection rules require. Which rules apply depends on your jurisdiction, and we work with your compliance adviser on that.",
        links: ["/services/cloud-security/cybersecurity"],
      },
      {
        title: "Document and enquiry automation",
        text: "We automate the reading of forms and reports into your systems, with a person checking anything uncertain. For enquiries, we build assistants limited to administrative questions such as timings and booking. They do not give medical advice.",
        links: [
          "/services/ai-data/automation",
          "/services/ai-data/generative-ai-and-agents",
        ],
      },
    ],
  },
  {
    slug: "retail-ecommerce",
    lead: "Customers move between shop, website, marketplace and phone and expect stock, prices and orders to match everywhere. Retailers need the systems behind those channels to agree with each other.",
    challenges: [
      {
        title: "Stock and orders out of sync",
        text: "When the store, the website and marketplaces each hold their own stock figure, you oversell some products and hide others that are available.",
      },
      {
        title: "Visitors who do not buy",
        text: "Slow pages, unclear product information and a long checkout lose sales you have already paid to attract. The causes are usually specific and measurable.",
      },
      {
        title: "Rising cost of acquiring customers",
        text: "Advertising spend grows while it stays unclear which channels bring profitable orders. Repeat purchase is left to chance.",
      },
      {
        title: "Payments, shipping and tax complexity",
        text: "Each market brings its own payment methods, carriers and invoicing rules. Handling them by hand does not survive growth.",
      },
    ],
    solutions: [
      {
        title: "Online stores and marketplaces",
        text: "We build custom stores, Shopify and WooCommerce stores, and multi-vendor marketplaces, with payment, shipping and tax invoicing integrated for the markets you sell in.",
        links: [
          "/services/product-engineering/ecommerce",
          "/services/product-engineering/fintech-and-payments",
        ],
      },
      {
        title: "Inventory, billing and point of sale",
        text: "We connect or build the back-office systems that keep one stock figure across shops, warehouse and online channels.",
        links: ["/services/product-engineering/enterprise-software"],
      },
      {
        title: "Search, recommendations and analytics",
        text: "We improve on-site search and product recommendations and set up analytics that show where visitors drop out, so changes are based on evidence. How much recommendations help depends on the size of your catalogue and order history.",
        links: [
          "/services/ai-data/machine-learning",
          "/services/ai-data/data-and-analytics",
        ],
      },
      {
        title: "Acquisition and retention marketing",
        text: "We run search optimisation and paid campaigns tied to revenue, and set up email and messaging flows for abandoned baskets, reorders and reviews.",
        links: [
          "/services/growth-marketing/seo",
          "/services/growth-marketing/performance-marketing",
          "/services/growth-marketing/marketing-automation",
        ],
      },
    ],
  },
  {
    slug: "hospitality-travel",
    lead: "Guests compare, book and review on their phones, and much of the booking flow is controlled by third-party platforms. Operators want more direct bookings and smoother operations behind them.",
    challenges: [
      {
        title: "Dependence on booking platforms",
        text: "Online travel agencies bring volume but take commission and own the guest relationship. A weak direct booking experience keeps you dependent on them.",
      },
      {
        title: "Availability and rates across channels",
        text: "Rooms, tables or seats sold through several channels need one source of truth. Without it you get double bookings and manual corrections.",
      },
      {
        title: "Guest questions at all hours",
        text: "Enquiries about availability, check-in, directions and changes arrive day and night, in several languages, while staff are busy with the guests in front of them.",
      },
      {
        title: "Reputation shaped by reviews",
        text: "Ratings on review sites influence bookings directly. Many operators have no routine for requesting, monitoring and answering reviews.",
      },
    ],
    solutions: [
      {
        title: "Direct booking websites",
        text: "We design and build fast, multilingual booking sites with clear availability, pricing and payment, so booking direct is as easy as booking through a platform.",
        links: [
          "/services/product-engineering/web-development",
          "/services/experience-design/ui-ux-design",
        ],
      },
      {
        title: "Hotel and operations software",
        text: "We build and integrate hotel management, point of sale and billing systems, and connect them to the channel managers and payment providers you use.",
        links: [
          "/services/product-engineering/enterprise-software",
          "/services/product-engineering/fintech-and-payments",
        ],
      },
      {
        title: "Guest messaging assistants",
        text: "We set up chat and voice assistants that answer routine questions from your own information and take booking requests, and that hand over to staff when a guest needs a person.",
        links: ["/services/ai-data/generative-ai-and-agents"],
      },
      {
        title: "Search visibility and reputation",
        text: "We work on local search visibility, content and photography, and set up a routine for collecting and responding to reviews.",
        links: [
          "/services/growth-marketing/seo",
          "/services/growth-marketing/social-and-content",
        ],
      },
    ],
  },
  {
    slug: "automotive",
    lead: "Buyers research vehicles, finance and servicing online long before they visit a showroom. Dealers, service networks and suppliers need digital channels that connect to what happens on the floor.",
    challenges: [
      {
        title: "Leads that go cold",
        text: "Enquiries arrive from websites, portals, adverts and phone calls. Without one place to track them, follow-up is slow and nobody knows which source produced a sale.",
      },
      {
        title: "Service booking and workshop scheduling",
        text: "Customers want to book a service slot and know when the vehicle will be ready. Workshops still run on phone calls and paper job cards.",
      },
      {
        title: "Dealers and distributors on separate systems",
        text: "Stock, orders, warranty claims and parts move between manufacturer, distributor and dealer through email and spreadsheets.",
      },
      {
        title: "Showing vehicles online",
        text: "Static photographs and specification tables do little to help a buyer compare variants, colours and options before a visit.",
      },
    ],
    solutions: [
      {
        title: "Lead management and CRM",
        text: "We build or configure CRM systems that capture every enquiry, assign it, track follow-up and report on which sources convert.",
        links: [
          "/services/product-engineering/enterprise-software",
          "/services/growth-marketing/marketing-automation",
        ],
      },
      {
        title: "Dealer and service portals",
        text: "We build portals for dealers to manage stock, orders and claims, and booking systems that let customers schedule servicing and follow progress.",
        links: [
          "/services/product-engineering/web-apps-and-saas",
          "/services/product-engineering/web-development",
        ],
      },
      {
        title: "3D and interactive vehicle presentation",
        text: "We produce 3D visuals, configurators and animated product pages that let buyers explore variants and options in the browser.",
        links: [
          "/services/experience-design/motion-and-3d",
          "/services/product-engineering/emerging-technology",
        ],
      },
      {
        title: "Fleet and connected vehicle software",
        text: "We build tracking, telematics and maintenance scheduling software for fleets, using data from devices fitted to the vehicles.",
        links: [
          "/services/product-engineering/enterprise-software",
          "/services/product-engineering/emerging-technology",
        ],
      },
    ],
  },
  {
    slug: "real-estate",
    lead: "Property search starts online, and buyers and tenants expect accurate listings and quick answers. Developers, brokers and property managers need to handle more enquiries and more paperwork with the same people.",
    challenges: [
      {
        title: "Many enquiries, few serious buyers",
        text: "Portals and adverts generate volume. Sales teams spend most of their time finding out which enquiries are real.",
      },
      {
        title: "Listings that go out of date",
        text: "Availability and prices change daily. When the website, portals and brochures disagree, trust is lost early.",
      },
      {
        title: "Selling property that is not built yet",
        text: "Floor plans and artist impressions leave buyers guessing about space, light and finish.",
      },
      {
        title: "Manual tenancy and payment administration",
        text: "Bookings, instalments, rent, maintenance requests and documents are tracked in spreadsheets and message threads.",
      },
    ],
    solutions: [
      {
        title: "Property websites and listing platforms",
        text: "We build project websites and listing platforms with search, maps and enquiry capture, fed from one inventory source so availability stays current.",
        links: [
          "/services/product-engineering/web-development",
          "/services/product-engineering/web-apps-and-saas",
        ],
      },
      {
        title: "Real estate management and CRM",
        text: "We build systems for inventory, bookings, payment schedules, tenancy and maintenance, with portals for buyers, tenants and channel partners.",
        links: ["/services/product-engineering/enterprise-software"],
      },
      {
        title: "3D walkthroughs and visualisation",
        text: "We produce 3D visuals, animated walkthroughs and virtual tours so buyers can understand a property before it exists.",
        links: [
          "/services/experience-design/motion-and-3d",
          "/services/product-engineering/emerging-technology",
        ],
      },
      {
        title: "Enquiry qualification and local marketing",
        text: "We set up AI assistants that answer first questions and collect budget, location and timing before handing over to sales, alongside local search and paid campaigns.",
        links: [
          "/services/ai-data/generative-ai-and-agents",
          "/services/growth-marketing/seo",
          "/services/growth-marketing/performance-marketing",
        ],
      },
    ],
  },
  {
    slug: "financial-services",
    lead: "Customers expect to open accounts, borrow, pay and invest from a phone, and regulators expect every step to be controlled and recorded. Speed and assurance have to be designed in together.",
    challenges: [
      {
        title: "Regulation that shapes the product",
        text: "Licensing, customer verification, data residency and audit requirements vary by country and by product. They affect architecture, not only policy documents.",
      },
      {
        title: "Onboarding that loses applicants",
        text: "Long forms, document uploads and manual checks cause applicants to give up before they finish.",
      },
      {
        title: "Legacy core systems",
        text: "Older platforms are stable but hard to change and hard to connect to modern channels. Replacing them in one step is risky.",
      },
      {
        title: "Fraud and security pressure",
        text: "Financial applications are constant targets. Weaknesses in authentication, authorisation or integrations have direct monetary consequences.",
      },
    ],
    solutions: [
      {
        title: "Payments, lending and collection platforms",
        text: "We build payment integrations, wallet and bill payment platforms, subscription and invoicing systems, and lending and collection software. You hold the licences and regulatory relationships. We build to the requirements they set.",
        links: ["/services/product-engineering/fintech-and-payments"],
      },
      {
        title: "Customer apps and portals",
        text: "We design and build mobile apps and web portals for onboarding, account servicing and payments, and test them on the devices your customers use.",
        links: [
          "/services/product-engineering/mobile-apps",
          "/services/product-engineering/web-apps-and-saas",
          "/services/experience-design/ui-ux-design",
        ],
      },
      {
        title: "Security testing and secure code review",
        text: "We carry out security audits, penetration tests and code reviews, and help you prepare for the data protection rules that apply to you. Testing reduces risk. It does not remove it, so we also help you plan monitoring and response.",
        links: [
          "/services/cloud-security/cybersecurity",
          "/services/product-engineering/quality-engineering",
        ],
      },
      {
        title: "Document processing and risk models",
        text: "We automate the extraction of data from application documents, with human review for exceptions, and build scoring and anomaly detection models that your risk team can inspect and validate.",
        links: [
          "/services/ai-data/automation",
          "/services/ai-data/machine-learning",
        ],
      },
    ],
  },
  {
    slug: "manufacturing",
    lead: "Manufacturers are connecting planning, production, stock and sales so that decisions rest on current data instead of last month's report. The difficult part is linking the shop floor to the office.",
    challenges: [
      {
        title: "Planning on spreadsheets",
        text: "Orders, materials, production schedules and dispatch are tracked in separate files. Shortages and delays show up late.",
      },
      {
        title: "No live view of the shop floor",
        text: "Machine status, output and downtime are recorded by hand, if they are recorded at all. Problems are analysed after the shift, not during it.",
      },
      {
        title: "Dealers and distributors ordering by phone",
        text: "Orders, price lists, scheme details and payment status travel by call and message. Errors and disputes are common.",
      },
      {
        title: "Quality checks that depend on inspection by eye",
        text: "Manual inspection is slow and inconsistent across shifts, and defects are found after value has been added.",
      },
    ],
    solutions: [
      {
        title: "ERP, inventory and billing",
        text: "We build and implement ERP systems covering purchasing, stock, production planning, dispatch and billing, sized to how your plant runs.",
        links: [
          "/services/product-engineering/enterprise-software",
          "/services/strategy-consulting/digital-transformation",
        ],
      },
      {
        title: "Connected machines and production data",
        text: "We connect machines and sensors to collect output, downtime and condition data, and show it on dashboards that supervisors can act on. What can be collected depends on the age and interfaces of your equipment.",
        links: [
          "/services/product-engineering/emerging-technology",
          "/services/ai-data/data-and-analytics",
        ],
      },
      {
        title: "Dealer and distributor portals",
        text: "We build portals where dealers place orders, see stock and prices, track dispatch and download invoices.",
        links: ["/services/product-engineering/web-apps-and-saas"],
      },
      {
        title: "Computer vision and forecasting",
        text: "We build vision models for defect detection and forecasting models for demand and maintenance. Both need enough labelled or historical data to be reliable, so we assess that before committing to a build.",
        links: ["/services/ai-data/machine-learning"],
      },
    ],
  },
  {
    slug: "agriculture",
    lead: "Farming and the businesses around it are adopting digital tools for advice, inputs, traceability and market access. Those tools must work for users in the field, often on basic phones and weak connections.",
    challenges: [
      {
        title: "Users with limited connectivity",
        text: "Farmers and field staff work where mobile data is patchy and devices are modest. Software built for office conditions fails there.",
      },
      {
        title: "Fragmented supply chains",
        text: "Produce passes through many hands between farm and buyer. Records of origin, quality and price are incomplete or kept on paper.",
      },
      {
        title: "Field data collected by hand",
        text: "Soil, weather, crop and equipment information is gathered irregularly and rarely reaches the people making decisions in time.",
      },
      {
        title: "Reaching growers with timely advice",
        text: "Guidance on inputs, pests and prices needs to arrive in the right language at the right point in the season.",
      },
    ],
    solutions: [
      {
        title: "Mobile apps built for field conditions",
        text: "We build lightweight apps that work offline and sync when a connection returns, with interfaces in the languages your users speak.",
        links: [
          "/services/product-engineering/mobile-apps",
          "/services/experience-design/ui-ux-design",
        ],
      },
      {
        title: "Marketplaces and supply chain platforms",
        text: "We build platforms for selling inputs and produce, with ordering, payments, logistics tracking and traceability records.",
        links: [
          "/services/product-engineering/ecommerce",
          "/services/product-engineering/web-apps-and-saas",
        ],
      },
      {
        title: "Sensors and farm data",
        text: "We connect field sensors, weather feeds and equipment data and present them in dashboards for agronomists and managers.",
        links: [
          "/services/product-engineering/emerging-technology",
          "/services/ai-data/data-and-analytics",
        ],
      },
      {
        title: "Advisory assistants and image analysis",
        text: "We build chat and voice assistants that deliver advice from your agronomy content, and image models that help identify crop problems. Model output is guidance for an expert to confirm, and accuracy depends on local crops and training data.",
        links: [
          "/services/ai-data/generative-ai-and-agents",
          "/services/ai-data/machine-learning",
        ],
      },
    ],
  },
  {
    slug: "public-sector",
    lead: "Citizens and beneficiaries expect services to be available online and usable by everyone. Public bodies and non-profits must provide that within tight budgets and under public scrutiny.",
    challenges: [
      {
        title: "Services that must work for everyone",
        text: "Users vary widely in language, ability, device and confidence with technology. A service that excludes some of them has failed at its purpose.",
      },
      {
        title: "Paper processes and long queues",
        text: "Applications, approvals and records still move on paper between desks. Applicants cannot see where their case stands.",
      },
      {
        title: "Old systems and limited budgets",
        text: "Critical systems run on ageing technology with little documentation. Funding arrives per project, which makes long-term maintenance hard to plan.",
      },
      {
        title: "Accountability for data and money",
        text: "Funders, auditors and the public expect evidence of how money was used and how personal data is protected.",
      },
    ],
    solutions: [
      {
        title: "Accessible websites and service portals",
        text: "We design and build multilingual websites and portals to recognised accessibility standards, and test them with assistive technology.",
        links: [
          "/services/product-engineering/web-development",
          "/services/experience-design/ui-ux-design",
          "/services/product-engineering/quality-engineering",
        ],
      },
      {
        title: "Case, grant and programme management systems",
        text: "We build applications for submissions, approvals, beneficiary records and donor or grant tracking, with status visible to applicants and staff.",
        links: [
          "/services/product-engineering/web-apps-and-saas",
          "/services/ai-data/automation",
        ],
      },
      {
        title: "Audits and modernisation of old software",
        text: "We review existing systems, document what they do and modernise them in stages, so services keep running during the change.",
        links: [
          "/services/strategy-consulting/technology-advisory",
          "/services/product-engineering/web-apps-and-saas",
        ],
      },
      {
        title: "Reporting, security and upkeep",
        text: "We build dashboards for programme and financial reporting, review security and data protection, and provide maintenance plans so a system stays supported after the project funding ends.",
        links: [
          "/services/ai-data/data-and-analytics",
          "/services/cloud-security/cybersecurity",
          "/services/managed-services/maintenance-and-support",
        ],
      },
    ],
  },
  {
    slug: "logistics-transport",
    lead: "Shippers, carriers and warehouses are expected to say where every order is and when it will arrive. That depends on systems that share data across companies, vehicles and countries.",
    challenges: [
      {
        title: "No reliable view of where goods are",
        text: "Status arrives by phone, email and spreadsheets from drivers, partners and warehouses. Customers ask for updates that the team has to chase by hand.",
      },
      {
        title: "Routes and loads planned by experience alone",
        text: "Planners juggle vehicles, drivers, time windows and capacity in their heads or on whiteboards. Empty kilometres and late deliveries are hard to measure, let alone reduce.",
      },
      {
        title: "Paperwork that slows every handover",
        text: "Delivery proofs, invoices, customs documents and claims are still handled on paper or as scanned files. Billing waits for documents, and disputes take weeks to settle.",
      },
      {
        title: "Systems that do not talk to partners",
        text: "Each customer, carrier and marketplace sends orders in its own format. Data is re-keyed between systems, and errors appear at the point of delivery.",
      },
    ],
    solutions: [
      {
        title: "Tracking and customer portals",
        text: "We build shipment tracking with live status from drivers and partners, and portals where customers book, follow and download documents for their orders.",
        links: [
          "/services/product-engineering/web-apps-and-saas",
          "/services/product-engineering/mobile-apps",
        ],
      },
      {
        title: "Transport and warehouse systems",
        text: "We build and integrate systems for orders, dispatch, fleet, warehouse stock and billing, so an order is entered once and followed through to the invoice.",
        links: [
          "/services/product-engineering/enterprise-software",
          "/services/strategy-consulting/digital-transformation",
        ],
      },
      {
        title: "Route planning and demand forecasting",
        text: "We build models that plan routes and loads and forecast volumes, using your own delivery history. We check first that the data is good enough to rely on.",
        links: ["/services/ai-data/machine-learning", "/services/ai-data/data-and-analytics"],
      },
      {
        title: "Document processing and integrations",
        text: "We automate the reading of delivery proofs, invoices and shipping documents, and connect your systems to customers, carriers and marketplaces through APIs and standard data exchange.",
        links: ["/services/ai-data/automation", "/services/cloud-security/cloud"],
      },
    ],
  },
  {
    slug: "startups",
    lead: "A startup has to learn whether customers want the product before the money runs out. Technology decisions in the first year need to favour speed of learning without creating a rebuild later.",
    challenges: [
      {
        title: "Too much scope in the first version",
        text: "Founders see the whole product. A first release that tries to include all of it arrives late and tests nothing clearly.",
      },
      {
        title: "No technical lead in the founding team",
        text: "Without one, choices about architecture, hiring and suppliers are made on trust, and mistakes surface when they are expensive to fix.",
      },
      {
        title: "A prototype that cannot grow",
        text: "Code written to prove an idea often lacks tests, security and structure. It starts to break as users and features are added.",
      },
      {
        title: "Launching without a way to measure",
        text: "Products go live with no analytics and no acquisition plan. Nobody can say whether the product or the marketing is the problem.",
      },
    ],
    solutions: [
      {
        title: "Product discovery and MVP planning",
        text: "We help you define the riskiest assumption, cut the first version down to what tests it, and plan the releases that follow.",
        links: ["/services/strategy-consulting/product-strategy"],
      },
      {
        title: "Design and build of the first product",
        text: "We design, build and release web, SaaS and mobile products, with source code, accounts and documentation in your ownership from the start.",
        links: [
          "/services/experience-design/ui-ux-design",
          "/services/product-engineering/web-apps-and-saas",
          "/services/product-engineering/mobile-apps",
        ],
      },
      {
        title: "A dedicated team as you grow",
        text: "We provide developers, designers and testers who work as your product team, and we review architecture and code when you inherit work from elsewhere.",
        links: [
          "/services/managed-services/dedicated-teams",
          "/services/strategy-consulting/technology-advisory",
        ],
      },
      {
        title: "Release pipeline, analytics and first customers",
        text: "We set up automated releases and cloud hosting, product and marketing analytics, and the first search and paid campaigns, so you can see what is working.",
        links: [
          "/services/cloud-security/devops",
          "/services/ai-data/data-and-analytics",
          "/services/growth-marketing/performance-marketing",
        ],
      },
    ],
  },
];
