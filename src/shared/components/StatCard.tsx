import type { ReactNode } from "react";

interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  tone?: "blue" | "cyan" | "amber";
}

const accentTone: Record<NonNullable<StatCardProps["tone"]>, string> = {
  blue: "bg-memory shadow-[0_0_12px_var(--memory-blue)]",
  cyan: "bg-signal shadow-[0_0_12px_var(--signal-cyan)]",
  amber: "bg-trace shadow-[0_0_12px_var(--trace-amber)]",
};

export function StatCard({ label, value, hint, tone = "blue" }: StatCardProps) {
  return (
    <div className="panel flex flex-col gap-2 px-[1.15rem] py-[1.05rem] transition-[border-color,transform] duration-200 ease-ease hover:-translate-y-0.5 hover:border-hairline-strong">
      <span
        className={`h-0.5 w-9 rounded-pill ${accentTone[tone]}`}
        aria-hidden="true"
      />
      <span className="font-mono text-micro uppercase tracking-[0.12em] text-ink_text-muted">
        {label}
      </span>
      <span className="font-display text-[1.95rem] font-semibold leading-none text-ink_text-bright tnum">
        {value}
      </span>
      {hint && <span className="text-sm text-ink_text-faint">{hint}</span>}
    </div>
  );
}
