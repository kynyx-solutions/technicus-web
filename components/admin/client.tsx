"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { btn } from "./ui";

/* ------------------------------------------------------------ toasts --- */

type Toast = { id: number; text: string; tone: "ok" | "error" };
const ToastContext = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});
export const useToast = () => useContext(ToastContext);

export function Toaster({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2">
        {toasts.map((t) => (
          <p key={t.id} className={`rounded-full px-5 py-3 text-sm shadow-lg ${t.tone === "ok" ? "bg-black text-white" : "bg-[#b4234f] text-white"}`}>
            {t.text}
          </p>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ------------------------------------------------------------ confirm --- */

type ConfirmOptions = { title: string; text?: string; confirm?: string; danger?: boolean };
const ConfirmContext = createContext<(o: ConfirmOptions) => Promise<boolean>>(async () => false);
export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const ask = useCallback((o: ConfirmOptions) => new Promise<boolean>((resolve) => setOpen({ ...o, resolve })), []);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  const finish = (v: boolean) => {
    open?.resolve(v);
    setOpen(null);
  };
  return (
    <ConfirmContext.Provider value={ask}>
      {children}
      <dialog
        ref={dialog}
        onCancel={(e) => {
          e.preventDefault();
          finish(false);
        }}
        className="m-auto w-[min(92vw,26rem)] rounded-[22px] p-6 backdrop:bg-black/40"
      >
        {open && (
          <>
            <p className="text-lg font-medium">{open.title}</p>
            {open.text && <p className="mt-2 text-black/60">{open.text}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className={btn.secondary} onClick={() => finish(false)}>
                Cancel
              </button>
              <button type="button" autoFocus className={open.danger ? btn.danger : btn.primary} onClick={() => finish(true)}>
                {open.confirm ?? "Confirm"}
              </button>
            </div>
          </>
        )}
      </dialog>
    </ConfirmContext.Provider>
  );
}

/* ------------------------------------------------------------ buttons --- */

/** A submit button that shows progress while its form is being sent. */
export function SubmitButton({ children, pendingText = "Saving…", className = btn.primary }: { children: React.ReactNode; pendingText?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingText : children}
    </button>
  );
}

/** Runs a server action after asking for confirmation, then reports the result. */
export function ActionButton({
  action,
  children,
  confirm,
  done,
  then,
  className = btn.secondary,
}: {
  action: () => Promise<{ ok: boolean; error?: string } | void>;
  children: React.ReactNode;
  confirm?: ConfirmOptions;
  done?: string;
  /** Runs after success, for example to go back to a list. */
  then?: () => void;
  className?: string;
}) {
  const ask = useConfirm();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      className={className}
      onClick={async () => {
        if (confirm && !(await ask(confirm))) return;
        setBusy(true);
        try {
          const result = await action();
          if (result && !result.ok) toast(result.error ?? "Something went wrong", "error");
          else {
            if (done) toast(done);
            then?.();
          }
        } catch {
          toast("Something went wrong", "error");
        } finally {
          setBusy(false);
        }
      }}
    >
      {children}
    </button>
  );
}

export function CopyButton({ value, children }: { value: string; children: React.ReactNode }) {
  const toast = useToast();
  return (
    <button
      type="button"
      className={`${btn.ghost} ${btn.small}`}
      onClick={() => {
        void navigator.clipboard.writeText(value);
        toast("Copied");
      }}
    >
      {children}
    </button>
  );
}
