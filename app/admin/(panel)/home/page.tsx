import type { Metadata } from "next";
import { btn, PageHeader } from "@/components/admin/ui";
import { freshHome } from "@/lib/cms";
import { HomeForm } from "./home-form";

export const metadata: Metadata = { title: "Home page" };

export default async function HomeSettingsPage() {
  const home = await freshHome();
  return (
    <>
      <PageHeader
        title="Home page"
        lead="The words on the home page. Services, case studies, articles and testimonials shown there are edited in their own sections."
        actions={
          <a href="/" target="_blank" className={btn.secondary}>
            View home page
          </a>
        }
      />
      <HomeForm initial={home} />
    </>
  );
}
