import { NextResponse, type NextRequest } from "next/server";

// A quick first check for the admin: no session cookie, go to the sign-in page.
// The real check (the cookie's signature and expiry) runs on the server in every
// admin page and action, through requireAdmin() in lib/auth.ts.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!request.cookies.has("technicus_admin")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
