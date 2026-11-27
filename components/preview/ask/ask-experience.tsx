"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, ArrowUp, ArrowUpRight, Bot, Cloud, Gauge, Mail, RotateCcw, ShoppingBag, Smartphone, TrendingUp } from "lucide-react";
import { respond, type AskAnswer, type AskData } from "./matcher";

const SUGGESTIONS = [
  { label: "An online store", query: "An online store for my brand", icon: ShoppingBag },
  { label: "An AI assistant for my team", query: "An AI assistant for my team", icon: Bot },
  { label: "A mobile app", query: "A mobile app for our customers", icon: Smartphone },
  { label: "Move to the cloud", query: "Move our servers to the cloud", icon: Cloud },
  { label: "Fix a slow website", query: "Fix a slow website", icon: Gauge },
  { label: "More leads from search", query: "More leads from search", icon: TrendingUp },
];

const EXAMPLES = [
  "a clinic booking system",
  "a support assistant",
  "a portal for our dealers",
  "an app for our drivers",
  "a faster company website",
];

const THINKING = ["Reading your brief", "Matching practices", "Looking for related work"];

type Turn = { id: number; query: string; answer: AskAnswer };

/* ------------------------------------------------------------------ */
/* Small hooks                                                         */
/* ------------------------------------------------------------------ */

const motionQuery = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(motionQuery);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(motionQuery).matches,
    () => false,
  );
}

function usePageVisible() {
  return useSyncExternalStore(
    (cb) => {
      document.addEventListener("visibilitychange", cb);
      return () => document.removeEventListener("visibilitychange", cb);
    },
    () => document.visibilityState === "visible",
    () => true,
  );
}

const fmt = (word: string, n: number) => `Try “${word.slice(0, n)}${n >= word.length ? "”" : ""}`;

/** Types example briefs into the placeholder. Runs only while it can be seen. */
function usePlaceholder(active: boolean) {
  const [text, setText] = useState(fmt(EXAMPLES[0], EXAMPLES[0].length));
  const pos = useRef({ i: 0, n: EXAMPLES[0].length, phase: "hold" as "hold" | "erase" | "type" });
  useEffect(() => {
    if (!active) return;
    let timer = 0;
    const step = () => {
      const p = pos.current;
      let delay = 45;
      if (p.phase === "hold") {
        p.phase = "erase";
        delay = 20;
      } else if (p.phase === "erase") {
        p.n -= 1;
        delay = 18;
        if (p.n <= 0) {
          p.n = 0;
          p.i = (p.i + 1) % EXAMPLES.length;
          p.phase = "type";
          delay = 320;
        }
      } else {
        p.n += 1;
        if (p.n >= EXAMPLES[p.i].length) {
          p.phase = "hold";
          delay = 2600;
        }
      }
      setText(fmt(EXAMPLES[p.i], p.n));
      timer = window.setTimeout(step, delay);
    };
    timer = window.setTimeout(step, pos.current.phase === "hold" ? 2600 : 200);
    return () => window.clearTimeout(timer);
  }, [active]);
  return text;
}

/* ------------------------------------------------------------------ */
/* One answered question                                               */
/* ------------------------------------------------------------------ */

type Stage = "thinking" | "typing" | "done";

function TurnView({
  turn,
  live,
  reduced,
  email,
  onDone,
  onAsk,
}: {
  turn: Turn;
  live: boolean;
  reduced: boolean;
  email: string;
  onDone: (id: number) => void;
  onAsk: (q: string) => void;
}) {
  const [stage, setStage] = useState<Stage>("thinking");
  const [chars, setChars] = useState(0);
  const [status, setStatus] = useState(0);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  // A turn that is no longer the newest, or any turn under reduced motion,
  // shows its finished state at once. That is also how an answer still
  // streaming is cancelled when a new question arrives.
  const instant = reduced || !live;
  const shown: Stage = instant ? "done" : stage;

  useEffect(() => {
    if (instant) return;
    const timers: number[] = [];
    let raf = 0;
    timers.push(window.setTimeout(() => setStatus(1), 360));
    timers.push(window.setTimeout(() => setStatus(2), 720));
    timers.push(
      window.setTimeout(() => {
        setStage("typing");
        const total = turn.answer.text.length;
        const start = performance.now();
        const tick = (now: number) => {
          // Roughly 160 characters a second: quick, but still readable as it lands.
          const n = Math.min(total, Math.floor((now - start) * 0.16));
          setChars(n);
          if (n < total) raf = requestAnimationFrame(tick);
          else {
            setStage("done");
            onDoneRef.current(turn.id);
          }
        };
        raf = requestAnimationFrame(tick);
      }, 1050),
    );
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      cancelAnimationFrame(raf);
    };
  }, [instant, turn]);

  const { answer } = turn;
  const brief = `/contact?brief=${encodeURIComponent(turn.query)}`;

  return (
    <article id={`ask-turn-${turn.id}`} aria-label={`Answer to: ${turn.query}`} className="scroll-mt-24 border-t border-[var(--ask-line)] py-8 first:border-t-0 first:pt-2 md:py-10">
      {/* The question */}
      <div className="grid gap-2 md:grid-cols-[136px_1fr] md:gap-8">
        <p className="pt-1 text-[12px] font-medium tracking-[0.16em] text-[var(--ask-muted)] uppercase">You asked</p>
        <p className="text-[19px] leading-[1.45] font-medium tracking-[-0.01em] text-[var(--ask-ink)] md:text-[21px]">{turn.query}</p>
      </div>

      {/* The answer */}
      <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-[136px_1fr] md:gap-8">
        <p className="flex items-center gap-2 self-start pt-1.5 text-[12px] font-medium tracking-[0.16em] text-[var(--ask-accent-ink)] uppercase">
          <span aria-hidden className="size-1.5 rounded-full bg-[var(--ask-accent)]" />
          Technicus
        </p>
        <div className="min-w-0">
          {shown === "thinking" && (
            <div className="ask-fade" aria-hidden>
              <p className="text-[14px] text-[var(--ask-muted)]">{THINKING[status]}…</p>
              <div className="mt-4 space-y-3">
                <div className="ask-shimmer h-3.5 w-[92%]" />
                <div className="ask-shimmer h-3.5 w-[78%]" />
                <div className="ask-shimmer h-3.5 w-[55%]" />
              </div>
            </div>
          )}

          {shown === "typing" && (
            <p aria-hidden className="ask-serif relative text-[24px] leading-[1.32] text-[var(--ask-ink)] md:text-[29px]">
              <span className="invisible">{answer.text}</span>
              <span className="absolute inset-0">
                {answer.text.slice(0, chars)}
                <span className="ask-caret" />
              </span>
            </p>
          )}

          {shown === "done" && (
            <>
              <p className="ask-serif text-[24px] leading-[1.32] text-[var(--ask-ink)] md:text-[29px]">{answer.text}</p>

              {answer.understood ? (
                <>
                  <h3 className="mt-10 text-[12px] font-medium tracking-[0.16em] text-[var(--ask-muted)] uppercase">Who would do the work</h3>
                  <ul className={`mt-4 grid gap-3 ${answer.practices.length > 1 ? "sm:grid-cols-2" : ""} ${answer.practices.length > 2 ? "lg:grid-cols-3" : ""}`}>
                    {answer.practices.map((p, i) => {
                      const lead = p.role === "lead";
                      return (
                        <li key={p.slug} className="ask-rise flex" style={{ "--ask-i": i } as React.CSSProperties}>
                          <Link
                            href={`/services/${p.slug}`}
                            className={`ask-card-link ask-press group flex w-full flex-col rounded-[20px] border p-5 md:p-6 ${
                              lead
                                ? "border-[var(--ask-ink)] bg-[var(--ask-ink)] text-[var(--ask-paper)]"
                                : "border-[var(--ask-line)] bg-[var(--ask-card)] hover:border-[var(--ask-ink)]/40"
                            }`}
                          >
                            <span className={`flex items-center justify-between text-[11.5px] font-medium tracking-[0.14em] uppercase ${lead ? "text-[#f3a585]" : "text-[var(--ask-muted)]"}`}>
                              <span className="flex items-center gap-2">
                                <span aria-hidden className={`size-1.5 rounded-full ${lead ? "bg-[#f3a585]" : "border border-current"}`} />
                                {lead ? "Leads the work" : "Works alongside"}
                              </span>
                              <ArrowUpRight aria-hidden size={18} className="ask-arrow" />
                            </span>
                            <span className="ask-serif mt-7 block text-[27px] leading-[1.05]">{p.name}</span>
                            <span className={`mt-2.5 block text-[14.5px] leading-[1.5] ${lead ? "text-[#d9d4c8]" : "text-[var(--ask-muted)]"}`}>{p.reason}</span>
                            <span className="mt-auto flex flex-wrap gap-1.5 pt-6">
                              {p.capabilities.map((c) => (
                                <span
                                  key={c.slug}
                                  className={`rounded-full px-2.5 py-1 text-[12.5px] ${lead ? "bg-white/10 text-[var(--ask-paper)]" : "bg-[var(--ask-paper-2)] text-[var(--ask-ink-2)]"}`}
                                >
                                  {c.name}
                                </span>
                              ))}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>

                  <h3 className="mt-10 text-[12px] font-medium tracking-[0.16em] text-[var(--ask-muted)] uppercase">Related work</h3>
                  {answer.projects.length ? (
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {answer.projects.map((p, i) => (
                        <li key={p.slug} className="ask-rise flex" style={{ "--ask-i": answer.practices.length + i } as React.CSSProperties}>
                          <Link
                            href={`/work/${p.slug}`}
                            className="ask-card-link ask-press group flex w-full items-stretch gap-4 rounded-[20px] border border-[var(--ask-line)] bg-[var(--ask-card)] p-3 pr-5 hover:border-[var(--ask-ink)]/40"
                          >
                            <span aria-hidden className="ask-plate grid w-[76px] shrink-0 place-items-center rounded-[14px] text-[var(--ask-paper)]">
                              <span className="ask-serif text-[34px] leading-none">{p.client.charAt(0)}</span>
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col py-1.5">
                              <span className="flex items-start justify-between gap-3">
                                <span className="text-[17px] font-semibold tracking-[-0.01em]">{p.client}</span>
                                <ArrowUpRight aria-hidden size={18} className="ask-arrow mt-0.5 shrink-0 text-[var(--ask-muted)]" />
                              </span>
                              <span className="mt-0.5 text-[13px] text-[var(--ask-muted)]">
                                {p.industry} · {p.country}
                              </span>
                              <span className="mt-2 text-[14.5px] leading-[1.45] text-[var(--ask-ink-2)]">{p.summary}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="ask-rise mt-3 text-[15px] text-[var(--ask-muted)]" style={{ "--ask-i": answer.practices.length } as React.CSSProperties}>
                      We will share the most relevant examples when we talk.{" "}
                      <Link href="/work" className="font-medium text-[var(--ask-ink)] underline decoration-[var(--ask-line)] underline-offset-4 hover:decoration-[var(--ask-accent)]">
                        Browse all work
                      </Link>
                    </p>
                  )}
                </>
              ) : (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Suggestions">
                  {SUGGESTIONS.map((s, i) => (
                    <li key={s.label} className="ask-rise" style={{ "--ask-i": i } as React.CSSProperties}>
                      <Chip label={s.label} Icon={s.icon} onClick={() => onAsk(s.query)} />
                    </li>
                  ))}
                </ul>
              )}

              {/* Next step */}
              <div
                className="ask-rise mt-10 flex flex-col gap-4 rounded-[20px] border border-[var(--ask-accent)]/25 bg-[var(--ask-accent-soft)]/55 p-5 sm:flex-row sm:items-center sm:justify-between md:p-6"
                style={{ "--ask-i": answer.practices.length + answer.projects.length + 1 } as React.CSSProperties}
              >
                <div>
                  <p className="text-[12px] font-medium tracking-[0.16em] text-[var(--ask-accent-ink)] uppercase">Next step</p>
                  <p className="mt-1.5 text-[16.5px] leading-[1.45] text-[var(--ask-ink)]">
                    {answer.understood ? "Scope it properly with a specialist. We bring your brief, so you will not have to repeat it." : "Prefer to explain it to a person? A specialist will take it from here."}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Link
                    href={brief}
                    className="ask-press inline-flex items-center gap-2 rounded-full bg-[var(--ask-accent)] px-5 py-3 text-[15px] font-medium whitespace-nowrap text-white hover:bg-[var(--ask-accent-ink)]"
                  >
                    Talk to a specialist <ArrowRight aria-hidden size={16} />
                  </Link>
                  <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 text-[14.5px] text-[var(--ask-ink-2)] underline decoration-[var(--ask-accent)]/40 underline-offset-4 hover:decoration-[var(--ask-accent)] sm:hidden lg:inline-flex">
                    <Mail aria-hidden size={15} /> {email}
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function Chip({ label, Icon, onClick }: { label: string; Icon: typeof Bot; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ask-press inline-flex items-center gap-2 rounded-full border border-[var(--ask-line)] bg-[var(--ask-card)] px-4 py-2.5 text-[14.5px] text-[var(--ask-ink-2)] hover:border-[var(--ask-ink)]/50 hover:text-[var(--ask-ink)] active:bg-[var(--ask-paper-2)]"
    >
      <Icon aria-hidden size={16} strokeWidth={1.75} className="text-[var(--ask-accent)]" />
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* The hero: prompt, conversation, composer                            */
/* ------------------------------------------------------------------ */

export function AskExperience({ data, email }: { data: AskData; email: string }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [value, setValue] = useState("");
  const [done, setDone] = useState<number[]>([]);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [hint, setHint] = useState(false);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLFormElement>(null);
  const reduced = useReducedMotion();
  const pageVisible = usePageVisible();

  const placeholder = usePlaceholder(!reduced && pageVisible && onScreen && !focused && value === "" && turns.length === 0);

  useEffect(() => {
    const el = composerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const resize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const ask = useCallback(
    (raw: string) => {
      const query = raw.trim().replace(/\s+/g, " ").slice(0, 280);
      if (!query) {
        setHint(true);
        inputRef.current?.focus();
        return;
      }
      setHint(false);
      const answer = respond(query, data);
      const id = ++idRef.current;
      setTurns((t) => [...t, { id, query, answer }]);
      setValue("");
      requestAnimationFrame(() => {
        resize();
        document.getElementById(`ask-turn-${id}`)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      });
    },
    [data, reduced],
  );

  const reset = () => {
    setTurns([]);
    setDone([]);
    setValue("");
    setHint(false);
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    inputRef.current?.focus({ preventScroll: true });
  };

  const latest = turns[turns.length - 1];
  const latestDone = latest && (reduced || done.includes(latest.id));
  const announcement = latestDone
    ? `${latest.answer.text}${latest.answer.practices.length ? ` Recommended practices: ${latest.answer.practices.map((p) => p.name).join(", ")}.` : ""}`
    : latest
      ? "Thinking about your brief."
      : "";

  const hasThread = turns.length > 0;

  return (
    <section id="ask" aria-labelledby="ask-title" className="relative">
      <div aria-hidden className="ask-field pointer-events-none absolute inset-x-0 top-0 h-[720px]" />
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div
        className={`relative mx-auto max-w-[920px] px-4 sm:px-6 ${
          hasThread ? "pt-10 md:pt-14" : "flex min-h-[calc(100svh-64px)] flex-col justify-center pt-10 pb-16 md:min-h-[calc(100svh-72px)] md:pb-24"
        }`}
      >
        <div className={hasThread ? "text-left" : "text-center"}>
          <p className={`inline-flex items-center gap-2.5 rounded-full border border-[var(--ask-line)] bg-[var(--ask-card)] px-3.5 py-1.5 text-[12px] text-[var(--ask-ink-2)] sm:text-[13px] ${pageVisible && onScreen ? "" : "ask-paused"}`}>
            <span aria-hidden className="ask-dot size-1.5 rounded-full bg-[var(--ask-accent)]" />
            Technology consultancy · India and worldwide
          </p>
          <h1
            id="ask-title"
            className={`ask-serif text-balance text-[var(--ask-ink)] ${
              hasThread ? "mt-5 text-[38px] leading-[1] md:text-[52px]" : "mt-7 text-[52px] leading-[0.95] sm:text-[76px] md:text-[104px]"
            }`}
          >
            What are you trying to <em className="text-[var(--ask-accent)] italic">build</em>?
          </h1>
          {!hasThread && (
            <p className="mx-auto mt-6 max-w-[560px] text-[17px] leading-[1.55] text-[var(--ask-muted)] md:text-[18.5px]">
              Describe it in your own words. We will show you how we would approach it, which of our teams would do the work, and related projects where we have them.
            </p>
          )}
        </div>

        {hasThread && (
          <div className="mt-10 md:mt-12">
            <div className="flex items-center justify-between border-b border-[var(--ask-line)] pb-3">
              <h2 className="text-[13px] font-medium tracking-[0.16em] text-[var(--ask-muted)] uppercase">Your brief</h2>
              <button
                type="button"
                onClick={reset}
                className="ask-press inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] text-[var(--ask-ink-2)] hover:bg-[var(--ask-paper-2)]"
              >
                <RotateCcw aria-hidden size={14} /> Start over
              </button>
            </div>
            <div className="pt-6">
              {turns.map((t) => (
                <TurnView key={t.id} turn={t} live={t.id === latest?.id} reduced={reduced} email={email} onAsk={ask} onDone={(id) => setDone((d) => [...d, id])} />
              ))}
            </div>
          </div>
        )}

        <div className={hasThread ? "ask-dock sticky bottom-0 z-20 -mx-4 px-4 pt-10 pb-4 sm:-mx-6 sm:px-6 md:pb-6" : "mt-10 md:mt-12"}>
          <form
            ref={composerRef}
            className="ask-composer rounded-[26px] p-2 pl-5 md:rounded-[30px] md:pl-7"
            onSubmit={(e) => {
              e.preventDefault();
              ask(value);
            }}
          >
            <label htmlFor="ask-input" className="sr-only">
              Describe what you are trying to build
            </label>
            <div className="flex items-end gap-3">
              <textarea
                id="ask-input"
                ref={inputRef}
                rows={1}
                value={value}
                maxLength={280}
                autoComplete="off"
                aria-describedby="ask-help"
                placeholder={hasThread ? "Ask something else" : reduced ? `Try “${EXAMPLES[0]}”` : placeholder}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (hint) setHint(false);
                  resize();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    ask(value);
                  }
                }}
                className={`min-w-0 flex-1 resize-none bg-transparent py-3.5 leading-[1.4] text-[var(--ask-ink)] outline-none focus-visible:outline-none ${
                  hasThread ? "text-[17px] md:py-3 md:text-[18px]" : "text-[19px] md:py-[18px] md:text-[23px]"
                }`}
              />
              <button
                type="submit"
                aria-label="Ask"
                className={`ask-press grid shrink-0 place-items-center rounded-full text-white ${hasThread ? "size-11 md:size-12" : "size-12 md:size-[60px]"} ${
                  value.trim() ? "bg-[var(--ask-accent)] hover:bg-[var(--ask-accent-ink)]" : "bg-[var(--ask-ink)] hover:bg-[var(--ask-ink-2)]"
                }`}
              >
                <ArrowUp aria-hidden size={hasThread ? 20 : 22} strokeWidth={2.25} />
              </button>
            </div>
          </form>
          <p id="ask-help" className={`mt-3 px-2 text-[13px] ${hasThread && !hint ? "sr-only md:not-sr-only" : ""} ${hint ? "text-[var(--ask-accent-ink)]" : "text-[var(--ask-muted)]"} ${hasThread ? "text-left" : "text-center"}`}>
            {hint ? "Type a sentence about what you need, or pick a suggestion." : "Press Enter to ask. Nothing you type is stored or sent anywhere."}
          </p>

          {!hasThread && (
            <ul className="mt-7 flex flex-wrap justify-center gap-2" aria-label="Suggestions">
              {SUGGESTIONS.map((s) => (
                <li key={s.label}>
                  <Chip label={s.label} Icon={s.icon} onClick={() => ask(s.query)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
