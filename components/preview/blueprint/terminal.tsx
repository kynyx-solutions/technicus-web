"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CornerDownLeft } from "lucide-react";

export type TermPractice = { slug: string; name: string; summary: string; capabilities: { slug: string; name: string }[] };
export type TermProject = {
  slug: string;
  client: string;
  industry: string;
  sector: string;
  summary: string;
  country: string;
  technologies: string[];
  pillars: string[];
};
export type TermData = {
  practices: TermPractice[];
  projects: TermProject[];
  industries: { slug: string; name: string }[];
  contact: { email: string; phone: string; phoneHref: string };
};

type Entry = { id: number; input?: string; out: ReactNode };

const commands: { name: string; args?: string; text: string }[] = [
  { name: "help", text: "List the commands" },
  { name: "services", args: "[practice]", text: "Our practices, or one in detail" },
  { name: "work", args: "[client]", text: "Build logs from client projects" },
  { name: "industries", text: "Sectors we work in" },
  { name: "about", text: "Who we are and how we work" },
  { name: "careers", text: "Join the team" },
  { name: "contact", text: "Talk to us about a project" },
  { name: "clear", text: "Clear the screen" },
];

export const suggestions = ["help", "services", "services ai-data", "work", "industries", "contact"];

const linkCls =
  "underline decoration-white/30 underline-offset-4 hover:text-[var(--bp-accent)] hover:decoration-[var(--bp-accent)]";
const cmdCls =
  "bp-press cursor-pointer text-[var(--bp-accent)] underline decoration-[var(--bp-accent)]/40 underline-offset-4 hover:decoration-[var(--bp-accent)]";

function match<T extends { slug: string }>(list: T[], q: string, name: (t: T) => string) {
  const s = q.toLowerCase().trim();
  return (
    list.find((t) => t.slug === s) ??
    list.find((t) => t.slug.startsWith(s)) ??
    list.find((t) => name(t).toLowerCase().includes(s))
  );
}

function Muted({ children }: { children: ReactNode }) {
  return <span className="whitespace-pre text-white/45">{children}</span>;
}

export function Terminal({ data }: { data: TermData }) {
  const [entries, setEntries] = useState<Entry[]>(() => [
    {
      id: 0,
      out: (
        <p>
          <span className="text-white">Technicus console.</span> <Muted>Ask about our practices, work and industries. Type a command, press Tab to complete, arrows for history.</Muted>
        </p>
      ),
    },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const nextId = useRef(1);
  const input = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const typing = useRef<number | null>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight });
  }, [entries]);

  useEffect(() => () => {
    if (typing.current) window.clearInterval(typing.current);
  }, []);

  const push = (input: string | undefined, out: ReactNode) =>
    setEntries((e) => [...e, { id: nextId.current++, input, out }]);

  const cmdLink = (c: string, label?: string) => (
    <button type="button" className={cmdCls} onClick={() => run(c)}>
      {label ?? c}
    </button>
  );

  function output(raw: string): ReactNode | "clear" {
    const [cmd, ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ");
    switch (cmd.toLowerCase()) {
      case "help":
      case "ls":
      case "?":
        return (
          <div>
            <p className="text-white/60">Available commands</p>
            <ul className="mt-2 grid gap-1">
              {commands.map((c) => (
                <li key={c.name} className="grid grid-cols-[minmax(0,9.5rem)_1fr] gap-3 max-sm:grid-cols-1 max-sm:gap-0">
                  <span>
                    {cmdLink(c.name)} {c.args && <Muted>{c.args}</Muted>}
                  </span>
                  <Muted>{c.text}</Muted>
                </li>
              ))}
            </ul>
          </div>
        );
      case "services":
      case "practices": {
        if (!arg)
          return (
            <div>
              <p className="text-white/60">Practices. Pick one for its parts list.</p>
              <ul className="mt-2 grid gap-1.5">
                {data.practices.map((p) => (
                  <li key={p.slug} className="grid grid-cols-[minmax(0,13rem)_1fr] gap-3 max-sm:grid-cols-1 max-sm:gap-0">
                    <span>{cmdLink(`services ${p.slug}`, p.slug)}</span>
                    <span className="text-white/80">{p.name} <Muted>· {p.summary}</Muted></span>
                  </li>
                ))}
              </ul>
            </div>
          );
        const p = match(data.practices, arg, (x) => x.name);
        if (!p) return <p>No practice matches “{arg}”. Try {cmdLink("services")}.</p>;
        return (
          <div>
            <p><span className="text-white">{p.name}</span></p>
            <p className="text-white/60">{p.summary}</p>
            <p className="mt-2 text-white/45">Parts list</p>
            <ul className="mt-1 grid gap-0.5">
              {p.capabilities.map((c) => (
                <li key={c.slug}>
                  <span className="text-white/35" aria-hidden="true">├─ </span>
                  <Link className={linkCls} href={`/services/${p.slug}/${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
            <p className="mt-2">
              <Link className={linkCls} href={`/services/${p.slug}`}>Open {p.name} ↗</Link>
            </p>
          </div>
        );
      }
      case "work":
      case "projects": {
        if (!arg)
          return (
            <div>
              <p className="text-white/60">Build logs</p>
              <ul className="mt-2 grid gap-1.5">
                {data.projects.map((p) => (
                  <li key={p.slug} className="grid grid-cols-[minmax(0,13rem)_1fr] gap-3 max-sm:grid-cols-1 max-sm:gap-0">
                    <span>{cmdLink(`work ${p.slug}`, p.slug)}</span>
                    <span className="text-white/80">{p.client} <Muted>· {p.industry} · {p.country}</Muted></span>
                  </li>
                ))}
              </ul>
              <p className="mt-2"><Link className={linkCls} href="/work">All work ↗</Link></p>
            </div>
          );
        const p = match(data.projects, arg, (x) => x.client);
        if (!p) return <p>No project matches “{arg}”. Try {cmdLink("work")}.</p>;
        const names = p.pillars.map((s) => data.practices.find((x) => x.slug === s)?.name).filter(Boolean);
        return (
          <div className="grid gap-0.5">
            <p className="text-white">{p.client}</p>
            <p><Muted>{"sector    "}</Muted>{p.sector}</p>
            <p><Muted>{"industry  "}</Muted>{p.industry}</p>
            <p><Muted>{"country   "}</Muted>{p.country}</p>
            {names.length > 0 && <p><Muted>{"practices "}</Muted>{names.join(", ")}</p>}
            {p.technologies.length > 0 && <p><Muted>{"stack     "}</Muted>{p.technologies.join(", ")}</p>}
            <p className="mt-1 text-white/70">{p.summary}</p>
            <p className="mt-1"><Link className={linkCls} href={`/work/${p.slug}`}>Read the build log ↗</Link></p>
          </div>
        );
      }
      case "industries":
        return (
          <div>
            <p className="text-white/60">Industries</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
              {data.industries.map((i) => (
                <li key={i.slug}><Link className={linkCls} href={`/industries/${i.slug}`}>{i.name}</Link></li>
              ))}
            </ul>
          </div>
        );
      case "about":
        return (
          <div>
            <p className="text-white/80">Technicus is a technology consultancy based in India, working with clients worldwide. We take work from the first decision to the system running in production, and we stay to run it.</p>
            <p className="mt-2 flex flex-wrap gap-x-5">
              <Link className={linkCls} href="/about">Company ↗</Link>
              <Link className={linkCls} href="/about/how-we-work">How we work ↗</Link>
              <Link className={linkCls} href="/about/leadership">Leadership ↗</Link>
            </p>
          </div>
        );
      case "careers":
        return <p>We hire engineers, designers and consultants. <Link className={linkCls} href="/careers">See open roles ↗</Link></p>;
      case "insights":
        return <p><Link className={linkCls} href="/insights">Read our insights ↗</Link></p>;
      case "contact":
        return (
          <div className="grid gap-0.5">
            <p><Muted>{"email  "}</Muted><a className={linkCls} href={`mailto:${data.contact.email}`}>{data.contact.email}</a></p>
            <p><Muted>{"phone  "}</Muted><a className={linkCls} href={data.contact.phoneHref}>{data.contact.phone}</a></p>
            <p className="mt-1"><Link className={linkCls} href="/contact">Start a project ↗</Link></p>
          </div>
        );
      case "clear":
      case "cls":
        return "clear";
      default:
        return <p>command not found: {cmd}. Type {cmdLink("help")} for the list.</p>;
    }
  }

  function run(raw: string) {
    if (typing.current) {
      window.clearInterval(typing.current);
      typing.current = null;
    }
    const cmd = raw.trim();
    setValue("");
    setCursor(null);
    if (!cmd) {
      push("", null);
      return;
    }
    setHistory((h) => (h[h.length - 1] === cmd ? h : [...h, cmd]));
    const out = output(cmd);
    if (out === "clear") setEntries([]);
    else push(cmd, out);
    input.current?.focus({ preventScroll: true });
  }

  /** Suggestion buttons type the command, then run it. */
  function suggest(cmd: string) {
    if (typing.current) window.clearInterval(typing.current);
    input.current?.focus({ preventScroll: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      run(cmd);
      return;
    }
    let i = 0;
    setValue("");
    typing.current = window.setInterval(() => {
      i++;
      setValue(cmd.slice(0, i));
      if (i >= cmd.length) {
        if (typing.current) window.clearInterval(typing.current);
        typing.current = null;
        window.setTimeout(() => run(cmd), 140);
      }
    }, 32);
  }

  function complete() {
    const v = value.replace(/^\s+/, "");
    const parts = v.split(/\s+/);
    let pool: string[];
    let prefix: string;
    let base = "";
    if (parts.length <= 1) {
      pool = commands.map((c) => c.name);
      prefix = parts[0] ?? "";
    } else {
      const c = parts[0].toLowerCase();
      prefix = parts.slice(1).join(" ");
      base = parts[0] + " ";
      pool =
        c === "services" ? data.practices.map((p) => p.slug) : c === "work" ? data.projects.map((p) => p.slug) : [];
    }
    const hits = pool.filter((p) => p.startsWith(prefix.toLowerCase()));
    if (hits.length === 1) {
      setValue(base + hits[0] + (parts.length <= 1 && commands.find((c) => c.name === hits[0])?.args ? " " : ""));
    } else if (hits.length > 1) {
      let common = hits[0];
      for (const h of hits) while (!h.startsWith(common)) common = common.slice(0, -1);
      if (common.length > prefix.length) setValue(base + common);
      else push(value, <p className="flex flex-wrap gap-x-5 text-white/60">{hits.map((h) => <span key={h}>{h}</span>)}</p>);
    }
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (typing.current && e.key.length === 1) {
      window.clearInterval(typing.current);
      typing.current = null;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      run(value);
    } else if (e.key === "Tab") {
      if (!value.trim()) return; // let Tab move focus when the line is empty
      e.preventDefault();
      complete();
    } else if (e.key === "ArrowUp") {
      if (!history.length) return;
      e.preventDefault();
      const i = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(i);
      setValue(history[i]);
    } else if (e.key === "ArrowDown") {
      if (cursor === null) return;
      e.preventDefault();
      const i = cursor + 1;
      if (i >= history.length) {
        setCursor(null);
        setValue("");
      } else {
        setCursor(i);
        setValue(history[i]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
    }
  }

  const prompt = (
    <span className="shrink-0 select-none" aria-hidden="true">
      <span className="text-white/45 max-sm:hidden">guest@technicus</span>
      <span className="text-[var(--bp-accent)]"> ~ ›</span>
    </span>
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Try a command">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => suggest(s)}
            className="bp-press bp-mono border border-white/20 px-3 py-1.5 text-[12px] text-white/80 hover:border-[var(--bp-accent)] hover:text-white"
          >
            <span className="text-[var(--bp-accent)]" aria-hidden="true">$ </span>
            {s}
          </button>
        ))}
      </div>

      <div
        className="border border-white/15 bg-[#0a0c0a] transition-colors focus-within:border-[var(--bp-accent)]/70"
        onMouseUp={(e) => {
          const t = e.target as HTMLElement;
          if (t.closest("a,button") || window.getSelection()?.toString()) return;
          input.current?.focus({ preventScroll: true });
        }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="bp-label text-white/50">Console</span>
          <span className="bp-label text-white/35 max-sm:hidden">Tab completes · ↑ ↓ history</span>
        </div>
        <div
          ref={scroller}
          className="bp-term-scroll bp-mono h-[420px] overflow-y-auto px-4 py-4 text-[13px] leading-[1.7] text-white/85 sm:h-[460px] sm:px-5"
          role="log"
          aria-live="polite"
          aria-label="Console output"
        >
          {entries.map((e) => (
            <div key={e.id} className="bp-out mb-3 break-words">
              {e.input !== undefined && (
                <p className="flex gap-2">
                  {prompt}
                  <span className="text-white">{e.input}</span>
                </p>
              )}
              {e.out}
            </div>
          ))}
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              run(value);
            }}
          >
            {prompt}
            <label htmlFor="bp-cmd" className="sr-only">Console command</label>
            <input
              id="bp-cmd"
              ref={input}
              value={value}
              onChange={(e) => {
                if (typing.current) {
                  window.clearInterval(typing.current);
                  typing.current = null;
                }
                setValue(e.target.value);
              }}
              onKeyDown={onKey}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="go"
              placeholder="type help"
              className="bp-caret bp-mono min-w-0 flex-1 bg-transparent text-[16px] text-white outline-none placeholder:text-white/25 focus-visible:outline-none sm:text-[13px]"
            />
            <button
              type="submit"
              className="bp-press grid size-8 shrink-0 place-items-center border border-white/15 text-white/60 hover:border-[var(--bp-accent)] hover:text-white"
              aria-label="Run command"
            >
              <CornerDownLeft className="size-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
