import { PERIOD_OPTIONS } from "./types";
import type { PeriodDays } from "./types";

interface Props {
  value: PeriodDays;
  onChange: (value: PeriodDays) => void;
  disabled?: boolean;
}

/** Segmented control for the dashboard window. Only the five allowed periods. */
export function DashboardPeriodSelect({ value, onChange, disabled }: Props) {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-sm border border-hairline bg-surface-0 p-1"
      role="group"
      aria-label="Dashboard period in days"
    >
      {PERIOD_OPTIONS.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            disabled={disabled}
            aria-pressed={active}
            className={`rounded-[4px] px-2.5 py-1 font-mono text-micro font-medium uppercase tracking-[0.08em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
              active
                ? "bg-memory text-ink"
                : "text-ink_text-muted hover:bg-surface-2 hover:text-lilac"
            }`}
          >
            {option}d
          </button>
        );
      })}
    </div>
  );
}
