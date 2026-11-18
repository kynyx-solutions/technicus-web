// Open roles.
//
// A role with `published: false` is a draft. Drafts are visible only while
// developing (npm run dev), with a banner, and are never part of a production
// build. Advertising a job that does not exist would be dishonest, so the two
// drafts below stay drafts until the owner confirms the roles, locations and
// details and sets `published: true`.

export type Role = {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  published: boolean;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const roles: Role[] = [
  {
    slug: "senior-frontend-engineer",
    title: "Senior Front-end Engineer",
    team: "Engineering",
    location: "To be confirmed",
    type: "Full-time",
    published: false,
    summary:
      "Build the interfaces of client products with React and TypeScript, working with designers and back-end engineers from the first sketch to production.",
    responsibilities: [
      "Build and maintain web interfaces with React, Next.js and TypeScript.",
      "Work with designers to turn designs and motion into accessible, fast pages.",
      "Review code and help other engineers improve theirs.",
      "Take part in estimating and planning with clients.",
    ],
    requirements: [
      "Strong experience with React and TypeScript in production.",
      "A good eye for layout, type and motion.",
      "Experience with testing and with performance work.",
      "Clear written and spoken English.",
    ],
  },
  {
    slug: "ai-engineer",
    title: "AI Engineer",
    team: "AI and Data",
    location: "To be confirmed",
    type: "Full-time",
    published: false,
    summary:
      "Design and build AI features and agents for client products, from a first prototype to a monitored system in production.",
    responsibilities: [
      "Build applications on large language models, including retrieval and tool use.",
      "Set up evaluation so that quality is measured and not guessed.",
      "Work with client teams on data access, privacy and security.",
      "Explain what a system can and cannot do, in plain words.",
    ],
    requirements: [
      "Strong Python and experience shipping software to production.",
      "Hands-on experience building with large language models.",
      "Good understanding of data handling and privacy.",
      "Clear written and spoken English.",
    ],
  },
];

const dev = process.env.NODE_ENV !== "production";

/** Roles that may be shown: published ones, plus drafts while developing. */
export const visibleRoles = () => roles.filter((r) => r.published || dev);
export const getRole = (slug: string) => visibleRoles().find((r) => r.slug === slug);

// DRAFT: confirm that this is how hiring runs.
export const hiringSteps = [
  { title: "Application", text: "Send your details and a link to your work. We read every application." },
  { title: "Conversation", text: "A call about your experience, what you want to do next and how we work." },
  { title: "Practical exercise", text: "A short piece of work close to the real job, discussed together afterwards." },
  { title: "Offer", text: "A clear offer in writing, and time to decide." },
];
