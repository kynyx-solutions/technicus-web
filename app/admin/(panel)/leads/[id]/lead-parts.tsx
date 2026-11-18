"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ActionButton, useToast } from "@/components/admin/client";
import { btn, input, label, timeAgo } from "@/components/admin/ui";
import { leadStatuses, priorities, type Note } from "@/lib/db/types";
import { addLeadNote, bulkLeads, deleteLeadNote, updateLead } from "../actions";

export function Pipeline({ id, status, priority }: { id: string; status: string; priority: string }) {
  const toast = useToast();
  const [pending, start] = useTransition();
  const change = (patch: { status?: string; priority?: string }) =>
    start(async () => {
      const r = await updateLead(id, patch);
      toast(r.ok ? "Saved" : (r.error ?? "Something went wrong"), r.ok ? "ok" : "error");
    });
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-[0.85rem] font-medium text-black/75">Status</span>
        <select disabled={pending} defaultValue={status} onChange={(e) => change({ status: e.target.value })} className={input}>
          {leadStatuses.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[0.85rem] font-medium text-black/75">Priority</span>
        <select disabled={pending} defaultValue={priority} onChange={(e) => change({ priority: e.target.value })} className={input}>
          {priorities.map((s) => (
            <option key={s} value={s}>
              {label(s)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function Notes({ id, notes }: { id: string; notes: Note[] }) {
  const [text, setText] = useState("");
  const [pending, start] = useTransition();
  const toast = useToast();
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          start(async () => {
            const r = await addLeadNote(id, text);
            if (!r.ok) return toast(r.error ?? "Something went wrong", "error");
            setText("");
          });
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={4000}
          rows={3}
          placeholder="Add a private note: a call summary, next step, anything the team should know"
          className={input}
        />
        <div className="mt-2 flex justify-end">
          <button type="submit" disabled={pending || !text.trim()} className={`${btn.primary} ${btn.small}`}>
            {pending ? "Adding…" : "Add note"}
          </button>
        </div>
      </form>
      {notes.length > 0 && (
        <ol className="mt-5 space-y-3">
          {[...notes].reverse().map((n) => (
            <li key={n.id} className="group rounded-2xl bg-fog px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[0.92rem] whitespace-pre-wrap">{n.text}</p>
                <ActionButton
                  action={() => deleteLeadNote(id, n.id)}
                  confirm={{ title: "Delete this note?", confirm: "Delete", danger: true }}
                  className="rounded-full p-1 text-black/40 opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#b4234f] focus:opacity-100"
                >
                  <Trash2 size={15} aria-label="Delete note" />
                </ActionButton>
              </div>
              <p className="mt-1.5 text-[0.78rem] text-black/45">
                {n.author} · {timeAgo(n.createdAt)}
              </p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function DeleteLead({ id }: { id: string }) {
  const router = useRouter();
  return (
    <ActionButton
      action={() => bulkLeads([id], "delete")}
      confirm={{ title: "Delete this lead?", text: "The lead and its notes are removed for good.", confirm: "Delete", danger: true }}
      done="Lead deleted"
      then={() => router.push("/admin/leads")}
      className={btn.danger}
    >
      Delete
    </ActionButton>
  );
}
