import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

// Downloads a CV. With Supabase, it redirects to a link that works for ten
// minutes; with the local store, the file is sent from here. Only for the owner.
export async function GET(_request: Request, { params }: RouteContext<"/admin/applications/[id]/cv">) {
  if (!(await getSession())) return new Response("Sign in first", { status: 401 });
  const { id } = await params;
  const row = await db().get("applications", id);
  if (!row?.cv_path) return new Response("Not found", { status: 404 });
  const name = row.cv_name || row.cv_path.split("/").pop()!;
  const signed = await db().signedUrl(row.cv_path, name);
  if (signed) return Response.redirect(signed, 302);
  const file = await db().readFile(row.cv_path);
  if (!file) return new Response("The file is missing", { status: 404 });
  const ext = row.cv_path.split(".").pop();
  const type = ext === "pdf" ? "application/pdf" : ext === "doc" ? "application/msword" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return new Response(new Uint8Array(file), {
    headers: {
      "content-type": type,
      "content-disposition": `attachment; filename="${name.replace(/[^\w.\- ]/g, "_")}"`,
      "cache-control": "private, no-store",
    },
  });
}
