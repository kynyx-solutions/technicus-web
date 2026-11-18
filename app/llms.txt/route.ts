import { pillars } from "@/content/services";
import { site } from "@/content/site";
import { getArticles, getSeoSettings } from "@/lib/cms";

// A plain summary of the site for AI assistants (llmstxt.org).
export async function GET() {
  const [seo, articles] = await Promise.all([getSeoSettings(), getArticles()]);
  const lines = [
    `# ${site.name}`,
    "",
    `> ${seo.llms}`,
    "",
    "## Services",
    ...pillars.map((p) => `- [${p.name}](${site.url}/services/${p.slug}): ${p.summary}`),
    "",
    "## Insights",
    ...articles.slice(0, 20).map((a) => `- [${a.title}](${site.url}/insights/${a.slug}): ${a.summary}`),
    "",
    "## Company",
    `- [About](${site.url}/about)`,
    `- [How we work](${site.url}/about/how-we-work)`,
    `- [Contact](${site.url}/contact)`,
  ];
  return new Response(lines.join("\n") + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
