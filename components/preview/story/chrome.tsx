import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/work", label: "Work" },
  { href: "/insights", label: "Insights" },
  { href: "/careers", label: "Careers" },
  { href: "/about", label: "About" },
];

export function Wordmark() {
  return (
    <span className="sty-wordmark">
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false">
        <rect x="1" y="1" width="18" height="18" rx="4" fill="currentColor" />
        <path d="M6 7h8M10 7v8" stroke="var(--sty-paper)" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      Technicus
    </span>
  );
}

export function StoryHeader() {
  return (
    <header className="sty-header">
      <div className="sty-wrap sty-header-row">
        <Link href="/preview/story" className="sty-home" aria-label="Technicus home">
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="sty-nav">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="sty-navlink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sty-header-end">
          <Link href="/contact" className="sty-btn sty-btn-ink sty-btn-sm">
            Contact
          </Link>
          <details className="sty-menu">
            <summary aria-label="Menu">
              <Menu size={20} aria-hidden="true" />
            </summary>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </header>
  );
}

export function StoryFooter({
  practices,
  email,
  phone,
  phoneHref,
}: {
  practices: { slug: string; name: string }[];
  email: string;
  phone: string;
  phoneHref: string;
}) {
  return (
    <footer className="sty-footer">
      <div className="sty-wrap">
        <div className="sty-footer-grid">
          <div>
            <Link href="/preview/story" className="sty-home" aria-label="Technicus home">
              <Wordmark />
            </Link>
            <p className="sty-footer-note">A technology consultancy based in India, working with clients worldwide.</p>
          </div>
          <div>
            <h2 className="sty-footer-h">Services</h2>
            <ul>
              {practices.map((p) => (
                <li key={p.slug}>
                  <Link href={`/services/${p.slug}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="sty-footer-h">Company</h2>
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="sty-footer-h">Talk to us</h2>
            <ul>
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <a href={phoneHref}>{phone}</a>
              </li>
              <li>
                <Link href="/contact" className="sty-inline-arrow">
                  Start a project <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="sty-footer-base">
          <p>&copy; {new Date().getFullYear()} Technicus Infotech LLP</p>
          <ul>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <Link href="/terms">Terms</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
