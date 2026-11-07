import { currentLanguage, i18n } from "@/shared/i18n";
import type { AskRequest, AskScope, ScopeChip } from "./types";

export const QUESTION_MIN = 3;
export const QUESTION_MAX = 2000;
export const TAG_MAX = 20;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

interface CalendarDate {
  y: number;
  m: number;
  d: number;
}

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat(currentLanguage(), { month: "long", year: "numeric" }).format(date);
}

function dayLabel(date: Date): string {
  return new Intl.DateTimeFormat(currentLanguage(), {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function parseCalendarDate(value: string): CalendarDate | null {
  const match = ISO_DATE.exec(value);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const date = new Date(y, m - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return null;
  }
  return { y, m, d };
}

function formatDay(value: string): string {
  const parsed = parseCalendarDate(value);
  if (!parsed) return value;
  return dayLabel(new Date(parsed.y, parsed.m - 1, parsed.d));
}

function fullMonthLabel(from: string, to: string): string | null {
  const start = parseCalendarDate(from);
  const end = parseCalendarDate(to);
  if (!start || !end) return null;
  if (start.y !== end.y || start.m !== end.m || start.d !== 1) return null;
  if (end.d !== new Date(start.y, start.m, 0).getDate()) return null;
  return monthLabel(new Date(start.y, start.m - 1, 1));
}

export function scopeChips(scope: AskScope): ScopeChip[] {
  const chips: ScopeChip[] = [];

  if (scope.from && scope.to) {
    const month = fullMonthLabel(scope.from, scope.to);
    const label =
      month ??
      (scope.from === scope.to
        ? formatDay(scope.from)
        : `${formatDay(scope.from)} – ${formatDay(scope.to)}`);
    chips.push({ key: "dates", kind: "dates", label });
  } else if (scope.from) {
    chips.push({ key: "from", kind: "from", label: i18n.t("ask.chipFrom", { date: formatDay(scope.from) }) });
  } else if (scope.to) {
    chips.push({ key: "to", kind: "to", label: i18n.t("ask.chipUntil", { date: formatDay(scope.to) }) });
  }

  for (const tag of scope.tags) {
    chips.push({ key: `tag:${tag}`, kind: "tag", tag, label: tag });
  }

  return chips;
}

export function scopeWithout(scope: AskScope, chip: ScopeChip): AskScope {
  if (chip.kind === "tag") {
    return { ...scope, tags: scope.tags.filter((tag) => tag !== chip.tag) };
  }
  if (chip.kind === "from") return { ...scope, from: "" };
  if (chip.kind === "to") return { ...scope, to: "" };
  return { ...scope, from: "", to: "" };
}

export function hasFilters(scope: AskScope): boolean {
  return Boolean(scope.from || scope.to || scope.tags.length > 0);
}

export function refusalMessage(scope: AskScope): string {
  if (scope.from || scope.to) return i18n.t("ask.refusal.range");
  if (scope.tags.length > 0) return i18n.t("ask.refusal.tags");
  return i18n.t("ask.refusal.none");
}

export function validateQuestion(question: string): string | null {
  const trimmed = question.trim();
  if (trimmed.length < QUESTION_MIN) return i18n.t("ask.validation.questionShort");
  if (trimmed.length > QUESTION_MAX) return i18n.t("ask.validation.questionLong");
  return null;
}

export function validateScope(scope: AskScope): string | null {
  if (scope.from && !parseCalendarDate(scope.from)) return i18n.t("ask.validation.startDate");
  if (scope.to && !parseCalendarDate(scope.to)) return i18n.t("ask.validation.endDate");
  if (scope.from && scope.to && scope.from > scope.to) {
    return i18n.t("ask.validation.dateOrder");
  }
  if (scope.tags.length > TAG_MAX) return i18n.t("ask.validation.tagLimit");
  return null;
}

/** Inclusive start of a local calendar day, as an ISO instant. */
export function toRangeStart(value: string): string {
  const parsed = parseCalendarDate(value);
  if (!parsed) throw new Error(`Invalid date: ${value}`);
  return new Date(parsed.y, parsed.m - 1, parsed.d, 0, 0, 0, 0).toISOString();
}

/** Inclusive end of a local calendar day, as an ISO instant. */
export function toRangeEnd(value: string): string {
  const parsed = parseCalendarDate(value);
  if (!parsed) throw new Error(`Invalid date: ${value}`);
  return new Date(parsed.y, parsed.m - 1, parsed.d, 23, 59, 59, 999).toISOString();
}

export function buildAskRequest(question: string, scope: AskScope): AskRequest {
  const body: AskRequest = { question: question.trim() };
  if (scope.from) body.from = toRangeStart(scope.from);
  if (scope.to) body.to = toRangeEnd(scope.to);
  if (scope.tags.length > 0) body.tags = [...scope.tags];
  return body;
}
