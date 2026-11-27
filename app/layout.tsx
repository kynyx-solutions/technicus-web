import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { site } from "@/content/site";
import { getSeoSettings } from "@/lib/cms";
import "./globals.css";

// Newsreader (serif) for headlines, Geist for text, Geist Mono for code.
// Self-hosted by Next.js.
// The brand phase may replace them.
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const newsreader = Newsreader({ variable: "--font-newsreader", subsets: ["latin"], display: "swap", style: ["normal", "italic"], axes: ["opsz"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap", weight: ["400", "500"] });

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name}: technology consultancy`, template: `%s | ${site.name}` },
    description: site.description,
    // Search engines are kept out until "Allow search engines" is switched on
    // in Admin > SEO > Search settings, at launch.
    robots: seo.indexing ? undefined : { index: false, follow: false },
    verification: {
      google: seo.verification.google || undefined,
      yandex: seo.verification.yandex || undefined,
      other: seo.verification.bing ? { "msvalidate.01": seo.verification.bing } : undefined,
    },
  };
}

// Runs before the first paint. It marks the page as animated only when motion
// is allowed, and removes the mark if the animation code has not started within
// four seconds, so text can never stay hidden.
const motionFlag = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('js-motion');setTimeout(function(){if(!window.__motionReady)d.classList.remove('js-motion')},4000)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${newsreader.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
