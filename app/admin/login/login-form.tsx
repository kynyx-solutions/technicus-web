"use client";

import { useActionState } from "react";
import { btn, input } from "@/components/admin/ui";
import { login, type LoginState } from "../auth-actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Email</span>
        <input name="email" type="email" required autoComplete="username" defaultValue={state.email} className={input} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Password</span>
        <input name="password" type="password" required autoComplete="current-password" className={input} />
      </label>
      {state.error && (
        <p role="alert" className="rounded-xl bg-[#fde8ee] px-3.5 py-2.5 text-sm text-[#8c1b3d]">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className={`${btn.primary} w-full !py-3`}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
