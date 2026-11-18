import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Cookie policy" };

export default function Page() {
  return <LegalPage slug="cookies" />;
}
