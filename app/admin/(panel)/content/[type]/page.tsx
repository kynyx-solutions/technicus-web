import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { btn, EmptyState, Notice, PageHeader } from "@/components/admin/ui";
import { contentConfig } from "@/lib/admin/content-config";
import { defaults } from "@/lib/cms";
import { db } from "@/lib/db";
import { contentTypes, type ContentType } from "@/lib/db/types";
import { ContentList, ImportButton } from "./content-list";

const builtIn: Record<ContentType, () => number> = {
  articles: () => defaults.articles().length,
  projects: () => defaults.projects().length,
  jobs: () => defaults.jobs().length,
  testimonials: () => defaults.testimonials().length,
};

export async function generateMetadata({ params }: PageProps<"/admin/content/[type]">): Promise<Metadata> {
  const { type } = await params;
  return { title: contentConfig[type as ContentType]?.title ?? "Content" };
}

export default async function ContentPage({ params }: PageProps<"/admin/content/[type]">) {
  const { type } = await params;
  if (!(contentTypes as readonly string[]).includes(type)) notFound();
  const config = contentConfig[type as ContentType];
  const rows = (await db().all("content"))
    .filter((r) => r.type === type)
    .sort((a, b) => a.sort_order - b.sort_order || b.created_at.localeCompare(a.created_at));
  const fallback = builtIn[type as ContentType]();
  const publicBase = config.publicPath ? config.publicPath("") : undefined;

  return (
    <>
      <PageHeader
        title={config.title}
        lead={config.intro}
        actions={
          <>
            {rows.length > 0 && <ImportButton type={type} count={fallback} />}
            <Link href={`/admin/content/${type}/new`} className={btn.primary}>
              New {config.singular}
            </Link>
          </>
        }
      />
      {rows.length === 0 ? (
        <div className="space-y-4">
          {fallback > 0 && (
            <Notice tone="blue">
              The site is showing {fallback} built-in {fallback === 1 ? config.singular : config.title.toLowerCase()} written in code. Import them to edit them here.
              As soon as anything is added here, the site shows only what is in the admin.
            </Notice>
          )}
          <EmptyState
            title={`No ${config.title.toLowerCase()} in the admin yet`}
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <ImportButton type={type} count={fallback} primary />
                <Link href={`/admin/content/${type}/new`} className={fallback ? btn.secondary : btn.primary}>
                  New {config.singular}
                </Link>
              </div>
            }
          />
        </div>
      ) : (
        <ContentList
          type={type}
          singular={config.singular}
          publicBase={publicBase}
          items={rows.map((r) => ({
            id: r.id,
            slug: r.slug,
            title: String(r.data[config.titleField] ?? ""),
            subtitle: config.subtitle?.(r.data) ?? "",
            published: r.published,
            updated: r.updated_at,
          }))}
        />
      )}
    </>
  );
}
