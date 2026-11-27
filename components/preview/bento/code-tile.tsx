"use client";

import { useRef, useState } from "react";
import { Check, GitBranch } from "lucide-react";
import { Tile, useLoop, useTile } from "./tile";
import { TileHead } from "./head";

const snippets = [
  {
    file: "release.ts",
    code: `import { checks, build, deploy } from "./ci";

export async function release(app: App) {
  await checks.run(app);
  const image = await build(app);
  await deploy(image, { canary: true });
  return image.url;
}`,
  },
  {
    file: "orders.ts",
    code: `export class Orders {
  constructor(private db: Db, private bus: Bus) {}

  async place(order: NewOrder) {
    const saved = await this.db.orders.insert(order);
    await this.bus.publish("order.placed", saved);
    return saved;
  }
}`,
  },
  {
    file: "assistant.ts",
    code: `export async function answer(question: string) {
  const sources = await search(docs, question);
  return model.respond({
    question,
    context: sources,
    rules: policy.support,
  });
}`,
  },
];

const TOKEN =
  /(\/\/.*$)|("[^"\n]*"?)|\b(import|from|export|async|function|await|const|return|class|constructor|private|true|false|new)\b|\b([A-Z][A-Za-z]*)\b|([a-zA-Z_]\w*)(?=\()|([{}()[\];,.:<>=])/gm;

function highlight(src: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of src.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(src.slice(last, i));
    const cls = m[1] ? "bnt-p" : m[2] ? "bnt-s" : m[3] ? "bnt-k" : m[4] ? "bnt-t" : m[5] ? "bnt-f" : "bnt-p";
    out.push(
      <span key={key++} className={cls}>
        {m[0]}
      </span>,
    );
    last = i + m[0].length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

type Phase = "type" | "checks" | "build" | "live";
const HOLD: Record<Exclude<Phase, "type">, number> = { checks: 1.1, build: 1.2, live: 2.8 };
const NEXT: Record<Phase, Phase> = { type: "checks", checks: "build", build: "live", live: "type" };

function Editor() {
  const { reduced } = useTile();
  const [s, setS] = useState(0);
  const [n, setN] = useState(snippets[0].code.length);
  const [phase, setPhase] = useState<Phase>("live");
  const st = useRef({ started: false, s: 0, chars: 0, phase: "live" as Phase, t: 0 });

  useLoop((dt, speed) => {
    const r = st.current;
    if (!r.started) {
      r.started = true;
      r.phase = "type";
      r.chars = 0;
      setPhase("type");
      setN(0);
      return;
    }
    const len = snippets[r.s].code.length;
    if (r.phase === "type") {
      // Type faster through indentation, slower on new lines, like a person.
      const ch = snippets[r.s].code[Math.floor(r.chars)];
      const rate = ch === " " ? 160 : ch === "\n" ? 14 : 58;
      r.chars = Math.min(len, r.chars + dt * rate * speed);
      const next = Math.floor(r.chars);
      setN(next);
      if (next >= len) {
        r.phase = "checks";
        r.t = 0;
        setPhase("checks");
      }
      return;
    }
    r.t += dt * speed;
    if (r.t >= HOLD[r.phase]) {
      r.t = 0;
      r.phase = NEXT[r.phase];
      if (r.phase === "type") {
        r.s = (r.s + 1) % snippets.length;
        r.chars = 0;
        setS(r.s);
        setN(0);
      }
      setPhase(r.phase);
    }
  });

  const snip = snippets[s];
  const shown = reduced ? snip.code : snip.code.slice(0, n);
  const lines = snip.code.split("\n").length;
  const status =
    phase === "type" ? `Editing ${snip.file}` : phase === "checks" ? "Running checks" : phase === "build" ? "Building" : "Live on production";
  const order: Phase[] = ["checks", "build", "live"];
  const at = order.indexOf(phase);

  return (
    <div className="bnt-editor mt-6 flex min-h-0 flex-1 flex-col overflow-hidden" aria-hidden="true">
      <div className="flex items-center gap-5 border-b border-[#232321] px-4 text-[12px]">
        {snippets.map((x, i) => (
          <span key={x.file} className="bnt-tab bnt-mono py-2.5" data-on={i === s}>
            {x.file}
          </span>
        ))}
      </div>
      <div className="relative min-h-[214px] flex-1 overflow-hidden px-4 py-3">
        <div className="flex gap-4">
          <div className="bnt-mono bnt-code select-none text-right text-[#4a4843]">
            {Array.from({ length: lines }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="bnt-mono bnt-code m-0 min-w-0 text-[#e9e6df]">
            <code>
              {highlight(shown)}
              {!reduced && phase === "type" ? <span className="bnt-caret" /> : null}
            </code>
          </pre>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-[#232321] px-4 py-2.5 text-[12px]">
        <span className="flex items-center gap-2 text-[#e9e6df]">
          <span className="bnt-status-dot" data-phase={phase} />
          {status}
        </span>
        <span className="bnt-steps flex items-center gap-3 text-[#6d6a63]">
          {["Checks", "Build", "Deploy"].map((l, i) => (
            <span key={l} data-on={i === at} data-done={phase === "live" || (at > i && phase !== "type")} className="flex items-center gap-1">
              {phase === "live" || (at > i && phase !== "type") ? <Check size={12} strokeWidth={2.5} /> : null}
              {l}
            </span>
          ))}
          <span className="hidden items-center gap-1 sm:flex">
            <GitBranch size={12} /> main
          </span>
        </span>
      </div>
    </div>
  );
}

export function CodeTile({ delay }: { delay?: number }) {
  return (
    <Tile area="code" tone="dark" delay={delay} label="Product engineering" className="flex flex-col p-5 md:p-7">
      <TileHead
        eyebrow="Product Engineering"
        title="Software that holds up in production."
        body="Web platforms, mobile apps and integrations, shipped in small releases with checks at every step."
        href="/services/product-engineering"
        large
      />
      <Editor />
    </Tile>
  );
}
