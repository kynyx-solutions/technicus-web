# Technicus Infotech website revamp plan

Date: 17 November 2026
Status: draft for review. Nothing in this plan has been built yet.
Revision 4: Technicus is to be established as a global technology consultancy brand, not a local web and app agency. This changes the positioning, the site structure, the content and the timeline. See sections 2, 5 and 7.

## 1. Summary

The current site is a 2016 theme placed on a new Laravel 12 skeleton. The pages load, but the two forms do not work, three pages give errors, and the design, content and SEO are ten years old. It presents Technicus as a local web design shop in Madhubani.

The goal is now larger than a new website: to establish Technicus as a global technology consultancy brand. The website is the main tool for that, but a consultancy brand rests on proof: results for clients, named experts, published thinking and recognised standards. So this plan covers three things together:

1. **Brand:** positioning, message, voice and a refreshed visual identity.
2. **Website:** a fully animated site with several interactive 3D scenes, built on Next.js, with Cuberto as the main design reference.
3. **Proof:** case studies with measured outcomes, leadership profiles, an Insights section, and third-party trust signals.

The work runs in nine phases over about nineteen to twenty-one weeks. The owner has said that time is not the constraint; getting the brand right is.

One item cannot wait: the security review of the old site found problems that must be fixed before anything else. Phase 0 deals with them first. The details are shared with the owners privately and are not in this repository.

## 2. Positioning and goals

**From and to**

| | Today | Target |
|---|---|---|
| What we are | A web and app development agency | A technology consultancy |
| Market | Madhubani, Darbhanga, Bihar | Clients worldwide, delivered from India |
| What we sell | Websites, apps, logos, hosting | Advice and delivery: strategy, design, engineering, AI, cloud, growth |
| Who buys | Local shop, school and showroom owners | Founders, technology heads, product heads and operations leaders |
| How we are chosen | Price and nearness | Expertise, proof of results, and trust |
| Brand name in use | Technicus Infotech | Technicus (the legal name stays in the footer and contracts) |

**What makes a consultancy different from an agency, on a website**

- It leads with the client's problem and the outcome, not with a list of things it can make.
- It shows named people with experience, because clients buy the judgment of experts.
- It publishes its thinking: articles, guides and reports.
- It organises itself by capability and by industry.
- It explains how it works with clients: engagement models, method, security, quality.
- It shows proof from outside: client quotes, review sites, partnerships, certifications.

**The honesty rule**

Nothing on the site is invented. No made-up clients, numbers, offices, awards or certifications. Buyers at this level check, and one false claim destroys the brand faster than anything else can build it. Where proof is thin today, the plan is to build the proof (section 7), not to write around it.

**The proof gap**

This is the largest risk in the whole plan. Today's portfolio is local small-business work: a tiffin service, automobile showrooms, hotels, a gym. That is real and useful, but on its own it does not support "global technology consultancy". Section 7 sets out how to close the gap, and the site launches with the claims the proof can carry at that time.

**What the site must do**

1. **Position.** A visitor understands within one screen that Technicus is a technology consultancy, and for whom.
2. **Prove.** Outcomes, people, thinking and standards are easy to find.
3. **Convert.** Every page leads to a conversation: book a consultation, send a brief, or call.
4. **Keep the local business.** Existing local search traffic and local clients are not lost.

**How we will know it worked**

Measured three, six and twelve months after launch.

| Measure | Today | Target |
|---|---|---|
| Enquiries received through the site | 0 (forms are broken) | Every submission stored and emailed; count tracked monthly |
| Enquiries from outside Bihar, and from outside India | Not tracked | Tracked by country; rising each quarter |
| Qualified enquiries (company, budget and need stated) | Not tracked | Tracked; share of total rising |
| Case studies with a measured outcome | 0 | 6 at launch, 12 within a year |
| Insights articles published | 0 | 6 at launch, then 2 a month |
| Third-party reviews (Clutch, GoodFirms, Google) | Not known | Profiles live at launch; 10 verified reviews within a year |
| Lighthouse mobile performance | Not measured; expected poor | 85 or higher (3D makes 90 hard to hold) |
| Largest Contentful Paint on mobile | Not measured | Under 2.5 seconds |
| Interaction to Next Paint on mobile | Not measured | Under 200 milliseconds |
| Animation smoothness | Not measured | No visible stutter on a mid-range Android phone |
| Lighthouse accessibility | Not measured | 95 or higher |
| Pages with errors | 3 routes, 2 forms | 0 |
| Analytics | None (old Google Analytics was shut down in 2023) | GA4 and Search Console reporting |

## 3. Where we are now

Found by reading the code on 17 November 2026. The site was not run.

**Security**
- The old site has security problems that need fixing at once. The details are kept out of this public repository and have been given to the owners.

**Broken**
- The contact and quote forms post to `MainController`, which does not exist.
- `/terms-and-condition`, `/privacy-policy` and `/refund-policy` point to views that do not exist.
- Image paths are relative (`img/t.png`), so they only work on one-level URLs.

**Out of date**
- Design is a 2016 multipurpose theme: jQuery 1.11, Font Awesome 4, a full-screen loader, a slider with one slide.
- `public/img` holds 373 images (60 MB). About 49 are used. The rest are theme demo files.
- The About page still has placeholder Latin text and skill bars showing "100%".
- Every page has the same keyword-stuffed meta description, with spelling mistakes.
- "Qoute" is misspelled in the URL, the menu and headings.
- The footer shows the email as `info@techicus.in`; the link behind it goes to `info@technicus.in`.
- The copyright year is 2016. Store links use `http://`.
- Career says "No Opening Right Now". Academy and Buy are empty pages.
- Vite and Tailwind 4 are installed but not used. Old Laravel 5 folders remain in `resources/`.
- Only the two default example tests exist.

**Worth keeping**
- Laravel 12, Pest, Vite and Tailwind 4 are already set up.
- Service URLs such as `/web-designing-in-madhubani-bihar` may already rank on Google.
- A real client list: Sabstore, DabbaSabba, Carbyke, Fitness Edge, Goal 360 Degree, Paygini, Stylintellect, Vru Technologies, Earth Lodge Manali, Hotel Indraprastha, Shiv Shakti Wahan, Sinha Auto Sales and others.
- Two offices, two phone numbers and existing social accounts.

## 4. Main decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | Change from Laravel 12 to Next.js with React and TypeScript | We want several interactive 3D scenes. The best 3D tooling for the web, React Three Fiber, is built on React. |
| 3D | Three.js through React Three Fiber and drei | Scenes are written as components, share one canvas, and load only when needed. |
| Animation engine | GSAP with ScrollTrigger and SplitText | The standard for high-end animated sites, free for commercial use including all plugins since 2025. The team already has GSAP experience. |
| Smooth scrolling | Lenis | Small, and works with ScrollTrigger. Turned off for visitors who ask for reduced motion. |
| Page transitions | One 3D canvas that stays mounted across pages, with GSAP animating page content out and in | The 3D scene can move continuously from one page to the next instead of reloading. |
| Styling | Tailwind 4 | Removes Bootstrap 3 and the theme CSS. |
| Content storage | TypeScript and MDX files in the repository for services, industries, case studies and insights | Works while developers publish the content. If non-developers are to publish articles themselves, add a headless CMS; decide in Phase 2. |
| Leads | Saved in a database table (Cloudflare D1) and emailed | An email-only form loses leads when mail fails. |
| Spam control | Cloudflare Turnstile, a honeypot field and rate limiting | We already use Cloudflare. No puzzles for real visitors. |
| Hosting | Cloudflare Workers, using the OpenNext adapter | We already use Cloudflare, and its free plan allows commercial sites. Vercel's free Hobby plan is for personal, non-commercial use only, so a company site would need Vercel Pro. Shared PHP hosting cannot run Next.js. |
| 3D models | Built in code, not in Blender | Shapes, particles, shaders, 3D text and the logo are generated by code. This adds almost no download size and needs no 3D artist. |
| Design | Our own design and identity, not another bought theme | A consultancy that sells design cannot use a stock theme. |
| Language | English at launch | The target audience is international. Hindi for the local pages, or other languages, are added when a market needs them. |
| Brand name | "Technicus" in the logo, menu and copy | "Infotech" reads as a small local IT shop. The registered name stays in the footer and legal pages. |
| Local services | Kept on local pages, out of the main menu | Protects existing rankings and clients without weakening the consultancy message. |

**What the change of stack costs**

- **The Laravel skeleton is replaced.** Little is lost. It contains no working controllers, models or tests of our own, and the Blade views were going to be rewritten in any case.
- **The team needs React and TypeScript as well as GSAP.** Confirmed: the team has this experience.
- **Hosting moves** to Cloudflare Workers. If the free plan's limits are reached, the paid Workers plan is the next step. Check current limits and prices on Cloudflare's pricing page before Phase 4.
- **Some SEO care is needed.** Pages are rendered on the server so that Google receives complete HTML. Animated and 3D parts are added on top in the browser.

The old code stays in git history. The new site is built on a branch in this repository.

**Fallback if the team does not know React**

Stay on Laravel 12 and write the scenes in plain Three.js, with Swup for page transitions. Each scene takes longer to build and the shared canvas needs more hand-written code, but there is no new framework to learn. The rest of this plan stays the same. The team has confirmed React experience, so this fallback is not expected to be used.

## 5. Site structure

**Main menu**

Services, Industries, Work, Insights, About, Careers, and a "Talk to us" button that stays visible.

**Pages**

| Area | Pages | Notes |
|---|---|---|
| Home | `/` | Positioning statement, proof, capabilities, featured work, insights |
| Services | `/services`, one page per pillar, one page per capability | Seven pillars (below). Each page is written around client problems and outcomes. |
| Industries | `/industries`, one page per industry | Twelve industries (below) |
| Work | `/work`, `/work/{project}` | Case studies: problem, approach, outcome. Old `/our-work` redirects with a 301. |
| Insights | `/insights`, `/insights/{article}` | Articles, guides and reports, with author profiles |
| About | `/about` | Story, purpose and values. Old `/about-us` redirects with a 301. |
| Leadership | `/about/leadership` | Named leaders with photo, experience and LinkedIn link |
| How we work | `/about/how-we-work` | Delivery method, engagement models, quality and communication |
| Trust | `/about/trust` | Security practices, data protection, partnerships and certifications that we actually hold |
| Locations | `/about/locations` | Real offices only, with time zones |
| Careers | `/careers`, `/careers/{role}` | Culture, benefits, open roles, open application. Old `/career` redirects. |
| Contact | `/contact` | Book a consultation, send a project brief, request an NDA, office details. Old `/contact-us` and `/qoute-request` redirect. |
| Legal | Privacy, Terms, Cookies, Refund | Written for international visitors (section 7) |
| India and local pages | The six existing service URLs, plus `/india` | See "Local business" below |
| Not found | 404 | Custom page with links back into the site |

**Service pillars**

The 20 categories in the catalogue are grouped into seven pillars. The menu shows pillars; each pillar page lists its capabilities.

| Pillar | Catalogue categories |
|---|---|
| Strategy and Consulting | 1 |
| Experience Design | 2 (digital design, branding, motion) |
| Product Engineering | 3, 4, 5, 6, 7, 10, 13, 16 |
| AI and Data | 8, 9 |
| Cloud and Security | 11 (cloud and DevOps), 12 |
| Growth and Marketing | 15 |
| Managed Services and Teams | 17, 18 |

**Service catalogue**

The owner has confirmed that the team can deliver any of these.

| # | Category | Services |
|---|---|---|
| 1 | Strategy and consulting | IT and digital consulting; product discovery and MVP planning; technology audit; technology partner for startups (a part-time CTO service); digital transformation for traditional businesses |
| 2 | Design | UI/UX design; website design; mobile app design; design systems; branding and logo; graphic and print design; packaging design; illustration and 3D visuals; motion graphics and explainer videos |
| 3 | Websites | Business and corporate websites; landing pages; animated and 3D websites; WordPress and headless CMS sites; website redesign; progressive web apps; booking and appointment sites; multilingual sites (Hindi and regional languages) |
| 4 | E-commerce | Custom online stores; Shopify and WooCommerce stores; multi-vendor marketplaces; payment, shipping and GST invoice integration; Amazon and Flipkart seller account management; store maintenance |
| 5 | Web applications and SaaS | Custom web applications; SaaS product development; customer, dealer and employee portals; dashboards and admin panels; API development and third-party integrations; modernising old software |
| 6 | Mobile apps | Android apps; iOS apps; cross-platform apps (Flutter, React Native); app publishing and app store optimisation; apps for wearables and TV; app maintenance |
| 7 | Business software | ERP; CRM; HR and payroll; billing, inventory and GST; point of sale for shops and restaurants; school and college management (Manageria); hospital and clinic management; hotel management; learning management and online exams; fleet and delivery tracking; real estate management; desktop software |
| 8 | AI and automation | AI chatbots for websites and WhatsApp; voice agents in Hindi and regional languages; AI agents for enquiries, follow-ups and support; workflow and office automation; AI features in existing software; document reading and data entry automation (OCR); custom machine learning models; computer vision; recommendation and search |
| 9 | Data and analytics | Business dashboards and reports; data warehouse and pipelines; website and marketing analytics setup; data migration and clean-up |
| 10 | Fintech and payments | Payment gateway and UPI integration; wallet, recharge and bill payment portals; AEPS and BBPS platforms; subscription and invoicing systems; loan and collection software |
| 11 | Cloud, hosting and DevOps | Domain, hosting, SSL and business email; cloud setup and migration (AWS, Azure, Google Cloud); server management and monitoring; CI/CD and DevOps; backup and disaster recovery; speed optimisation |
| 12 | Cybersecurity | Security audit and penetration testing; hacked website clean-up; data protection compliance (DPDP Act); secure code review; staff security awareness |
| 13 | Emerging technology | Internet of Things solutions; AR and VR experiences; blockchain and smart contracts; game development |
| 14 | Communication tools | WhatsApp Business API setup; bulk SMS and OTP services; IVR and cloud telephony; email infrastructure |
| 15 | Digital marketing | SEO; local SEO and Google Business Profile; social media marketing; Google and Meta ads; content writing; photo and video production; WhatsApp, SMS and email campaigns; influencer marketing; online reputation management; marketing automation; conversion rate improvement |
| 16 | Testing and quality | Manual testing; automated testing; performance and load testing; accessibility testing |
| 17 | Support and maintenance | Website and app maintenance plans; round-the-clock support; speed, security and SEO audits; rescue and takeover of unfinished projects |
| 18 | Teams for other companies | Dedicated developers; team extension; white-label development for agencies; offshore development for overseas clients |
| 19 | Government and institutions | E-governance portals; websites for schools, colleges, NGOs and local bodies; online admission, fee and result systems |
| 20 | Training | Technicus Academy courses; internships; corporate training |

**Industries:** education; healthcare; retail and e-commerce; hospitality and travel; automotive; real estate; financial services; manufacturing; logistics and transport; agriculture; public sector and non-profits (includes category 19); startups.

**Local business services**

Some services suit local small businesses and would weaken a global consultancy message if they sat in the main menu: domain and hosting sales, bulk SMS, visiting cards and print design, marketplace seller account management, and Technicus Academy (categories 14 and 20, and parts of 2, 4 and 11).

These are kept, not removed:

- The six existing service URLs, such as `/web-designing-in-madhubani-bihar`, stay live as local landing pages, so existing Google rankings and local clients are not lost.
- A page at `/india` presents services for local businesses and links to the hosting store over HTTPS if it is still running.
- These pages are linked from the footer, not from the main menu.

**How pages are built**

- Every capability gets its own page at launch (owner's decision). Individual services appear as sections inside their capability page.
- Each service page covers: the client problem, our approach, what is delivered, how we engage, related case studies, related insights, common questions, and a named expert to contact.
- Prices are not listed. Global buyers expect engagement models (fixed scope, time and materials, dedicated team, retainer) and a conversation. The local pages may show starting prices.
- Services, industries, case studies and insights are content files, so adding a page later needs no new code.

The full page list and the layout of every page are in `SITE_STRUCTURE.md`.

**Launch scope:** home, seven pillar pages, all 28 capability pages, a technologies page, twelve industry pages, six case studies, six insights articles, all About pages, careers, contact, legal and the local pages.

**Removed:** `buy` and `welcome`.

**Home page, top to bottom**
1. A positioning statement: what Technicus is and for whom, with two buttons, "Talk to us" and "See our work".
2. A proof bar: client names and one or two real numbers.
3. The seven pillars, each with one line and a link.
4. Three featured case studies, each led by its outcome.
5. Industries.
6. How we work with clients, in four real steps.
7. Latest insights.
8. Client quotes with name, role and company.
9. Where we work: the globe scene with real locations.
10. Careers teaser.
11. A closing call to "Talk to us", with the footer below.

## 6. Design and motion

**Look**

- Works equally on phone and laptop. Decision makers abroad often read on a laptop; visitors in India are mostly on phones on mobile data.
- Calm where people read. Service, case study and insights pages use quieter motion than the home and work pages, so the content is easy to read.
- A bold, confident look: one brand colour and one accent, very large type, generous space. Large type and space are what make motion look good.
- At most two font families, hosted on our own server.
- Real photos of the team, office and client work. No stock images of handshakes.
- SVG icons and illustrations, so they can be drawn and animated.
- Dark mode is optional and low priority.
- Meets WCAG 2.2 level AA: colour contrast, keyboard use, visible focus, alt text, labelled form fields.

The visual identity is refreshed as part of this plan (section 7): wordmark, colours, typefaces and a brand guide.

**Motion**

Every page is animated, but the motion follows one system so the site feels designed and not busy.

| Layer | What the visitor sees | Where |
|---|---|---|
| Intro | A short logo animation, under 1.5 seconds, on the first visit of a session only | Home |
| Page transitions | The old page wipes or fades out and the new one animates in, with no white flash | Every link |
| Smooth scroll | Scrolling eases instead of jumping | Whole site, desktop and capable phones |
| Text reveals | Headlines appear line by line or word by word | Every section heading |
| Scroll reveals | Images, cards and numbers move and fade in as they enter the screen | Every section |
| Pinned sections | The section stays in place while its content changes on scroll | "How we work" steps; featured case studies |
| Parallax | Images move at a different speed from the page | Hero and case study images |
| Horizontal scroll | A row of projects moves sideways as the visitor scrolls down | Work section on Home, desktop only |
| Marquee | Client logos move in a continuous band | Home, About |
| Counters | Numbers count up once | Stats |
| Hover and press | Buttons pull slightly toward the cursor; cards tilt; links underline with a sweep; a custom cursor on desktop | All interactive elements |
| Menu | Full-screen menu opens with staggered links | Mobile and desktop |
| Form feedback | Fields, errors and the success state animate | Consultation and brief forms |
| Drawn SVG | Icons and lines draw themselves | Service icons, process diagram |

**Reference sites**

Three sites set the direction. Each is a reference for one thing only; we do not copy any of them.

| Site | Address | What we take from it | What we do not take |
|---|---|---|---|
| Noomo Agency | noomoagency.com | The 3D level: 3D in almost every section, while services and work stay easy to find. The reference for our five scenes. | Its weight. Our scenes follow the size and frame-rate limits below. |
| Cuberto | cuberto.com | How to present: the services list, project pages, and the cursor and hover effects | Its agency structure. Our structure is that of a consultancy (section 5): industries, insights, leadership and trust pages. |
| 14islands | 14islands.com | The performance bar: light 3D and smooth scroll that stay fast on a phone | Nothing specific |

Chosen by the owner on 17 November 2026.

**Main reference (final): Cuberto.** Confirmed by the owner on 17 November 2026. The page structure, the way services and projects are presented, and the style of motion follow Cuberto. 14islands and Noomo are supporting references only: 14islands for the speed standard, Noomo for the level of 3D. Where either conflicts with the Cuberto direction, Cuberto wins.

**When the references disagree:** Noomo pulls toward more 3D and 14islands pulls toward speed. On a laptop we aim for the Noomo level. On a phone, 14islands wins: any scene that misses the limits below is simplified or replaced by its still image.

The descriptions above are from memory of the sites. The designer should open all three at the start of Phase 3 and confirm they still show what is described here.

**3D scenes**

Five scenes are planned. The final concept for each is chosen in Phase 3, using the reference sites above.

| Scene | Page | What it is | What low-power devices get |
|---|---|---|---|
| Hero | Home | A 3D object or abstract form that reacts to the cursor and to scroll | A still image |
| Services | Home and service pages | One 3D object per service, changing into the next as the visitor scrolls. The same object opens that service's page. | A still image per service |
| Work gallery | Work | Project screenshots on 3D planes that bend and ripple on scroll and hover | A normal image grid |
| Global presence | Home, About and Contact | A 3D globe showing our real offices and the countries of real clients | A flat map image |
| Not found | 404 page | A small playful scene | A still image |

**Rules for 3D**

1. **3D is decoration.** No text, link or button exists only inside a scene. Everything a visitor or Google needs is in the HTML.
2. **Size limit.** Each scene's models and textures total under 1 MB after compression.
3. **Loaded late.** 3D code and models load after the first screen has painted, and only when the scene is near the screen.
4. **Three device levels.** Full 3D on capable devices, a simplified scene on mid-range phones, a still image on low-power devices, on data-saver mode and for reduced motion.
5. **Frame rate.** 60 frames per second on a laptop and at least 30 on the test phone. A scene that cannot reach this is simplified.
6. **Battery.** Rendering stops when the scene is off screen or the tab is in the background.

**Rules that keep it fast and usable**

1. **Content first.** All text is in the HTML and readable before any script runs. If JavaScript fails, the page is still complete. This also keeps Google able to read everything.
2. **Nothing blocks the first screen.** The hero headline is visible immediately; its animation enhances it and never hides it while scripts load.
3. **Only cheap properties.** Animate `transform` and `opacity`. No animating of width, height, top, left or large blurs.
4. **Reduced motion is respected.** Visitors with "reduce motion" set on their device get simple fades, no smooth scroll, no parallax and no pinning.
5. **Phones get a lighter version.** No custom cursor, no magnetic buttons, no horizontal scroll, less parallax. Smooth scroll is turned off on low-power devices.
6. **Short and consistent.** Most animations last 0.4 to 0.9 seconds, with one shared set of easing curves and delays, defined once in code.
7. **Animate once.** A reveal plays the first time a section enters the screen and does not replay on every scroll.
8. **No scroll hijacking.** Pinned sections are short. The visitor always stays in control of the scroll speed.
9. **Video is used sparingly.** Short, muted, compressed loops only, loaded after the page is ready, with a poster image.

## 7. Brand, content and proof

This is the part most likely to delay the launch, and the part that decides whether the positioning is believed. It starts in Phase 1.

**Brand (Phase 1)**

- **Positioning statement:** one sentence saying what Technicus is, for whom, and why it is different. Everything else follows from it.
- **Breadth:** the owner has decided that Technicus presents expertise across all domains and technology stacks, with no narrow focus. All seven pillars are shown as equals. Breadth is believed only when each area shows its own proof, so every pillar needs at least one case study and one named expert.
- **Message set:** a tagline, a 50-word and a 150-word company description, and three proof points.
- **Voice:** plain, expert and direct. No "we love", no exclamation marks, no superlatives without evidence. Written for a technology head and a business leader. One spelling standard, British or American, used everywhere (question 21).
- **Visual identity:** refreshed wordmark reading "Technicus", colour palette, typefaces, icon and illustration style, photo style, and a short brand guide. The same identity is used on LinkedIn, proposals, email signatures and presentations.

**Proof (starts in Phase 1 and continues after launch)**

| Proof | What is needed | Who supplies it |
|---|---|---|
| Case studies | Six at launch. Each has the client, the business problem, our approach, what was built, and an outcome with a number. Client permission in writing. | Owner and project leads |
| Client quotes | Name, role, company and photo; video where possible | Owner |
| Leadership profiles | Photo, background, areas of expertise, LinkedIn | Leadership |
| Insights | Six articles at launch, written or reviewed by a named expert, in the focus areas | Team experts, with editing |
| Review profiles | Clutch and GoodFirms profiles created and verified; clients invited to review | Owner |
| Partnerships | Partner programmes we can honestly join, for example cloud providers and e-commerce platforms | Owner |
| Standards | Decide whether to pursue ISO 27001 or similar. It takes months and is shown only when held. | Owner |
| Company facts | Registration, founding year, team size, real office addresses | Owner |
| LinkedIn | Company page brought in line with the new identity; leaders active | Marketing |

To close the proof gap faster, the first one or two international or larger projects should be planned as case studies from the start, with outcome numbers agreed with the client.

**Content**

- **Service and industry pages:** written around client problems and outcomes (section 5). No keyword stuffing.
- **Case studies:** existing local projects are rewritten honestly in the problem, approach, outcome form. Check that each client site is still live and that we have permission.
- **About:** the true story, including the origin in Madhubani. Building a global firm from Bihar is a strength of the story, not something to hide.
- **Numbers:** replace "4560 hours" and "452 coffee cups" with figures we can stand behind.
- **Careers:** how we work, what we offer, and how to apply. A consultancy competes for talent as much as for clients.
- **Legal:** privacy, terms and cookie pages reviewed by someone qualified. They must cover India's Digital Personal Data Protection Act 2023, and the GDPR and similar laws for visitors from Europe, the UK and the US.
- **Proofreading:** every page checked by a second person. Spelling mistakes cost more on this site than on the old one.

**Requirements for a global audience**

- International phone format, office time zones, and a way to book a call in the visitor's own time zone.
- A cookie consent banner that follows the visitor's region.
- Fast loading on every continent (Cloudflare's network already gives this).
- Contact by form, email and scheduled call for all visitors; WhatsApp is also shown, since it is common in India and the Middle East.
- English at launch. Other languages are added only when a target market needs them.

## 8. Technical plan

**Repository**
- The Next.js app is built on a `revamp` branch in this repository.
- On that branch the Laravel files, the old theme CSS and JavaScript, the fonts and the unused images are removed. Only images that the new pages use are carried over.
- The README is replaced with setup and deploy steps.

**Structure**
- `app/` holds the routes. One root layout contains the header, the footer, smooth scrolling and the 3D canvas.
- `components/` holds interface parts: hero, service card, case study card, testimonial, call-to-action band and form fields.
- `components/three/` holds the 3D scenes, one folder per scene.
- `lib/motion/` holds the motion system: shared easings and durations, and one reusable hook per effect.
- `content/` holds services, industries, case studies, insights, people and locations.
- Pages are server components. Only the animated and interactive parts run in the browser.
- TypeScript in strict mode.

**Animation**
- Effects are reusable components and hooks, for example `<Reveal lines>`, so pages stay free of animation code.
- GSAP's `useGSAP` hook cleans up animations and ScrollTrigger instances when a page changes. Missing this causes memory leaks and broken scroll positions.
- One `matchMedia` setup switches between the desktop, phone and reduced-motion versions.
- GSAP plugins are loaded only on pages that use them.

**3D**
- Scenes are built in code with Claude Code: generated geometry, particles, custom shaders, 3D text, and the logo extruded from its SVG.
- This limits the style to abstract and geometric forms. Realistic objects, characters and product models are not possible this way.
- If one scene needs a real model, we use a free, openly licensed glTF model, or hire a 3D artist for that model only. Such a model is compressed with Draco and KTX2.
- Each scene is a separate chunk, loaded when it comes near the screen, with a still image shown until it is ready.
- A device check at start-up puts each visitor in one of three levels: full 3D, simplified 3D, or still image.
- Rendering pauses when a scene is off screen or the browser tab is hidden.
- All scenes share one canvas and one renderer.

**Forms and leads**
- `leads` table in Cloudflare D1: type (consultation, brief, NDA request, career, local enquiry), name, work email, company, role, country, phone, service of interest, budget range, timeline, message, source page, UTM values, consent, created time.
- A call booking tool on the contact page, showing times in the visitor's time zone.
- Optional: each lead is also sent to a CRM.
- Server actions with schema validation, and clear error messages shown next to each field.
- An email to the team and a confirmation email to the visitor, sent through an SMTP provider.
- Turnstile, a honeypot field and a limit of a few submissions per minute per IP address.
- A thank-you page per form so conversions can be counted.
- Phone and WhatsApp buttons tracked as events.

**Performance**
- Images served as AVIF or WebP in several sizes, lazy-loaded below the first screen, with width and height set.
- Under 150 KB of compressed JavaScript for the first screen. The 3D code, about 200 KB more, loads afterwards as a separate chunk.
- Fonts self-hosted with `font-display: swap`.
- Cloudflare caching for pages and assets.
- Tested on a real mid-range Android phone on a throttled 4G connection, not only on a laptop.

**SEO**
- A unique title and description for every page.
- Canonical tags, Open Graph and Twitter card tags with a share image.
- Structured data: `Organization` for the company, `Service`, `Article` with author, `BreadcrumbList` and `FAQPage`. `LocalBusiness` is used on the local pages only.
- Search targets shift from "web design in Madhubani" to capability and industry terms. The local pages keep the local terms.
- An XML sitemap generated automatically, and a correct `robots.txt`.
- 301 redirects for every changed URL.
- A Google Business Profile for each office, with the same name, address and phone as the site.
- Search Console set up and the sitemap submitted.

**Analytics and consent**
- GA4, loaded only after the visitor agrees.
- A consent banner that follows the visitor's region.
- Events: consultation booked, brief submitted, phone tapped, WhatsApp tapped, article read, case study read. Enquiries are reported by country.

**Security**
- Secrets only in the host's environment settings. No `.env` file in git.
- HTTPS everywhere with HSTS, plus Content-Security-Policy, `X-Content-Type-Options` and `Referrer-Policy` headers.
- Dependency updates checked monthly.

**Quality**
- Playwright tests: every route returns 200, every form validates and stores a lead, redirects work, and a form still submits after an in-site page transition.
- Unit tests for validation and lead storage.
- ESLint and Prettier for code style.
- GitHub Actions running tests and lint on every pull request.
- A preview deployment for every pull request, for review before each release.
- Work on branches with pull requests and clear commit messages.

## 9. Phases

Durations are estimates. They assume one developer with GSAP and React experience, one designer, 3D scenes written in code with Claude Code, and brand and content input from the owners on time.

| Phase | Work | Time | Done when |
|---|---|---|---|
| 0. Emergency fixes | Fix the security problems found on the old site (details shared privately with the owners). | 1 day | Every item on the private list is done |
| 1. Brand and positioning | Answer the open questions in section 10. Positioning statement, focus areas, message set, voice. Start collecting proof: case study material, leadership profiles, review profiles. | 2 weeks; proof work continues | Positioning and focus areas signed off by the owners |
| 2. Structure and content plan | Final page list and menu. Which capabilities get their own page. Content outline for every page. Case study and insights writing begins. | 2 weeks; writing continues | Page list signed off; six case studies and six articles in progress |
| 3. Identity, design, motion and 3D direction | Visual identity and brand guide. Mobile and desktop designs for home, a pillar page, a capability page, an industry page, work, a case study, an article, about and contact. Motion storyboard. A concept for each 3D scene. A working prototype of the home hero scene with one page transition, tried on a phone. | 3.5 weeks | Identity, designs, scene concepts and prototype approved |
| 4. Foundation | Next.js app, layout, Tailwind, hosting, preview deployments and CI. Motion system. Shared 3D canvas with the three device levels. Content file structure for services, industries, case studies and insights. | 1.5 weeks | Empty pages render with working transitions, smooth scroll and a test scene; CI passes |
| 5. Pages and forms | Build about 90 pages from shared templates (see `SITE_STRUCTURE.md`) with final content and basic reveals. Leads table, consultation and brief forms, call booking, emails, spam control. Redirects and local pages. | 4 weeks | All launch pages complete on staging; test leads arrive |
| 6. 3D scenes | Build the five scenes in section 6 in code, each with its simplified version and still image. | 2 to 3 weeks | Every scene runs on desktop and on the test phone within the limits in section 6 |
| 7. Motion build | Intro, pinned sections, horizontal scroll, parallax, hover effects, menu, drawn SVGs, form feedback. Tuning of timing across the site. | 2 weeks | Every item in the motion table works on desktop, phone and reduced motion |
| 8. SEO, speed, QA | Meta tags, structured data, sitemap, redirects, image optimisation, accessibility checks, real-device testing of animation and 3D, legal review, proofreading. | 2 weeks | Targets in section 2 met on staging |
| 9. Launch | Deploy, check redirects, submit sitemap, update LinkedIn, review profiles and Google Business Profiles to the new identity, watch errors and leads for two weeks. | 3 days plus monitoring | Live site error-free; first real enquiry received |

Run one after another, the phases take about nineteen to twenty-one weeks. Phases 6 and 7 can overlap with Phase 5 if a second developer is available, which saves about three weeks.

**After launch, ongoing**

- Two Insights articles a month, and a new case study each quarter.
- Reviews collected on Clutch, GoodFirms and Google.
- Individual capability pages added as proof arrives.
- A yearly report or guide in one focus area.
- A simple page for managing leads, or a connection to a CRM.
- A quarterly review of the numbers in section 2.

## 10. Open questions

These need answers from the owners before Phase 3 starts.

1. Is the site live now, and on which domain: `technicusinfotech.com` or `technicus.in`? Which is the main one?
2. Where is it hosted, and who has access to the server and to Cloudflare?
3. Is `store.technicusinfotech.com` still in business?
4. Is Technicus Academy a real offering? If yes, it needs course content. If no, the page is removed.
5. Are both offices (Madhubani and Phagwara) still open? Are both phone numbers current?
6. Which email address should receive leads?
7. Which clients have agreed to appear as case studies?
8. Do we show prices, price ranges, or "on request"?
9. Do we have the logo in vector format?
10. Is there a budget for photography?
11. Do we want 3D or WebGL scenes? **Answered: several.** This is why the stack changes to Next.js.
12. Which three animated websites do we like most? **Answered: 14islands, Noomo Agency and Cuberto (see "Reference sites" in section 6).**
13. Who does the motion work? **Answered: someone on the team with GSAP experience.**
14. Does anyone on the team know React and TypeScript? **Answered: yes.**
15. Who makes the 3D models? **Answered: built in code with Claude Code. No Blender work is planned (see "3D" in section 8).**
16. Where is the new site hosted? **Proposed: Cloudflare Workers. Vercel's free Hobby plan cannot be used for a company site. Waiting for the owner to confirm.**

Questions raised by the global consultancy goal:

17. Which countries or regions do we target first? **Answered: worldwide, with no priority region.**
18. Which two or three focus areas do we want to be known for first? **Answered: none singled out. Technicus presents expertise in all domains, with experts in every technology stack. All seven pillars are shown as equals.**
19. Is the brand name in use "Technicus" alone? Which domain is the main one for a global audience?
20. Who are the named leaders on the site, and will they publish under their own names?
21. British or American spelling?
22. Which current clients can give a named quote and an outcome number?
23. Do we have any international clients or projects today that can be shown?
24. Do we pursue ISO 27001 or a similar standard, and which partner programmes do we join?
25. Do we add one consultancy site as a second reference, for structure only? Proposed: Thoughtworks (thoughtworks.com), for how it presents insights, industries and expertise.
26. Who writes and edits the Insights articles, and will non-developers need to publish them?

## 11. Risks

| Risk | Effect | How we handle it |
|---|---|---|
| Content arrives late | Launch slips | Start in Phase 1; launch with six case studies and six articles and add more later |
| Rankings drop after launch | Fewer visitors | Keep ranking URLs; 301 redirects; watch Search Console for a month |
| The old site's security problems are exploited before they are fixed | Data or traffic could be exposed | Fix in Phase 0, before anything else |
| Old client sites are offline | Weak portfolio | Check each one; use screenshots and a written case study where the site is gone |
| The claim "global consultancy" is larger than the proof | Buyers do not believe it and leave | The honesty rule in section 2; build proof from Phase 1; launch with the claims the proof supports and strengthen them as proof arrives |
| Breadth without depth: 28 capability pages and little proof on some | We look like a generalist vendor competing on price | A case study and a named expert for every pillar; capability pages without proof are written carefully and strengthened first after launch |
| Local rankings and local clients are lost | Present income falls before new income arrives | Local pages kept on their existing URLs; 301 redirects; Search Console watched for three months |
| Leaders have no time for profiles and articles | No Insights, weak proof | Agree time in Phase 1; interview experts and have an editor write from the interview |
| Insights stops after launch | The section looks abandoned, which is worse than none | A fixed publishing rhythm with a named owner; show dates only if we keep it up |
| Scope grows further (more languages, client portal) | Launch slips | Keep these in "after launch" or out of scope |
| Animation makes the site slow on phones | Visitors leave before the page shows; lower Google ranking | The rules in section 6; lighter phone version; real-device testing in Phase 8; the speed targets in section 2 decide what ships |
| 3D is too heavy for phones on mobile data | Most of our local visitors get a slow or hot phone | The rules for 3D in section 6; three device levels; a still image is always ready |
| 3D scenes take longer than planned | Launch slips | Fix the five scene concepts in Phase 3; launch with the hero and work gallery if the others are late |
| Code-built 3D looks too abstract next to the Noomo reference | The site falls short of the look we want | Decide in the Phase 3 prototype; bring in a 3D artist for one or two models if needed |
| Next.js on Cloudflare Workers hits a limit or an unsupported feature | Extra setup time | Prove the deployment in Phase 4 with a form and a test scene; Vercel Pro is the fallback |
| Animation distracts from the message | Fewer enquiries despite a nicer site | One motion system; "Talk to us" stays visible and static in the header; compare enquiry numbers after launch |
| Motion tuning never ends | Launch slips | The motion table in section 6 is the fixed list; new ideas go to "after launch" |
| Page transitions break scripts | Forms, analytics or animations fail after navigating | Tests that submit a form after an in-site navigation; a checklist per page in Phase 8 |

## 12. Out of scope

- Changing the legal company name. The brand name in use becomes "Technicus"; the registered name is unchanged.
- Opening offices or registering companies in other countries.
- Obtaining certifications. The plan only records the decision and shows them once held.
- Rebuilding the domain and hosting store.
- An online payment or checkout flow.
- A client login area.
- Paid advertising and outbound sales. The site supports them but this plan does not run them.
