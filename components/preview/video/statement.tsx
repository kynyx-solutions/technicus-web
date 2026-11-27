"use client";

import { useCallback, useRef, type CSSProperties } from "react";
import { s } from "./styles";
import { useReducedMotion, useScrollFrame } from "./motion";

/**
 * A large editorial statement whose words light up as it scrolls through the
 * viewport. Words wrapped in *asterisks* are set in the serif italic.
 * Without scripts or with reduced motion every word is fully visible.
 */
export function Statement({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = innerHeight;
    // 0 when the paragraph's top is at 85% of the screen, 1 when its bottom reaches 45%.
    const start = vh * 0.85;
    const end = vh * 0.45;
    const p = (start - r.top) / (start - end + r.height);
    el.style.setProperty("--prog", Math.min(1, Math.max(0, p)).toFixed(4));
  }, []);
  useScrollFrame(update, !reduced);

  return (
    <p ref={ref} className={s.statementText} style={{ "--n": words.length } as CSSProperties}>
      {words.map((w, i) => {
        const em = w.startsWith("*");
        const clean = w.replace(/\*/g, "");
        return (
          <span key={i}>
            <span className={`${s.word} ${em ? s.em : ""}`} style={{ "--i": i } as CSSProperties}>
              {clean}
            </span>{" "}
          </span>
        );
      })}
    </p>
  );
}
