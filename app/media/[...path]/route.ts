import { db } from "@/lib/db";
import { mediaType } from "@/lib/media";

// Serves images uploaded in the admin. Names are random and never reused, so
// browsers may keep them for a year. SVG files are served with a policy that
// stops any script inside them from running.
export async function GET(_request: Request, { params }: RouteContext<"/media/[...path]">) {
  const { path } = await params;
  const name = path.join("/");
  if (!/^[\w-]+\.(png|jpg|webp|svg)$/.test(name)) return new Response("Not found", { status: 404 });
  const file = await db().readFile(`media/${name}`);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file), {
    headers: {
      "content-type": mediaType(name),
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
