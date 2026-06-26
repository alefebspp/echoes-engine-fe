import type { ReactNode } from "react";

type Tone = "error" | "ok" | "info";

const tones: Record<Tone, string> = {
  error: "border-danger/50 [--dot:var(--danger)] text-lilac",
  ok: "border-signal/50 [--dot:var(--signal-cyan)] text-lilac",
  info: "border-memory/40 [--dot:var(--memory-blue)] text-lilac",
};

/** Form-level message (e.g. a rejected login), announced to assistive tech. */
export function FormBanner({ tone = "info", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-sm border bg-surface-0 px-3.5 py-3 text-sm ${tones[tone]}`}
      role="alert"
    >
      <span
        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--dot)] shadow-[0_0_8px_var(--dot)]"
        aria-hidden="true"
      />
      <span>{children}</span>
    </div>
  );
}
