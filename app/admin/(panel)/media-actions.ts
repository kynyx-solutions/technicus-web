"use server";

import { requireAdmin } from "@/lib/auth";
import { IMAGE_MAX_BYTES, IMAGE_TYPES, looksLikeImage, saveImage } from "@/lib/media";

export async function uploadImage(form: FormData): Promise<{ ok: boolean; url?: string; error?: string }> {
  await requireAdmin();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose an image first." };
  if (file.size > IMAGE_MAX_BYTES) return { ok: false, error: "The image is larger than 2 MB." };
  if (!IMAGE_TYPES[file.type]) return { ok: false, error: "Use a PNG, JPG, WebP or SVG image." };
  const bytes = Buffer.from(await file.arrayBuffer());
  if (!looksLikeImage(bytes, file.type)) return { ok: false, error: "This file is not the image type its name says." };
  try {
    return { ok: true, url: await saveImage(bytes, file.type) };
  } catch (error) {
    console.error("Image upload failed", error);
    return { ok: false, error: "The image could not be saved." };
  }
}
