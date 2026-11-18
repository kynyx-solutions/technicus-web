import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// One owner account, set by environment variables:
//   ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET (a long random string)
// A successful sign-in sets a signed cookie that scripts on the page cannot read.
// Changing ADMIN_EMAIL, ADMIN_PASSWORD or AUTH_SECRET signs everyone out.

export const SESSION_COOKIE = "technicus_admin";
const HOURS = Number(process.env.ADMIN_SESSION_HOURS || 12);

export const adminConfigured = () => Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.AUTH_SECRET);

const sha = (v: string) => createHash("sha256").update(v).digest();
const secret = () => `${process.env.AUTH_SECRET}:${process.env.ADMIN_EMAIL}:${sha(process.env.ADMIN_PASSWORD ?? "").toString("hex")}`;
const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

/** Compares in constant time, so the response time reveals nothing. */
export function credentialsMatch(email: string, password: string) {
  if (!adminConfigured()) return false;
  const a = timingSafeEqual(sha(email.trim().toLowerCase()), sha(process.env.ADMIN_EMAIL!.trim().toLowerCase()));
  const b = timingSafeEqual(sha(password), sha(process.env.ADMIN_PASSWORD!));
  return a && b;
}

export function createToken(email: string) {
  const payload = Buffer.from(JSON.stringify({ sub: email, exp: Date.now() + HOURS * 3600_000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readToken(token: string | undefined): { email: string } | null {
  if (!token || !adminConfigured()) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { sub: string; exp: number };
    return data.exp > Date.now() ? { email: data.sub } : null;
  } catch {
    return null;
  }
}

export async function setSession(email: string) {
  (await cookies()).set(SESSION_COOKIE, createToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: HOURS * 3600,
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession() {
  return readToken((await cookies()).get(SESSION_COOKIE)?.value);
}

/** For every admin page and action: the signed-in owner, or a redirect to sign in. */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

// Failed sign-ins: at most 10 per 15 minutes from one address.
const failures = new Map<string, number[]>();
export function loginBlocked(address: string) {
  const recent = (failures.get(address) ?? []).filter((t) => Date.now() - t < 15 * 60_000);
  failures.set(address, recent);
  return recent.length >= 10;
}
export function recordFailure(address: string) {
  failures.set(address, [...(failures.get(address) ?? []), Date.now()]);
}
