import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/admin/client";
import { Badge, btn, Card, fmtDateTime, label, PageHeader, priorityTone, statusTone, timeAgo } from "@/components/admin/ui";
import { formNames } from "@/lib/admin/leads";
import { db } from "@/lib/db";
import { DeleteLead, Notes, Pipeline } from "./lead-parts";

export const metadata: Metadata = { title: "Lead" };

const fieldNames: Record<string, string> = {
  topic: "Topics",
  service: "Services",
  preferredTime: "Preferred time",
  timeZone: "Time zone",
  role: "Their role",
  source: "Sent from page",
};
const hidden = new Set(["name", "email", "phone", "company", "country", "message", "budget", "timeline", "consent", "started", "website", "type"]);

export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  const { id } = await params;
  const lead = await db().get("leads", id);
  if (!lead) notFound();
  const others = (await db().all("leads")).filter((l) => l.id !== lead.id && lead.email && l.email.toLowerCase() === lead.email.toLowerCase()).slice(0, 5);

  const firstName = lead.name.split(" ")[0] || "there";
  const reply = `mailto:${lead.email}?subject=${encodeURIComponent(`Re: your enquiry to Technicus (${lead.ref})`)}&body=${encodeURIComponent(`Hi ${firstName},\n\nThank you for getting in touch with Technicus.\n\n`)}`;
  const digits = lead.phone.replace(/\D/g, "");
  const extra = Object.entries(lead.fields).filter(([k, v]) => v && !hidden.has(k));

  return (
    <>
      <PageHeader
        back={{ href: "/admin/leads", label: "All leads" }}
        title={lead.name || "No name"}
        lead={
          <span className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone[lead.status]}>{label(lead.status)}</Badge>
            <Badge tone={priorityTone[lead.priority]}>{label(lead.priority)} priority</Badge>
            <span className="text-black/55">
              {formNames[lead.type] ?? lead.type} · {lead.ref}
            </span>
            <CopyButton value={lead.ref}>Copy reference</CopyButton>
          </span>
        }
        actions={
          <>
            {lead.email && (
              <a href={reply} className={btn.primary}>
                Reply by email
              </a>
            )}
            {digits.length >= 8 && (
              <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" className={btn.secondary}>
                WhatsApp
              </a>
            )}
            <DeleteLead id={lead.id} />
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card title="Their message">
            <p className="leading-relaxed whitespace-pre-wrap text-black/80">{lead.message || "No message."}</p>
            {lead.services.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {lead.services.map((s) => (
                  <Badge key={s} tone="violet">
                    {s}
                  </Badge>
                ))}
              </div>
            )}
          </Card>
          <Card title="Activity and notes">
            <Notes id={lead.id} notes={lead.notes} />
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Pipeline">
            <Pipeline id={lead.id} status={lead.status} priority={lead.priority} />
          </Card>
          <Card title="Contact">
            <dl className="space-y-3 text-[0.92rem]">
              {[
                ["Email", lead.email && <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>],
                ["Phone", lead.phone && <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>],
                ["Company", lead.company],
                ["Country", lead.country],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={String(k)}>
                    <dt className="text-[0.8rem] text-black/50">{k}</dt>
                    <dd className="break-words">{v}</dd>
                  </div>
                ))}
            </dl>
          </Card>
          <Card title="Details">
            <dl className="space-y-3 text-[0.92rem]">
              {[
                ["Budget", lead.budget],
                ["Timeline", lead.timeline],
                ...extra.map(([k, v]) => [fieldNames[k] ?? k, v]),
                ["Received", `${fmtDateTime(lead.created_at)} (${timeAgo(lead.created_at)})`],
                ["Last updated", timeAgo(lead.updated_at)],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[0.8rem] text-black/50">{k}</dt>
                    <dd className="break-words">{v}</dd>
                  </div>
                ))}
            </dl>
          </Card>
          {others.length > 0 && (
            <Card title="Earlier enquiries from this email">
              <ul className="space-y-2 text-[0.9rem]">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link href={`/admin/leads/${o.id}`} className="flex items-center justify-between gap-2 hover:underline">
                      <span>{formNames[o.type] ?? o.type}</span>
                      <span className="text-black/50">{timeAgo(o.created_at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
