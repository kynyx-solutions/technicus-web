import type { Metadata } from "next";
import { Thanks } from "@/components/thanks";
import { thanksFallback } from "@/content/thanks";
import { withSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/contact/thank-you", { title: "Thank you" });
}

export default function ThankYouPage() {
  return <Thanks {...thanksFallback} />;
}
