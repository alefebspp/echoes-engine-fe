import { formatNumber, formatPercent } from "@/shared/utils/formatNumber";

export interface BarMeterRow {
  key: string;
  label: string;
  /** Mono secondary label (e.g. a domain or source code). */
  sublabel?: string;
  count: number;
  /** Optional explicit percentage; otherwise computed against the max. */
  percentage?: number;
}

interface BarMeterProps {
  rows: BarMeterRow[];
  tone?: "memory" | "signal" | "trace";
  /** Show a ranked index (1, 2, 3…) — only when order is meaningful. */
  ranked?: boolean;
  valueMode?: "count" | "percentage";
}

const toneFill: Record<NonNullable<BarMeterProps["tone"]>, string> = {
  memory: "bg-memory",
  signal: "bg-signal",
  trace: "bg-trace",
};

export function BarMeter({
  rows,
  tone = "memory",
  ranked = false,
  valueMode = "count",
}: BarMeterProps) {
  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <ul className="flex flex-col gap-3">
      {rows.map((row, index) => {
        const width = Math.max(2, (row.count / max) * 100);
        const value =
          valueMode === "percentage" && row.percentage !== undefined
            ? formatPercent(row.percentage)
            : formatNumber(row.count);
        return (
          <li key={row.key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 items-baseline gap-2">
                {ranked && (
                  <span className="font-mono text-micro text-ink_text-faint tnum">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
                <span className="truncate text-sm text-lilac">{row.label}</span>
                {row.sublabel && (
                  <span className="truncate font-mono text-micro text-ink_text-faint">
                    {row.sublabel}
                  </span>
                )}
              </span>
              <span className="shrink-0 font-mono text-sm text-ink_text-muted tnum">
                {value}
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-pill bg-surface-0"
              role="presentation"
            >
              <div
                className={`h-full rounded-pill ${toneFill[tone]} transition-[width] duration-500 ease-ease`}
                style={{ width: `${width}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
