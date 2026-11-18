"use client";

import { ArrowDown, ArrowUp, ExternalLink, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useConfirm, useToast } from "@/components/admin/client";
import { Badge, btn, input, timeAgo } from "@/components/admin/ui";
import { deleteContent, importDefaults, moveContent, setPublished } from "../actions";

export type ListItem = { id: string; slug: string; title: string; subtitle: string; published: boolean; updated: string };

export function ContentList({ type, singular, items, publicBase }: { type: string; singular: string; items: ListItem[]; publicBase?: string }) {
  const [q, setQ] = useState("");
  const [pending, start] = useTransition();
  const ask = useConfirm();
  const toast = useToast();
  const term = q.trim().toLowerCase();
  const shown = items.filter((i) => !term || `${i.title} ${i.subtitle}`.toLowerCase().includes(term));

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, done?: string) =>
    start(async () => {
      const r = await fn();
      if (!r.ok) toast(r.error ?? "Something went wrong", "error");
      else if (done) toast(done);
    });

  return (
    <>
      {items.length > 6 && <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${items.length} items`} className={`${input} mb-4 md:!w-80`} />}
      <ul className="overflow-hidden rounded-[22px] bg-white">
        {shown.map((item, i) => (
          <li key={item.id} className="flex items-center gap-3 border-b border-black/6 px-4 py-3 last:border-0 md:px-5">
            {!term && (
              <span className="flex flex-col">
                <button type="button" disabled={pending || i === 0} aria-label="Move up" onClick={() => run(() => moveContent(type, item.id, -1))} className="rounded p-0.5 text-black/40 hover:text-black disabled:opacity-20">
                  <ArrowUp size={14} />
                </button>
                <button type="button" disabled={pending || i === shown.length - 1} aria-label="Move down" onClick={() => run(() => moveContent(type, item.id, 1))} className="rounded p-0.5 text-black/40 hover:text-black disabled:opacity-20">
                  <ArrowDown size={14} />
                </button>
              </span>
            )}
            <Link href={`/admin/content/${type}/${item.id}`} className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="truncate font-medium hover:underline">{item.title || "Untitled"}</span>
                {!item.published && <Badge>Hidden</Badge>}
              </span>
              <span className="block truncate text-[0.83rem] text-black/50">
                {item.subtitle ? `${item.subtitle} · ` : ""}edited {timeAgo(item.updated)}
              </span>
            </Link>
            <label className="flex items-center gap-2 text-[0.82rem] text-black/60" title={item.published ? "Visible on the site" : "Hidden from the site"}>
              <span className="hidden sm:inline">{item.published ? "Visible" : "Hidden"}</span>
              <input
                type="checkbox"
                role="switch"
                checked={item.published}
                disabled={pending}
                onChange={() => run(() => setPublished(item.id, !item.published), item.published ? "Hidden from the site" : "Now visible on the site")}
                className="peer sr-only"
              />
              <span aria-hidden className="relative h-5 w-9 rounded-full bg-black/15 transition-colors peer-checked:bg-black after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
            </label>
            {publicBase && item.published && (
              <a href={`${publicBase}${item.slug}`} target="_blank" rel="noreferrer" aria-label="View on site" className="rounded-full p-2 text-black/50 hover:bg-black/5 hover:text-black">
                <ExternalLink size={16} />
              </a>
            )}
            <Link href={`/admin/content/${type}/${item.id}`} aria-label="Edit" className="rounded-full p-2 text-black/50 hover:bg-black/5 hover:text-black">
              <Pencil size={16} />
            </Link>
            <button
              type="button"
              aria-label="Delete"
              disabled={pending}
              onClick={async () => {
                if (await ask({ title: `Delete this ${singular}?`, text: `"${item.title}" is removed from the site for good.`, confirm: "Delete", danger: true }))
                  run(() => deleteContent(item.id), "Deleted");
              }}
              className="rounded-full p-2 text-black/50 hover:bg-[#fdf0f4] hover:text-[#b4234f]"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

/** Copies the built-in content (written in code) into the admin. */
export function ImportButton({ type, count, primary }: { type: string; count: number; primary?: boolean }) {
  const [overwrite, setOverwrite] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const toast = useToast();
  const router = useRouter();
  if (count === 0) return null;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={primary ? btn.primary : btn.secondary}>
        Import built-in content
      </button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4" role="dialog" aria-modal>
          <div className="w-full max-w-md rounded-[22px] bg-white p-6">
            <p className="text-lg font-medium">Import {count} built-in items</p>
            <p className="mt-2 text-black/60">The site&apos;s current content, written in code, is copied here so you can edit it. Once imported, the site shows what is in the admin.</p>
            <label className="mt-4 flex items-start gap-2 text-sm">
              <input type="checkbox" checked={overwrite} onChange={(e) => setOverwrite(e.target.checked)} className="mt-0.5 h-4 w-4 accent-black" />
              <span>Overwrite items that already exist here (same web address). Your edits to them are lost.</span>
            </label>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className={btn.secondary} onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                disabled={pending}
                className={btn.primary}
                onClick={() =>
                  start(async () => {
                    const r = await importDefaults(type, overwrite);
                    if (!r.ok) return toast(r.error ?? "Import failed", "error");
                    toast(`Imported: ${r.created} added, ${r.updated} updated, ${r.skipped} skipped`);
                    setOpen(false);
                    router.refresh();
                  })
                }
              >
                {pending ? "Importing…" : "Import"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
