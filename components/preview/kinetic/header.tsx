"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { s } from "./styles";
import { nav } from "./nav";


function Roll({ children }: { children: string }) {
  return (
    <span className={s.roll}>
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

/* Fixed ink bar. Hides while scrolling down, returns on the way up. */
export function KineticHeader() {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const first = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > 160 && y > last + 2 ? true : y < last - 2 ? false : (h) => h);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className={s.header} data-solid={solid} data-hidden={hidden && !open}>
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-4 md:h-[4.5rem] md:px-10">
          <Link href="/preview/kinetic" className={`${s.display} text-[1.7rem] leading-none tracking-[-0.03em]`}>
            Technicus<span className="text-(--k-sig)">.</span>
          </Link>
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.95rem] font-medium">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="py-2">
                    <Roll>{n.label}</Roll>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/contact" className={`${s.btn} hidden !py-3 sm:inline-flex`}>
              <Roll>Contact us</Roll>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <button
              ref={toggle}
              type="button"
              className="grid size-11 place-items-center lg:hidden"
              aria-expanded={open}
              aria-controls="k-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu size={26} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div id="k-menu" className={s.menu} data-open={open} role="dialog" aria-modal="true" aria-label="Menu">
        <div className="flex h-16 items-center justify-between px-4">
          <span className={`${s.display} text-[1.7rem] leading-none`}>Technicus.</span>
          <button
            type="button"
            className="grid size-11 place-items-center"
            aria-label="Close menu"
            onClick={() => {
              setOpen(false);
              toggle.current?.focus();
            }}
          >
            <X size={28} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile" className="px-4 pt-8">
          <ul>
            {nav.map((n, i) => (
              <li key={n.href} className="border-b border-(--k-ink)/20">
                <Link ref={i === 0 ? first : undefined} href={n.href} className={`${s.display} ${s.menuLink} block py-2`} onClick={() => setOpen(false)}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className={`${s.btn} ${s.btnInk} mt-10`} onClick={() => setOpen(false)}>
            Contact us <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </>
  );
}
