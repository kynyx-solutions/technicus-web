import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Eyebrow, title and optional line. When `href` is set the title link stretches over the whole tile. */
export function TileHead({
  eyebrow,
  title,
  body,
  href,
  large = false,
  arrow = true,
  className = "",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  href?: string;
  large?: boolean;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <p className="bnt-eyebrow">{eyebrow}</p>
        <h3 className={`bnt-title mt-3 ${large ? "bnt-title-lg" : ""}`}>
          {href ? (
            <Link href={href} className="bnt-stretch">
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        {body ? <p className="bnt-body mt-2 max-w-[46ch]">{body}</p> : null}
      </div>
      {href && arrow ? (
        <span className="bnt-go" aria-hidden="true">
          <ArrowRight size={16} strokeWidth={1.75} />
        </span>
      ) : null}
    </div>
  );
}
