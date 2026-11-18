import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState, PageHeader } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { ApplicationList } from "./application-list";

export const metadata: Metadata = { title: "Job applications" };

export default async function ApplicationsPage() {
  const items = await db().all("applications");
  const roles = [...new Set(items.map((a) => a.role))].sort();
  return (
    <>
      <PageHeader title="Job applications" lead="Applications from the careers page. CVs are stored privately and open through a short-lived link." />
      {items.length === 0 ? (
        <EmptyState title="No applications yet" text="When someone applies through the careers page, their application and CV appear here." />
      ) : (
        <Suspense>
          <ApplicationList items={items} roles={roles} />
        </Suspense>
      )}
    </>
  );
}
