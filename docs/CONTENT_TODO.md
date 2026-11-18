# Content to confirm or supply before launch

Date: 18 November 2026

The site is built with real copy, but nothing about Technicus was invented. Where a fact was not known, the page either hides that part or uses text taken from the 2016 site. This list is everything the owners must confirm, correct or supply. While developing (`npm run dev`), each gap is also marked on the page itself with an orange "Needs content" note. Those notes never appear in a production build.

## 1. Facts copied from the old site: confirm each one

File: `content/company.ts`

| Item | Value in use | Question |
|---|---|---|
| Email | info@technicus.in | Still the address for enquiries? |
| Phone | +91 85560 93704 | Still correct? Is it on WhatsApp? The site links to WhatsApp on this number. |
| Head office | Jai Maa Bhagwati Kutir, 8/128, Janta Press Lane, Ganga Sagar Chowk, Madhubani, Bihar 847211 | Still correct? |
| Branch office | Phagwara, Punjab (a university campus address) | Left off the site. Does it still exist? |
| Second phone | +91 98880 55024 | Left off the site. Still in use? |
| Social accounts | X and Facebook links | Still active? |
| LinkedIn | none | Supply the company page address. It is the most important social link for this audience. |
| Legal name | Technicus Infotech LLP | Correct as registered? |
| Main domain | technicusinfotech.com (placeholder) | Which domain is the main one? Set it in `content/site.ts`. |

## 2. Statements about how Technicus works: confirm each is true today

These read as promises to clients. Remove any that is not true; do not soften it.

**Trust page** (`app/about/trust/page.tsx`)
- Access to client systems is given to named people and removed at the end.
- Client code is kept in private repositories, under the client's account where possible.
- Secrets are never stored in source code.
- Development uses sample or anonymised data unless agreed otherwise.
- An NDA is available before details are shared.
- Code, designs and documentation belong to the client by contract.
- Domains, hosting and accounts are registered in the client's name.
- Support terms are agreed in writing before the project starts.

**How we work page** (`content/company.ts` and `app/about/how-we-work/page.tsx`)
- The four method stages, the four engagement models, and the communication and quality lists.
- The five questions and answers, including ownership of work and how changes are handled.

**Service pages** (`content/copy/capabilities-a.ts`, `capabilities-b.ts`). The questions and answers on these 28 pages state policies as fact. The ones to check:
- A warranty period for defect fixes after launch.
- Discovery work and audits quoted at a fixed fee.
- Advertising, cloud and platform accounts always in the client's name; no reselling of hosting.
- Named accounts with multi-factor authentication and a password manager.
- Penetration tests include a retest after fixes.
- Clients may interview dedicated-team members before they start.
- Taking over another supplier's software starts with a paid assessment.
- White-label work runs under non-disclosure and non-solicitation terms.
- Staff "on site or on call" during ERP go-live. On site may not be possible for clients abroad.
- AI tools may help with research and first drafts of content, with a human editor on every piece.
- Round-the-clock support is offered as out-of-hours monitoring and incident response under an agreed service level.

**Contact and thank-you pages**
- "We reply within two working days."

## 3. Capabilities implied by the copy: confirm the team has them

The copy follows the agreed service list, so it says Technicus can do each of these. Check that it can: website copywriting, voice-over and sound for video, 3D modelling, IoT firmware, game art, computer vision, voice assistants, and help preparing for GDPR, ISO 27001 and SOC 2 (the copy does not claim Technicus is certified).

## 4. Technology lists: remove anything the team does not use

- `content/company.ts`, the Technologies page.
- The `technologies` field of each pillar and capability in `content/copy/`.
- Third-party products are named as tools, not as partnerships: for example ERPNext, Odoo, Zoho, Adyen, Braintree, Magento, Unity, Unreal Engine, OpenAI API, Anthropic API, Azure OpenAI and Amazon Bedrock.

## 5. Missing content: supply it

| What | Where | Effect while missing |
|---|---|---|
| Six case studies: client permission, screenshots, the problem, our approach, what was built, outcome numbers, a client quote | `content/work.ts` | Each case study shows only the client's name and a one-line description from the old site. The pictures are generated colour blocks. |
| Client names approved for display | `clientNames` in `content/company.ts` | The moving band on the home page shows the seven service names. |
| Company numbers: founding year, projects, team size, countries | `stats` in `content/company.ts` | The numbers sections are hidden. |
| Client quotes with name, role and company | `quotes` in `content/company.ts` | The quote section is hidden. |
| Leadership team: photo, background, expertise, LinkedIn | `content/people.ts`, with `leader: true` | The Leadership page says profiles are being prepared. Consider removing its links until one profile exists. |
| Named expert for each pillar | `expertFor` in `content/people.ts` | Pages invite visitors to talk to "our team". |
| Article authors | `content/people.ts` | All six articles are signed "Technicus Editorial". |
| Founding year, founders and milestones | `app/about/page.tsx` | The story on the About page is written from what the old site shows. Correct it. |
| Company values | `values` in `content/company.ts` | Four draft values are shown. They are the owners' to decide. |
| Real job openings | `content/careers.ts` | Two example roles exist as drafts. They are visible only while developing and are not in the production site, which says "No openings right now". Set `published: true` to advertise a role. |
| Benefits and working arrangements | `app/careers/page.tsx` | Not stated. |
| Hiring steps | `hiringSteps` in `content/careers.ts` | Four draft steps are shown. Confirm that this is how hiring runs. |
| Partners and certifications | `app/about/trust/page.tsx` | The page says they will be listed once held. |
| Hosting store, bulk SMS and Academy: still offered? | `app/india/page.tsx` | Listed under "Also available" on the India page. |

## 6. Case study descriptions: check the wording

The old site gave only a name and a few words for each client. These one-line descriptions were written from those words and may be wrong in detail:

| Client | Old site said | Site now says |
|---|---|---|
| Sabstore | Ecommerce Solution | An e-commerce platform for an online retailer. |
| DabbaSabba | Customised Tiffin Services | An online ordering service for customised meal delivery. |
| Carbyke | Renting Services | A booking platform for car and bike rental. |
| Paygini | Payment Processing Solution | A payment processing solution. |
| Goal 360 Degree | Educational Institute | A website for an educational institute. |
| Hotel Indraprastha | Hotel | A website for a hotel. |

## 7. Legal pages: review by a lawyer

`content/legal.ts` holds plain-language drafts of the privacy policy, terms of use, cookie policy and refund policy. They have not been reviewed by a lawyer. The privacy policy states how long data is kept and who sees it; make sure that matches practice.

## 8. Articles: review by a subject expert

The six articles in `content/copy/articles.ts` cite no statistics or sources. Three general statements are made without figures; cut them if you want none: that many cloud incidents come from configuration mistakes, that broken access control is one of the most common serious flaws, and that steady workloads can cost more in the cloud. No article covers Growth and Marketing yet.

## 9. Design choices that are placeholders

- The design follows Cuberto, the agreed main reference: white and black, soft mint and lavender cards, muted indigo shapes. The typeface is Inter, standing in for Cuberto's paid typeface. All of it is set in `app/globals.css`, and the brand phase may change it.
- The wordmark is the word "technicus" in lowercase, set in Inter. There is no logo file yet.
- There are no photographs anywhere on the site. Case study and article pictures are generated shapes until real screenshots exist.
- The home page showreel shows only Technicus's own new website on its screens, because no client work is cleared for display. Once case study screenshots are approved, put them on the screens (`scripts/reel/screens.mjs`) and render the video again; see the Showreel section of `README.md`.
