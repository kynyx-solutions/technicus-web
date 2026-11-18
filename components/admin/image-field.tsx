"use client";

import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { uploadImage } from "@/app/admin/(panel)/media-actions";
import { useToast } from "./client";
import { btn, input } from "./ui";

/**
 * An image: upload a file (PNG, JPG, WebP or SVG, up to 2 MB) or paste a link.
 * `shape` sets the preview: "logo" shows it on a light card, "cover" wide.
 */
export function ImageField({ value, onChange, shape = "logo", label }: { value: string; onChange: (url: string) => void; shape?: "logo" | "cover"; label?: string }) {
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const upload = async (f: File) => {
    setBusy(true);
    const form = new FormData();
    form.set("file", f);
    const r = await uploadImage(form);
    setBusy(false);
    if (!r.ok || !r.url) return toast(r.error ?? "Upload failed", "error");
    onChange(r.url);
    toast("Image uploaded");
  };

  return (
    <div>
      {label && <p className="mb-1.5 text-[0.85rem] font-medium text-black/75">{label}</p>}
      <div className="flex items-center gap-3">
        <div
          className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-black/10 bg-fog ${shape === "cover" ? "h-20 w-44" : "h-16 w-28"}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) void upload(f);
          }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className={shape === "cover" ? "h-full w-full object-cover" : "max-h-[70%] max-w-[80%] object-contain"} />
          ) : (
            <ImagePlus size={20} className="text-black/30" aria-hidden />
          )}
          {value && (
            <button type="button" aria-label="Remove image" onClick={() => onChange("")} className="absolute top-1 right-1 rounded-full bg-white/90 p-0.5 text-black/60 hover:text-black">
              <X size={13} />
            </button>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input ref={file} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="sr-only" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          <button type="button" disabled={busy} onClick={() => file.current?.click()} className={`${btn.secondary} ${btn.small}`}>
            {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </button>
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="or paste a link: https://… or /path" className={`${input} !py-1.5 !text-[0.85rem]`} />
        </div>
      </div>
    </div>
  );
}
