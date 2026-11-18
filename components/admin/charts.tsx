import Link from "next/link";

/** Leads per day as columns. Each column shows its date and count on hover. */
export function Columns({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const w = 100 / data.length;
  return (
    <div>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-44 w-full" role="img" aria-label="Leads per day">
        {[0.25, 0.5, 0.75].map((y) => (
          <line key={y} x1="0" x2="100" y1={40 * y} y2={40 * y} stroke="rgba(0,0,0,0.06)" strokeWidth="0.15" />
        ))}
        {data.map((d, i) => {
          const h = (d.value / max) * 38;
          return (
            <g key={i}>
              <rect x={i * w + w * 0.15} y={40 - h} width={w * 0.7} height={Math.max(h, d.value ? 0.6 : 0.25)} rx={Math.min(0.8, w * 0.2)} fill={d.value ? "#000" : "rgba(0,0,0,0.08)"}>
                <title>{`${d.label}: ${d.value} lead${d.value === 1 ? "" : "s"}`}</title>
              </rect>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[0.75rem] text-black/45">
        <span>{data[0]?.label}</span>
        <span>Most in a day: {max === 1 && !data.some((d) => d.value) ? 0 : max}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

/** A ranked list with bars, such as most requested services. */
export function BarList({ items, empty = "Nothing yet", hrefFor }: { items: { label: string; value: number }[]; empty?: string; hrefFor?: (label: string) => string }) {
  if (!items.length) return <p className="text-[0.88rem] text-black/45">{empty}</p>;
  const max = Math.max(...items.map((i) => i.value));
  return (
    <ul className="space-y-2.5">
      {items.map((i) => {
        const body = (
          <>
            <span className="mb-1 flex justify-between gap-2 text-[0.88rem]">
              <span className="truncate">{i.label}</span>
              <span className="text-black/55">{i.value}</span>
            </span>
            <span className="block h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
              <span className="block h-full rounded-full bg-indigo" style={{ width: `${(i.value / max) * 100}%` }} />
            </span>
          </>
        );
        return <li key={i.label}>{hrefFor ? <Link href={hrefFor(i.label)} className="block hover:opacity-75">{body}</Link> : body}</li>;
      })}
    </ul>
  );
}
