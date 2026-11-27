"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark, nav } from "./brand";

export function AskHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled || open ? "border-[var(--ask-line)] bg-[var(--ask-paper)]" : "border-transparent bg-[var(--ask-paper)]/0"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-4 sm:px-6 md:h-[72px] lg:px-10">
        <Link href="/preview/ask" aria-label="Technicus home" className="ask-press -m-1 p-1">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-full px-3.5 py-2 text-[14.5px] text-[var(--ask-ink-2)] transition-colors hover:bg-[var(--ask-paper-2)] hover:text-[var(--ask-ink)]"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/contact"
            className="ask-press hidden rounded-full bg-[var(--ask-ink)] px-5 py-2.5 text-[14px] font-medium text-[var(--ask-paper)] hover:bg-[var(--ask-accent)] sm:inline-flex"
          >
            Contact
          </Link>
          <button
            type="button"
            className="ask-press grid size-10 place-items-center rounded-full border border-[var(--ask-line)] lg:hidden"
            aria-expanded={open}
            aria-controls="ask-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="ask-mobile-nav" aria-label="Main" className="ask-fade border-t border-[var(--ask-line)] px-4 pt-2 pb-6 sm:px-6 lg:hidden">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="flex items-center justify-between border-b border-[var(--ask-line-2)] py-3.5 text-[19px]" onClick={() => setOpen(false)}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="ask-press mt-5 flex justify-center rounded-full bg-[var(--ask-ink)] px-5 py-3.5 font-medium text-[var(--ask-paper)]"
          >
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
}
