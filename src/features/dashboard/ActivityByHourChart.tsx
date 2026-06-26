import { useMemo } from "react";
import { Card, CardHeader, CardBody } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { formatHourLabel } from "@/shared/utils/formatDate";
import { formatNumber } from "@/shared/utils/formatNumber";
import type { ActivityByHourPoint } from "./types";

interface Props {
  data: ActivityByHourPoint[];
}

const TICKS = [0, 6, 12, 18];

export function ActivityByHourChart({ data }: Props) {
  const { hours, max, total, busiest } = useMemo(() => {
    // Fill the full 0–23 range so the map always reads as a complete day.
    const byHour = new Map(data.map((d) => [d.hour, d.count]));
    const filled = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: byHour.get(hour) ?? 0,
    }));
    const maxCount = Math.max(0, ...filled.map((h) => h.count));
    const sum = filled.reduce((acc, h) => acc + h.count, 0);
    const peak = filled.reduce((best, h) => (h.count > best.count ? h : best), filled[0]);
    return { hours: filled, max: maxCount, total: sum, busiest: peak };
  }, [data]);

  const hasData = total > 0;

  return (
    <Card>
      <CardHeader
        as="h2"
        title="Activity by hour"
        subtitle={
          hasData
            ? `Busiest around ${formatHourLabel(busiest.hour)}`
            : "When activity collects across the day"
        }
      />
      <CardBody>
        {!hasData ? (
          <EmptyState
            title="No hourly rhythm yet"
            description="Captured events will resolve into a 24-hour map of when you're active."
          />
        ) : (
          <div
            role="img"
            aria-label={`Activity by hour. Busiest around ${formatHourLabel(busiest.hour)} with ${formatNumber(busiest.count)} events.`}
          >
            <div className="flex h-32 items-end gap-[3px]">
              {hours.map((h) => {
                const intensity = max > 0 ? h.count / max : 0;
                const heightPct = Math.max(3, intensity * 100);
                return (
                  <div
                    key={h.hour}
                    className="group relative flex flex-1 items-end"
                    style={{ height: "100%" }}
                  >
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-memory to-signal transition-opacity duration-150 group-hover:opacity-100"
                      style={{
                        height: `${heightPct}%`,
                        opacity: 0.35 + intensity * 0.65,
                      }}
                      title={`${formatHourLabel(h.hour)} · ${formatNumber(h.count)} events`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="relative mt-2 h-4">
              {hours.map((h) =>
                TICKS.includes(h.hour) ? (
                  <span
                    key={h.hour}
                    className="absolute font-mono text-[11px] text-ink_text-faint"
                    style={{ left: `${(h.hour / 24) * 100}%` }}
                  >
                    {formatHourLabel(h.hour)}
                  </span>
                ) : null,
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
