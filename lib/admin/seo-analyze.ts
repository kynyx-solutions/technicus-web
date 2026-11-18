// SEO checks for a page, with a score out of 100. Used live in the editor and
// across the whole site on the SEO health page. Runs in the browser and on the
// server, so it parses HTML with simple patterns rather than a DOM.

export type CheckStatus = "good" | "ok" | "bad";
export type Check = { id: string; status: CheckStatus; text: string };

export type PageFacts = {
  title: string;
  description: string;
  path: string;
  focus?: string;
  /** Main text of the page, as HTML. */
  html: string;
  ogImage?: string;
  noindex?: boolean;
  h1Count?: number;
  kind?: "article" | "page" | "case" | "job";
};

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"');

export function extract(html: string) {
  const noScript = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  const text = decode(noScript.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  const headings = [...noScript.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => decode(m[1].replace(/<[^>]+>/g, "")).trim());
  const images = [...noScript.matchAll(/<img\b[^>]*>/gi)].map((m) => ({ alt: /\balt="([^"]*)"/i.exec(m[0])?.[1] ?? null }));
  const links = [...noScript.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
  return { text, headings, images, links };
}

const MIN_WORDS = { article: 600, page: 250, case: 200, job: 120 };

export function analyze(page: PageFacts) {
  const { text, headings, images, links } = extract(page.html);
  const words = text ? text.split(" ").length : 0;
  const lower = text.toLowerCase();
  const focus = page.focus?.trim().toLowerCase();
  const checks: Check[] = [];
  const add = (id: string, status: CheckStatus, t: string) => checks.push({ id, status, text: t });

  const tl = page.title.trim().length;
  if (!tl) add("title", "bad", "The page has no title.");
  else if (tl >= 30 && tl <= 60) add("title", "good", `Title length is good (${tl} characters).`);
  else if (tl < 30) add("title", "ok", `Title is short (${tl} characters). Aim for 30 to 60.`);
  else add("title", tl <= 70 ? "ok" : "bad", `Title is long (${tl} characters) and may be cut off in results. Aim for 30 to 60.`);

  const dl = page.description.trim().length;
  if (!dl) add("description", "bad", "There is no meta description. Search engines will pick text from the page instead.");
  else if (dl >= 120 && dl <= 158) add("description", "good", `Description length is good (${dl} characters).`);
  else if (dl < 120) add("description", dl >= 70 ? "ok" : "bad", `Description is short (${dl} characters). Aim for 120 to 158.`);
  else add("description", dl <= 170 ? "ok" : "bad", `Description is long (${dl} characters) and will be cut off. Aim for 120 to 158.`);

  if (page.noindex) add("noindex", "bad", "This page is set to noindex, so search engines will not show it.");
  if (page.h1Count !== undefined) {
    if (page.h1Count === 1) add("h1", "good", "The page has one main heading.");
    else add("h1", "bad", page.h1Count === 0 ? "The page has no main heading (h1)." : `The page has ${page.h1Count} main headings; it should have one.`);
  }

  if (!focus) add("focus", "ok", "Set a focus keyword to check how well the page targets it.");
  else {
    const inTitle = page.title.toLowerCase().includes(focus);
    add("focus-title", inTitle ? "good" : "bad", inTitle ? "The focus keyword is in the title." : "Put the focus keyword in the title, ideally near the start.");
    const inDesc = page.description.toLowerCase().includes(focus);
    add("focus-desc", inDesc ? "good" : "ok", inDesc ? "The focus keyword is in the description." : "Use the focus keyword in the description.");
    // The home page's address is the domain alone, so it is not checked.
    if (page.path !== "/") {
      const slugWords = focus.split(/\s+/).filter((w) => w.length > 2);
      const inUrl = slugWords.length > 0 && slugWords.every((w) => page.path.toLowerCase().includes(w));
      add("focus-url", inUrl ? "good" : "ok", inUrl ? "The web address contains the focus keyword." : "The web address does not contain the focus keyword.");
    }
    const inIntro = lower.slice(0, 700).includes(focus);
    add("focus-intro", inIntro ? "good" : "ok", inIntro ? "The focus keyword appears early in the text." : "Use the focus keyword in the opening paragraph.");
    if (headings.length) {
      const inHead = headings.some((h) => h.toLowerCase().includes(focus));
      add("focus-heading", inHead ? "good" : "ok", inHead ? "A subheading contains the focus keyword." : "Use the focus keyword in at least one subheading.");
    }
    if (words > 50) {
      const count = lower.split(focus).length - 1;
      const density = (count * focus.split(/\s+/).length * 100) / words;
      if (density > 3) add("density", "bad", `The focus keyword is used too often (${density.toFixed(1)}%). Over 3% reads as stuffing.`);
      else if (density >= 0.5) add("density", "good", `The focus keyword is used a natural amount (${density.toFixed(1)}%).`);
      else add("density", "ok", `The focus keyword is used rarely (${count} time${count === 1 ? "" : "s"}).`);
    }
  }

  const min = MIN_WORDS[page.kind ?? "page"];
  add("words", words >= min ? "good" : words >= min / 2 ? "ok" : "bad", words >= min ? `The text is long enough (${words} words).` : `The text is short (${words} words). Aim for at least ${min}.`);

  if (page.kind === "article") {
    add("headings", headings.length >= 2 ? "good" : "ok", headings.length >= 2 ? "The text is broken up with subheadings." : "Add subheadings to break up the text.");
    const internal = links.filter((h) => h.startsWith("/")).length;
    add("internal", internal ? "good" : "ok", internal ? `It links to ${internal} other page${internal === 1 ? "" : "s"} on the site.` : "Link to at least one related page on the site.");
  }
  const missingAlt = images.filter((i) => !i.alt).length;
  if (images.length) add("alt", missingAlt ? "bad" : "good", missingAlt ? `${missingAlt} image${missingAlt === 1 ? " has" : "s have"} no description (alt text).` : "Every image has a description.");
  add("og", page.ogImage ? "good" : "ok", page.ogImage ? "A social sharing image is set." : "No social sharing image: the site default is used.");

  const weight = { good: 1, ok: 0.5, bad: 0 };
  const score = checks.length ? Math.round((checks.reduce((s, c) => s + weight[c.status], 0) / checks.length) * 100) : 0;
  return { score, checks, words };
}

export const scoreTone = (s: number) => (s >= 80 ? "green" : s >= 50 ? "amber" : "red") as "green" | "amber" | "red";
