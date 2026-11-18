import "server-only";
import { unstable_cache } from "next/cache";
import { roles as codeRoles, type Role } from "@/content/careers";
import { contact as codeContact, offices as codeOffices, positioning, quotes as codeQuotes, stats as codeStats, clientNames as codeClients, type Office } from "@/content/company";
import { articles as codeArticles } from "@/content/copy";
import type { Article, ArticleBlock, Faq } from "@/content/copy/types";
import { homeFaqs } from "@/content/faqs";
import { projects as codeProjects, type Project } from "@/content/work";
import { db } from "@/lib/db";
import type { ContentRow, ContentType } from "@/lib/db/types";

// What the public site reads. Content edited in the admin comes from the
// database; if the admin has no items of a kind yet, the content written in
// code (content/) is used, so the site is complete before anything is entered.
// Reads are cached and refreshed whenever the admin saves (tag "cms").

export const CMS_TAG = "cms";

export type Seo = {
  title?: string;
  description?: string;
  focus?: string;
  ogImage?: string;
  noindex?: boolean;
};

export type ArticleItem = Omit<Article, "body"> & { html: string; coverImage?: string; seo?: Seo };
export type ProjectItem = Project & { seo?: Seo };
export type JobItem = Omit<Role, "published"> & { published?: boolean; seo?: Seo };
export type Testimonial = { text: string; name: string; role: string; company: string; logo?: string };
export type Client = { name: string; logo?: string; url?: string };

export type ContactSettings = {
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  x: string;
  facebook: string;
  instagram: string;
  offices: Office[];
};

export type HomeSettings = {
  heroTitle: string;
  heroLead: string;
  introText: string;
  workTitle: string;
  howText: string;
  industriesTitle: string;
  industriesLead: string;
  insightsTitle: string;
  faqs: Faq[];
  closingTitle: string;
  closingLead: string;
  /** Clients who agreed to be named, with their logo. */
  clients: Client[];
  stats: { value: number; suffix?: string; label: string }[];
};

export type SeoSettings = {
  /** Overrides for fixed pages, keyed by path. */
  pages: Record<string, Seo>;
  /** Off until launch: every page is marked noindex. */
  indexing: boolean;
  verification: { google: string; bing: string; yandex: string };
  aiCrawlers: { search: boolean; training: boolean };
  llms: string;
};

/* ---------------------------------------------------------- defaults --- */

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export function blocksToHtml(blocks: ArticleBlock[]) {
  return blocks
    .map((b) =>
      b.type === "ul" ? `<ul>${b.items.map((i) => `<li>${escape(i)}</li>`).join("")}</ul>` : `<${b.type}>${escape(b.text)}</${b.type}>`,
    )
    .join("\n");
}

export const defaults = {
  articles: (): ArticleItem[] =>
    codeArticles.map(({ body, ...rest }) => ({ ...rest, html: blocksToHtml(body) })),
  projects: (): ProjectItem[] => codeProjects,
  jobs: (): JobItem[] => codeRoles,
  testimonials: (): Testimonial[] => codeQuotes,
  contact: (): ContactSettings => ({
    email: codeContact.email,
    phone: codeContact.phone,
    whatsapp: codeContact.whatsappHref ? codeContact.phone : "",
    linkedin: codeContact.linkedin,
    x: codeContact.x,
    facebook: codeContact.facebook,
    instagram: "",
    offices: codeOffices,
  }),
  home: (): HomeSettings => ({
    heroTitle: positioning.statement,
    heroLead: positioning.lead,
    introText:
      "Technicus is a technology consultancy for startups, growing companies and established organisations. We plan, design, build and run software. One team takes a product from the first decision to the system that runs it, in any industry and on any major technology stack.",
    workTitle: "Selected work",
    howText:
      "Every engagement follows the same four stages. You see working software early and often, and you always know what is being built, why, and what it costs.",
    industriesTitle: "Industries",
    industriesLead: "The same engineering discipline, applied with knowledge of how each sector works.",
    insightsTitle: "Insights",
    faqs: homeFaqs,
    closingTitle: "Have something to build or rethink?",
    closingLead: "Tell us where things stand today, what you are trying to achieve and what is getting in the way.",
    clients: codeClients.map((name) => ({ name })),
    stats: codeStats,
  }),
  seo: (): SeoSettings => ({
    pages: {},
    indexing: false,
    verification: { google: "", bing: "", yandex: "" },
    aiCrawlers: { search: true, training: false },
    llms: "Technicus is a technology consultancy. It helps organisations plan, design, build and run software: strategy, design, engineering, AI and data, cloud and security, growth, and managed services.",
  }),
};

/* ------------------------------------------------------------- reads --- */

/** Every row of a kind, in the admin's order. Empty if the store cannot be read. */
async function rows(type: ContentType): Promise<ContentRow[] | null> {
  try {
    const all = (await db().all("content")).filter((r) => r.type === type);
    return all.sort((a, b) => a.sort_order - b.sort_order || b.created_at.localeCompare(a.created_at));
  } catch (error) {
    console.error(`Content "${type}" could not be read; using the built-in content`, error);
    return null;
  }
}

async function setting<V extends object>(key: string, fallback: () => V): Promise<V> {
  try {
    const saved = await db().getSetting<Partial<V>>(key);
    return { ...fallback(), ...(saved ?? {}) };
  } catch (error) {
    console.error(`Setting "${key}" could not be read; using defaults`, error);
    return fallback();
  }
}

const cached = <A extends unknown[], R>(name: string, fn: (...args: A) => Promise<R>) =>
  unstable_cache(fn, [name], { tags: [CMS_TAG], revalidate: 300 });

const dev = process.env.NODE_ENV !== "production";

export const getArticles = cached("articles", async (): Promise<ArticleItem[]> => {
  const list = await rows("articles");
  const items = list?.length ? list.filter((r) => r.published).map((r) => ({ ...(r.data as ArticleItem), slug: r.slug })) : defaults.articles();
  return items.sort((a, b) => b.date.localeCompare(a.date));
});

export const getProjects = cached("projects", async (): Promise<ProjectItem[]> => {
  const list = await rows("projects");
  return list?.length ? list.filter((r) => r.published).map((r) => ({ ...(r.data as ProjectItem), slug: r.slug })) : defaults.projects();
});

/** Published openings. Built-in drafts show only while developing. */
export const getJobs = cached("jobs", async (): Promise<JobItem[]> => {
  const list = await rows("jobs");
  if (list?.length) return list.filter((r) => r.published).map((r) => ({ ...(r.data as JobItem), slug: r.slug, published: true }));
  return defaults.jobs().filter((r) => r.published || dev);
});

export const getTestimonials = cached("testimonials", async (): Promise<Testimonial[]> => {
  const list = await rows("testimonials");
  return list?.length ? list.filter((r) => r.published).map((r) => r.data as Testimonial) : defaults.testimonials();
});

export const getContact = cached("contact", () => setting("contact", defaults.contact));

/** Uncached reads for the admin's own forms, so they always show what is stored. */
export const freshContact = () => setting("contact", defaults.contact);
export const freshSeoSettings = () => setting("seo", defaults.seo);
export async function freshHome() {
  const home = await setting("home", defaults.home);
  const legacy = (home as HomeSettings & { clientNames?: string[] }).clientNames;
  if (legacy?.length && !home.clients.length) home.clients = legacy.map((name) => ({ name }));
  return home;
}
// Earlier saves kept client names only; freshHome converts them.
export const getHome = cached("home", () => freshHome());
export const getSeoSettings = cached("seo", () => setting("seo", defaults.seo));

export async function getArticle(slug: string) {
  return (await getArticles()).find((a) => a.slug === slug);
}
export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}
export async function getJob(slug: string) {
  return (await getJobs()).find((j) => j.slug === slug);
}

/** Links built from the contact settings. */
export function contactLinks(c: ContactSettings) {
  const digits = (v: string) => v.replace(/[^\d+]/g, "");
  return {
    phoneHref: `tel:${digits(c.phone)}`,
    whatsappHref: c.whatsapp ? `https://wa.me/${digits(c.whatsapp).replace(/^\+/, "")}` : "",
  };
}

/** Contact settings with ready-made links, for pages. */
export async function getContactInfo() {
  const c = await getContact();
  return { ...c, ...contactLinks(c) };
}
