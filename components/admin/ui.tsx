// Building blocks for the admin, in the site's style: white and black, Inter,
// rounded cards on a light grey page. Server-safe (no hooks); interactive pieces
// are in components/admin/client.tsx.
import Link from "next/link";

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-coal disabled:opacity-50",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:border-black disabled:opacity-50",
  ghost: "inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-black/70 transition-colors hover:bg-black/5 hover:text-black",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-full border border-[#e9b8c6] bg-white px-5 py-2.5 text-sm font-medium text-[#b4234f] transition-colors hover:bg-[#fdf0f4] disabled:opacity-50",
  small: "!px-3.5 !py-1.5 !text-[0.8rem]",
};

export const input =
  "w-full rounded-xl border border-black/12 bg-white px-3.5 py-2.5 text-[0.95rem] outline-none transition-colors placeholder:text-black/35 focus:border-black";

export function PageHeader({ title, lead, actions, back }: { title: string; lead?: React.ReactNode; actions?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {back && (
          <Link href={back.href} className="mb-3 inline-flex items-center gap-1.5 text-sm text-black/55 hover:text-black">
            <span aria-hidden>←</span> {back.label}
          </Link>
        )}
        <h1 className="text-[1.9rem] leading-tight font-[560] tracking-[-0.02em] md:text-[2.3rem]">{title}</h1>
        {lead && <p className="mt-2 max-w-2xl text-black/60">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Card({ title, action, children, className = "", padded = true }: { title?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string; padded?: boolean }) {
  return (
    <section className={`rounded-[22px] bg-white ${padded ? "p-5 md:p-6" : ""} ${className}`}>
      {(title || action) && (
        <div className={`flex items-center justify-between gap-3 ${padded ? "mb-4" : "px-5 pt-5 pb-3 md:px-6"}`}>
          {title && <h2 className="text-[1.05rem] font-medium tracking-[-0.01em]">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

const tones = {
  neutral: "bg-black/[0.06] text-black/70",
  blue: "bg-[#e6ecff] text-[#2b48b8]",
  green: "bg-mint text-[#14715f]",
  amber: "bg-[#fff2d9] text-[#8a5a00]",
  red: "bg-[#fde8ee] text-[#b4234f]",
  violet: "bg-lavender text-indigo",
  black: "bg-black text-white",
};
export type Tone = keyof typeof tones;

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.78rem] font-medium whitespace-nowrap ${tones[tone]}`}>{children}</span>;
}

export const statusTone: Record<string, Tone> = {
  new: "blue",
  contacted: "violet",
  qualified: "amber",
  converted: "green",
  closed: "neutral",
  shortlisted: "violet",
  interview: "amber",
  offered: "blue",
  hired: "green",
  rejected: "neutral",
};
export const priorityTone: Record<string, Tone> = { high: "red", medium: "amber", low: "neutral" };

export const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function Field({ label: text, hint, children, className = "" }: { label: string; hint?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[0.85rem] font-medium text-black/75">{text}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[0.8rem] text-black/50">{hint}</span>}
    </label>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-[22px] border border-dashed border-black/15 bg-white px-6 py-14 text-center">
      <p className="text-lg font-medium">{title}</p>
      {text && <p className="mx-auto mt-2 max-w-md text-black/55">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Notice({ tone = "amber", children }: { tone?: "amber" | "blue" | "red"; children: React.ReactNode }) {
  const t = { amber: "bg-[#fff6e3] text-[#6b4700]", blue: "bg-lavender text-[#2c2a63]", red: "bg-[#fde8ee] text-[#8c1b3d]" }[tone];
  return <div className={`rounded-2xl px-4 py-3 text-[0.9rem] ${t}`}>{children}</div>;
}

export function Stat({ label: text, value, sub, href }: { label: string; value: React.ReactNode; sub?: React.ReactNode; href?: string }) {
  const body = (
    <>
      <p className="text-[0.85rem] text-black/55">{text}</p>
      <p className="mt-2 text-[2rem] leading-none font-[560] tracking-[-0.02em]">{value}</p>
      {sub && <p className="mt-2 text-[0.82rem] text-black/55">{sub}</p>}
    </>
  );
  return href ? (
    <Link href={href} className="block rounded-[22px] bg-white p-5 transition-shadow hover:shadow-[0_0_0_1px_rgba(0,0,0,0.12)] md:p-6">
      {body}
    </Link>
  ) : (
    <div className="rounded-[22px] bg-white p-5 md:p-6">{body}</div>
  );
}

export function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const units: [number, string][] = [
    [60, "minute"],
    [3600, "hour"],
    [86400, "day"],
    [604800, "week"],
    [2592000, "month"],
    [31536000, "year"],
  ];
  let unit = units[0];
  for (const u of units) if (s >= u[0]) unit = u;
  const n = Math.floor(s / unit[0]);
  return `${n} ${unit[1]}${n === 1 ? "" : "s"} ago`;
}

export const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 text-left text-[0.78rem] font-medium tracking-[0.02em] text-black/50 uppercase ${className}`}>{children}</th>;
}
