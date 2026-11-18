# Technicus website

The new Technicus website, a technology consultancy site with scroll animation, 3D and a showreel rendered from code.

Next.js 16, React 19, TypeScript, Tailwind 4, GSAP, Lenis and Three.js (through React Three Fiber).

## Run it

Requires Node.js 20 or later.

```bash
npm install
npm run dev      # http://localhost:3000, with "Needs content" notes and draft roles visible
npm run build    # production build
npm run start    # serve the production build
npm run lint
```

## Where things are

| Path | Holds |
|---|---|
| `app/(site)/` | The public pages, one folder per route. `[local]` serves the six local service pages kept from the old site. |
| `app/admin/` | The admin dashboard (see below). |
| `app/actions.ts` | Receives every public form, including job applications with a CV. |
| `components/ui.tsx` | The page sections every page is assembled from: hero, section, intro, stacked service cards, work grid, cards, steps, questions, closing call. |
| `components/art.tsx` | The layered abstract shapes, one per service pillar. |
| `components/header.tsx`, `footer.tsx` | Menus and footer. |
| `components/motion/` | Smooth scroll, the page transition and scroll animations, the cursor. |
| `components/three/` | The 3D panels: a particle system that takes a different shape on each page. |
| `components/forms/` | The lead form and the three-way contact form. |
| `content/services.ts` | The seven pillars, 28 capabilities and their services. Menus, pages and the sitemap are generated from it. |
| `content/copy/` | The written copy for pillars, capabilities, industries and articles. |
| `content/company.ts` | Contact details, offices, method, engagement models, technologies. |
| `content/work.ts`, `people.ts`, `careers.ts`, `legal.ts` | Case studies, authors and leaders, roles, legal texts. |
| `lib/leads.ts` | Form validation, lead and application storage, email or webhook alerts, rate limit. |
| `lib/db/` | The data store: Supabase, or local files in `.data/` for development. |
| `lib/cms.ts` | What the public pages read: admin content, falling back to `content/`. |
| `lib/auth.ts`, `proxy.ts` | Admin sign-in. |
| `supabase/migrations/` | The database tables, to run once in Supabase. |
| `next.config.ts` | Redirects from old-site URLs. |
| `docs/` | `REVAMP_PLAN.md`, `SITE_STRUCTURE.md`, and `CONTENT_TODO.md` (what the owners must confirm or supply). |

## Adding content

- A capability or pillar: add it to `content/services.ts`, and its copy to `content/copy/`.
- A case study: `content/work.ts`. An article: `content/copy/articles.ts`.
- A person (author, leader or pillar expert): `content/people.ts`.
- A job: `content/careers.ts`. A role with `published: false` is a draft, visible only with `npm run dev`.
- An office: `content/company.ts`. It appears on the Locations page and as a marker on the globe.

## Animation

Pages are plain server-rendered HTML. They opt in to effects with data attributes, which `components/motion/page-motion.tsx` reads on every page view:

| Attribute | Effect |
|---|---|
| `data-split` | Headline revealed line by line |
| `data-reveal` | Block fades and rises in |
| `data-parallax="0.15"` | Moves slower or faster than the page |
| `data-count="120"` | Number counts up once |
| `data-magnetic` | Pulls toward the cursor, laptops only |
| `data-hscroll` with `data-track` inside | Sideways scroll while pinned, laptops only |
| `data-stack-card` | Shrinks a little as the next stacked card slides over it |

Visitors who ask for reduced motion get the content with no animation and still pictures instead of 3D. All text is in the HTML and is visible if scripts fail.

## Design

The visual direction follows the main reference, Cuberto (see `docs/REVAMP_PLAN.md`): white and black, Inter at medium weight in place of Cuberto's paid typeface, sections that slide over each other with rounded corners, service cards that stack while scrolling, a two-column work grid, soft mint and lavender cards, and muted indigo only in abstract shapes. Colours and type are set in `app/globals.css`.

## 3D

3D appears inside rounded dark panels, the way Cuberto places video: each service pillar page (that pillar's shape), the work page (frames), About, Locations and Contact (a globe with office markers) and the 404 page. Each panel is a `SceneBox` (`components/three/scene-box.tsx`) with about 11,000 points (3,800 on phones) moving between shapes generated in `components/three/shapes.ts`. The 3D code downloads only when a panel comes near the screen and stops rendering when it leaves. Low-power devices, data saver and reduced motion see the layered shape instead.

## Showreel

The home page hero plays a 12-second showreel in the style of Cuberto's: four shots of the site's own pages on devices that were modelled in code (a laptop and phone over night dunes, a sphere that breaks open over the home page, a wall of pages, a monitor in a blue room). The video is rendered from Three.js, not filmed or bought, so it can be changed and rendered again at any time.

| Path | Holds |
|---|---|
| `components/reel/` | The scenes (`shots.ts`), device models (`models.ts`) and the frame renderer (`reel.ts`). |
| `app/studio/reel` | A page that plays the reel live, at http://localhost:3000/studio/reel. It exists only in development. |
| `scripts/reel/` | `screens.mjs` takes the screenshots shown on the screens; `render.mjs` renders and encodes the video. |
| `public/showreel/` | The output: `reel-1080.mp4`, `reel-720.mp4` (phones) and `poster.jpg`. |

To make it again after changing the site or the scenes (needs ffmpeg):

```bash
npm run build && npm run start -- -p 3987               # production server, so no development notes appear
BASE=http://localhost:3987 npm run reel:screens          # in another terminal
npm run dev                                              # then stop the production server and start the dev server
npm run reel:render                                      # about a minute on a laptop with a graphics chip
```

Each frame is the average of 24 sub-frames, which gives motion blur and smooth edges. The screenshots (`public/_reel`) and frames (`.reel`) are working files and are not committed.

## Admin dashboard

At `/admin`, modelled on the Kynyx admin and styled like the site. One owner account.

| Section | What it does |
|---|---|
| Dashboard | Leads and applications over 7 to 180 days, pipeline, requested services, budgets, latest leads, state of the content. |
| Leads | Every form submission. Search and filters kept in the address, status and priority, private notes with an automatic log of changes, bulk status and delete, CSV export, reply by email or WhatsApp, earlier enquiries from the same person. |
| Job applications | Applications from the careers page with their CV (PDF or Word, up to 4 MB, checked by content, stored privately). Status, notes, download, call, WhatsApp. |
| Home page | All the words on the home page: hero, introductions, section titles, client names, numbers, questions, closing call. |
| Articles, Case studies, Job openings, Testimonials | Create, edit, hide, reorder and delete. Articles have a text editor; every item except testimonials has an SEO tab with a score. "Import built-in content" copies what is written in `content/` into the admin so it can be edited. |
| Contact & socials | Email, phone, WhatsApp, social links and offices, used across the site. |
| SEO health | Fetches every public page and scores it: title, description, main heading, length, keyword use, images, duplicates. |
| Titles & descriptions | Search title, description, focus keyword, sharing image and noindex for each fixed page, with a Google preview and live score. |
| Keywords | Searches to rank for, each tied to a page; a coverage check against that page; suggested keywords from the services; ideas from Google's search suggestions. |
| Page speed | Google PageSpeed Insights for the main pages, kept so changes can be compared. Works once the site is public. |
| Search settings | The launch switch that lets search engines in (off until then: every page is noindex and robots.txt blocks crawlers), AI crawlers, verification codes, the llms.txt summary, and a check of robots.txt, sitemap.xml and llms.txt. |
| Settings | The account and the state of each connection. |

Changes go live straight away: saving refreshes the cached content and the public pages, so there is no publish step. Articles, case studies and openings created after a build are rendered on their first visit.

**Images.** Client logos, testimonial logos and article covers can be uploaded in the admin (PNG, JPG, WebP or SVG, up to 2 MB, checked by content). They are stored with the other data (Supabase bucket `media`, or `.data/files/media`) and served at `/media/...`; SVG files are served with a policy that stops scripts in them from running.

**Home page sections.** "Trusted by" shows the client logos from Admin > Home page; with more than eight, the logos take turns. "Trusted by our clients" shows the testimonials: on larger screens the section holds still while the cards fly in and land on a pile, and they can then be picked up and thrown; on phones they are a row to swipe. Both sections stay hidden until they have content.

**On-page SEO.** Every indexable page has a focus keyword, a search title (30 to 60 characters), a description (120 to 158) and the keyword in its opening and in one section heading, set in `content/seo.ts`. The admin's settings override it per page. Placeholder and legal pages (`noindexPaths` in the same file) are kept out of search and the sitemap on purpose, and SEO health lists them separately. Every page shares a generated image (`/og-image`) unless one is set. The keyword tracker's suggestions are each page's focus keyword plus rising searches (`trendingKeywords`).

`DATA_DIR` moves the local data folder, for example to test without touching your own data.

**Content source.** For each kind of content, the site shows what is in the admin as soon as the admin has at least one item of that kind; until then it shows the content written in `content/`. Services, industries and the legal pages are still edited in code.

**Setting it up.** Copy `.env.example` to `.env.local` (development) or set the same variables on the host:

1. `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `AUTH_SECRET` (`openssl rand -base64 48`). Without them the sign-in page explains what is missing.
2. Create a Supabase project, run `supabase/migrations/20261118000000_admin.sql` in its SQL editor, and set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The key stays on the server; the browser never talks to Supabase. Without these, data is kept in `.data/` on the computer, which is for development only.
3. Optional: `RESEND_API_KEY`, `NOTIFY_EMAIL` and `MAIL_FROM` for an email on every lead and application; `LEAD_WEBHOOK_URL`; `SITE_URL`; `PAGESPEED_API_KEY`.

The admin needs a Node.js server (it uses Node's crypto and, without Supabase, its file system). It is not indexed: every admin page sends noindex and robots.txt disallows `/admin`.

## Forms

Enquiry forms post to `submitLead` and the careers form to `submitApplication`, both in `app/actions.ts`. They validate the fields, store the submission, alert the team and redirect to a thank-you page.

- **Storage:** leads and applications go to the admin's store (Supabase, or `.data/` in development) and appear under Leads and Job applications.
- **Notification:** an email through Resend and/or a JSON post to `LEAD_WEBHOOK_URL`, as configured. No email is sent to the visitor yet.
- **Spam:** a hidden field, a minimum time before sending, and five submissions per ten minutes per address. Cloudflare Turnstile is to be added at deployment.

## Not built yet

- Final brand identity, logo and photography.
- Confirmed company content: see `docs/CONTENT_TODO.md`.
- Email to the visitor and a calendar for booking calls.
- Analytics, the cookie consent banner and structured data for search engines.
- Automated tests and CI.
- Deployment, and Cloudflare Turnstile on the forms.
- Speed and accessibility measurement on real devices.

Search engines are kept out until "Allow search engines" is switched on in Admin > SEO > Search settings. Do that at launch.
