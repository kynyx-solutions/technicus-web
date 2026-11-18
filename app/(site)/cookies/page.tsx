import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { withSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/cookies", { title: "Cookie policy" });
}

export default function Page() {
  return <LegalPage slug="cookies" />;
}
