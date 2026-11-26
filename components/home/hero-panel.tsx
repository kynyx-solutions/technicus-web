import { BrainCircuit, CloudCog, Code2, Compass, LifeBuoy, PenTool, TrendingUp } from "lucide-react";
import Link from "next/link";
import { pillars } from "@/content/services";

const ICONS = [Compass, PenTool, Code2, BrainCircuit, CloudCog, TrendingUp, LifeBuoy];

/** The home page hero panel: the service areas, one team end to end. */
export function HeroPanel() {
  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-sky via-white to-sky" />
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_60px_-30px_rgba(11,31,58,0.35)]">
        <div className="flex items-center justify-between border-b border-line bg-mist px-5 py-3.5">
          <p className="font-heading text-[0.95rem] font-semibold text-navy">One team, end to end</p>
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-blue" />
            <span className="h-2.5 w-2.5 rounded-full bg-blue/40" />
            <span className="h-2.5 w-2.5 rounded-full bg-blue/20" />
          </span>
        </div>
        <ul className="divide-y divide-line">
          {pillars.map((p, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li key={p.slug}>
                <Link href={`/services/${p.slug}`} className="group flex items-center gap-4 px-5 py-3 transition-colors hover:bg-mist">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky text-blue">
                    <Icon size={18} strokeWidth={1.9} aria-hidden />
                  </span>
                  <span className="flex-1 text-[0.95rem] font-medium text-ink group-hover:text-blue">{p.name}</span>
                  <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-blue">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
