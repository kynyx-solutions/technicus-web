"use client";

import { Repeater, TextField, useSettings } from "@/components/admin/settings-form";
import { ImageField } from "@/components/admin/image-field";
import { Card, Field, input } from "@/components/admin/ui";
import type { HomeSettings } from "@/lib/cms";
import { resetSetting, saveHome } from "../settings-actions";

export function HomeForm({ initial }: { initial: HomeSettings }) {
  const { value: v, set, errors, bar } = useSettings(initial, saveHome, () => resetSetting("home"));
  return (
    <div className="space-y-4">
      <Card title="Hero">
        <div className="space-y-4">
          <TextField label="Headline" value={v.heroTitle} onChange={(x) => set("heroTitle", x)} error={errors.heroTitle} max={120} hint="The big line at the top of the home page." />
          <TextField label="Text under the headline" value={v.heroLead} onChange={(x) => set("heroLead", x)} area max={400} />
          <p className="text-[0.82rem] text-black/50">The showreel video below the headline is rendered from code; see the README to make a new one.</p>
        </div>
      </Card>

      <Card title="What we do">
        <TextField label="Introduction" value={v.introText} onChange={(x) => set("introText", x)} area rows={4} max={800} hint="Shown above the seven service cards. The cards come from the services content." />
      </Card>

      <Card title="Trusted by: client logos">
        <p className="mb-3 text-[0.88rem] text-black/55">
          Only clients who have agreed to be named. Shown as a logo grid on the home page; with more than eight, the logos take turns. The section stays hidden while this is empty.
        </p>
        <Repeater
          items={v.clients}
          onChange={(x) => set("clients", x)}
          blank={{ name: "", logo: "", url: "" }}
          addLabel="Add a client"
          max={40}
          render={(c, update, i) => (
            <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
              <div className="space-y-3">
                <Field label="Client name" hint={errors[`clients.${i}.name`]}>
                  <input value={c.name} maxLength={80} onChange={(e) => update({ name: e.target.value })} className={input} />
                </Field>
                <Field label="Website (optional)" hint={errors[`clients.${i}.url`]}>
                  <input value={c.url ?? ""} placeholder="https://" onChange={(e) => update({ url: e.target.value })} className={input} />
                </Field>
              </div>
              <ImageField label="Logo" value={c.logo ?? ""} onChange={(logo) => update({ logo })} />
            </div>
          )}
        />
      </Card>

      <Card title="Section headings">
        <div className="grid gap-4 md:grid-cols-2">
          <TextField label="Work section title" value={v.workTitle} onChange={(x) => set("workTitle", x)} max={80} />
          <TextField label="Insights section title" value={v.insightsTitle} onChange={(x) => set("insightsTitle", x)} max={80} />
          <TextField label="Industries section title" value={v.industriesTitle} onChange={(x) => set("industriesTitle", x)} max={80} />
          <TextField label="Industries section text" value={v.industriesLead} onChange={(x) => set("industriesLead", x)} max={300} />
          <div className="md:col-span-2">
            <TextField label="How we work: introduction" value={v.howText} onChange={(x) => set("howText", x)} area max={600} />
          </div>
        </div>
      </Card>

      <Card title="Numbers">
        <p className="mb-3 text-[0.88rem] text-black/55">Real figures only, such as projects delivered or years in business. The section stays hidden while empty.</p>
        <Repeater
          items={v.stats}
          onChange={(x) => set("stats", x)}
          blank={{ value: 0, suffix: "", label: "" }}
          addLabel="Add a number"
          max={6}
          render={(s, update) => (
            <div className="grid gap-3 sm:grid-cols-[8rem_5rem_1fr]">
              <Field label="Number">
                <input type="number" min={0} value={s.value} onChange={(e) => update({ value: Number(e.target.value) })} className={input} />
              </Field>
              <Field label="After it">
                <input value={s.suffix ?? ""} maxLength={6} placeholder="+ or %" onChange={(e) => update({ suffix: e.target.value })} className={input} />
              </Field>
              <Field label="What it counts">
                <input value={s.label} maxLength={80} onChange={(e) => update({ label: e.target.value })} className={input} />
              </Field>
            </div>
          )}
        />
      </Card>

      <Card title="Questions">
        <Repeater
          items={v.faqs}
          onChange={(x) => set("faqs", x)}
          blank={{ q: "", a: "" }}
          addLabel="Add a question"
          render={(f, update) => (
            <div className="space-y-3">
              <Field label="Question">
                <input value={f.q} maxLength={300} onChange={(e) => update({ q: e.target.value })} className={input} />
              </Field>
              <Field label="Answer">
                <textarea value={f.a} rows={3} maxLength={2000} onChange={(e) => update({ a: e.target.value })} className={input} />
              </Field>
            </div>
          )}
        />
        {errors.faqs && <p className="mt-2 text-sm text-[#b4234f]">Every question needs an answer.</p>}
      </Card>

      <Card title="Closing call">
        <div className="space-y-4">
          <TextField label="Line" value={v.closingTitle} onChange={(x) => set("closingTitle", x)} max={120} />
          <TextField label="Text" value={v.closingLead} onChange={(x) => set("closingLead", x)} area max={400} />
        </div>
      </Card>
      {bar}
    </div>
  );
}
