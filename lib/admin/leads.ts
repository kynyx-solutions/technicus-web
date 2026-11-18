import "server-only";
import type { LeadRow } from "@/lib/db/types";

export type LeadQuery = {
  q?: string;
  status?: string;
  priority?: string;
  service?: string;
  type?: string;
  from?: string;
  to?: string;
  sort?: string;
  page?: string;
  limit?: string;
};

export const sorts = { newest: "Newest first", oldest: "Oldest first", updated: "Recently updated", name: "Name A–Z" } as const;

export function filterLeads(rows: LeadRow[], q: LeadQuery) {
  const term = q.q?.trim().toLowerCase();
  let list = rows.filter((l) => {
    if (q.status && l.status !== q.status) return false;
    if (q.priority && l.priority !== q.priority) return false;
    if (q.type && l.type !== q.type) return false;
    if (q.service && !l.services.includes(q.service)) return false;
    if (q.from && l.created_at < q.from) return false;
    if (q.to && l.created_at.slice(0, 10) > q.to) return false;
    if (term) {
      const hay = [l.name, l.email, l.company, l.ref, l.phone, l.message].join(" ").toLowerCase();
      if (!hay.includes(term)) return false;
    }
    return true;
  });
  const sort = q.sort ?? "newest";
  list = [...list].sort((a, b) =>
    sort === "oldest"
      ? a.created_at.localeCompare(b.created_at)
      : sort === "updated"
        ? b.updated_at.localeCompare(a.updated_at)
        : sort === "name"
          ? a.name.localeCompare(b.name)
          : b.created_at.localeCompare(a.created_at),
  );
  const limit = Math.min(100, Math.max(5, Number(q.limit) || 20));
  const pages = Math.max(1, Math.ceil(list.length / limit));
  const page = Math.min(pages, Math.max(1, Number(q.page) || 1));
  return {
    total: list.length,
    all: list,
    items: list.slice((page - 1) * limit, page * limit),
    page,
    pages,
    limit,
    services: [...new Set(rows.flatMap((l) => l.services))].sort(),
  };
}

export const formNames: Record<string, string> = {
  brief: "Project brief",
  consultation: "Consultation",
  nda: "NDA request",
  local: "Local enquiry",
};
