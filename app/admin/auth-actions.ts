"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { clearSession, credentialsMatch, loginBlocked, recordFailure, setSession } from "@/lib/auth";

export type LoginState = { error?: string; email?: string };

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const h = await headers();
  const address = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (loginBlocked(address)) return { email, error: "Too many failed attempts. Try again in 15 minutes." };
  if (!credentialsMatch(email, password)) {
    recordFailure(address);
    return { email, error: "That email and password do not match." };
  }
  await setSession(email);
  redirect("/admin");
}

export async function logout() {
  await clearSession();
  redirect("/admin/login");
}
