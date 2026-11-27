import type { Metadata } from "next";

// Design previews for choosing a direction. Kept out of search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
