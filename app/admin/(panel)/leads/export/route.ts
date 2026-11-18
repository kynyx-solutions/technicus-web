import { filterLeads, formNames, type LeadQuery } from "@/lib/admin/leads";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

// CSV of the leads matching the current filters. Cells that a spreadsheet would
// run as a formula are prefixed so they stay text.
const cell = (v: unknown) => {
  let s = Array.isArray(v) ? v.join("; ") : String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(request: Request) {
  if (!(await getSession())) return new Response("Sign in first", { status: 401 });
  const params = Object.fromEntries(new URL(request.url).searchParams) as LeadQuery;
  const { all } = filterLeads(await db().all("leads"), { ...params, limit: "100" });
  const columns = ["ref", "created_at", "form", "status", "priority", "name", "email", "phone", "company", "country", "services", "budget", "timeline", "message", "source"] as const;
  const rows = all.slice(0, 10000).map((l) =>
    columns.map((c) => cell(c === "form" ? (formNames[l.type] ?? l.type) : l[c as keyof typeof l])).join(","),
  );
  const csv = "﻿" + [columns.join(","), ...rows].join("\r\n");
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="technicus-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
