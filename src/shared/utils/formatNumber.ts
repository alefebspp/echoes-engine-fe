const COMPACT = new Intl.NumberFormat(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});

const PLAIN = new Intl.NumberFormat(undefined);

export function formatNumber(value: number): string {
  return PLAIN.format(value);
}

/** 1240 → "1.2K". Used in tight chart labels and stat cards. */
export function formatCompact(value: number): string {
  return COMPACT.format(value);
}

export function formatPercent(value: number, fractionDigits = 0): string {
  return `${value.toFixed(fractionDigits)}%`;
}

/**
 * Turn an unknown summary value into a display string. The dashboard `summary`
 * is `Record<string, unknown>`, so we render defensively without assuming shape.
 */
export function formatSummaryValue(value: unknown): string {
  if (typeof value === "number") return formatNumber(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "string") return value;
  if (value === null || value === undefined) return "—";
  return String(value);
}

/** "events_today" / "eventsToday" → "Events today". */
export function humanizeKey(key: string): string {
  const spaced = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}
