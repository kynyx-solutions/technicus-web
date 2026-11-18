import type { Metadata } from "next";
import { Thanks } from "@/components/thanks";
import { thanksFallback } from "@/content/thanks";

export const metadata: Metadata = { title: "Thank you" };

export default function ThankYouPage() {
  return <Thanks {...thanksFallback} />;
}
