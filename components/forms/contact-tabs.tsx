"use client";

import { useState } from "react";
import { LeadForm } from "./lead-form";

const tabs = [
  { id: "brief", label: "Project brief", text: "Tell us what you are planning. We reply within two working days." },
  { id: "consultation", label: "Consultation", text: "Suggest a time for a call. We confirm by email in your time zone." },
  { id: "nda", label: "NDA first", text: "We send you a non-disclosure agreement before you share any detail." },
] as const;

type TabId = (typeof tabs)[number]["id"];

/** The three ways to start a conversation, as one switchable form. */
export function ContactTabs({ services }: { services: string[] }) {
  const [active, setActive] = useState<TabId>("brief");
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      <div role="tablist" aria-label="How would you like to start?" className="inline-flex flex-wrap gap-1.5 rounded-full bg-fog p-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls="contact-panel"
            onClick={() => setActive(tab.id)}
            className={`rounded-full px-5 py-3 text-[1.05rem] transition-colors md:px-6 ${
              active === tab.id ? "bg-black text-white" : "text-black/60 hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="mt-5 mb-14 text-lg text-black/60">{current.text}</p>
      <div id="contact-panel" role="tabpanel" aria-labelledby={`tab-${current.id}`}>
        <LeadForm key={current.id} type={current.id} services={services} />
      </div>
    </div>
  );
}
