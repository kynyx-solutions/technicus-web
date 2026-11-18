import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Notice } from "@/components/admin/ui";
import { adminConfigured, getSession } from "@/lib/auth";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <p className="mb-8 text-center text-2xl font-semibold tracking-[-0.02em]">
          technicus <span className="font-normal text-black/40">admin</span>
        </p>
        <div className="rounded-[26px] bg-white p-7">
          {adminConfigured() ? (
            <LoginForm />
          ) : (
            <Notice>
              The admin account is not set up. Add <code>ADMIN_EMAIL</code>, <code>ADMIN_PASSWORD</code> and <code>AUTH_SECRET</code> to the
              server&apos;s environment (see <code>.env.example</code>), then restart.
            </Notice>
          )}
        </div>
      </div>
    </main>
  );
}
