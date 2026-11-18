# What we need to add to the website

Date: 18 November 2026
For: the Technicus owners and the people who will supply content

The new website is built, tested and on GitHub. Its design, animation, admin dashboard and search optimisation are finished. What it lacks is **real information about Technicus**: proof of work, people, numbers and confirmed facts. The site never invents these. Where something is missing, that part of the page is hidden or shows only what the old site stated.

This report lists everything that must be supplied, why each item matters, the format it is needed in, and where it goes. Items are in order of importance.

---

## How content is added

Most items are entered in the **admin dashboard** at `/admin`. Sign in with the owner email and password. Each section of this report says where its content goes:

- **Admin › …** means the owner can enter it without a developer. It appears on the site as soon as it is saved.
- **Developer** means it is still written in code. Send the content to the developer, who adds it.

Images are uploaded in the admin: PNG, JPG, WebP or SVG, up to 2 MB each.

---

## Summary

| # | What | Why it matters | Where | Priority |
|---|---|---|---|---|
| 1 | Confirm contact details, office and legal name | Wrong details lose enquiries | Admin › Contact & socials | Before launch |
| 2 | Confirm statements about how we work | They are promises to clients | Developer | Before launch |
| 3 | Legal pages reviewed by a lawyer | Legal exposure | Developer | Before launch |
| 4 | Technical setup: database, email, domain, hosting | The site cannot go live without it | Developer, with owner accounts | Before launch |
| 5 | Client logos, with permission | The strongest trust signal on the home page | Admin › Home page | Before launch if possible |
| 6 | Client testimonials, with permission | Social proof; the home section is hidden without them | Admin › Testimonials | Before launch if possible |
| 7 | Six full case studies | The Work pages are thin; they decide most buying decisions | Admin › Case studies | First month |
| 8 | Company numbers | The numbers section is hidden without them | Admin › Home page | First month |
| 9 | Leadership profiles and named experts | Buyers want to know who they will work with | Developer | First month |
| 10 | Real job openings and working conditions | The Careers page says there are no openings | Admin › Job openings | When hiring |
| 11 | Company story, founding year and values | The About page is written from the old site | Developer | First month |
| 12 | Logo file, brand decisions and photography | The wordmark is plain text; there are no photos | Developer | Brand phase |
| 13 | Articles reviewed and new ones written | Search traffic and authority | Admin › Articles | Ongoing |
| 14 | Launch-day search setup | Without it Google cannot index the site | Admin › SEO | Launch day |
| 15 | Confirm services, skills and technologies | The site claims all of them | Developer | Before launch |

---

## 1. Contact details, office and legal name

**Where:** Admin › Contact & socials. The domain alone is set by the developer.

These were copied from the 2016 site and must be checked:

| Item | Value now on the site | What to confirm |
|---|---|---|
| Email | info@technicus.in | Is this still the enquiry address? Is it monitored daily? |
| Phone | +91 85560 93704 | Still correct? |
| WhatsApp | Same number | Is this number on WhatsApp? The site has "WhatsApp us" buttons. |
| Head office | Jai Maa Bhagwati Kutir, 8/128, Janta Press Lane, Ganga Sagar Chowk, Madhubani, Bihar 847211 | Still correct? |
| Branch office | Phagwara, Punjab (left off the site) | Does it still exist? If yes, add it with its address and time zone. |
| Second phone | +91 98880 55024 (left off the site) | Still in use? |
| LinkedIn | None | **Please supply the company page.** It is the most important social link for business clients. |
| X and Facebook | twitter.com/technicusinfo, facebook.com/technicusinfotech | Still active? Remove any that are not. |
| Instagram | None | Add if there is one. |
| Legal name | Technicus Infotech LLP | Exactly as registered? |
| Main domain | technicusinfotech.com (placeholder) | Which domain will the site live on? |

---

## 2. Statements about how Technicus works

**Where:** Developer (send corrections)

The site describes how Technicus works. Clients will read these as promises. Please confirm each one is true today. Remove any that is not; do not soften it.

**Trust page:**
- Access to client systems is given to named people only, and removed at the end of the project.
- Client code is kept in private repositories, under the client's own account where possible.
- Passwords and keys are never stored in source code.
- Development uses sample or anonymised data unless agreed otherwise.
- An NDA is available before any details are shared.
- Code, designs and documentation belong to the client by contract.
- Domains, hosting and accounts are registered in the client's name.
- Support terms are agreed in writing before the project starts.

**How we work page and home page questions:**
- The four stages: Understand, Plan, Build, Run.
- The four engagement models: Fixed scope, Time and materials, Dedicated team, Retainer.
- "A named lead for every engagement", "a weekly or fortnightly review", "working hours arranged to overlap with yours".
- "Code review on every change", "automated tests", "accessibility and performance checked before release".
- "You own the code and designs."
- "We work with clients outside India."

**Service pages:** these policies appear in the questions on the 28 service pages:
- a warranty period for fixing defects after launch
- discovery work and audits quoted at a fixed fee
- advertising, cloud and platform accounts always in the client's name, with no reselling of hosting
- named accounts with two-factor sign-in and a password manager
- penetration tests include a retest after fixes
- clients may interview dedicated-team members before they start
- taking over another supplier's software starts with a paid assessment
- white-label work runs under non-disclosure and non-solicitation terms
- staff on site or on call during an ERP go-live (on site may not be possible abroad)
- AI tools may help with first drafts of content, with a human editor on every piece
- round-the-clock support as out-of-hours monitoring under an agreed service level

**Contact and thank-you pages:**
- "We reply within two working days."
- The four steps under "What happens after you write": someone who does the work reads it, a first call, a written proposal with scope, team, timeline and cost, then the start.

**Added during the search optimisation:** please confirm these too.
- Careers: hiring "usually takes two to three weeks", and candidates hear back "whether or not we move forward".
- Local service pages: "a team based in Madhubani, Bihar, that builds for clients across India and abroad".
- Locations page: visits to an office can be arranged on request.

---

## 3. Legal pages

**Where:** Developer

The privacy policy, terms of use, cookie policy and refund policy are plain-language drafts and **have not been reviewed by a lawyer**. Please have them reviewed. Check in particular that the privacy policy matches practice: what is collected, who sees it and how long it is kept. That includes the CVs now uploaded through the careers form.

Until they are reviewed, these pages are kept out of Google on purpose.

---

## 4. Technical setup before launch

**Where:** Developer, using accounts the owners create

| Item | What is needed from the owners |
|---|---|
| **Database (Supabase)** | Create a Supabase project for Technicus and share access with the developer. Until then, leads and content are only stored on a laptop. |
| **Admin sign-in** | The owner email and a strong password for the admin, set privately on the host. The current demo login is for testing only. |
| **Email alerts (Resend)** | A Resend account and the address that should receive new-lead and new-application emails. The sending domain must be verified, which needs access to the domain's DNS. |
| **Domain and hosting** | Confirm the domain and the hosting provider (Cloudflare was proposed). DNS access is needed to point the domain at the new site. |
| **Old site security** | The leaked certificate key and the database and mail passwords of the old site must be revoked and changed first. The details are in the private notes held by the developer. |
| **PageSpeed key (optional)** | A free Google Cloud API key, so page speed tests are not rate-limited. |

---

## 5. Client logos ("Trusted by")

**Where:** Admin › Home page › Trusted by: client logos

The home page has a logo grid like the reference site's. With more than eight clients, the logos take turns. **It stays hidden until at least one client is added.**

For each client:
- **Written permission** to show their name and logo. This is required.
- Client name, as they want it written.
- Logo file:
  - SVG is best, or PNG with a transparent background.
  - At least 400 px wide, up to 2 MB.
  - A dark or single-colour version works best: logos are shown in grey and take their colour on hover.
- Website address (optional).

Aim for at least 8 logos. Twelve or more makes the rotation work well.

---

## 6. Client testimonials ("Trusted by our clients")

**Where:** Admin › Testimonials

This home page section shows quotes as cards that fly in and land on a pile, like the reference site. **It stays hidden until at least one is published.**

For each testimonial:
- **Written permission** from the person quoted. This is required.
- The quote:
  - about 300 characters fits the card in full
  - in the client's own words, lightly edited only with their approval
- Their full name, role and company.
- The company logo, in the same format as section 5.

Aim for 4 to 8 quotes from different industries and countries.

---

## 7. Case studies

**Where:** Admin › Case studies. First click "Import built-in content" so the six existing ones can be edited.

The six case studies only have what the 2016 site said: a client name and a few words. They are the weakest part of the site, and buyers look at them most.

For each of Sabstore, DabbaSabba, Carbyke, Paygini, Goal 360 Degree and Hotel Indraprastha, please supply:

| Field | What to write |
|---|---|
| Permission | Written agreement from the client to be shown. Without it, remove the case study. |
| One-line summary | What was built, in one sentence. Used as the page headline. |
| What the client does | Their business, in a few words. |
| Country | |
| The problem | What was wrong or missing before. 60 to 150 words. |
| Our approach | How Technicus tackled it. 60 to 150 words. |
| What we built | The product, its main parts and the technology. 60 to 150 words. |
| Outcomes | Up to six results with numbers, e.g. "40% more online orders". Only figures the client agrees to share. |
| Client quote | With name and role. This can be the same as a testimonial. |
| Technologies | The main tools and platforms used. |
| Screenshots | 3 to 6 images of the finished product: desktop and phone, PNG or JPG, at least 1600 px wide. |

Please also check the current one-line descriptions, which were written from very little information:

| Client | Old site said | Site says now |
|---|---|---|
| Sabstore | Ecommerce Solution | An e-commerce platform for an online retailer. |
| DabbaSabba | Customised Tiffin Services | An online ordering service for customised meal delivery. |
| Carbyke | Renting Services | A booking platform for car and bike rental. |
| Paygini | Payment Processing Solution | A payment processing solution. |
| Goal 360 Degree | Educational Institute | A website for an educational institute. |
| Hotel Indraprastha | Hotel | A website for a hotel. |

More case studies are welcome, especially recent work and work for clients outside India.

> **Developer task:** the case study editor has no field for screenshots yet; the pictures are generated shapes. Add an image gallery field before screenshots are supplied. When screenshots arrive, the home page showreel video can also be rendered again with real project screens.

---

## 8. Company numbers

**Where:** Admin › Home page › Numbers

The site shows a numbers section only when real figures exist. Supply up to six, for example:

- year founded, or years in business
- projects delivered
- clients served
- countries served
- team size
- repeat clients, as a percentage

Use only figures you can stand behind if a client asks.

---

## 9. Leadership, experts and authors

**Where:** Developer (not in the admin yet)

The Leadership page says profiles are being prepared and is kept out of Google until it has content. Each service pillar page invites visitors to "talk to our team". With a named expert, it shows that person instead. All articles are signed "Technicus Editorial".

For each leader, pillar expert or author:
- Full name and role.
- Photo:
  - square, at least 800 × 800 px
  - plain or office background
  - the same style for everyone
- Bio of 60 to 120 words: background, experience, what they focus on.
- Three to six areas of expertise.
- LinkedIn profile.
- For experts, which service pillar they cover: Strategy, Design, Engineering, AI and Data, Cloud and Security, Growth, or Managed Services.

> **Developer task, optional:** add a People section to the admin so profiles can be managed without a developer.

---

## 10. Careers

**Where:** Admin › Job openings. Other careers text: Developer.

The site has a careers page and an application form with CV upload. Applications arrive in Admin › Job applications. Today it says "No openings right now"; two example roles exist only in development and are never published.

Needed:
- **Real openings.** For each:
  - title, team, location (office, remote or both) and type (full-time, part-time, contract or internship)
  - a summary
  - what the person will do
  - what you look for
- **Working at Technicus:**
  - benefits
  - working hours
  - office, remote or hybrid
  - locations
  - learning budget, if any
- **Hiring steps.** Confirm the four shown (Application, Conversation, Practical exercise, Offer) and the "two to three weeks" timeframe.

---

## 11. Company story and values

**Where:** Developer

The About page story is written from what the old site shows: Technicus began in Madhubani, building for local businesses, and grew into a consultancy. Please supply:

- founding year and founders
- key milestones (first international client, new services, team growth)
- confirmation or correction of the story text
- company values: four draft values are shown ("Say what is true", "Solve the real problem", "Build to last", "Stay responsible"); they are yours to decide
- partnerships and certifications actually held (for example a cloud partner, or ISO certification); the Trust page lists them once they exist

---

## 12. Brand: logo, look and photography

**Where:** Developer

| Item | Now | Needed |
|---|---|---|
| Logo | The word "technicus" typed in Inter | The real logo as SVG, in a dark version and a light version, plus a square icon for the browser tab and app icons (at least 512 × 512 px) |
| Typeface | Inter, standing in for the reference site's paid font | Confirm Inter, or choose and license a brand typeface |
| Colours | White, black, soft mint and lavender, muted indigo | Confirm or supply brand colours |
| Photography | None; all pictures are generated shapes | Team photos, office and work-in-progress photos, if available. Real photos of real people build trust. |
| Sharing image | A generated image with the headline | Can be replaced with a designed one at 1200 × 630 px |
| Showreel | Rendered from code, showing the site's own pages | Re-render with real project screenshots once case studies are approved |

---

## 13. Articles

**Where:** Admin › Articles. First click "Import built-in content".

There are six articles, on:
- AI agent projects
- building or buying software
- cloud migration
- briefing a design team
- a security checklist
- team models

Needed:
- **Review** each article by a subject expert. They cite no statistics. Three general statements could be cut if you want none:
  - many cloud incidents come from configuration mistakes
  - broken access control is one of the most common serious flaws
  - steady workloads can cost more in the cloud
- **Author names:** move each article to a named expert once profiles exist (section 9).
- **Cover images:** 21:9, at least 2100 × 900 px, one per article.
- **New articles:**
  - Growth and Marketing has none yet
  - one or two a month on topics the target clients search for; Admin › SEO › Keywords lists good topics
  - each article has an SEO tab with a score; aim for 95 or more before publishing

---

## 14. Launch-day search setup

**Where:** Admin › SEO

Every indexable page (78) already scores 95 or more on the built-in SEO check. 103 focus and trending keywords are being tracked. On launch day:

1. **Admin › SEO › Search settings:** switch on "Allow search engines". Until then, every page tells Google not to index it.
2. **Verify ownership:**
   - create the site in Google Search Console and Bing Webmaster Tools
   - paste their verification codes in Search settings
   - submit `sitemap.xml`
3. **Google Business Profile:** create or update it with the same address, phone and website as the site.
4. **Run the SEO health check** (Admin › SEO health) and **page speed tests** (Admin › Page speed) against the live address.
5. **Every month:** enter each tracked keyword's Google position in Admin › SEO › Keywords, and check coverage.
6. **Old site addresses:** the main old URLs already redirect to the new pages, and the six local service pages keep their old addresses. Check in Search Console after launch for any old page still receiving traffic.

---

## 15. Services, skills and technologies to confirm

**Where:** Developer

The site says Technicus can deliver all 7 service areas and 28 services. Please confirm the team can deliver each of these less common ones:

- website copywriting
- voice-over and sound for video
- 3D modelling
- IoT firmware
- game art
- computer vision
- voice assistants
- help preparing for GDPR, ISO 27001 and SOC 2 (the site does not claim certification)

Also check:
- **Technologies page** and each service's list: remove anything the team does not actually use.
- **Third-party products** (ERPNext, Odoo, Zoho, Shopify, Magento, Unity, Unreal Engine, OpenAI, Anthropic, Azure OpenAI, Amazon Bedrock and others) are named as tools we use, not partnerships. Tell us if any is a formal partnership.
- **India page:** are the hosting store, bulk SMS and Academy from the old site still offered?

---

## Checklist

Tick these off as they are supplied.

**Before launch**
- [ ] Contact details, office, legal name and domain confirmed
- [ ] LinkedIn and active social links supplied
- [ ] Statements about how we work confirmed or corrected
- [ ] Legal pages reviewed by a lawyer
- [ ] Supabase, admin login, email alerts, domain and hosting set up
- [ ] Old site keys and passwords revoked and changed
- [ ] Services, skills and technologies confirmed

**Proof (as early as possible)**
- [ ] At least 8 client logos with permission
- [ ] 4 to 8 testimonials with permission
- [ ] Six full case studies, with screenshots and permission
- [ ] Company numbers

**People and story**
- [ ] Leadership profiles and photos
- [ ] Named expert for each service pillar
- [ ] Founding story, milestones and values
- [ ] Partnerships and certifications held

**Brand**
- [ ] Logo files and icon
- [ ] Typeface and colours confirmed
- [ ] Photography

**Careers and articles**
- [ ] Real job openings and working conditions
- [ ] Existing articles reviewed; authors assigned
- [ ] Article cover images
- [ ] A plan for new articles

**Launch day**
- [ ] Search engines allowed
- [ ] Search Console and Bing verified, sitemap submitted
- [ ] Google Business Profile updated
- [ ] SEO health and page speed checked on the live site
