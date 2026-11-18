"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useConfirm, useToast } from "@/components/admin/client";
import { Badge, btn, Card, input, label, Stat, type Tone } from "@/components/admin/ui";
import { keywordKinds, keywordStatuses, type KeywordRow } from "@/lib/db/types";
import { deleteKeyword, keywordCoverage, keywordIdeas, saveKeyword } from "../actions";

type Coverage = Awaited<ReturnType<typeof keywordCoverage>>;
const coverageTone: Record<string, Tone> = { strong: "green", partial: "amber", missing: "red", unassigned: "neutral", error: "red" };
const coverageText: Record<string, string> = { strong: "Well covered", partial: "Partly covered", missing: "Not on the page", unassigned: "No page", error: "Page error" };

export function Keywords({ items, pages, recommended }: { items: KeywordRow[]; pages: string[]; recommended: { term: string; page: string; kind: "target" | "trending" }[] }) {
  const [coverage, setCoverage] = useState<Coverage>({});
  const [checking, setChecking] = useState(false);
  const [draft, setDraft] = useState({ term: "", page: "", kind: "target" as const });
  const [q, setQ] = useState("");
  const [pending, start] = useTransition();
  const toast = useToast();
  const ask = useConfirm();
  const router = useRouter();

  const missing = recommended.filter((r) => !items.some((k) => k.term.toLowerCase() === r.term.toLowerCase()));
  const term = q.trim().toLowerCase();
  const shown = items.filter((k) => !term || k.term.toLowerCase().includes(term) || k.page.includes(term));
  const known = Object.keys(coverage).length > 0;

  const save = (id: string | null, k: Partial<KeywordRow>, done?: string) =>
    start(async () => {
      const base = id ? items.find((x) => x.id === id)! : { term: "", kind: "target", page: "", status: "planned", position: null, notes: "" };
      const r = await saveKeyword(id, { ...base, ...k, id: undefined, created_at: undefined, updated_at: undefined });
      if (!r.ok) return toast(r.error ?? "Could not save", "error");
      if (done) toast(done);
      router.refresh();
    });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Keywords tracked" value={items.length} />
        <Stat label="Well covered" value={known ? Object.values(coverage).filter((c) => c === "strong").length : "–"} sub={known ? "In the page title or heading, and the text" : "Run the coverage check"} />
        <Stat label="Content gaps" value={known ? Object.values(coverage).filter((c) => c === "missing" || c === "unassigned").length : "–"} sub="Not on the page, or no page assigned" />
      </div>

      <Card>
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            save(null, draft, "Keyword added");
            setDraft({ term: "", page: "", kind: "target" });
          }}
        >
          <label className="min-w-[14rem] flex-1">
            <span className="mb-1 block text-[0.8rem] font-medium">Keyword</span>
            <input value={draft.term} onChange={(e) => setDraft({ ...draft, term: e.target.value })} placeholder="e.g. ai consulting services" className={input} />
          </label>
          <label className="min-w-[14rem]">
            <span className="mb-1 block text-[0.8rem] font-medium">Page that should rank</span>
            <select value={draft.page} onChange={(e) => setDraft({ ...draft, page: e.target.value })} className={input}>
              <option value="">Not decided</option>
              {pages.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={pending || !draft.term.trim()} className={btn.primary}>
            <Plus size={15} /> Add
          </button>
          <span className="ml-auto flex gap-2">
            {missing.length > 0 && (
              <button
                type="button"
                disabled={pending}
                className={btn.secondary}
                onClick={() =>
                  start(async () => {
                    for (const r of missing) await saveKeyword(null, { term: r.term, page: r.page, kind: r.kind, status: "planned", position: null, notes: "" });
                    toast(`${missing.length} keywords added: focus keywords for every page, plus trending searches`);
                    router.refresh();
                  })
                }
              >
                Add {missing.length} suggested
              </button>
            )}
            <button
              type="button"
              disabled={checking || !items.length}
              className={btn.secondary}
              onClick={async () => {
                setChecking(true);
                setCoverage(await keywordCoverage());
                setChecking(false);
              }}
            >
              {checking ? "Checking pages…" : "Check coverage"}
            </button>
          </span>
        </form>
      </Card>

      {items.length > 0 && (
        <div className="overflow-hidden rounded-[22px] bg-white">
          <div className="border-b border-black/6 p-3">
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter keywords" className={`${input} md:!w-72`} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-[0.9rem]">
              <thead className="border-b border-black/6 text-left text-[0.78rem] tracking-[0.02em] text-black/50 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Keyword</th>
                  <th className="px-4 py-3 font-medium">Page</th>
                  <th className="px-4 py-3 font-medium">Coverage</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium" title="Position in Google, checked by hand">
                    Google position
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {shown.map((k) => (
                  <tr key={k.id} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-2.5 font-medium">{k.term}</td>
                    <td className="px-4 py-2.5">
                      <select aria-label="Page" defaultValue={k.page} disabled={pending} onChange={(e) => save(k.id, { page: e.target.value })} className={`${input} !py-1.5`}>
                        <option value="">Not decided</option>
                        {pages.map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">{coverage[k.id] ? <Badge tone={coverageTone[coverage[k.id]]}>{coverageText[coverage[k.id]]}</Badge> : <span className="text-black/35">–</span>}</td>
                    <td className="px-4 py-2.5">
                      <select aria-label="Type" defaultValue={k.kind} disabled={pending} onChange={(e) => save(k.id, { kind: e.target.value as KeywordRow["kind"] })} className={`${input} !w-auto min-w-[7.5rem] !py-1.5`}>
                        {keywordKinds.map((s) => (
                          <option key={s} value={s}>
                            {label(s)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <select aria-label="Status" defaultValue={k.status} disabled={pending} onChange={(e) => save(k.id, { status: e.target.value as KeywordRow["status"] })} className={`${input} !w-auto min-w-[8.5rem] !py-1.5`}>
                        {keywordStatuses.map((s) => (
                          <option key={s} value={s}>
                            {label(s)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min={1}
                        max={200}
                        aria-label="Google position"
                        defaultValue={k.position ?? ""}
                        onBlur={(e) => {
                          const v = e.target.value ? Number(e.target.value) : null;
                          if (v !== k.position) save(k.id, { position: v });
                        }}
                        className={`${input} !w-20 !py-1.5`}
                      />
                    </td>
                    <td className="px-2 py-2.5">
                      <button
                        type="button"
                        aria-label="Delete"
                        onClick={async () => {
                          if (await ask({ title: `Stop tracking "${k.term}"?`, confirm: "Delete", danger: true }))
                            start(async () => {
                              await deleteKeyword(k.id);
                              router.refresh();
                            });
                        }}
                        className="rounded-full p-2 text-black/45 hover:text-[#b4234f]"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Ideas onAdd={(t) => save(null, { term: t }, `Tracking "${t}"`)} tracked={items.map((k) => k.term.toLowerCase())} />
    </div>
  );
}

function Ideas({ onAdd, tracked }: { onAdd: (term: string) => void; tracked: string[] }) {
  const [seed, setSeed] = useState("");
  const [country, setCountry] = useState("us");
  const [deep, setDeep] = useState(false);
  const [groups, setGroups] = useState<Record<string, string[]> | null>(null);
  const [pending, start] = useTransition();
  const toast = useToast();
  return (
    <Card title="Keyword ideas" action={<span className="text-[0.8rem] text-black/45">From Google search suggestions</span>}>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const r = await keywordIdeas(seed, country, deep);
            if (!r.ok) return toast(r.error, "error");
            setGroups(r.groups);
          });
        }}
      >
        <label className="min-w-[14rem] flex-1">
          <span className="mb-1 block text-[0.8rem] font-medium">Start from</span>
          <input value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="e.g. software development company" className={input} />
        </label>
        <label>
          <span className="mb-1 block text-[0.8rem] font-medium">Country</span>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className={input}>
            {[
              ["us", "United States"],
              ["gb", "United Kingdom"],
              ["in", "India"],
              ["ae", "UAE"],
              ["au", "Australia"],
              ["ca", "Canada"],
              ["sg", "Singapore"],
              ["de", "Germany"],
            ].map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 pb-2.5 text-sm">
          <input type="checkbox" checked={deep} onChange={(e) => setDeep(e.target.checked)} className="h-4 w-4 accent-black" />
          Long tail (slower)
        </label>
        <button type="submit" disabled={pending || !seed.trim()} className={btn.primary}>
          {pending ? "Finding…" : "Find ideas"}
        </button>
      </form>
      {groups && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {Object.entries(groups)
            .filter(([, list]) => list.length)
            .map(([name, list]) => (
              <div key={name}>
                <p className="mb-2 text-[0.85rem] font-medium">
                  {name} <span className="text-black/40">({list.length})</span>
                </p>
                <ul className="flex flex-wrap gap-1.5">
                  {list.slice(0, 40).map((s) => {
                    const done = tracked.includes(s);
                    return (
                      <li key={s}>
                        <button
                          type="button"
                          disabled={done}
                          onClick={() => onAdd(s)}
                          title={done ? "Already tracked" : "Track this keyword"}
                          className={`rounded-full border px-3 py-1 text-[0.85rem] ${done ? "border-transparent bg-mint text-[#14715f]" : "border-black/12 bg-white hover:border-black"}`}
                        >
                          {done ? "✓ " : "+ "}
                          {s}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
}
