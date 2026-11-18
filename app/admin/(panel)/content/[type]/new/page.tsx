import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/content/site";
import { contentConfig } from "@/lib/admin/content-config";
import { contentTypes, type ContentType } from "@/lib/db/types";
import { ContentEditor } from "../editor";

export const metadata: Metadata = { title: "New item" };

const starters: Partial<Record<ContentType, Record<string, unknown>>> = {
  articles: { kind: "Article", author: "technicus-editorial", date: new Date().toISOString().slice(0, 10), related: [], html: "" },
  jobs: { type: "Full-time", responsibilities: [], requirements: [] },
  projects: { pillars: [], services: [], technologies: [], outcomes: [] },
};

export default async function NewContentPage({ params }: PageProps<"/admin/content/[type]/new">) {
  const { type } = await params;
  if (!(contentTypes as readonly string[]).includes(type)) notFound();
  const config = contentConfig[type as ContentType];
  return (
    <>
      <Link href={`/admin/content/${type}`} className="mb-2 inline-flex items-center gap-1.5 text-sm text-black/55 hover:text-black">
        <span aria-hidden>←</span> {config.title}
      </Link>
      <ContentEditor type={type as ContentType} id={null} initial={{ slug: "", published: true, data: starters[type as ContentType] ?? {} }} siteUrl={site.url} />
    </>
  );
}
