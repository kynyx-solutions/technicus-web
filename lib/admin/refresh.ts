import "server-only";
import { revalidatePath, updateTag } from "next/cache";
import { CMS_TAG } from "@/lib/cms";

/** After an admin change: refresh cached content and every public page. Server actions only. */
export function refreshSite() {
  updateTag(CMS_TAG);
  revalidatePath("/", "layout");
}
