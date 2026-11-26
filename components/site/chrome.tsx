import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { PageMotion } from "@/components/motion/page-motion";
import { getContactInfo } from "@/lib/cms";

/** Header, footer and quiet page motion around every public page. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const contact = await getContactInfo();
  return (
    <>
      <Header contact={{ email: contact.email, phone: contact.phone, phoneHref: contact.phoneHref }} />
      <main id="content" className="relative flex-1">
        <PageMotion>{children}</PageMotion>
      </main>
      <Footer />
    </>
  );
}
