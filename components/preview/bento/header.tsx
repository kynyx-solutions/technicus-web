"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Wordmark, nav } from "./brand";

export function BentoHeader() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="bnt-header" data-solid={solid || open}>
      <div className="bnt-wrap flex h-16 items-center justify-between gap-6">
        <Link href="/preview/bento" aria-label="Technicus home">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[14.5px]">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="bnt-navlink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/contact" className="bnt-btn bnt-btn-ink px-4 py-2.5 text-[14px]">
            Contact <ArrowRight size={15} />
          </Link>
          <button
            ref={toggle}
            type="button"
            className="bnt-ctl lg:hidden"
            aria-expanded={open}
            aria-controls="bnt-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="bnt-menu" aria-label="Main" className="bnt-menu border-t border-[var(--bnt-line)] bg-[var(--bnt-bg)] lg:hidden">
          <ul className="bnt-wrap flex flex-col py-3">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="block border-b border-[var(--bnt-line)] py-4 text-[22px] font-semibold tracking-[-0.02em]" onClick={() => setOpen(false)}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
