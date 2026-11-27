import type { CSSProperties, ReactNode } from "react";
import s from "./styles";

export const vars = (v: Record<string, string | number>) => v as CSSProperties;

/** Text split into masked lines that rise into place. */
export function Lines({ lines, delay = 0 }: { lines: ReactNode[]; delay?: number }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={s.line}>
          <span className={s.lineInner} style={vars({ "--d": i + delay })}>
            {line}
          </span>
        </span>
      ))}
    </>
  );
}
