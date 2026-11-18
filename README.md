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
| `app/` | One folder per route. `app/[local]` serves the six local service pages kept from the old site. `app/actions.ts` receives every form. |
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
| `lib/leads.ts` | Form validation, lead storage, notification, rate limit. |
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

## Forms

Every form posts to `submitLead` in `app/actions.ts`, which validates the fields, stores the lead, and redirects to a thank-you page for that form type.

- **Storage:** leads are appended to `.data/leads.jsonl`, one JSON object per line. The folder is not committed. This works on any Node server. On Cloudflare Workers there is no file system: replace `saveLead` in `lib/leads.ts` with an insert into D1.
- **Notification:** set the environment variable `LEAD_WEBHOOK_URL` and each lead is also posted there as JSON, so an email service, a chat channel or a CRM can receive it. Without it, leads are only stored. No email is sent to the visitor yet.
- **Spam:** a hidden field, a minimum time before sending, and five submissions per ten minutes per address. Cloudflare Turnstile is to be added at deployment.

## Not built yet

- Final brand identity, logo and photography.
- Confirmed company content: see `docs/CONTENT_TODO.md`.
- Email to the team and to the visitor, a calendar for booking calls, and CV upload.
- Analytics, the cookie consent banner and structured data for search engines.
- Automated tests and CI.
- Cloudflare deployment, D1 storage and Turnstile.
- Speed and accessibility measurement on real devices.

The root layout sets `robots: noindex`. Remove that at launch.
