"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { contact } from "@/content/company";
import { pillars } from "@/content/services";
import { aboutPages, industries, site } from "@/content/site";

type Menu = "services" | "industries" | "about" | null;

const directLinks = [
  { href: "/work", name: "Work" },
  { href: "/insights", name: "Insights" },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className={`ml-1.5 inline h-2.5 w-2.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const [menu, setMenu] = useState<Menu>(null);
  const [pillarSlug, setPillarSlug] = useState(pillars[0].slug);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(false);

  // Hide on the way down, return on the way up, and take the colour of the
  // section underneath: white text over black sections, black over white.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 400 && y > last);
      last = y;
      const self = header.current;
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 40)
        .find((el) => !self?.contains(el))
        ?.closest("[data-tone]");
      setDark(under?.getAttribute("data-tone") === "dark");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    // A new page has a new section under the header; measure once it has painted.
    const first = window.setTimeout(measure, 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearTimeout(first);
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

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

  const pillar = pillars.find((p) => p.slug === pillarSlug) ?? pillars[0];
  const open = menu !== null;
  // White text over dark sections, unless a light drop-down panel is open.
  const onDark = (dark && !open) || mobileOpen;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const trigger = (id: Exclude<Menu, null>, label: string, base: string) => (
    <button
      type="button"
      aria-expanded={menu === id}
      aria-controls={`menu-${id}`}
      onMouseEnter={() => setMenu(id)}
      onFocus={() => setMenu(id)}
      onClick={() => setMenu(menu === id ? null : id)}
      className={`inline-flex items-center py-2 transition-opacity hover:opacity-60 ${isActive(base) ? "underline underline-offset-[10px]" : ""}`}
    >
      {label}
      <Chevron open={menu === id} />
    </button>
  );

  const panel = "absolute inset-x-0 top-full hidden lg:block";
  const card = "shell rounded-b-[28px] bg-white text-black shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)]";

  return (
    <header
      ref={header}
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-expo)] ${
        onDark ? "text-white" : "text-black"
      } ${scrolled && !open && !mobileOpen ? (onDark ? "bg-black/80 backdrop-blur-md" : "bg-white/85 backdrop-blur-md") : ""} ${
        open ? "bg-white" : ""
      } ${hidden && !open && !mobileOpen ? "-translate-y-full" : ""}`}
      onMouseLeave={() => setMenu(null)}
      // Close every menu when a link inside the header is followed.
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) {
          setMenu(null);
          setMobileOpen(false);
        }
      }}
    >
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded focus:bg-black focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <div className="shell flex h-[84px] items-center justify-between md:h-24">
        <Link href="/" className="text-[1.65rem] font-semibold tracking-[-0.03em]" aria-label={`${site.name} home`}>
          {site.name.toLowerCase()}
        </Link>

        <div className="flex items-center gap-9">
          <nav aria-label="Main" className="hidden items-center gap-9 text-[1.05rem] lg:flex">
            {trigger("services", "Services", "/services")}
            {trigger("industries", "Industries", "/industries")}
            {directLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className="py-2 transition-opacity hover:opacity-60 aria-[current=page]:underline aria-[current=page]:underline-offset-[10px]"
                onMouseEnter={() => setMenu(null)}
              >
                {l.name}
              </Link>
            ))}
            {trigger("about", "About", "/about")}
            <Link
              href="/careers"
              aria-current={isActive("/careers") ? "page" : undefined}
              className="py-2 transition-opacity hover:opacity-60 aria-[current=page]:underline aria-[current=page]:underline-offset-[10px]"
              onMouseEnter={() => setMenu(null)}
            >
              Careers
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              className={`btn px-6 py-4 ${pathname === "/contact" ? (onDark ? "border border-white" : "border border-black") : onDark ? "bg-white text-black hover:bg-smoke" : "bg-black text-white hover:bg-coal"}`}
              onMouseEnter={() => setMenu(null)}
            >
              Talk to us
            </Link>
            <button
              type="button"
              className={`btn border px-5 py-4 lg:hidden ${onDark ? "border-white/50" : "border-black/30"}`}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* Laptop: drop-down panels */}
      {menu === "services" && (
        <div id="menu-services" className={panel}>
          <div className={`${card} grid grid-cols-12 gap-10 px-12 pt-6 pb-12 xl:px-12`}>
            <ul className="col-span-5">
              {pillars.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/services/${p.slug}`}
                    onMouseEnter={() => setPillarSlug(p.slug)}
                    onFocus={() => setPillarSlug(p.slug)}
                    className={`block py-1.5 text-[1.7rem] tracking-[-0.015em] transition-colors ${p.slug === pillar.slug ? "text-black" : "text-black/30"}`}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="col-span-4 pt-2">
              <p className="mb-5 text-[0.95rem] text-black/55">{pillar.summary}</p>
              <ul className="space-y-2.5 text-[1.1rem]">
                {pillar.capabilities.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/services/${pillar.slug}/${c.slug}`} className="sweep">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="col-span-3 space-y-3 border-l border-black/10 pt-2 pl-10 text-[1rem]">
              {[
                { href: "/services", name: "All services" },
                { href: "/technologies", name: "Technologies" },
                { href: "/about/how-we-work", name: "How we work" },
                { href: "/work", name: "Case studies" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="sweep">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {menu === "industries" && (
        <div id="menu-industries" className={panel}>
          <div className={`${card} px-12 pt-6 pb-12 xl:px-12`}>
            <ul className="grid max-w-4xl grid-cols-2 gap-x-12 gap-y-2 text-[1.5rem] tracking-[-0.015em]">
              {industries.map((i) => (
                <li key={i.slug}>
                  <Link href={`/industries/${i.slug}`} className="sweep">
                    {i.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/industries" className="sweep mt-8 inline-block text-[1rem]">
              All industries
            </Link>
          </div>
        </div>
      )}

      {menu === "about" && (
        <div id="menu-about" className={panel}>
          <ul className={`${card} flex flex-wrap gap-x-12 gap-y-2 px-12 pt-6 pb-12 text-[1.5rem] tracking-[-0.015em] xl:px-12`}>
            {aboutPages.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="sweep">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Phone and tablet: full-screen menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="fixed inset-x-0 top-[84px] bottom-0 overflow-y-auto bg-black px-5 pt-4 pb-10 text-white md:top-24 md:px-8 lg:hidden">
          <nav aria-label="Main" className="text-[2.4rem] leading-tight font-medium tracking-[-0.02em]">
            <details className="border-b border-white/15">
              <summary className="cursor-pointer list-none py-4">Services</summary>
              <div className="space-y-6 pb-6 text-base font-normal tracking-normal">
                {pillars.map((p) => (
                  <div key={p.slug}>
                    <Link href={`/services/${p.slug}`} className="text-lg">
                      {p.name}
                    </Link>
                    <ul className="mt-2 space-y-1.5 text-white/60">
                      {p.capabilities.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/services/${p.slug}/${c.slug}`}>{c.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <Link href="/services" className="block underline underline-offset-4">
                  All services
                </Link>
                <Link href="/technologies" className="block underline underline-offset-4">
                  Technologies
                </Link>
              </div>
            </details>
            <details className="border-b border-white/15">
              <summary className="cursor-pointer list-none py-4">Industries</summary>
              <ul className="space-y-2 pb-6 text-base font-normal tracking-normal text-white/60">
                {industries.map((i) => (
                  <li key={i.slug}>
                    <Link href={`/industries/${i.slug}`}>{i.name}</Link>
                  </li>
                ))}
              </ul>
            </details>
            {directLinks.map((l) => (
              <Link key={l.href} href={l.href} className="block border-b border-white/15 py-4">
                {l.name}
              </Link>
            ))}
            <details className="border-b border-white/15">
              <summary className="cursor-pointer list-none py-4">About</summary>
              <ul className="space-y-2 pb-6 text-base font-normal tracking-normal text-white/60">
                {aboutPages.map((p) => (
                  <li key={p.href}>
                    <Link href={p.href}>{p.name}</Link>
                  </li>
                ))}
              </ul>
            </details>
            <Link href="/careers" className="block border-b border-white/15 py-4">
              Careers
            </Link>
          </nav>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={`mailto:${contact.email}`} className="btn-outline-light">
              {contact.email}
            </a>
            <a href={contact.phoneHref} className="btn-outline-light">
              {contact.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
