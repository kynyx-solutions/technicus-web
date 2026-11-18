import type { Metadata } from "next";
import { Notice, PageHeader } from "@/components/admin/ui";
import { site } from "@/content/site";
import { db } from "@/lib/db";
import { Speed } from "./speed";

export const metadata: Metadata = { title: "Page speed" };

// The main page types; each test takes up to a minute.
const PAGES = ["/", "/services", "/services/ai-data", "/services/product-engineering/web-development", "/work", "/insights", "/about", "/contact", "/careers"];

export default async function SpeedPage() {
  const base = process.env.SITE_URL || site.url;
  const runs = await db().all("pagespeed");
  return (
    <>
      <PageHeader title="Page speed" lead="Google PageSpeed Insights for the main pages: speed, accessibility, best practices and SEO, with the biggest improvements to make." />
      <div className="mb-4">
        <Notice tone="blue">
          Tests run against the public site at <strong>{base}</strong>, so they only work once it is live there. Set <code>SITE_URL</code> to test another address, and{" "}
          <code>PAGESPEED_API_KEY</code> (free from Google Cloud) to avoid Google&apos;s limit on tests without a key.
        </Notice>
      </div>
      <Speed pages={PAGES} runs={runs} base={base} />
    </>
  );
}
