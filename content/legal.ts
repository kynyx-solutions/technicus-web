// DRAFT legal texts. Written in plain words as a starting point. They have not
// been reviewed by a lawyer and must be before launch. See docs/CONTENT_TODO.md.

import { contact } from "./company";
import { site } from "./site";

export type LegalDoc = {
  slug: string;
  title: string;
  updated: string;
  sections: { heading: string; paragraphs: string[] }[];
};

const company = site.legalName;

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy policy",
    updated: "2026-11-18",
    sections: [
      {
        heading: "Who we are",
        paragraphs: [
          `This website is run by ${company} ("Technicus", "we"). For any question about your personal data, write to ${contact.email}.`,
        ],
      },
      {
        heading: "What we collect",
        paragraphs: [
          "We collect the details you give us in a form on this site: your name, email address, phone number, company, role, country and the message you write. For job applications we also collect the link you provide to your CV or profile.",
          "With each form we record the page it was sent from and the time. Our servers also see your network address when you send a form; we use it only to limit abuse.",
        ],
      },
      {
        heading: "Why we collect it",
        paragraphs: [
          "We use these details to reply to you, to prepare a proposal if you ask for one, and to consider you for a role if you apply. We collect them with your consent, which you give by ticking the box on the form.",
          "We do not sell your data and we do not use it for advertising.",
        ],
      },
      {
        heading: "Who sees it",
        paragraphs: [
          "Your details are seen by the people at Technicus who handle enquiries and hiring. They are stored with the companies that host this website and our email. We do not share them with anyone else unless the law requires it.",
        ],
      },
      {
        heading: "How long we keep it",
        paragraphs: [
          "We keep enquiry details for as long as we are in contact with you about your enquiry. We keep job applications for as long as the hiring process lasts. You can ask us to delete your details at any time.",
        ],
      },
      {
        heading: "Your rights",
        paragraphs: [
          "You can ask to see the data we hold about you, to have it corrected or deleted, and to withdraw your consent. These rights are set out in laws including India's Digital Personal Data Protection Act 2023 and, for visitors from Europe and the United Kingdom, the GDPR.",
          `To use any of these rights, write to ${contact.email}. If you are not satisfied with our answer, you can complain to the data protection authority in your country.`,
        ],
      },
      {
        heading: "Changes",
        paragraphs: ["If we change this policy, we will publish the new version on this page with a new date."],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of use",
    updated: "2026-11-18",
    sections: [
      {
        heading: "About these terms",
        paragraphs: [
          `These terms cover your use of this website, which is run by ${company}. Work that we do for clients is covered by a separate written contract, not by these terms.`,
        ],
      },
      {
        heading: "Content",
        paragraphs: [
          "The text, design and code of this site belong to Technicus unless stated otherwise. You may read, share and quote it with a link to the source. You may not present it as your own.",
          "Articles on this site are general information. They are not advice for your particular situation.",
        ],
      },
      {
        heading: "Use of the site",
        paragraphs: [
          "Do not try to break, overload or gain unauthorised access to this site, and do not send false or unlawful content through its forms.",
        ],
      },
      {
        heading: "Liability",
        paragraphs: [
          "We work to keep this site accurate and available but do not promise that it always will be. To the extent the law allows, we are not liable for loss arising from your use of the site.",
        ],
      },
      {
        heading: "Law",
        paragraphs: ["These terms are governed by the laws of India."],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie policy",
    updated: "2026-11-18",
    sections: [
      {
        heading: "Cookies on this site",
        paragraphs: [
          "At present this site does not set advertising or analytics cookies and does not track you across other websites.",
          "The site remembers nothing between visits. Security features that protect our forms from abuse may set a strictly necessary cookie.",
        ],
      },
      {
        heading: "If this changes",
        paragraphs: [
          "If we add analytics or any other cookie that is not strictly necessary, we will ask for your consent first and list each cookie on this page.",
        ],
      },
    ],
  },
  {
    slug: "refund",
    title: "Refund policy",
    updated: "2026-11-18",
    sections: [
      {
        heading: "Client projects",
        paragraphs: [
          "Our work for clients is done under a written contract. That contract sets out what is paid, when, and what happens if either side ends the work early. Refunds are handled as that contract states.",
        ],
      },
      {
        heading: "Questions",
        paragraphs: [`If you have a question about a payment you have made to us, write to ${contact.email}.`],
      },
    ],
  },
];

export const getLegalDoc = (slug: string) => legalDocs.find((d) => d.slug === slug);
