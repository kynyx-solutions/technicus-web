import Link from "next/link";
import { articles } from "@/content/copy";
import { contact, offices } from "@/content/company";
import { pillars } from "@/content/services";
import { industries, legalPages, site } from "@/content/site";

const mainLinks = [
  { href: "/services", name: "Services" },
  { href: "/industries", name: "Industries" },
  { href: "/work", name: "Work" },
  { href: "/insights", name: "Insights" },
  { href: "/about", name: "About" },
  { href: "/about/how-we-work", name: "How we work" },
  { href: "/careers", name: "Careers" },
  { href: "/contact", name: "Contact" },
];

function Icon({ name }: { name: "linkedin" | "x" | "facebook" | "whatsapp" }) {
  const paths = {
    linkedin:
      "M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 13.4c0-3.1-1.66-5.15-4.42-5.15-1.6 0-2.62.86-3.06 1.66V8.5H9.7V20h3.37v-6.06c0-1.6.6-2.73 2.03-2.73 1.38 0 1.96 1.1 1.96 2.73V20h3.38v-6.6Z",
    x: "M17.53 3H20.5l-6.5 7.43L21.65 21h-5.98l-4.69-6.13L5.62 21H2.64l6.96-7.95L2.25 3h6.13l4.24 5.6L17.53 3Zm-1.04 16.2h1.65L7.58 4.7H5.81l10.68 14.5Z",
    facebook: "M13.5 21v-8h2.7l.4-3.13h-3.1V7.88c0-.9.25-1.52 1.55-1.52h1.65V3.57A22 22 0 0 0 14.3 3.4c-2.4 0-4.05 1.47-4.05 4.16v2.31H7.5V13h2.75v8h3.25Z",
    whatsapp:
      "M12 3a9 9 0 0 0-7.74 13.6L3 21l4.53-1.2A9 9 0 1 0 12 3Zm0 16.4c-1.4 0-2.77-.38-3.97-1.09l-.28-.17-2.69.71.72-2.62-.19-.29A7.4 7.4 0 1 1 12 19.4Zm4.06-5.54c-.22-.11-1.31-.65-1.51-.72-.2-.07-.35-.11-.5.11-.15.22-.57.72-.7.87-.13.15-.26.17-.48.06-.22-.11-.94-.35-1.79-1.1-.66-.59-1.11-1.32-1.24-1.54-.13-.22-.01-.34.1-.45.1-.1.22-.26.33-.39.11-.13.15-.22.22-.37.07-.15.04-.28-.02-.39-.06-.11-.5-1.2-.68-1.64-.18-.43-.36-.37-.5-.38h-.43c-.15 0-.39.06-.59.28-.2.22-.78.76-.78 1.85 0 1.09.8 2.15.91 2.3.11.15 1.57 2.4 3.8 3.36.53.23.95.37 1.27.47.53.17 1.02.15 1.4.09.43-.06 1.31-.54 1.5-1.06.18-.52.18-.97.13-1.06-.06-.09-.2-.15-.42-.26Z",
  };
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d={paths[name]} />
    </svg>
  );
}

function Column({ title, links }: { title: string; links: { href: string; name: string }[] }) {
  return (
    <div>
      <h2 className="label mb-4 text-white/40">{title}</h2>
      <ul className="space-y-2 text-[0.95rem] text-white/70">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="sweep hover:text-white">
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const social = [
    { href: contact.linkedin, name: "LinkedIn", icon: "linkedin" as const },
    { href: contact.x, name: "X", icon: "x" as const },
    { href: contact.facebook, name: "Facebook", icon: "facebook" as const },
    { href: contact.whatsappHref, name: "WhatsApp", icon: "whatsapp" as const },
  ].filter((s) => s.href);

  return (
    <footer data-tone="dark" className="panel bg-black text-white">
      <div className="shell grid gap-14 pt-16 pb-16 md:pt-24 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-7">
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${contact.email}`} className="btn-outline-light px-5 py-3.5 text-[1.3rem] font-normal md:text-[1.5rem]">
              {contact.email}
            </a>
            <a href={contact.phoneHref} className="btn-outline-light px-5 py-3.5 text-[1.3rem] font-normal md:text-[1.5rem]">
              {contact.phone}
            </a>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2">
            {offices.map((o) => (
              <li key={o.city} className="text-[0.98rem] leading-relaxed">
                <span className="label mr-2 text-white/45">{o.hq ? "Head office" : "Office"}</span>
                {o.lines.join(", ")}
              </li>
            ))}
          </ul>
        </div>
        <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-[1.35rem] lg:col-span-5 lg:justify-items-end lg:text-right">
          {mainLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="sweep">
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="shell grid gap-10 border-t border-white/10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <Column title="Services" links={[...pillars.map((p) => ({ href: `/services/${p.slug}`, name: p.name })), { href: "/technologies", name: "Technologies" }]} />
        <Column title="Industries" links={industries.map((i) => ({ href: `/industries/${i.slug}`, name: i.name }))} />
        <Column title="Insights" links={[...articles.slice(0, 3).map((a) => ({ href: `/insights/${a.slug}`, name: a.title })), { href: "/insights", name: "All insights" }]} />
        <Column
          title="Company"
          links={[
            { href: "/about/leadership", name: "Leadership" },
            { href: "/about/trust", name: "Trust" },
            { href: "/about/locations", name: "Locations" },
            { href: "/india", name: "Technicus in India" },
          ]}
        />
      </div>

      <div className="shell flex flex-col gap-6 border-t border-white/10 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.95rem]">
          {legalPages.map((l) => (
            <Link key={l.href} href={l.href} className="sweep">
              {l.name}
            </Link>
          ))}
          <span className="text-white/45">
            © {new Date().getFullYear()} {site.legalName}
          </span>
        </div>
        <ul className="flex gap-3">
          {social.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white hover:text-black md:h-14 md:w-14"
              >
                <Icon name={s.icon} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
