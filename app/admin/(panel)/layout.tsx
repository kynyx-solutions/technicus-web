import { ConfirmProvider, Toaster } from "@/components/admin/client";
import { Sidebar } from "@/components/admin/sidebar";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

// Every admin page renders fresh data on each request.
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const [leads, applications] = await Promise.all([
    db().all("leads").catch(() => []),
    db().all("applications").catch(() => []),
  ]);
  const counts = {
    leads: leads.filter((l) => l.status === "new").length,
    applications: applications.filter((a) => a.status === "new").length,
  };
  return (
    <Toaster>
      <ConfirmProvider>
        <Sidebar email={session.email} counts={counts} />
        <div className="lg:pl-64">
          <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">{children}</main>
        </div>
      </ConfirmProvider>
    </Toaster>
  );
}
