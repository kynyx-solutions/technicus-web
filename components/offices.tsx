import { LocalTime } from "@/components/local-time";
import { getContactInfo } from "@/lib/cms";

export async function OfficeCards() {
  const contact = await getContactInfo();
  const offices = contact.offices;
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {offices.map((o) => (
        <li key={o.city} className="rounded-xl border border-line bg-white p-7 text-ink md:p-8" data-reveal>
          <p className="label mb-4 text-blue">{o.hq ? "Head office" : "Office"}</p>
          <h3 className="h3">
            {o.city}, {o.country}
          </h3>
          <address className="mt-3 text-muted not-italic">
            {o.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <p className="mt-6">
            Local time: <LocalTime timeZone={o.timeZone} />
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={contact.phoneHref} className="btn-outline">
              {contact.phone}
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.lines.join(", ")}, ${o.country}`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-outline"
            >
              Open in maps
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
