import { notFound } from "next/navigation";
import { formatDate } from "@/components/lists";
import { DevNote, Hero } from "@/components/ui";
import { getLegalDoc } from "@/content/legal";
import { anchor } from "@/content/services";

export function LegalPage({ slug }: { slug: string }) {
  const doc = getLegalDoc(slug);
  if (!doc) notFound();

  return (
    <>
      <Hero crumbs={[{ href: `/${doc.slug}`, name: doc.title }]} title={doc.title} lead={`Last updated ${formatDate(doc.updated)}`} />
      <div data-tone="light" className="panel bg-fog pt-16 pb-28 md:pt-24 md:pb-40">
        <div className="inner grid gap-12 md:grid-cols-12">
          <nav aria-label="On this page" className="md:col-span-3">
            <ul className="space-y-2.5 text-[0.95rem] md:sticky md:top-28">
              {doc.sections.map((s) => (
                <li key={s.heading}>
                  <a href={`#${anchor(s.heading)}`} className="sweep">
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <article className="space-y-12 text-lg leading-relaxed md:col-span-9">
            <DevNote>review by a qualified lawyer. This text is a plain-language draft.</DevNote>
            {doc.sections.map((s) => (
              <section key={s.heading} id={anchor(s.heading)} className="scroll-mt-28 space-y-4">
                <h2 className="text-[1.6rem] leading-tight font-medium tracking-[-0.01em]">{s.heading}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p} className="text-black/75">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}
