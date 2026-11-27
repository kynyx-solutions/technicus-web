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
      <div role="tablist" aria-label="How would you like to start?" className="inline-flex flex-wrap gap-1 border border-line bg-mist p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls="contact-panel"
            onClick={() => setActive(tab.id)}
            className={` px-5 py-2.5 text-[0.95rem] font-semibold transition-colors ${
              active === tab.id ? "bg-blue text-white " : "text-muted hover:text-navy"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="mt-4 mb-10 text-muted">{current.text}</p>
      <div id="contact-panel" role="tabpanel" aria-labelledby={`tab-${current.id}`}>
        <LeadForm key={current.id} type={current.id} services={services} />
      </div>
    </div>
  );
}
