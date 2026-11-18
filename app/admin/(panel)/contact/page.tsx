import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { freshContact } from "@/lib/cms";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "Contact & socials" };

export default async function ContactSettingsPage() {
  return (
    <>
      <PageHeader title="Contact & socials" lead="Email, phone, WhatsApp, social accounts and offices, used across the whole site." />
      <ContactForm initial={await freshContact()} />
    </>
  );
}
