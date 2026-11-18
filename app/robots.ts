import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getSeoSettings } from "@/lib/cms";

// AI crawlers that power answers in search products, and those that collect
// training data. Each group is allowed or blocked in Admin > SEO > Search settings.
const AI_SEARCH = ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot", "Claude-User"];
const AI_TRAINING = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot", "Bytespider", "meta-externalagent"];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = await getSeoSettings();
  if (!seo.indexing) return { rules: [{ userAgent: "*", disallow: "/" }] };
  const blocked = [...(seo.aiCrawlers.search ? [] : AI_SEARCH), ...(seo.aiCrawlers.training ? [] : AI_TRAINING)];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/studio"] },
      ...(blocked.length ? [{ userAgent: blocked, disallow: "/" }] : []),
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
