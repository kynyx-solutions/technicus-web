import "server-only";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";

// Images uploaded in the admin: client logos, testimonial logos, cover images.
// They are stored under media/ and served by app/media/[...path].

export const IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};
export const IMAGE_MAX_BYTES = 2 * 1024 * 1024;

/** True if the bytes really are the image type claimed. */
export function looksLikeImage(bytes: Buffer, type: string) {
  const head = bytes.subarray(0, 12);
  if (type === "image/png") return head.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
  if (type === "image/jpeg") return head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff;
  if (type === "image/webp") return head.subarray(0, 4).toString() === "RIFF" && head.subarray(8, 12).toString() === "WEBP";
  if (type === "image/svg+xml") return /<svg[\s>]/i.test(bytes.subarray(0, 4096).toString("utf8"));
  return false;
}

export async function saveImage(bytes: Buffer, type: string) {
  const file = `media/${randomUUID()}.${IMAGE_TYPES[type]}`;
  await db().putFile(file, bytes, type);
  return `/${file}`;
}

export const mediaType = (file: string) =>
  ({ png: "image/png", jpg: "image/jpeg", webp: "image/webp", svg: "image/svg+xml" })[file.split(".").pop() ?? ""] ?? "application/octet-stream";
