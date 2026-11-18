"use client";

import { Repeater, TextField, useSettings } from "@/components/admin/settings-form";
import { Card, Field, input } from "@/components/admin/ui";
import type { ContactSettings } from "@/lib/cms";
import { resetSetting, saveContact } from "../settings-actions";

export function ContactForm({ initial }: { initial: ContactSettings }) {
  const { value: v, set, errors, bar } = useSettings(initial, saveContact, () => resetSetting("contact"));
  return (
    <div className="space-y-4">
      <Card title="Contact details">
        <div className="grid gap-4 md:grid-cols-3">
          <TextField label="Email" value={v.email} onChange={(x) => set("email", x)} error={errors.email} />
          <TextField label="Phone" value={v.phone} onChange={(x) => set("phone", x)} hint="As it should appear, e.g. +91 85560 93704" />
          <TextField label="WhatsApp number" value={v.whatsapp} onChange={(x) => set("whatsapp", x)} hint="With country code. Empty hides WhatsApp links." />
        </div>
      </Card>
      <Card title="Social accounts">
        <p className="mb-3 text-[0.88rem] text-black/55">Shown as icons in the footer. Leave a field empty to hide that icon.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="LinkedIn" value={v.linkedin} onChange={(x) => set("linkedin", x)} error={errors.linkedin} hint="The most important one for this audience." />
          <TextField label="X" value={v.x} onChange={(x) => set("x", x)} error={errors.x} />
          <TextField label="Facebook" value={v.facebook} onChange={(x) => set("facebook", x)} error={errors.facebook} />
          <TextField label="Instagram" value={v.instagram} onChange={(x) => set("instagram", x)} error={errors.instagram} />
        </div>
      </Card>
      <Card title="Offices">
        <p className="mb-3 text-[0.88rem] text-black/55">Shown in the footer and on the Contact and Locations pages, with the local time.</p>
        <Repeater
          items={v.offices}
          onChange={(x) => set("offices", x)}
          blank={{ city: "", country: "", lines: [], timeZone: "Asia/Kolkata", lat: 0, lon: 0 }}
          addLabel="Add an office"
          max={12}
          render={(o, update, i) => (
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="City">
                <input value={o.city} onChange={(e) => update({ city: e.target.value })} className={input} />
              </Field>
              <Field label="Country">
                <input value={o.country} onChange={(e) => update({ country: e.target.value })} className={input} />
              </Field>
              <Field label="Address" hint="One line per row." className="md:col-span-2">
                <textarea value={o.lines.join("\n")} rows={3} onChange={(e) => update({ lines: e.target.value.split("\n") })} className={input} />
              </Field>
              <Field label="Time zone" hint={errors[`offices.${i}.timeZone`] ?? "For example Asia/Kolkata or Europe/London."}>
                <input value={o.timeZone} onChange={(e) => update({ timeZone: e.target.value })} className={input} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Latitude">
                  <input type="number" step="0.01" value={o.lat} onChange={(e) => update({ lat: Number(e.target.value) })} className={input} />
                </Field>
                <Field label="Longitude">
                  <input type="number" step="0.01" value={o.lon} onChange={(e) => update({ lon: Number(e.target.value) })} className={input} />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={Boolean(o.hq)} onChange={(e) => update({ hq: e.target.checked })} className="h-4 w-4 accent-black" />
                Head office
              </label>
            </div>
          )}
        />
      </Card>
      {bar}
    </div>
  );
}
