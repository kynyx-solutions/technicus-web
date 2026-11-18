import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { site } from "@/content/site";
import { contentConfig, toEditor } from "@/lib/admin/content-config";
import { db } from "@/lib/db";
import type { ContentType } from "@/lib/db/types";
import { ContentEditor } from "../editor";

export const metadata: Metadata = { title: "Edit" };

export default async function EditContentPage({ params }: PageProps<"/admin/content/[type]/[id]">) {
  const { type, id } = await params;
  const row = await db().get("content", id);
  if (!row || row.type !== type) notFound();
  const config = contentConfig[type as ContentType];
  return (
    <>
      <Link href={`/admin/content/${type}`} className="mb-2 inline-flex items-center gap-1.5 text-sm text-black/55 hover:text-black">
        <span aria-hidden>←</span> {config.title}
      </Link>
      <ContentEditor key={row.updated_at} type={row.type} id={row.id} initial={{ slug: row.slug, published: row.published, data: toEditor(row.type, row.data) }} siteUrl={site.url} />
    </>
  );
}
