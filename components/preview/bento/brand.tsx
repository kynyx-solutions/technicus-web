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
    <span className={`inline-flex items-baseline text-[21px] font-semibold tracking-[-0.04em] ${className}`}>
      Technicus<span className="bnt-accent-dot" aria-hidden="true" />
    </span>
  );
}
