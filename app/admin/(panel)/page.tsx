import type { Metadata } from "next";
import Link from "next/link";
import { BarList, Columns } from "@/components/admin/charts";
import { Badge, Card, label, Notice, PageHeader, priorityTone, Stat, statusTone, timeAgo } from "@/components/admin/ui";
import { formNames } from "@/lib/admin/leads";
import { contentConfig } from "@/lib/admin/content-config";
import { db } from "@/lib/db";
import { contentTypes, leadStatuses } from "@/lib/db/types";

export const metadata: Metadata = { title: "Dashboard" };

const RANGES = [7, 30, 90, 180];
/** The time of this request. The page renders fresh on every visit. */
const requestTime = () => Date.now();
const count = <T,>(items: T[], key: (i: T) => string | string[]) => {
  const m = new Map<string, number>();
  for (const i of items) for (const k of [key(i)].flat()) if (k) m.set(k, (m.get(k) ?? 0) + 1);
  return [...m.entries()].map(([l, value]) => ({ label: l, value })).sort((a, b) => b.value - a.value);
};

export default async function Dashboard({ searchParams }: PageProps<"/admin">) {
  const asked = Number((await searchParams).days);
  const days = RANGES.includes(asked) ? asked : 30;
  const [leads, applications, content] = await Promise.all([db().all("leads"), db().all("applications"), db().all("content")]);

  const now = requestTime();
  const since = new Date(now - days * 86400_000).toISOString();
  const before = new Date(now - 2 * days * 86400_000).toISOString();
  const current = leads.filter((l) => l.created_at >= since);
  const previous = leads.filter((l) => l.created_at >= before && l.created_at < since);
  const change = previous.length ? Math.round(((current.length - previous.length) / previous.length) * 100) : null;
  const waiting = leads.filter((l) => l.status === "new").length;
  const open = leads.filter((l) => ["new", "contacted", "qualified"].includes(l.status)).length;
  const converted = leads.filter((l) => l.status === "converted").length;
  const newApplications = applications.filter((a) => a.created_at >= since).length;

  // Leads per day. Days are counted in UTC.
  const perDay = Array.from({ length: days }, (_, i) => {
    const d = new Date(now - (days - 1 - i) * 86400_000).toISOString().slice(0, 10);
    return { label: new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }), value: current.filter((l) => l.created_at.slice(0, 10) === d).length };
  });

  return (
    <>
      <PageHeader
        title="Dashboard"
        lead="Enquiries, applications and the state of the website."
        actions={
          <div className="inline-flex rounded-full bg-white p-1">
            {RANGES.map((r) => (
              <Link key={r} href={`/admin?days=${r}`} className={`rounded-full px-3.5 py-1.5 text-sm ${r === days ? "bg-black text-white" : "text-black/60 hover:text-black"}`}>
                {r} days
              </Link>
            ))}
          </div>
        }
      />

      {db().kind === "local" && (
        <div className="mb-4">
          <Notice>
            Data is stored in files on this computer (<code>.data/</code>), which suits development only. Connect Supabase before going live: see Settings.
          </Notice>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label={`Leads, last ${days} days`} value={current.length} sub={change === null ? "No earlier period to compare" : `${change >= 0 ? "+" : ""}${change}% on the ${days} days before`} href="/admin/leads" />
        <Stat label="Waiting for a reply" value={waiting} sub="Status: new" href="/admin/leads?status=new" />
        <Stat label="Open pipeline" value={open} sub="New, contacted or qualified" />
        <Stat label="Conversion" value={leads.length ? `${Math.round((converted / leads.length) * 100)}%` : "–"} sub={`${converted} of ${leads.length} leads, all time`} href="/admin/leads?status=converted" />
        <Stat label={`Applications, last ${days} days`} value={newApplications} sub={`${applications.filter((a) => a.status === "new").length} not yet reviewed`} href="/admin/applications" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Leads per day" className="lg:col-span-2">
          <Columns data={perDay} />
        </Card>
        <Card title="Pipeline">
          <BarList items={leadStatuses.map((s) => ({ label: label(s), value: leads.filter((l) => l.status === s).length }))} hrefFor={(l) => `/admin/leads?status=${l.toLowerCase()}`} />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card title="Most requested services">
          <BarList items={count(current, (l) => l.services).slice(0, 10)} empty="No services chosen in this period" hrefFor={(s) => `/admin/leads?service=${encodeURIComponent(s)}`} />
        </Card>
        <Card title="Which form">
          <BarList items={count(current, (l) => formNames[l.type] ?? l.type)} empty="No leads in this period" />
        </Card>
        <Card title="Budgets">
          <BarList items={count(current, (l) => l.budget)} empty="No budgets given in this period" />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title="Latest leads" action={<Link href="/admin/leads" className="text-sm text-black/55 hover:text-black">All leads</Link>} className="lg:col-span-2">
          {leads.length ? (
            <ul className="divide-y divide-black/6">
              {leads.slice(0, 6).map((l) => (
                <li key={l.id}>
                  <Link href={`/admin/leads/${l.id}`} className="flex items-center gap-3 py-2.5 hover:opacity-75">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{l.name}</span>
                      <span className="block truncate text-[0.82rem] text-black/50">
                        {formNames[l.type] ?? l.type}
                        {l.company && ` · ${l.company}`}
                      </span>
                    </span>
                    <Badge tone={priorityTone[l.priority]}>{label(l.priority)}</Badge>
                    <Badge tone={statusTone[l.status]}>{label(l.status)}</Badge>
                    <span className="hidden w-24 text-right text-[0.82rem] text-black/45 sm:block">{timeAgo(l.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.9rem] text-black/45">No leads yet.</p>
          )}
        </Card>
        <Card title="Website content">
          <ul className="space-y-2.5 text-[0.9rem]">
            {contentTypes.map((t) => {
              const rows = content.filter((r) => r.type === t);
              const hidden = rows.filter((r) => !r.published).length;
              return (
                <li key={t}>
                  <Link href={`/admin/content/${t}`} className="flex justify-between gap-2 hover:opacity-75">
                    <span>{contentConfig[t].title}</span>
                    <span className="text-black/55">{rows.length ? `${rows.length - hidden} visible${hidden ? `, ${hidden} hidden` : ""}` : "Built-in content"}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}
