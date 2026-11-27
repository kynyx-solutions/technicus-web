import type { ReactNode } from "react";

/** Crosshair mark centred on a frame intersection. */
export function Cross({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`bp-cross ${className}`} />;
}

/** |<---- label ---->| */
export function Dim({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div aria-hidden="true" className={`bp-dim ${className}`}>
      <span className="bp-dim-line bp-start" />
      <span className="bp-label whitespace-nowrap text-[10px]">{label}</span>
      <span className="bp-dim-line bp-end" />
    </div>
  );
}

/** Title block strip at the top of every sheet. Labels in words only. */
export function TitleBlock({ sheet, dark = false }: { sheet: string; dark?: boolean }) {
  const line = dark ? "border-[var(--bp-night-line)]" : "border-[var(--bp-line)]";
  const muted = dark ? "text-white/45" : "text-[var(--bp-muted)]";
  const strong = dark ? "text-white" : "text-[var(--bp-ink)]";
  const cell = `flex items-center gap-2 border-r ${line} px-4 py-2.5 sm:px-6`;
  return (
    <div className={`bp-label flex border-b ${line}`}>
      <div className={cell}>
        <span className={muted}>Sheet</span>
        <span className={strong}>{sheet}</span>
      </div>
      <div className={`${cell} max-md:hidden`}>
        <span className={muted}>Drawn by</span>
        <span className={strong}>Technicus</span>
      </div>
      <div className={`${cell} max-lg:hidden`}>
        <span className={muted}>Scale</span>
        <span className={strong}>To fit</span>
      </div>
      <div className="ml-auto flex items-center gap-2 px-4 py-2.5 sm:px-6">
        <span className={muted}>Revision</span>
        <span className={strong}>Current</span>
      </div>
    </div>
  );
}

/** A framed sheet of the drawing set. */
export function Sheet({
  id,
  sheet,
  dark = false,
  children,
  className = "",
  labelledBy,
}: {
  id?: string;
  sheet: string;
  dark?: boolean;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`relative scroll-mt-14 border-t border-[var(--bp-ink)] ${dark ? "bg-[var(--bp-night)] text-[#f2f1ec]" : ""} ${className}`}
    >
      <Cross className="-top-[7px] -left-[7px]" />
      <Cross className="-top-[7px] -right-[7px]" />
      <TitleBlock sheet={sheet} dark={dark} />
      {children}
    </section>
  );
}

/** Heading block used by most sheets. */
export function SheetHeading({
  id,
  kicker,
  title,
  intro,
  dark = false,
}: {
  id: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className="bp-reveal grid gap-6 px-4 pt-14 pb-10 sm:px-6 md:pt-20 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end lg:gap-16 lg:px-10">
      <div>
        <p className={`bp-label flex items-center gap-2 ${dark ? "text-white/55" : "text-[var(--bp-muted)]"}`}>
          <span className="inline-block size-2 bg-[var(--bp-accent)]" aria-hidden="true" />
          {kicker}
        </p>
        <h2 id={id} className="mt-5 max-w-3xl text-[clamp(2.1rem,4.6vw,3.9rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance">
          {title}
        </h2>
      </div>
      {intro && (
        <p className={`max-w-md text-[17px] leading-relaxed text-pretty ${dark ? "text-white/65" : "text-[var(--bp-ink-2)]"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
