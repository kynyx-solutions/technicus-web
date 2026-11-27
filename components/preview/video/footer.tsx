import Link from "next/link";
import { s } from "./styles";
import { legalPages, site } from "@/content/site";

type Props = {
  pillars: { slug: string; name: string }[];
  contact: { email: string; phone: string; phoneHref: string };
};

const company = [
  { href: "/about", name: "About" },
  { href: "/work", name: "Work" },
  { href: "/industries", name: "Industries" },
  { href: "/insights", name: "Insights" },
  { href: "/careers", name: "Careers" },
  { href: "/contact", name: "Contact" },
];

export function Footer({ pillars, contact }: Props) {
  return (
    <footer className={s.footer}>
      <div className={s.shell}>
        <div className={s.footerGrid}>
          <div>
            <Link href="/preview/video" className={s.wordmark}>
              Technicus<i aria-hidden="true" />
            </Link>
            <p className={s.footerIntro}>
              A technology consultancy based in India, working with organisations around the world on strategy, design, engineering, AI, cloud and growth.
            </p>
          </div>
          <div>
            <h2 className={s.footerHead}>Services</h2>
            <ul className={s.footerList}>
              {pillars.map((p) => (
                <li key={p.slug}>
                  <Link href={`/services/${p.slug}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={s.footerHead}>Company</h2>
            <ul className={s.footerList}>
              {company.map((c) => (
                <li key={c.href}>
                  <Link href={c.href}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={s.footerHead}>Talk to us</h2>
            <ul className={s.footerList}>
              <li>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </li>
              <li>
                <a href={contact.phoneHref}>{contact.phone}</a>
              </li>
              <li>
                <Link href="/about/locations">Locations</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className={s.footerMark} aria-hidden="true">
          Technicus
        </p>
        <div className={s.footerBottom}>
          <span>
            © {new Date().getFullYear()} {site.legalName}
          </span>
          <nav aria-label="Legal">
            {legalPages.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
