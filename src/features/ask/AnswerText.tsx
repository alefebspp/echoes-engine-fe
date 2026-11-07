import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { ListedSource } from "./sources";

const MARK = /\[(\d+)\]/g;

export function sourceDomId(turnId: string, n: number): string {
  return `source-${turnId}-${n}`;
}

export function focusSource(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  el.focus({ preventScroll: true });
}

interface AnswerTextProps {
  text: string;
  sources: ListedSource[];
  turnId: string;
}

/** Renders the written reading, turning `[1]` into a jump to that source. */
export function AnswerText({ text, sources, turnId }: AnswerTextProps) {
  const { t } = useTranslation();
  const nodes: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(MARK)) {
    const start = match.index ?? 0;
    const n = Number(match[1]);
    const source = sources[n - 1];
    if (start > last) nodes.push(text.slice(last, start));

    if (source && n >= 1) {
      nodes.push(
        <button
          key={`${start}-${n}`}
          type="button"
          className="mx-0.5 inline-flex min-h-6 min-w-6 items-center justify-center rounded-sm px-0.5 align-baseline font-mono text-micro font-medium leading-none text-trace underline decoration-[rgba(246,193,119,0.45)] underline-offset-2 hover:decoration-trace"
          aria-label={t("ask.sourceLabel", { n, title: source.title })}
          onClick={() => focusSource(sourceDomId(turnId, n))}
        >
          [{n}]
        </button>,
      );
    } else {
      nodes.push(match[0]);
    }

    last = start + match[0].length;
  }

  if (last < text.length) nodes.push(text.slice(last));

  return (
    <p className="max-w-[62ch] text-pretty break-words text-[1.0625rem] leading-7">{nodes}</p>
  );
}
