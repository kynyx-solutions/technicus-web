import type { Metadata } from "next";
import { Suspense } from "react";
import { btn, EmptyState, PageHeader } from "@/components/admin/ui";
import { filterLeads, formNames, sorts, type LeadQuery } from "@/lib/admin/leads";
import { db } from "@/lib/db";
import { LeadFilters, LeadTable, Pager } from "./leads-table";

export const metadata: Metadata = { title: "Leads" };

export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const query = (await searchParams) as LeadQuery;
  const rows = await db().all("leads");
  const result = filterLeads(rows, query);
  const exportQuery = new URLSearchParams(Object.entries(query).filter(([k, v]) => typeof v === "string" && k !== "page") as [string, string][]);

  return (
    <>
      <PageHeader
        title="Leads"
        lead="Every enquiry sent through the site's forms: project briefs, consultations, NDA requests and local enquiries."
        actions={
          rows.length > 0 && (
            <a href={`/admin/leads/export?${exportQuery}`} className={btn.secondary}>
              Export CSV
            </a>
          )
        }
      />
      {rows.length === 0 ? (
        <EmptyState title="No leads yet" text="When someone sends a form on the site, it appears here." />
      ) : (
        <Suspense>
          <LeadFilters services={result.services} sorts={sorts} forms={formNames} />
          {result.total === 0 ? (
            <EmptyState title="No leads match these filters" />
          ) : (
            <>
              <LeadTable items={result.items} />
              <Pager page={result.page} pages={result.pages} total={result.total} limit={result.limit} />
            </>
          )}
        </Suspense>
      )}
    </>
  );
}
