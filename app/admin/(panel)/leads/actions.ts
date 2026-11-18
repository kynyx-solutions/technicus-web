"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { leadStatuses, priorities, type LeadStatus, type Priority } from "@/lib/db/types";

type Result = { ok: boolean; error?: string };
const refresh = () => revalidatePath("/admin", "layout");

export async function updateLead(id: string, patch: { status?: string; priority?: string }): Promise<Result> {
  const { email } = await requireAdmin();
  const lead = await db().get("leads", id);
  if (!lead) return { ok: false, error: "This lead no longer exists." };
  const changes: string[] = [];
  const next: { status?: LeadStatus; priority?: Priority } = {};
  if (patch.status && patch.status !== lead.status) {
    if (!leadStatuses.includes(patch.status as LeadStatus)) return { ok: false, error: "Unknown status" };
    next.status = patch.status as LeadStatus;
    changes.push(`Status changed from ${lead.status} to ${patch.status}.`);
  }
  if (patch.priority && patch.priority !== lead.priority) {
    if (!priorities.includes(patch.priority as Priority)) return { ok: false, error: "Unknown priority" };
    next.priority = patch.priority as Priority;
    changes.push(`Priority changed from ${lead.priority} to ${patch.priority}.`);
  }
  if (!changes.length) return { ok: true };
  const note = { id: randomUUID(), text: changes.join(" "), author: email, createdAt: new Date().toISOString() };
  await db().update("leads", id, { ...next, notes: [...lead.notes, note] });
  refresh();
  return { ok: true };
}

export async function addLeadNote(id: string, text: string): Promise<Result> {
  const { email } = await requireAdmin();
  const clean = text.trim().slice(0, 4000);
  if (!clean) return { ok: false, error: "Write a note first." };
  const lead = await db().get("leads", id);
  if (!lead) return { ok: false, error: "This lead no longer exists." };
  await db().update("leads", id, { notes: [...lead.notes, { id: randomUUID(), text: clean, author: email, createdAt: new Date().toISOString() }] });
  refresh();
  return { ok: true };
}

export async function deleteLeadNote(id: string, noteId: string): Promise<Result> {
  await requireAdmin();
  const lead = await db().get("leads", id);
  if (!lead) return { ok: false, error: "This lead no longer exists." };
  await db().update("leads", id, { notes: lead.notes.filter((n) => n.id !== noteId) });
  refresh();
  return { ok: true };
}

export async function bulkLeads(ids: string[], action: "status" | "delete", status?: string): Promise<Result> {
  await requireAdmin();
  const list = ids.slice(0, 200);
  if (!list.length) return { ok: false, error: "Select at least one lead." };
  if (action === "delete") await db().remove("leads", list);
  else {
    if (!leadStatuses.includes(status as LeadStatus)) return { ok: false, error: "Choose a status." };
    for (const id of list) await updateLead(id, { status });
  }
  refresh();
  return { ok: true };
}
