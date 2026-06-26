import { httpClient } from "@/shared/api/httpClient";
import type { DashboardStats, PeriodDays } from "./types";

const EMPTY: Omit<DashboardStats, "timezone" | "periodDays" | "summary"> = {
  eventsByDay: [],
  categoryBreakdown: [],
  topDomains: [],
  topBrowsers: [],
  eventsBySource: [],
  activityByHour: [],
};

/**
 * Fetch dashboard analytics for a period. Normalizes the response so chart
 * components can rely on arrays always being present.
 */
export async function fetchDashboard(days: PeriodDays): Promise<DashboardStats> {
  const raw = await httpClient.get<Partial<DashboardStats>>("/dashboard", {
    query: { days },
  });

  return {
    timezone: raw.timezone ?? "UTC",
    periodDays: raw.periodDays ?? days,
    summary: raw.summary ?? {},
    eventsByDay: raw.eventsByDay ?? EMPTY.eventsByDay,
    categoryBreakdown: raw.categoryBreakdown ?? EMPTY.categoryBreakdown,
    topDomains: raw.topDomains ?? EMPTY.topDomains,
    topBrowsers: raw.topBrowsers ?? EMPTY.topBrowsers,
    eventsBySource: raw.eventsBySource ?? EMPTY.eventsBySource,
    activityByHour: raw.activityByHour ?? EMPTY.activityByHour,
  };
}

export const dashboardKeys = {
  all: ["dashboard"] as const,
  period: (days: PeriodDays) => ["dashboard", days] as const,
};
