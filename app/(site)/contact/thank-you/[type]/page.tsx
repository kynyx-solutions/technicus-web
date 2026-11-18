import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Thanks } from "@/components/thanks";
import { thanks } from "@/content/thanks";

// One confirmation page per form, so each kind of enquiry can be counted.
export const metadata: Metadata = { title: "Thank you" };
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(thanks).map((type) => ({ type }));
}

export default async function ThankYouPage({ params }: PageProps<"/contact/thank-you/[type]">) {
  const message = thanks[(await params).type];
  if (!message) notFound();
  return <Thanks {...message} />;
}
