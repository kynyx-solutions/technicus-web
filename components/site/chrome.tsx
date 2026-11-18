import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Cursor } from "@/components/motion/cursor";
import { PageMotion } from "@/components/motion/page-motion";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { getContactInfo } from "@/lib/cms";

/** Header, footer, smooth scroll, page motion and cursor around every public page. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const contact = await getContactInfo();
  return (
    <>
      <SmoothScroll />
      <Header contact={{ email: contact.email, phone: contact.phone, phoneHref: contact.phoneHref }} />
      <main id="content" className="relative flex-1">
        <PageMotion>{children}</PageMotion>
      </main>
      <Footer />
      <Cursor />
    </>
  );
}
