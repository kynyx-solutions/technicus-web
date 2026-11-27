"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { s } from "./styles";
import { useScrollFrame } from "./motion";

const nav = [
  { href: "/services", name: "Services" },
  { href: "/industries", name: "Industries" },
  { href: "/work", name: "Work" },
  { href: "/insights", name: "Insights" },
  { href: "/careers", name: "Careers" },
  { href: "/about", name: "About" },
];

/** Transparent over the hero, solid once the page scrolls; hides while scrolling down. */
export function Header() {
  const ref = useRef<HTMLElement>(null);
  const last = useRef(0);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const y = scrollY;
    el.dataset.solid = String(y > 40);
    const down = y > last.current + 4;
    const up = y < last.current - 4;
    if (down && y > innerHeight * 0.9) el.dataset.hidden = "true";
    else if (up || y < 200) el.dataset.hidden = "false";
    last.current = y;
  }, []);
  useScrollFrame(update);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    const btn = menuBtn.current;
    return () => {
      root.style.overflow = "";
      removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  return (
    <header ref={ref} className={s.header} data-solid="false">
      <div className={`${s.shell} ${s.headerRow}`}>
        <Link href="/preview/video" className={s.wordmark} aria-label="Technicus, home">
          Technicus<i aria-hidden="true" />
        </Link>
        <nav aria-label="Main" className={s.nav}>
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className={s.navLink}>
              {n.name}
            </Link>
          ))}
        </nav>
        <Link href="/contact" className={s.headerCta}>
          Contact us
        </Link>
        <button
          ref={menuBtn}
          type="button"
          className={s.menuBtn}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>
      </div>
      {open && (
        <div className={s.mobileMenu} role="dialog" aria-modal="true" aria-label="Menu">
          <div className={`${s.shell} ${s.headerRow}`}>
            <span className={s.wordmark}>
              Technicus<i aria-hidden="true" />
            </span>
            <button type="button" className={s.menuBtn} aria-label="Close menu" onClick={() => setOpen(false)} autoFocus>
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <nav aria-label="Main" className={s.shell}>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} onClick={() => setOpen(false)}>
                    {n.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/contact" className={s.btn} style={{ marginTop: 32 }}>
              Contact us <ArrowRight size={18} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
