import type { Client } from "@/lib/cms";

/** Client logos in a bordered grid, shown in grey and in colour on hover. */
export function ClientLogos({ clients }: { clients: Client[] }) {
  return (
    <ul className="grid grid-cols-2 border-t border-l border-line sm:grid-cols-3 lg:grid-cols-6">
      {clients.slice(0, 18).map((c) => {
        const body = c.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.logo} alt={c.name} loading="lazy" className="max-h-10 max-w-[75%] object-contain opacity-60 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0" />
        ) : (
          <span className="text-center text-[0.95rem] font-medium text-muted transition-colors group-hover:text-navy">{c.name}</span>
        );
        return (
          <li key={c.name} className="group flex h-28 items-center justify-center border-r border-b border-line px-4" data-reveal>
            {c.url ? (
              <a href={c.url} target="_blank" rel="noreferrer" aria-label={c.name} className="flex h-full w-full items-center justify-center">
                {body}
              </a>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ul>
  );
}
