export interface EventsByDayPoint {
  date: string;
  count: number;
}

export interface CategoryBreakdownItem {
  tag: string;
  count: number;
  percentage: number;
}

export interface TopDomainItem {
  domain: string;
  count: number;
}

export interface TopBrowserItem {
  browser: string;
  count: number;
}

export interface EventsBySourceItem {
  sourceCode: string;
  sourceName: string;
  count: number;
}

export interface ActivityByHourPoint {
  hour: number;
  count: number;
}

/**
 * Mirrors GET /dashboard. `summary` is intentionally loose — the backend only
 * guarantees a record of values, so the UI renders it defensively.
 */
export interface DashboardStats {
  timezone: string;
  periodDays: number;
  summary: Record<string, unknown>;
  eventsByDay: EventsByDayPoint[];
  categoryBreakdown: CategoryBreakdownItem[];
  topDomains: TopDomainItem[];
  topBrowsers: TopBrowserItem[];
  eventsBySource: EventsBySourceItem[];
  activityByHour: ActivityByHourPoint[];
}

export const PERIOD_OPTIONS = [7, 14, 30, 60, 90] as const;
export type PeriodDays = (typeof PERIOD_OPTIONS)[number];
