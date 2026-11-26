import type { Testimonial } from "@/lib/cms";

/** Client testimonials as cards. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.slice(0, 9).map((t, i) => (
        <li key={`${t.name}-${i}`} data-reveal>
          <figure className="flex h-full flex-col rounded-xl border border-line bg-white p-7 text-ink">
            <svg aria-hidden viewBox="0 0 32 24" className="h-6 w-auto self-start text-blue">
              <path fill="currentColor" d="M0 24V14C0 6.3 4.4 1.6 12 0l1.6 3.4C9.4 4.8 7.3 7.4 7 10.8h6V24H0Zm18 0V14c0-7.7 4.4-12.4 12-14l1.6 3.4c-4.2 1.4-6.3 4-6.6 7.4h6V24H18Z" />
            </svg>
            <blockquote className="mt-5 text-[1.02rem] leading-relaxed">&ldquo;{t.text}&rdquo;</blockquote>
            <figcaption className="mt-auto flex items-center gap-4 border-t border-line pt-5">
              {t.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.logo} alt={t.company || t.name} className="h-8 w-auto max-w-[6rem] object-contain" />
              ) : (
                <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-sky font-heading font-bold text-blue">
                  {t.name.charAt(0)}
                </span>
              )}
              <span>
                <span className="block font-heading text-[0.95rem] font-semibold">{t.name}</span>
                <span className="block text-[0.85rem] text-muted">{[t.role, t.company].filter(Boolean).join(", ")}</span>
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
