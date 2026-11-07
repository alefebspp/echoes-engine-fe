import { currentLanguage } from "@/shared/i18n";

type FormatName = "shortDate" | "weekday" | "fullDate" | "dateTime";

const OPTIONS: Record<FormatName, Intl.DateTimeFormatOptions> = {
  shortDate: { month: "short", day: "numeric" },
  weekday: { weekday: "short" },
  fullDate: { year: "numeric", month: "short", day: "numeric" },
  dateTime: { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
};

const cache = new Map<string, Intl.DateTimeFormat>();

/** Formatters follow the active interface language, built once per locale. */
function formatter(name: FormatName): Intl.DateTimeFormat {
  const locale = currentLanguage();
  const key = `${locale}:${name}`;
  let format = cache.get(key);
  if (!format) {
    format = new Intl.DateTimeFormat(locale, OPTIONS[name]);
    cache.set(key, format);
  }
  return format;
}

function parse(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatShortDate(value: string | Date): string {
  return formatter("shortDate").format(parse(value));
}

export function formatWeekday(value: string | Date): string {
  return formatter("weekday").format(parse(value));
}

export function formatFullDate(value: string | Date): string {
  return formatter("fullDate").format(parse(value));
}

export function formatDateTime(value: string | Date): string {
  return formatter("dateTime").format(parse(value));
}

/** "12 AM", "1 PM" … (or "0h", "13h" in Portuguese) for the 24-hour activity map. */
export function formatHourLabel(hour: number): string {
  const normalized = ((hour % 24) + 24) % 24;
  if (currentLanguage() === "pt-BR") return `${normalized}h`;
  if (normalized === 0) return "12 AM";
  if (normalized === 12) return "12 PM";
  return normalized < 12 ? `${normalized} AM` : `${normalized - 12} PM`;
}
