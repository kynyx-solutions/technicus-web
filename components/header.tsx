"use client";

import { Menu as MenuIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { pillars } from "@/content/services";
import { aboutPages, industries, site } from "@/content/site";

type Menu = "services" | "industries" | "about" | null;

const directLinks = [
  { href: "/work", name: "Work" },
  { href: "/insights", name: "Insights" },
  { href: "/careers", name: "Careers" },
];

/** The wordmark: the name in the serif, closed with a vermilion square. */
export function Logo({ light }: { light?: boolean }) {
  return (
    <span className={`inline-flex items-baseline gap-[3px] font-serif text-[1.7rem] leading-none tracking-[-0.03em] ${light ? "text-paper" : "text-ink"}`}>
      {site.name}
      <span aria-hidden className="inline-block h-[7px] w-[7px] bg-blue" />
    </span>
  );
}

/** A small plus that turns into a minus when its menu is open. */
function Toggle({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative ml-1.5 inline-block h-2 w-2">
      <span className="absolute top-1/2 left-0 h-px w-2 bg-current" />
      <span className={`absolute top-0 left-1/2 h-2 w-px bg-current transition-transform duration-500 ease-(--ease-out-expo) ${open ? "scale-y-0" : ""}`} />
    </span>
  );
}

/**
 * Paper bar with a hairline that appears once the page scrolls under it.
 * Drop-down panels open full width beneath the bar, like an index.
 */
export function Header({ contact }: { contact: { email: string; phone: string; phoneHref: string } }) {
  const pathname = usePathname();
  const [menu, setMenu] = useState<Menu>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuTop, setMenuTop] = useState(72);
  const bar = useRef<HTMLDivElement>(null);

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
    if (mobileOpen && bar.current) setMenuTop(Math.round(bar.current.getBoundingClientRect().bottom));
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const navLink = (active: boolean) => `sweep inline-flex items-center py-1 text-[0.92rem] transition-colors duration-200 ${active ? "text-ink" : "text-ink/65 hover:text-ink"}`;

  const trigger = (id: Exclude<Menu, null>, label: string, base: string) => (
    <button
      type="button"
      aria-expanded={menu === id}
      aria-controls={`menu-${id}`}
      aria-current={isActive(base) ? "page" : undefined}
      onMouseEnter={() => setMenu(id)}
      onFocus={() => setMenu(id)}
      onClick={() => setMenu(menu === id ? null : id)}
      className={navLink(isActive(base) || menu === id)}
    >
      {label}
      <Toggle open={menu === id} />
    </button>
  );

  const panel = "materialize absolute inset-x-0 top-full hidden border-t border-ink/10 border-b border-b-ink/15 bg-paper lg:block";
  const panelHead = (title: string, href: string, label: string) => (
    <div className="col-span-3 flex flex-col items-start">
      <p className="label text-ink">{title}</p>
      <Link href={href} className="group mt-6 inline-flex items-center gap-2 text-[0.9rem] text-ink/70 hover:text-ink">
        <span className="sweep">{label}</span>
        <span aria-hidden className="transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1">
          →
        </span>
      </Link>
    </div>
  );

  return (
    <header
      className={`sticky top-0 z-50 bg-paper transition-[box-shadow] duration-300 ${scrolled || menu ? "shadow-[0_1px_0_rgba(21,20,15,0.12)]" : ""}`}
      onMouseLeave={() => setMenu(null)}
      // Close every menu when a link inside the header is followed.
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) {
          setMenu(null);
          setMobileOpen(false);
        }
      }}
    >
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper">
        Skip to content
      </a>

      <div ref={bar} className="shell flex h-[72px] items-center justify-between gap-8">
        <Link href="/" aria-label={`${site.name} home`} onMouseEnter={() => setMenu(null)}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {trigger("services", "Services", "/services")}
          {trigger("industries", "Industries", "/industries")}
          {directLinks.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={navLink(isActive(l.href))} onMouseEnter={() => setMenu(null)}>
              {l.name}
            </Link>
          ))}
          {trigger("about", "About", "/about")}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn-dark hidden !h-10 !px-5 sm:inline-flex" onMouseEnter={() => setMenu(null)}>
            Contact
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-ink/15 text-ink transition-transform duration-300 active:scale-90 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <MenuIcon size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Laptop: drop-down panels */}
      {menu === "services" && (
        <div id="menu-services" className={panel}>
          <div className="shell grid grid-cols-12 gap-10 py-12">
            {panelHead("Services", "/services", "All services")}
            <div className="col-span-9 grid grid-cols-3 gap-x-10 gap-y-9">
              {pillars.map((p) => (
                <div key={p.slug}>
                  <Link href={`/services/${p.slug}`} className="font-serif text-[1.3rem] leading-tight tracking-[-0.015em] text-ink hover:text-blue">
                    {p.name}
                  </Link>
                  <ul className="mt-3 space-y-1.5 text-[0.87rem] text-muted">
                    {p.capabilities.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/services/${p.slug}/${c.slug}`} className="sweep hover:text-ink">
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {menu === "industries" && (
        <div id="menu-industries" className={panel}>
          <div className="shell grid grid-cols-12 gap-10 py-12">
            {panelHead("Industries", "/industries", "All industries")}
            <ul className="col-span-9 grid grid-cols-3 gap-x-10 gap-y-4">
              {industries.map((i) => (
                <li key={i.slug}>
                  <Link href={`/industries/${i.slug}`} className="font-serif text-[1.3rem] tracking-[-0.015em] text-ink hover:text-blue">
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {menu === "about" && (
        <div id="menu-about" className={panel}>
          <div className="shell grid grid-cols-12 gap-10 py-12">
            {panelHead("About", "/about", "About Technicus")}
            <ul className="col-span-9 grid grid-cols-3 gap-x-10 gap-y-4">
              {aboutPages.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="font-serif text-[1.3rem] tracking-[-0.015em] text-ink hover:text-blue">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Phone and tablet: a full sheet under the bar */}
      {mobileOpen && (
        <div id="mobile-menu" style={{ top: menuTop }} className="materialize fixed inset-x-0 bottom-0 overflow-y-auto border-t border-ink/10 bg-paper px-5 pt-4 pb-10 md:px-10 lg:hidden">
          <nav aria-label="Main" className="font-serif text-[1.9rem] leading-tight tracking-[-0.02em] text-ink">
            <details className="border-b border-ink/15">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4">
                Services <span className="font-sans text-xl font-light">+</span>
              </summary>
              <div className="space-y-5 pb-6 font-sans text-[0.95rem] tracking-normal">
                {pillars.map((p) => (
                  <div key={p.slug}>
                    <Link href={`/services/${p.slug}`} className="font-medium text-ink">
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
                <Link href="/services" className="block font-medium text-blue">
                  All services →
                </Link>
              </div>
            </details>
            <details className="border-b border-ink/15">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4">
                Industries <span className="font-sans text-xl font-light">+</span>
              </summary>
              <ul className="space-y-1.5 pb-6 font-sans text-[0.95rem] tracking-normal text-muted">
                {industries.map((i) => (
                  <li key={i.slug}>
                    <Link href={`/industries/${i.slug}`}>{i.name}</Link>
                  </li>
                ))}
              </ul>
            </details>
            {directLinks.map((l) => (
              <Link key={l.href} href={l.href} className="block border-b border-ink/15 py-4">
                {l.name}
              </Link>
            ))}
            <details className="border-b border-ink/15">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4">
                About <span className="font-sans text-xl font-light">+</span>
              </summary>
              <ul className="space-y-1.5 pb-6 font-sans text-[0.95rem] tracking-normal text-muted">
                {aboutPages.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href}>{p.name}</Link>
                  </li>
                ))}
              </ul>
            </details>
          </nav>
          <div className="mt-10 space-y-3">
            <Link href="/contact" className="btn-dark w-full">
              Contact
            </Link>
            <div className="grid gap-1 pt-4 text-[0.95rem] text-muted">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <a href={contact.phoneHref}>{contact.phone}</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
