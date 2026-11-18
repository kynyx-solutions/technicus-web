"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useConfirm, useToast } from "./client";
import { btn, Field, input } from "./ui";

type Result = { ok: boolean; error?: string; errors?: Record<string, string> };

/** State, save and reset for a settings page. */
export function useSettings<T>(initial: T, save: (v: T) => Promise<Result>, reset?: () => Promise<Result>) {
  const [value, setValue] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dirty, setDirty] = useState(false);
  const [pending, start] = useTransition();
  const toast = useToast();
  const ask = useConfirm();
  const router = useRouter();
  const set = <K extends keyof T>(key: K, v: T[K]) => {
    setValue((s) => ({ ...s, [key]: v }));
    setDirty(true);
  };
  const bar = (
    <div className="sticky bottom-4 z-20 mt-6 flex items-center justify-end gap-2 rounded-full bg-white/90 p-2 pl-5 shadow-[0_4px_24px_rgba(0,0,0,0.08)] backdrop-blur">
      <span className="mr-auto text-sm text-black/55">{dirty ? "Unsaved changes" : "Changes go live on the site as soon as you save."}</span>
      {reset && (
        <button
          type="button"
          className={btn.ghost}
          onClick={async () => {
            if (!(await ask({ title: "Reset to the built-in text?", text: "Your saved changes on this page are discarded.", confirm: "Reset", danger: true }))) return;
            start(async () => {
              await reset();
              toast("Reset to the built-in text");
              router.refresh();
              window.location.reload();
            });
          }}
        >
          Reset to defaults
        </button>
      )}
      <button
        type="button"
        disabled={pending || !dirty}
        className={btn.primary}
        onClick={() =>
          start(async () => {
            const r = await save(value);
            setErrors(r.errors ?? {});
            if (!r.ok) return toast(r.error ?? "Could not save", "error");
            setDirty(false);
            toast("Saved. The site is updated.");
            router.refresh();
          })
        }
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </div>
  );
  return { value, set, errors, bar };
}

export function TextField({ label, value, onChange, error, hint, area, rows = 3, max }: { label: string; value: string; onChange: (v: string) => void; error?: string; hint?: string; area?: boolean; rows?: number; max?: number }) {
  return (
    <Field label={label} hint={error ? <span className="text-[#b4234f]">{error}</span> : hint}>
      {area ? (
        <textarea value={value} rows={rows} maxLength={max} onChange={(e) => onChange(e.target.value)} className={input} aria-invalid={Boolean(error)} />
      ) : (
        <input value={value} maxLength={max} onChange={(e) => onChange(e.target.value)} className={input} aria-invalid={Boolean(error)} />
      )}
    </Field>
  );
}

/** A repeatable list of small records, such as questions and answers. */
export function Repeater<R>({ items, onChange, blank, render, addLabel, max = 20 }: { items: R[]; onChange: (v: R[]) => void; blank: R; render: (item: R, update: (patch: Partial<R>) => void, i: number) => React.ReactNode; addLabel: string; max?: number }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="relative rounded-2xl bg-fog p-4 pr-12">
          {render(item, (patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))), i)}
          <button type="button" aria-label="Remove" onClick={() => onChange(items.filter((_, j) => j !== i))} className="absolute top-3 right-3 rounded-full p-2 text-black/45 hover:bg-white hover:text-[#b4234f]">
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, blank])} className={`${btn.secondary} ${btn.small}`}>
          <Plus size={14} /> {addLabel}
        </button>
      )}
    </div>
  );
}
