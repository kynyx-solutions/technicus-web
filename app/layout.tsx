import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Cursor } from "@/components/motion/cursor";
import { PageMotion } from "@/components/motion/page-motion";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { site } from "@/content/site";
import "./globals.css";

// Inter stands in for the reference's typeface (Suisse Intl, a paid font).
// Self-hosted by Next.js. The brand phase may replace it.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: technology consultancy`, template: `%s | ${site.name}` },
  description: site.description,
  // The site must not be indexed until launch. Remove then.
  robots: { index: false, follow: false },
};

// Runs before the first paint. It marks the page as animated only when motion
// is allowed, and removes the mark if the animation code has not started within
// four seconds, so text can never stay hidden.
const motionFlag = `(function(){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;var d=document.documentElement;d.classList.add('js-motion');setTimeout(function(){if(!window.__motionReady)d.classList.remove('js-motion')},4000)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SmoothScroll />
        <Header />
        <main id="content" className="relative flex-1">
          <PageMotion>{children}</PageMotion>
        </main>
        <Footer />
        <Cursor />
      </body>
    </html>
  );
}
