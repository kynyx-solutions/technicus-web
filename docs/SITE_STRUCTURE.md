# Technicus website: layout and page structure

Date: 17 November 2026
Status: draft for review. This document defines what pages exist, what is on each page and in what order. It does not define colours, typefaces or final wording; those come from the identity and design work in Phase 3 of `REVAMP_PLAN.md`.

Decisions from the owner that shape this structure:

- The target market is worldwide.
- Technicus presents expertise across all domains and technology stacks. All seven service pillars are shown as equals, and every capability gets its own page at launch.

## 1. Sitemap

About 90 pages at launch. Pages marked (local) are kept for existing Indian search traffic and are linked from the footer only.

```
/                                   Home
/services                           Services overview
  /services/{pillar}                7 pillar pages
  /services/{pillar}/{capability}   28 capability pages
/technologies                       Technology stacks we work with
/industries                         Industries overview
  /industries/{industry}            11 industry pages
/work                               Case study index
  /work/{project}                   Case studies (6 at launch)
/insights                           Articles, guides, reports
  /insights/{article}               Articles (6 at launch)
  /insights/authors/{person}        Author pages
/about                              Company story, purpose, values
  /about/leadership                 Leadership team
  /about/how-we-work                Method and engagement models
  /about/trust                      Security, data protection, partners
  /about/locations                  Offices and time zones
/careers                            Culture, benefits, open roles
  /careers/{role}                   Role pages
/contact                            Consultation, brief, NDA, offices
  /contact/thank-you                Confirmation page (per form type)
/privacy  /terms  /cookies  /refund Legal pages
/india                              Services for local businesses (local)
/web-designing-in-madhubani-bihar           (local, URL kept)
/web-development-in-madhubani-bihar         (local, URL kept)
/app-development-in-bihar                   (local, URL kept)
/graphics-design-in-bihar                   (local, URL kept)
/software-development-in-madhubani-bihar    (local, URL kept)
/digital-marketing                          (local, URL kept)
404                                 Not found
```

## 2. Services: pillars and capability pages

The individual services in the catalogue (section 5 of `REVAMP_PLAN.md`) appear as sections inside these capability pages. Each section has an anchor link, so any single service can be linked to directly.

| Pillar | URL | Capability pages |
|---|---|---|
| Strategy and Consulting | `/services/strategy-consulting` | `digital-transformation`, `product-strategy`, `technology-advisory` |
| Experience Design | `/services/experience-design` | `ui-ux-design`, `brand-identity`, `motion-and-3d`, `design-systems` |
| Product Engineering | `/services/product-engineering` | `web-development`, `ecommerce`, `web-apps-and-saas`, `mobile-apps`, `enterprise-software`, `fintech-and-payments`, `emerging-technology`, `quality-engineering` |
| AI and Data | `/services/ai-data` | `generative-ai-and-agents`, `automation`, `machine-learning`, `data-and-analytics` |
| Cloud and Security | `/services/cloud-security` | `cloud`, `devops`, `cybersecurity` |
| Growth and Marketing | `/services/growth-marketing` | `seo`, `performance-marketing`, `social-and-content`, `marketing-automation` |
| Managed Services and Teams | `/services/managed-services` | `maintenance-and-support`, `dedicated-teams` |

**Industries:** `education`, `healthcare`, `retail-ecommerce`, `hospitality-travel`, `automotive`, `real-estate`, `financial-services`, `manufacturing`, `logistics-transport`, `agriculture`, `public-sector`, `startups`.

**Technologies page:** one page grouping the stacks we work with: front end, back end, mobile, cloud, data, AI, commerce platforms, and testing. Each technology links to the capability pages and case studies where it is used. Individual technology pages can be added after launch.

## 3. Global layout

These parts appear on every page.

**Grid and breakpoints**

| Screen | Width | Columns | Side margin |
|---|---|---|---|
| Phone | under 768 px | 4 | 20 px |
| Tablet | 768 to 1023 px | 8 | 32 px |
| Laptop | 1024 to 1439 px | 12 | 48 px |
| Large | 1440 px and over | 12, content capped at 1440 px | 64 px |

Sections are separated by generous vertical space: about 160 px on a laptop and 80 px on a phone. One idea per section.

**Page shell**

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER   Technicus    Services Industries Work Insights      │
│                       About Careers            [Talk to us]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ 3D CANVAS (fixed, behind the content, shared by all pages)   │
│                                                              │
│   PAGE CONTENT (changes with an animated transition)         │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ CLOSING CALL    "Let's talk about your project" [Talk to us] │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

**Header**

- Left: the Technicus wordmark, linking to Home.
- Centre: Services, Industries, Work, Insights, About, Careers.
- Right: the "Talk to us" button. It is always visible and does not animate away.
- The header is transparent over a page's first section and gains a solid background after scrolling.
- It hides when the visitor scrolls down and returns when they scroll up.
- On a phone: wordmark, "Talk to us", and a menu button that opens a full-screen menu.

**Services menu (laptop)**

Opens on hover or keyboard focus. The pillars are on the left; the panel on the right changes with the selected pillar.

```
┌──────────────────────────────────────────────────────────────┐
│ Strategy and Consulting  ▸ │ Product Engineering             │
│ Experience Design          │ One line on what this covers    │
│ Product Engineering      ● │                                 │
│ AI and Data                │ Web development     Mobile apps │
│ Cloud and Security         │ E-commerce          Enterprise  │
│ Growth and Marketing       │ Web apps and SaaS   Fintech     │
│ Managed Services and Teams │ Emerging technology Quality     │
│                            │                                 │
│ All services →             │ Featured case study  [image] →  │
│ Technologies →             │                                 │
└──────────────────────────────────────────────────────────────┘
```

**Other menus**

- **Industries:** a two-column list of the twelve industries, with a link to the overview.
- **About:** Company, Leadership, How we work, Trust, Locations.
- **Work, Insights, Careers:** direct links with no drop-down.

**Full-screen menu (phone)**

- The six menu items in large type, appearing one after another.
- Services, Industries and About expand in place to show their sub-items.
- At the bottom: "Talk to us", email, phone and LinkedIn.

**Closing call**

A full-width band above the footer on every page except Contact: one line of text and the "Talk to us" button. The line changes by page type, for example "Planning an AI project?" on AI pages.

**Footer**

```
┌──────────────────────────────────────────────────────────────┐
│ Technicus            Services      Industries    Company     │
│ One-line             7 pillars     12 industries About       │
│ description          Technologies                Leadership  │
│                                                  How we work │
│ Email                Insights      Local         Trust       │
│ Phone                Latest 3      India         Careers     │
│ LinkedIn and         articles      Hosting store Contact     │
│ other social                                                 │
├──────────────────────────────────────────────────────────────┤
│ © year, registered company name   Privacy Terms Cookies      │
└──────────────────────────────────────────────────────────────┘
```

**Always-present elements**

- A "skip to content" link for keyboard users.
- The cookie consent banner, shown by region.
- The page transition layer.
- A custom cursor on laptops only.
- Breadcrumbs on every page below the first level.

## 4. Page layouts

Each page is a stack of sections, listed top to bottom. "3D" marks where a scene from `REVAMP_PLAN.md` section 6 appears.

### Home

1. **Hero.** Positioning statement in very large type, one supporting sentence, two buttons: "Talk to us" and "See our work". 3D: hero scene.
2. **Proof bar.** Client names in a moving band, with one or two real numbers.
3. **What we do.** The seven pillars. On a laptop, a pinned section where each pillar takes the screen in turn. 3D: services scene.
4. **Featured work.** Three case studies in a horizontal scroll, each led by its outcome.
5. **Industries.** The twelve industries as a compact grid of links.
6. **How we work.** Four steps, pinned, with a line that draws between them.
7. **Technologies.** A band of the stacks we work with, linking to the Technologies page.
8. **Insights.** The three latest articles.
9. **Client quotes.** One quote at a time, with name, role and company.
10. **Global presence.** Real offices and client countries. 3D: globe scene.
11. **Careers teaser.** One line and a link.
12. Closing call and footer.

### Services overview

1. **Hero.** A headline on what Technicus does as a whole, and one paragraph.
2. **Pillar list.** Seven large rows. Each has the pillar name, one sentence, its capabilities as links, and a hover image or 3D form.
3. **How we engage.** The four engagement models in brief, linking to How we work.
4. **Technologies band.**
5. **Featured work.** Three case studies.
6. Closing call and footer.

### Pillar page

1. **Hero.** Pillar name, a statement of the client problem it solves, and "Talk to us". 3D: that pillar's form from the services scene.
2. **Overview.** Two or three paragraphs: when clients need this and what changes for them.
3. **Capabilities.** A card for each capability page, with one line and a link.
4. **Outcomes.** Three or four results from real projects, each linking to its case study.
5. **Approach.** How work in this pillar runs, in steps.
6. **Technologies.** The stacks used in this pillar.
7. **Related case studies.**
8. **Related insights.**
9. **Expert contact.** A named person for this pillar, with photo and a contact button.
10. Closing call and footer.

### Capability page

1. **Hero.** Capability name, the client problem in one sentence, and "Talk to us".
2. **What we do.** The individual services as sections with anchor links, each with a short description and what is delivered.
3. **Why it matters.** The business case, with a figure where we have one.
4. **How we engage.** Typical ways to start: an audit, a discovery sprint, a fixed-scope build, a dedicated team.
5. **Technologies.**
6. **Proof.** One featured case study and up to two more.
7. **Questions.** Five to eight common questions with answers.
8. **Related capabilities and insights.**
9. **Expert contact.**
10. Closing call and footer.

### Technologies

1. **Hero.** One line on breadth of expertise.
2. **Stack groups.** Front end, back end, mobile, cloud, data, AI, commerce platforms, testing. Each technology shows its name and links to where it is used.
3. **How we choose technology.** A short statement that the choice follows the client's problem.
4. Closing call and footer.

### Industries overview

1. **Hero.**
2. **Industry grid.** Twelve cards with an image, the name and one line.
3. **Featured work across industries.**
4. Closing call and footer.

### Industry page

1. **Hero.** Industry name and the main change that industry is facing.
2. **Challenges.** Three to five problems clients in this industry bring to us.
3. **What we do for this industry.** Solutions, each linking to the relevant capability pages.
4. **Case studies in this industry.**
5. **Insights for this industry.**
6. **Expert contact.**
7. Closing call and footer.

### Work index

1. **Hero.** One line and the filters: by pillar and by industry.
2. **Project grid.** Large project images. 3D: work gallery scene on laptops; a normal grid on phones.
3. Closing call and footer.

### Case study

1. **Hero.** Client name, one-line outcome, a large image.
2. **Facts.** Client, industry, country, services, technologies, duration.
3. **The problem.**
4. **Our approach.**
5. **What we built.** Images and short video loops.
6. **Outcome.** Two to four numbers in large type.
7. **Client quote.** Name, role and company.
8. **Next project.** A full-width link to the next case study.
9. Closing call and footer.

### Insights index

1. **Hero.** One line, with filters by topic and by type (article, guide, report).
2. **Featured article.**
3. **Article list.** Title, summary, author, date, reading time.
4. **Newsletter sign-up.** Only if we commit to sending one.
5. Closing call and footer.

### Article

1. **Header.** Title, summary, author with photo, date, reading time.
2. **Body.** A narrow reading column with quiet motion only. A reading progress bar at the top.
3. **Author box.** Short profile and LinkedIn link.
4. **Related services and case studies.**
5. **More articles.**
6. Closing call and footer.

### About

1. **Hero.** A statement of purpose.
2. **Story.** From the founding in Madhubani to today, as a short timeline.
3. **Values.** Four or five, each with a sentence on what it means in practice.
4. **Numbers.** Real figures only: years, projects, team size, countries served.
5. **Leadership preview.** Linking to the Leadership page.
6. **Global presence.** 3D: globe scene.
7. **Careers teaser.**
8. Closing call and footer.

### Leadership

1. **Hero.**
2. **People grid.** Photo, name, role. Selecting a person opens their profile: background, expertise, articles and LinkedIn.
3. Closing call and footer.

### How we work

1. **Hero.**
2. **Method.** The delivery steps from first conversation to ongoing support.
3. **Engagement models.** Fixed scope, time and materials, dedicated team, retainer: when each fits.
4. **Communication.** Time zone overlap, reporting rhythm, tools, a named point of contact.
5. **Quality.** Testing, code review, accessibility and performance standards.
6. **Questions.**
7. Closing call and footer.

### Trust

1. **Hero.**
2. **Security practices.** How client code and data are handled.
3. **Data protection.** The laws we follow and how to make a request.
4. **Contracts.** NDA, ownership of work, and support terms, in plain words.
5. **Partners and certifications.** Only those we hold.
6. Closing call and footer.

### Locations

1. **Hero.** 3D: globe scene.
2. **Office cards.** Address, phone, local time, and a map link for each real office.
3. **Working across time zones.** The hours we cover.
4. Closing call and footer.

### Careers

1. **Hero.**
2. **Why Technicus.** What working here is like.
3. **Benefits.**
4. **Open roles.** Filter by team and location. If there are none, an open application form.
5. **Hiring steps.**
6. Footer.

### Role page

1. Title, team, location, type of employment.
2. About the role, responsibilities, requirements.
3. Application form with CV upload.
4. Footer.

### Contact

1. **Hero.** One line.
2. **Three ways to start,** side by side:
   - **Book a consultation.** A calendar in the visitor's time zone.
   - **Send a project brief.** Name, work email, company, role, country, service of interest, budget range, timeline, message, consent.
   - **Request an NDA first.**
3. **Direct contact.** Email, phone, WhatsApp, LinkedIn.
4. **Offices.** With local time.
5. Footer. No closing call on this page.

### Legal pages

One narrow reading column with a contents list at the side and the date of last update.

### India page (local)

1. **Hero.** Technicus for businesses in India, with a phone number and a WhatsApp button.
2. **Local services.** Websites, apps, software, design, marketing, domains and hosting, bulk SMS, print design, Academy.
3. **Starting prices,** if the owner decides to show them.
4. **Local client work.**
5. **Short enquiry form.** Name, phone, need.
6. **Offices in India,** with a map.
7. Footer.

### Local service pages (six, URLs kept)

1. Hero with the service name and place.
2. What is included.
3. Local client work.
4. Short enquiry form, phone and WhatsApp.
5. A link to the matching global capability page.
6. Footer.

### Not found

One line, a search of the main sections, and links to Home, Services and Work. 3D: the small 404 scene.

## 5. Reusable sections

Every page above is assembled from this set, so each is designed and built once.

| Section | Used on |
|---|---|
| Hero (large statement, optional scene) | All pages |
| Proof bar | Home, pillar pages |
| Pillar list and capability cards | Home, Services, pillar pages |
| Case study card and row | Home, Services, pillar, capability, industry, Work |
| Outcome numbers | Case study, pillar, About |
| Steps (pinned) | Home, pillar, How we work |
| Technologies band | Home, Services, pillar, capability |
| Insight card and row | Home, pillar, capability, industry, Insights |
| Client quote | Home, case study |
| Expert contact | Pillar, capability, industry |
| Questions and answers | Capability, How we work |
| Globe | Home, About, Locations |
| Forms (consultation, brief, NDA, career, local enquiry) | Contact, role page, local pages |
| Closing call | All pages except Contact |

## 6. Redirects from the old site

| Old URL | New URL |
|---|---|
| `/about-us` | `/about` |
| `/our-work` | `/work` |
| `/career` | `/careers` |
| `/contact-us` | `/contact` |
| `/qoute-request` | `/contact` |
| `/terms-and-condition` | `/terms` |
| `/privacy-policy` | `/privacy` |
| `/refund-policy` | `/refund` |
| `/academy` | `/india` |
| The six local service URLs | No redirect; they stay as local pages |

## 7. What is needed before design starts

1. The owner's approval of this structure, or changes to it.
2. The positioning statement for the Home hero.
3. The list of real offices and client countries for the globe.
4. The names for the Leadership page and the expert contacts.
5. The six case studies chosen for launch.
