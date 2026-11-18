// Shapes for the written content. Structure (slugs, names, service lists) lives in
// content/services.ts and content/site.ts; the files in this folder add the words.

export type Step = { title: string; text: string };
export type Faq = { q: string; a: string };

export type PillarCopy = {
  /** Must match a pillar slug in content/services.ts. */
  slug: string;
  /** The client problem this pillar solves, as one short statement. Max 12 words. */
  headline: string;
  /** One or two sentences under the headline. */
  lead: string;
  /** Two or three paragraphs: when clients need this and what changes for them. */
  overview: string[];
  /** Exactly four steps describing how work in this pillar runs. */
  approach: Step[];
  /** Technologies and tools used in this pillar. 8 to 14 names. */
  technologies: string[];
};

export type ServiceCopy = {
  /** Two or three sentences on what the service is and who needs it. */
  text: string;
  /** Three or four concrete things the client receives. Short noun phrases. */
  deliverables: string[];
};

export type CapabilityCopy = {
  /** Pillar slug and capability slug, both from content/services.ts. */
  pillar: string;
  slug: string;
  /** The client problem in one sentence. */
  lead: string;
  /** The business case, in one paragraph. No statistics. */
  why: string;
  /**
   * Keyed by the exact service name from content/services.ts. Every service of
   * the capability must have an entry.
   */
  services: Record<string, ServiceCopy>;
  /** 6 to 10 technology or tool names. */
  technologies: string[];
  /** Exactly five questions a buyer would ask, with direct answers. */
  faqs: Faq[];
};

export type IndustryCopy = {
  /** Must match an industry slug in content/site.ts. */
  slug: string;
  /** The main change this industry is facing, in one or two sentences. */
  lead: string;
  /** Exactly four problems clients in this industry bring to a technology partner. */
  challenges: Step[];
  /** Exactly four things we do for this industry. */
  solutions: {
    title: string;
    text: string;
    /** One to three capability paths, e.g. "/services/ai-data/automation". Must exist. */
    links: string[];
  }[];
};

export type ArticleBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  /** One or two sentences. */
  summary: string;
  kind: "Article" | "Guide";
  /** A pillar name from content/services.ts. */
  topic: string;
  /** ISO date. */
  date: string;
  readingMinutes: number;
  /** Author slug from content/people.ts. */
  author: string;
  /** Pillar slugs this article relates to. One or two. */
  related: string[];
  body: ArticleBlock[];
};
