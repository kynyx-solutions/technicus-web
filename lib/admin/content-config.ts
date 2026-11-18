// The editable content types and their fields. The admin editor draws its form
// from this, and the server validates against it (lib/admin/content-schema.ts).
// Shared by server and browser code, so it must not import server-only modules.
import { pillars } from "@/content/services";
import { industries } from "@/content/site";
import { people } from "@/content/people";
import type { ContentType } from "@/lib/db/types";

export type FieldDef =
  | { name: string; label: string; kind: "text" | "textarea" | "url" | "date"; required?: boolean; max?: number; hint?: string; half?: boolean }
  | { name: string; label: string; kind: "number"; required?: boolean; half?: boolean; hint?: string }
  | { name: string; label: string; kind: "select"; options: { value: string; label: string }[]; required?: boolean; half?: boolean; hint?: string }
  | { name: string; label: string; kind: "multi"; options: { value: string; label: string }[]; hint?: string }
  | { name: string; label: string; kind: "tags" | "lines"; hint?: string; max?: number }
  | { name: string; label: string; kind: "richtext"; hint?: string }
  | { name: string; label: string; kind: "image"; shape?: "logo" | "cover"; hint?: string; half?: boolean }
  | { name: string; label: string; kind: "rows"; fields: { name: string; label: string }[]; hint?: string; max?: number };

export type TypeConfig = {
  type: ContentType;
  title: string;
  singular: string;
  /** Field shown as the item's name in lists. */
  titleField: string;
  /** Second line in lists. */
  subtitle?: (d: Record<string, unknown>) => string;
  /** The public page of an item, if it has one. */
  publicPath?: (slug: string) => string;
  /** Slug made automatically from these fields when there is no slug field. */
  autoSlug?: string[];
  seo: boolean;
  /** Field holding the main text, for the SEO checks. */
  bodyField?: string;
  fields: FieldDef[];
  intro: string;
};

const pillarOptions = pillars.map((p) => ({ value: p.slug, label: p.name }));

export const contentConfig: Record<ContentType, TypeConfig> = {
  articles: {
    type: "articles",
    title: "Articles",
    singular: "article",
    titleField: "title",
    subtitle: (d) => [d.kind, d.topic, d.date].filter(Boolean).join(" · "),
    publicPath: (slug) => `/insights/${slug}`,
    seo: true,
    bodyField: "html",
    intro: "Articles and guides on the Insights pages. The newest appears first on the site.",
    fields: [
      { name: "title", label: "Title", kind: "text", required: true, max: 160 },
      { name: "summary", label: "Summary", kind: "textarea", required: true, max: 400, hint: "One or two sentences. Shown on cards and under the title." },
      { name: "kind", label: "Kind", kind: "select", options: ["Article", "Guide"].map((v) => ({ value: v, label: v })), required: true, half: true },
      { name: "topic", label: "Topic", kind: "select", options: pillars.map((p) => ({ value: p.name, label: p.name })), required: true, half: true },
      { name: "date", label: "Publish date", kind: "date", required: true, half: true },
      { name: "readingMinutes", label: "Reading time (minutes)", kind: "number", half: true, hint: "Leave empty to work it out from the text." },
      { name: "author", label: "Author", kind: "select", options: people.map((p) => ({ value: p.slug, label: p.name })), required: true, half: true },
      { name: "coverImage", label: "Cover image", kind: "image", shape: "cover", half: true, hint: "Wide, about 21:9. Shown on cards and at the top of the article." },
      { name: "related", label: "Related services", kind: "multi", options: pillarOptions, hint: "Shown at the end of the article. One or two." },
      { name: "html", label: "Text", kind: "richtext" },
    ],
  },
  projects: {
    type: "projects",
    title: "Case studies",
    singular: "case study",
    titleField: "client",
    subtitle: (d) => [d.industry, d.country].filter(Boolean).join(" · "),
    publicPath: (slug) => `/work/${slug}`,
    seo: true,
    bodyField: "problem",
    intro: "Projects on the Work pages, in the order shown here. Show a client only with their permission.",
    fields: [
      { name: "client", label: "Client", kind: "text", required: true, max: 120, half: true },
      { name: "sector", label: "What the client does", kind: "text", max: 120, half: true },
      { name: "summary", label: "One-line summary", kind: "textarea", required: true, max: 300, hint: "Used as the page headline." },
      { name: "industrySlug", label: "Industry", kind: "select", options: industries.map((i) => ({ value: i.slug, label: i.name })), required: true, half: true },
      { name: "country", label: "Country", kind: "text", max: 80, half: true },
      { name: "pillars", label: "Services provided", kind: "multi", options: pillarOptions },
      { name: "services", label: "Specific services", kind: "tags", hint: "Press Enter after each one." },
      { name: "technologies", label: "Technologies", kind: "tags" },
      { name: "problem", label: "The problem", kind: "textarea", max: 3000 },
      { name: "approach", label: "Our approach", kind: "textarea", max: 3000 },
      { name: "built", label: "What we built", kind: "textarea", max: 3000 },
      { name: "outcomes", label: "Outcomes", kind: "rows", fields: [{ name: "value", label: "Number, e.g. 40%" }, { name: "label", label: "What it measures" }], max: 6 },
      { name: "quoteText", label: "Client quote", kind: "textarea", max: 800 },
      { name: "quoteName", label: "Quote: name", kind: "text", max: 120, half: true },
      { name: "quoteRole", label: "Quote: role and company", kind: "text", max: 160, half: true },
    ],
  },
  jobs: {
    type: "jobs",
    title: "Job openings",
    singular: "job opening",
    titleField: "title",
    subtitle: (d) => [d.team, d.location, d.type].filter(Boolean).join(" · "),
    publicPath: (slug) => `/careers/${slug}`,
    seo: true,
    bodyField: "summary",
    intro: "Roles on the Careers page. Hide a role to take it off the site without deleting it. With none visible, the page says there are no openings.",
    fields: [
      { name: "title", label: "Job title", kind: "text", required: true, max: 120 },
      { name: "team", label: "Team", kind: "text", max: 80, half: true },
      { name: "location", label: "Location", kind: "text", required: true, max: 120, half: true },
      { name: "type", label: "Type", kind: "select", options: ["Full-time", "Part-time", "Contract", "Internship"].map((v) => ({ value: v, label: v })), required: true, half: true },
      { name: "summary", label: "Summary", kind: "textarea", required: true, max: 600 },
      { name: "responsibilities", label: "What you will do", kind: "lines", hint: "One point per line." },
      { name: "requirements", label: "What we look for", kind: "lines", hint: "One point per line." },
    ],
  },
  testimonials: {
    type: "testimonials",
    title: "Testimonials",
    singular: "testimonial",
    titleField: "name",
    subtitle: (d) => [d.role, d.company].filter(Boolean).join(", "),
    autoSlug: ["name", "company"],
    seo: false,
    intro: "Client quotes on the home page. The section appears once at least one is visible. Publish a quote only with the client's written permission.",
    fields: [
      { name: "text", label: "Quote", kind: "textarea", required: true, max: 600, hint: "Up to about 300 characters fits the card in full." },
      { name: "name", label: "Name", kind: "text", required: true, max: 120, half: true },
      { name: "role", label: "Role", kind: "text", max: 120, half: true },
      { name: "company", label: "Company", kind: "text", max: 120, half: true },
      { name: "logo", label: "Company logo", kind: "image", shape: "logo", half: true, hint: "Shown on the card. A dark logo on a transparent background works best." },
    ],
  },
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Site data to editor fields (a few fields are stored differently on the site). */
export function toEditor(type: ContentType, data: Record<string, unknown>): Record<string, unknown> {
  if (type === "projects") {
    const quote = data.quote as { text?: string; name?: string; role?: string } | undefined;
    return { ...data, quoteText: quote?.text ?? "", quoteName: quote?.name ?? "", quoteRole: quote?.role ?? "" };
  }
  return data;
}

/** Editor fields back to the shape the site reads. */
export function fromEditor(type: ContentType, data: Record<string, unknown>): Record<string, unknown> {
  if (type === "projects") {
    const { quoteText, quoteName, quoteRole, ...rest } = data as Record<string, string>;
    const industry = industries.find((i) => i.slug === rest.industrySlug)?.name ?? "";
    return { ...rest, industry, quote: quoteText ? { text: quoteText, name: quoteName ?? "", role: quoteRole ?? "" } : undefined };
  }
  return data;
}
