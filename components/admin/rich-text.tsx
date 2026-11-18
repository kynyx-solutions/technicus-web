"use client";

import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Code, Heading2, Heading3, ImageIcon, Italic, Link2, List, Minus, Quote, Redo2, Strikethrough, Underline, Undo2 } from "lucide-react";
import { useState } from "react";
import { btn, input } from "./ui";

/**
 * The article editor. Headings, emphasis, bullet lists, quotes, code, links and
 * images. There is no numbered-list button: the site uses no numbering.
 */
export function RichText({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const [dialog, setDialog] = useState<null | "link" | "image">(null);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, orderedList: false, link: { openOnClick: false, autolink: true } }),
      Image,
      Placeholder.configure({ placeholder: "Write the article…" }),
    ],
    content: value,
    editorProps: { attributes: { class: "article-body min-h-[22rem] px-5 py-4 text-[1.05rem] leading-relaxed outline-none" } },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            underline: e.isActive("underline"),
            strike: e.isActive("strike"),
            list: e.isActive("bulletList"),
            quote: e.isActive("blockquote"),
            code: e.isActive("codeBlock"),
            link: e.isActive("link"),
          }
        : null,
  });
  if (!editor) return <div className="min-h-[24rem] rounded-2xl border border-black/12 bg-white" />;

  const tool = (label: string, Icon: typeof Bold, active: boolean | undefined, run: () => void) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(e) => e.preventDefault()}
      onClick={run}
      className={`rounded-lg p-2 transition-colors ${active ? "bg-black text-white" : "text-black/65 hover:bg-black/5 hover:text-black"}`}
    >
      <Icon size={16} />
    </button>
  );
  const chain = () => editor.chain().focus();

  return (
    <div className="overflow-hidden rounded-2xl border border-black/12 bg-white focus-within:border-black">
      <div className="sticky top-0 z-10 flex flex-wrap gap-0.5 border-b border-black/8 bg-white px-2 py-1.5">
        {tool("Heading", Heading2, state?.h2, () => chain().toggleHeading({ level: 2 }).run())}
        {tool("Subheading", Heading3, state?.h3, () => chain().toggleHeading({ level: 3 }).run())}
        <span className="mx-1 w-px bg-black/10" />
        {tool("Bold", Bold, state?.bold, () => chain().toggleBold().run())}
        {tool("Italic", Italic, state?.italic, () => chain().toggleItalic().run())}
        {tool("Underline", Underline, state?.underline, () => chain().toggleUnderline().run())}
        {tool("Strikethrough", Strikethrough, state?.strike, () => chain().toggleStrike().run())}
        <span className="mx-1 w-px bg-black/10" />
        {tool("Bullet list", List, state?.list, () => chain().toggleBulletList().run())}
        {tool("Quote", Quote, state?.quote, () => chain().toggleBlockquote().run())}
        {tool("Code block", Code, state?.code, () => chain().toggleCodeBlock().run())}
        {tool("Divider", Minus, false, () => chain().setHorizontalRule().run())}
        <span className="mx-1 w-px bg-black/10" />
        {tool("Link", Link2, state?.link, () => {
          setUrl(editor.getAttributes("link").href ?? "");
          setDialog("link");
        })}
        {tool("Image", ImageIcon, false, () => {
          setUrl("");
          setAlt("");
          setDialog("image");
        })}
        <span className="ml-auto flex">
          {tool("Undo", Undo2, false, () => chain().undo().run())}
          {tool("Redo", Redo2, false, () => chain().redo().run())}
        </span>
      </div>
      {dialog && (
        <div className="flex flex-wrap items-end gap-2 border-b border-black/8 bg-fog px-3 py-3">
          <label className="min-w-[14rem] flex-1">
            <span className="mb-1 block text-xs font-medium">{dialog === "link" ? "Link address" : "Image address"}</span>
            <input autoFocus value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https:// or /path" className={`${input} !py-2`} />
          </label>
          {dialog === "image" && (
            <label className="min-w-[14rem] flex-1">
              <span className="mb-1 block text-xs font-medium">Description (alt text), required</span>
              <input value={alt} onChange={(e) => setAlt(e.target.value)} className={`${input} !py-2`} />
            </label>
          )}
          <button
            type="button"
            disabled={dialog === "image" && (!url || !alt)}
            className={`${btn.primary} ${btn.small}`}
            onClick={() => {
              if (dialog === "link") {
                if (url) chain().extendMarkRange("link").setLink({ href: url }).run();
                else chain().extendMarkRange("link").unsetLink().run();
              } else chain().setImage({ src: url, alt }).run();
              setDialog(null);
            }}
          >
            {dialog === "link" ? (url ? "Set link" : "Remove link") : "Insert image"}
          </button>
          <button type="button" className={`${btn.ghost} ${btn.small}`} onClick={() => setDialog(null)}>
            Cancel
          </button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
