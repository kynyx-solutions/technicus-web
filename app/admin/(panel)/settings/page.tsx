import type { Metadata } from "next";
import { logout } from "@/app/admin/auth-actions";
import { Badge, btn, Card, PageHeader } from "@/components/admin/ui";
import { site } from "@/content/site";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { email } = await requireAdmin();
  const store = db();
  let connected = true;
  try {
    await store.getSetting("seo");
  } catch {
    connected = false;
  }
  const set = (name: string) => Boolean(process.env[name]);
  const rows: { name: string; ok: boolean; on: string; off: string; how: string }[] = [
    {
      name: "Database",
      ok: store.kind === "supabase" && connected,
      on: "Supabase, connected",
      off: store.kind === "supabase" ? "Supabase is set but cannot be reached" : "Local files (development only)",
      how: "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run supabase/migrations/20261118000000_admin.sql once in the Supabase SQL editor.",
    },
    {
      name: "Email alerts",
      ok: set("RESEND_API_KEY") && set("NOTIFY_EMAIL") && set("MAIL_FROM"),
      on: "New leads and applications are emailed",
      off: "No emails are sent",
      how: "Set RESEND_API_KEY, NOTIFY_EMAIL (who receives them) and MAIL_FROM (a sender on a domain verified in Resend).",
    },
    { name: "Webhook", ok: set("LEAD_WEBHOOK_URL"), on: "Leads are also posted to a webhook", off: "Not set (optional)", how: "Set LEAD_WEBHOOK_URL to post every lead as JSON to a chat channel or CRM." },
    { name: "Public address", ok: set("SITE_URL"), on: process.env.SITE_URL ?? "", off: `Not set; using ${site.url}`, how: "Set SITE_URL to the live address, used for email links and PageSpeed tests." },
    { name: "PageSpeed key", ok: set("PAGESPEED_API_KEY"), on: "Configured", off: "Not set (optional; tests are rate-limited without it)", how: "Create a free API key in Google Cloud and set PAGESPEED_API_KEY." },
  ];
  return (
    <>
      <PageHeader title="Settings" lead="The admin account and the services the site is connected to." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Account">
          <p className="text-[0.85rem] text-black/50">Signed in as</p>
          <p className="font-medium break-all">{email}</p>
          <p className="mt-1">
            <Badge>Owner</Badge>
          </p>
          <p className="mt-4 text-[0.85rem] text-black/55">
            The account is set by ADMIN_EMAIL and ADMIN_PASSWORD on the server. Change them there to change the password; everyone is signed out.
          </p>
          <form action={logout} className="mt-4">
            <button type="submit" className={btn.secondary}>
              Sign out
            </button>
          </form>
        </Card>
        <Card title="Connections" className="lg:col-span-2">
          <ul className="divide-y divide-black/6">
            {rows.map((r) => (
              <li key={r.name} className="py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{r.name}</span>
                  <Badge tone={r.ok ? "green" : "amber"}>{r.ok ? r.on : r.off}</Badge>
                </div>
                {!r.ok && <p className="mt-1 text-[0.85rem] text-black/55">{r.how}</p>}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
