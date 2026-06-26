import { StatCard } from "@/shared/components/StatCard";
import { formatNumber, formatSummaryValue, humanizeKey } from "@/shared/utils/formatNumber";
import { formatShortDate } from "@/shared/utils/formatDate";
import type { DashboardStats } from "./types";

interface Props {
  stats: DashboardStats;
}

/**
 * Summary tiles. We lead with figures derived from the guaranteed arrays so the
 * row is always meaningful, then append any extra keys the backend includes in
 * `summary` (whose exact shape isn't guaranteed) rather than assuming fields.
 */
export function SummaryCards({ stats }: Props) {
  const totalEvents = stats.eventsByDay.reduce((acc, d) => acc + d.count, 0);
  const activeDays = stats.eventsByDay.filter((d) => d.count > 0).length;
  const busiest = stats.eventsByDay.reduce<typeof stats.eventsByDay[number] | null>(
    (best, point) => (best && best.count >= point.count ? best : point),
    null,
  );

  const derived = [
    {
      key: "total",
      label: "Captured this period",
      value: formatNumber(totalEvents),
      hint: `across ${stats.periodDays} days`,
      tone: "cyan" as const,
    },
    {
      key: "active-days",
      label: "Active days",
      value: formatNumber(activeDays),
      hint: activeDays === 0 ? "no activity yet" : `of ${stats.eventsByDay.length || stats.periodDays}`,
      tone: "blue" as const,
    },
    {
      key: "domains",
      label: "Tracked domains",
      value: formatNumber(stats.topDomains.length),
      hint: stats.topDomains[0] ? `top: ${stats.topDomains[0].domain}` : "none yet",
      tone: "blue" as const,
    },
    {
      key: "busiest",
      label: "Busiest day",
      value: busiest && busiest.count > 0 ? formatShortDate(busiest.date) : "—",
      hint: busiest && busiest.count > 0 ? `${formatNumber(busiest.count)} events` : "awaiting data",
      tone: "amber" as const,
    },
  ];

  // Surface a few extra backend-provided summary keys, if any, without overwhelming the row.
  const extra = Object.entries(stats.summary)
    .filter(([, value]) => typeof value !== "object")
    .slice(0, 4)
    .map(([key, value]) => ({
      key: `summary-${key}`,
      label: humanizeKey(key),
      value: formatSummaryValue(value),
      hint: undefined,
      tone: "blue" as const,
    }));

  return (
    <section aria-label="Summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {derived.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          value={card.value}
          hint={card.hint}
          tone={card.tone}
        />
      ))}
      {extra.map((card) => (
        <StatCard key={card.key} label={card.label} value={card.value} tone={card.tone} />
      ))}
    </section>
  );
}
