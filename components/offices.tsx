import { LocalTime } from "@/components/local-time";
import { getContactInfo } from "@/lib/cms";

export async function OfficeCards() {
  const contact = await getContactInfo();
  const offices = contact.offices;
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {offices.map((o, i) => (
        <li key={o.city} className={`rounded-[22px] p-8 text-black md:p-10 ${i % 2 ? "bg-lavender" : "bg-mint"}`} data-reveal>
          <p className="label mb-5 text-black/50">{o.hq ? "Head office" : "Office"}</p>
          <h3 className="text-[1.8rem] leading-tight font-medium tracking-[-0.015em]">
            {o.city}, {o.country}
          </h3>
          <address className="mt-4 text-black/65 not-italic">
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
            <a href={contact.phoneHref} className="btn border border-black/25 px-5 py-3 text-base hover:bg-black hover:text-white">
              {contact.phone}
            </a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${o.lines.join(", ")}, ${o.country}`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn border border-black/25 px-5 py-3 text-base hover:bg-black hover:text-white"
            >
              Open in maps
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}
