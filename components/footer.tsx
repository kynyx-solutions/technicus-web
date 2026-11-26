import Link from "next/link";
import { Logo } from "@/components/header";
import { getArticles, getContactInfo } from "@/lib/cms";
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

function Icon({ name }: { name: "linkedin" | "x" | "facebook" | "whatsapp" | "instagram" }) {
  const paths = {
    linkedin:
      "M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 13.4c0-3.1-1.66-5.15-4.42-5.15-1.6 0-2.62.86-3.06 1.66V8.5H9.7V20h3.37v-6.06c0-1.6.6-2.73 2.03-2.73 1.38 0 1.96 1.1 1.96 2.73V20h3.38v-6.6Z",
    instagram:
      "M12 3.2c2.87 0 3.2.01 4.34.06 1.05.05 1.62.22 2 .37.5.2.86.43 1.24.8.37.38.6.74.8 1.24.15.38.32.95.37 2 .05 1.13.06 1.47.06 4.33s-.01 3.2-.06 4.34c-.05 1.05-.22 1.62-.37 2-.2.5-.43.86-.8 1.24-.38.37-.74.6-1.24.8-.38.15-.95.32-2 .37-1.13.05-1.47.06-4.34.06s-3.2-.01-4.33-.06c-1.05-.05-1.62-.22-2-.37-.5-.2-.86-.43-1.24-.8a3.33 3.33 0 0 1-.8-1.24c-.15-.38-.32-.95-.37-2C3.21 15.2 3.2 14.87 3.2 12s.01-3.2.06-4.33c.05-1.05.22-1.62.37-2 .2-.5.43-.86.8-1.24.38-.37.74-.6 1.24-.8.38-.15.95-.32 2-.37C8.8 3.21 9.13 3.2 12 3.2Zm0 4.38a4.42 4.42 0 1 0 0 8.84 4.42 4.42 0 0 0 0-8.84Zm0 7.29a2.87 2.87 0 1 1 0-5.74 2.87 2.87 0 0 1 0 5.74Zm4.6-8.5a1.03 1.03 0 1 0 0 2.07 1.03 1.03 0 0 0 0-2.07Z",
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
      <h2 className="mb-4 font-heading text-[0.95rem] font-semibold text-white">{title}</h2>
      <ul className="space-y-2.5 text-[0.9rem] text-white/65">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-white">
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const [contact, articles] = await Promise.all([getContactInfo(), getArticles()]);
  const offices = contact.offices;
  const social = [
    { href: contact.linkedin, name: "LinkedIn", icon: "linkedin" as const },
    { href: contact.x, name: "X", icon: "x" as const },
    { href: contact.facebook, name: "Facebook", icon: "facebook" as const },
    { href: contact.instagram, name: "Instagram", icon: "instagram" as const },
    { href: contact.whatsappHref, name: "WhatsApp", icon: "whatsapp" as const },
  ].filter((s) => s.href);

  return (
    <footer data-tone="dark" className="bg-navy text-white">
      <div className="shell grid gap-12 pt-16 pb-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-sm text-[0.92rem] leading-relaxed text-white/65">
            {site.description}
          </p>
          <ul className="mt-6 space-y-2 text-[0.92rem]">
            <li>
              <a href={`mailto:${contact.email}`} className="text-white hover:text-[#8fb2ff]">
                {contact.email}
              </a>
            </li>
            <li>
              <a href={contact.phoneHref} className="text-white hover:text-[#8fb2ff]">
                {contact.phone}
              </a>
            </li>
            {offices.map((o) => (
              <li key={o.city} className="pt-2 text-white/60">
                <span className="block text-[0.75rem] font-semibold tracking-[0.1em] text-white/45 uppercase">{o.hq ? "Head office" : "Office"}</span>
                {o.lines.join(", ")}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
          <Column title="Services" links={[...pillars.map((p) => ({ href: `/services/${p.slug}`, name: p.name })), { href: "/technologies", name: "Technologies" }]} />
          <Column title="Industries" links={industries.map((i) => ({ href: `/industries/${i.slug}`, name: i.name }))} />
          <Column title="Company" links={mainLinks.filter((l) => !["/services", "/industries"].includes(l.href)).concat([{ href: "/about/trust", name: "Trust" }, { href: "/about/locations", name: "Locations" }, { href: "/india", name: "Technicus in India" }])} />
          <Column title="Insights" links={[...articles.slice(0, 4).map((a) => ({ href: `/insights/${a.slug}`, name: a.title })), { href: "/insights", name: "All insights" }]} />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.85rem] text-white/60">
            <span>
              © {new Date().getFullYear()} {site.legalName}
            </span>
            {legalPages.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white">
                {l.name}
              </Link>
            ))}
          </div>
          <ul className="flex gap-2">
            {social.map((s) => (
              <li key={s.name}>
                <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.name} className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 transition-colors hover:bg-blue">
                  <Icon name={s.icon} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
