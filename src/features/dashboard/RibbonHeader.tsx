import { useTranslation } from "react-i18next";
import { Card } from "@/shared/components/Card";
import { SignalRibbon } from "@/shared/components/SignalRibbon";
import { DashboardPeriodSelect } from "./DashboardPeriodSelect";
import type { DashboardStats, PeriodDays } from "./types";

interface Props {
  stats?: DashboardStats;
  period: PeriodDays;
  onPeriodChange: (next: PeriodDays) => void;
  isFetching?: boolean;
  animate?: boolean;
}

/** The dashboard's signal ribbon overview, with the period control and timezone. */
export function RibbonHeader({
  stats,
  period,
  onPeriodChange,
  isFetching = false,
  animate = true,
}: Props) {
  const { t } = useTranslation();
  const data = stats?.eventsByDay ?? [];

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-4 px-[1.35rem] pb-2 pt-[1.15rem]">
        <div className="flex flex-col gap-1">
          <span className="eyebrow">{t("dashboard.ribbon.eyebrow")}</span>
          <p className="font-display text-h3 font-semibold text-ink_text-bright">
            {t("dashboard.ribbon.title")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isFetching && (
            <span className="font-mono text-micro uppercase tracking-[0.12em] text-ink_text-faint">
              {t("dashboard.ribbon.updating")}
            </span>
          )}
          <DashboardPeriodSelect value={period} onChange={onPeriodChange} />
        </div>
      </div>

      <div className="px-[1.35rem] pb-[0.4rem] pt-2">
        <SignalRibbon
          data={data}
          animate={animate}
          height={104}
          caption={t("dashboard.ribbon.caption", { days: period })}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-[1.35rem] pb-[1.15rem] pt-1">
        <span className="font-mono text-micro text-ink_text-faint">
          {data.length > 0
            ? `${data[0]?.date} → ${data[data.length - 1]?.date}`
            : t("dashboard.ribbon.awaiting")}
        </span>
        {stats && (
          <span className="font-mono text-micro text-ink_text-faint">
            {t("dashboard.ribbon.timezone", { timezone: stats.timezone })}
          </span>
        )}
      </div>
    </Card>
  );
}
