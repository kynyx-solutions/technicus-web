"use client";

import {
  BarChart3,
  Briefcase,
  ExternalLink,
  FileText,
  Gauge,
  Home,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Phone,
  Search,
  Settings,
  ShieldCheck,
  Type,
  UserRoundSearch,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/app/admin/auth-actions";

type Counts = { leads: number; applications: number };

const groups = (c: Counts) => [
  { title: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }] },
  {
    title: "Inbox",
    items: [
      { href: "/admin/leads", label: "Leads", icon: Inbox, count: c.leads },
      { href: "/admin/applications", label: "Job applications", icon: UserRoundSearch, count: c.applications },
    ],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/home", label: "Home page", icon: Home },
      { href: "/admin/content/articles", label: "Articles", icon: FileText },
      { href: "/admin/content/projects", label: "Case studies", icon: BarChart3 },
      { href: "/admin/content/jobs", label: "Job openings", icon: Briefcase },
      { href: "/admin/content/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { href: "/admin/contact", label: "Contact & socials", icon: Phone },
    ],
  },
  {
    title: "SEO",
    items: [
      { href: "/admin/seo", label: "SEO health", icon: ShieldCheck, exact: true },
      { href: "/admin/seo/pages", label: "Titles & descriptions", icon: Type },
      { href: "/admin/seo/keywords", label: "Keywords", icon: KeyRound },
      { href: "/admin/seo/speed", label: "Page speed", icon: Gauge },
      { href: "/admin/seo/settings", label: "Search settings", icon: Search },
    ],
  },
  { title: "", items: [{ href: "/admin/settings", label: "Settings", icon: Settings }] },
];

export function Sidebar({ email, counts }: { email: string; counts: Counts }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    // Close the phone menu after navigating.
    const t = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const nav = (
    <nav className="flex h-full flex-col">
      <Link href="/admin" className="px-3 pt-1 pb-4 text-xl font-semibold tracking-[-0.02em]">
        technicus <span className="font-normal text-black/40">admin</span>
      </Link>
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {groups(counts).map((g, gi) => (
          <div key={gi}>
            {g.title && <p className="mb-1.5 px-3 text-[0.72rem] font-medium tracking-[0.06em] text-black/40 uppercase">{g.title}</p>}
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = "exact" in item && item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-full px-3 py-[0.4rem] text-[0.9rem] transition-colors ${
                        active ? "bg-black text-white" : "text-black/70 hover:bg-black/5 hover:text-black"
                      }`}
                    >
                      <Icon size={17} strokeWidth={1.8} aria-hidden />
                      <span className="flex-1">{item.label}</span>
                      {"count" in item && item.count ? (
                        <span className={`rounded-full px-2 py-0.5 text-[0.72rem] font-medium ${active ? "bg-white text-black" : "bg-[#e6ecff] text-[#2b48b8]"}`}>
                          {item.count}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-0.5 border-t border-black/10 pt-3">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-full px-3 py-2 text-[0.92rem] text-black/70 hover:bg-black/5 hover:text-black">
          <ExternalLink size={17} strokeWidth={1.8} aria-hidden /> View website
        </a>
        <div className="flex items-center gap-3 px-3 py-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black text-sm font-medium text-white uppercase">{email.charAt(0)}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.85rem]">{email}</span>
            <span className="block text-[0.75rem] text-black/45">Owner</span>
          </span>
          <form action={logout}>
            <button type="submit" title="Sign out" aria-label="Sign out" className="rounded-full p-2 text-black/55 hover:bg-black/5 hover:text-black">
              <LogOut size={17} strokeWidth={1.8} />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-white px-3 py-5 lg:block">{nav}</aside>
      <div className="sticky top-0 z-30 flex items-center justify-between bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/admin" className="text-lg font-semibold tracking-[-0.02em]">
          technicus <span className="font-normal text-black/40">admin</span>
        </Link>
        <button type="button" aria-label="Open menu" onClick={() => setOpen(true)} className="rounded-full p-2 hover:bg-black/5">
          <Menu size={20} />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white px-3 py-5">
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute top-4 right-3 rounded-full p-2 hover:bg-black/5">
              <X size={20} />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
