const SHORT_DATE = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
});

const WEEKDAY = new Intl.DateTimeFormat(undefined, { weekday: "short" });

const FULL_DATE = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const DATETIME = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function parse(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatShortDate(value: string | Date): string {
  return SHORT_DATE.format(parse(value));
}

export function formatWeekday(value: string | Date): string {
  return WEEKDAY.format(parse(value));
}

export function formatFullDate(value: string | Date): string {
  return FULL_DATE.format(parse(value));
}

export function formatDateTime(value: string | Date): string {
  return DATETIME.format(parse(value));
}

/** "12 AM", "1 PM" … for the 24-hour activity map. */
export function formatHourLabel(hour: number): string {
  const normalized = ((hour % 24) + 24) % 24;
  if (normalized === 0) return "12 AM";
  if (normalized === 12) return "12 PM";
  return normalized < 12 ? `${normalized} AM` : `${normalized - 12} PM`;
}
