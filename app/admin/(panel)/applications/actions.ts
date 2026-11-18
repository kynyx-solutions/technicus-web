"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { applicationStatuses, type ApplicationStatus } from "@/lib/db/types";

type Result = { ok: boolean; error?: string };

export async function updateApplication(id: string, patch: { status?: string; notes?: string }): Promise<Result> {
  await requireAdmin();
  const next: { status?: ApplicationStatus; notes?: string } = {};
  if (patch.status !== undefined) {
    if (!applicationStatuses.includes(patch.status as ApplicationStatus)) return { ok: false, error: "Unknown status" };
    next.status = patch.status as ApplicationStatus;
  }
  if (patch.notes !== undefined) next.notes = patch.notes.slice(0, 4000);
  const row = await db().update("applications", id, next);
  if (!row) return { ok: false, error: "This application no longer exists." };
  revalidatePath("/admin", "layout");
  return { ok: true };
}

/** Deletes the application and its CV file. */
export async function deleteApplication(id: string): Promise<Result> {
  await requireAdmin();
  const row = await db().get("applications", id);
  if (!row) return { ok: false, error: "This application no longer exists." };
  await db().removeFiles([row.cv_path]);
  await db().remove("applications", [id]);
  revalidatePath("/admin", "layout");
  return { ok: true };
}
