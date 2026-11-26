"use client";

import { ChevronDown, Mail, Menu as MenuIcon, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { pillars } from "@/content/services";
import { aboutPages, industries, site } from "@/content/site";

type Menu = "services" | "industries" | "about" | null;

const directLinks = [
  { href: "/work", name: "Case studies" },
  { href: "/insights", name: "Insights" },
  { href: "/careers", name: "Careers" },
];

/** The wordmark: a blue square with a "t", and the name. */
export function Logo({ light }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-md bg-blue font-heading text-[1.05rem] font-extrabold text-white">
        t
      </span>
      <span className={`font-heading text-[1.35rem] font-bold tracking-[-0.02em] ${light ? "text-white" : "text-navy"}`}>{site.name.toLowerCase()}</span>
    </span>
  );
}

export function Header({ contact }: { contact: { email: string; phone: string; phoneHref: string } }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState<Menu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const navLink = (active: boolean) =>
    `relative inline-flex h-[72px] items-center text-[0.95rem] font-medium transition-colors hover:text-blue ${active ? "text-blue after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-blue" : "text-ink"}`;

  const trigger = (id: Exclude<Menu, null>, label: string, base: string) => (
    <button
      type="button"
      aria-expanded={menu === id}
      aria-controls={`menu-${id}`}
      onMouseEnter={() => setMenu(id)}
      onFocus={() => setMenu(id)}
      onClick={() => setMenu(menu === id ? null : id)}
      className={`${navLink(isActive(base))} gap-1`}
    >
      {label}
      <ChevronDown size={15} className={`transition-transform ${menu === id ? "rotate-180" : ""}`} aria-hidden />
    </button>
  );

  const panel = "absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_24px_48px_-24px_rgba(15,23,42,0.25)] lg:block";

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow ${scrolled || menu ? "shadow-[0_1px_0_#e2e8f0,0_8px_24px_-16px_rgba(15,23,42,0.18)]" : "shadow-[0_1px_0_#e2e8f0]"}`}
      onMouseLeave={() => setMenu(null)}
      // Close every menu when a link inside the header is followed.
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) {
          setMenu(null);
          setMobileOpen(false);
        }
      }}
    >
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded focus:bg-blue focus:px-3 focus:py-2 focus:text-white">
        Skip to content
      </a>

      {/* Utility bar */}
      <div className="hidden bg-navy text-white/80 md:block">
        <div className="shell flex h-9 items-center justify-between text-[0.8rem]">
          <p>Technology consultancy · Strategy, engineering, AI, cloud and growth</p>
          <div className="flex items-center gap-6">
            <a href={`mailto:${contact.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
              <Mail size={13} aria-hidden /> {contact.email}
            </a>
            <a href={contact.phoneHref} className="inline-flex items-center gap-1.5 hover:text-white">
              <Phone size={13} aria-hidden /> {contact.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label={`${site.name} home`} onMouseEnter={() => setMenu(null)}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {trigger("services", "Services", "/services")}
          {trigger("industries", "Industries", "/industries")}
          {directLinks.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={navLink(isActive(l.href))} onMouseEnter={() => setMenu(null)}>
              {l.name}
            </Link>
          ))}
          {trigger("about", "About", "/about")}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/contact" className="btn-dark hidden !px-5 !py-3 sm:inline-flex" onMouseEnter={() => setMenu(null)}>
            Contact us
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-navy lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Laptop: drop-down panels */}
      {menu === "services" && (
        <div id="menu-services" className={panel}>
          <div className="shell grid grid-cols-12 gap-8 py-8">
            <div className="col-span-9 grid grid-cols-3 gap-x-8 gap-y-7">
              {pillars.map((p) => (
                <div key={p.slug}>
                  <Link href={`/services/${p.slug}`} className="font-heading text-[0.98rem] font-semibold text-navy hover:text-blue">
                    {p.name}
                  </Link>
                  <ul className="mt-2.5 space-y-1.5 text-[0.88rem] text-muted">
                    {p.capabilities.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/services/${p.slug}/${c.slug}`} className="hover:text-blue">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="col-span-3 rounded-xl bg-mist p-6">
              <p className="font-heading font-semibold text-navy">Not sure where to start?</p>
              <p className="mt-2 text-[0.9rem] text-muted">Tell us the problem and we will recommend the right mix of services.</p>
              <ul className="mt-5 space-y-2 text-[0.9rem] font-medium">
                {[
                  { href: "/services", name: "All services" },
                  { href: "/technologies", name: "Technologies" },
                  { href: "/about/how-we-work", name: "How we work" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-blue hover:underline">
                      {l.name} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {menu === "industries" && (
        <div id="menu-industries" className={panel}>
          <div className="shell py-8">
            <ul className="grid grid-cols-4 gap-x-8 gap-y-3 text-[0.95rem] font-medium">
              {industries.map((i) => (
                <li key={i.slug}>
                  <Link href={`/industries/${i.slug}`} className="text-ink hover:text-blue">
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/industries" className="mt-6 inline-block text-[0.9rem] font-semibold text-blue hover:underline">
              All industries →
            </Link>
          </div>
        </div>
      )}

      {menu === "about" && (
        <div id="menu-about" className={panel}>
          <ul className="shell flex flex-wrap gap-x-10 gap-y-3 py-7 text-[0.95rem] font-medium">
            {aboutPages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="text-ink hover:text-blue">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Phone and tablet: full-screen menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto border-t border-line bg-white px-5 pt-2 pb-10 md:top-[108px] md:px-8 lg:hidden">
          <nav aria-label="Main" className="font-heading text-[1.15rem] font-semibold text-navy">
            <details className="border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4">
                Services <ChevronDown size={18} aria-hidden />
              </summary>
              <div className="space-y-5 pb-5 font-sans text-[0.95rem] font-normal">
                {pillars.map((p) => (
                  <div key={p.slug}>
                    <Link href={`/services/${p.slug}`} className="font-semibold text-navy">
                      {p.name}
                    </Link>
                    <ul className="mt-1.5 space-y-1 text-muted">
                      {p.capabilities.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/services/${p.slug}/${c.slug}`}>{c.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link href="/services" className="block font-semibold text-blue">
                  All services →
                </Link>
              </div>
            </details>
            <details className="border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4">
                Industries <ChevronDown size={18} aria-hidden />
              </summary>
              <ul className="space-y-1.5 pb-5 font-sans text-[0.95rem] font-normal text-muted">
                {industries.map((i) => (
                  <li key={i.slug}>
                    <Link href={`/industries/${i.slug}`}>{i.name}</Link>
                  </li>
                ))}
              </ul>
            </details>
            {directLinks.map((l) => (
              <Link key={l.href} href={l.href} className="block border-b border-line py-4">
                {l.name}
              </Link>
            ))}
            <details className="border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4">
                About <ChevronDown size={18} aria-hidden />
              </summary>
              <ul className="space-y-1.5 pb-5 font-sans text-[0.95rem] font-normal text-muted">
                {aboutPages.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href}>{p.name}</Link>
                  </li>
                ))}
              </ul>
            </details>
          </nav>
          <div className="mt-8 space-y-3">
            <Link href="/contact" className="btn-dark w-full">
              Contact us
            </Link>
            <a href={`mailto:${contact.email}`} className="btn-outline w-full">
              {contact.email}
            </a>
            <a href={contact.phoneHref} className="btn-outline w-full">
              {contact.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
