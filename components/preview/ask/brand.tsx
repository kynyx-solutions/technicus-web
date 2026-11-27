// Shared by the header (client) and the page and footer (server).

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/work", label: "Work" },
  { href: "/insights", label: "Insights" },
  { href: "/careers", label: "Careers" },
  { href: "/about", label: "About" },
];

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span aria-hidden className="grid size-7 place-items-center rounded-[8px] bg-[var(--ask-ink)] text-[var(--ask-paper)]">
        <span className="ask-serif text-[19px] leading-none">T</span>
      </span>
      <span className="text-[17px] font-semibold tracking-[-0.02em]">Technicus</span>
    </span>
  );
}
