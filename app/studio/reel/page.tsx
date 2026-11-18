import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReelStudio } from "@/components/reel/reel-studio";

export const metadata: Metadata = { title: "Showreel studio", robots: { index: false } };

// Where the showreel video is rendered. It exists only with `npm run dev`.
export default function ReelStudioPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ReelStudio />;
}
