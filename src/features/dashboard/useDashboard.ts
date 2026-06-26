import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { dashboardKeys, fetchDashboard } from "./api";
import { PERIOD_OPTIONS } from "./types";
import type { PeriodDays } from "./types";

const DEFAULT_PERIOD: PeriodDays = 30;

function coercePeriod(raw: string | null): PeriodDays {
  const parsed = Number(raw);
  return (PERIOD_OPTIONS as readonly number[]).includes(parsed)
    ? (parsed as PeriodDays)
    : DEFAULT_PERIOD;
}

/** Reads/writes the dashboard window via `?days=`, so it persists and is shareable. */
export function usePeriodParam(): [PeriodDays, (next: PeriodDays) => void] {
  const [params, setParams] = useSearchParams();
  const period = coercePeriod(params.get("days"));

  const setPeriod = useCallback(
    (next: PeriodDays) => {
      setParams(
        (current) => {
          const updated = new URLSearchParams(current);
          updated.set("days", String(next));
          return updated;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  return [period, setPeriod];
}

export function useDashboardQuery(days: PeriodDays) {
  return useQuery({
    queryKey: dashboardKeys.period(days),
    queryFn: () => fetchDashboard(days),
    staleTime: 60_000,
    retry: 1,
  });
}
