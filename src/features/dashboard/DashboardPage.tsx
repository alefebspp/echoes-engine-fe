import { useTranslation } from "react-i18next";
import { PageHeader } from "@/shared/components/PageHeader";
import { Card, CardBody } from "@/shared/components/Card";
import { LoadingBlock, ErrorBlock } from "@/shared/components/Feedback";
import { toUserMessage } from "@/shared/api/apiErrors";
import { ConnectExtensionCard } from "@/features/extension/ConnectExtensionCard";
import { useHasCapturedEvents } from "@/features/extension/useHasCapturedEvents";
import { RibbonHeader } from "./RibbonHeader";
import { SummaryCards } from "./SummaryCards";
import { EventsByDayChart } from "./EventsByDayChart";
import { TopDomains } from "./TopDomains";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { SourcesPanel } from "./SourcesPanel";
import { usePeriodParam, useDashboardQuery } from "./useDashboard";

export function DashboardPage() {
  const { t } = useTranslation();
  const [period, setPeriod] = usePeriodParam();
  const query = useDashboardQuery(period);
  // Checked across all time, so an empty period alone doesn't suggest a reinstall.
  const hasCapturedEvents = useHasCapturedEvents();

  return (
    <>
      <PageHeader
        eyebrow={t("dashboard.eyebrow")}
        title={t("dashboard.title")}
        description={t("dashboard.description")}
      />

      <div className="flex flex-col gap-4">
        {hasCapturedEvents.data === false && <ConnectExtensionCard />}

        <RibbonHeader
          stats={query.data}
          period={period}
          onPeriodChange={setPeriod}
          isFetching={query.isFetching}
        />

        {query.isLoading ? (
          <Card>
            <CardBody>
              <LoadingBlock label={t("dashboard.loading")} />
            </CardBody>
          </Card>
        ) : query.isError ? (
          <Card>
            <CardBody>
              <ErrorBlock
                title={t("dashboard.loadError")}
                message={toUserMessage(query.error)}
                onRetry={() => query.refetch()}
              />
            </CardBody>
          </Card>
        ) : query.data ? (
          <>
            <SummaryCards stats={query.data} />

            <EventsByDayChart data={query.data.eventsByDay} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <TopDomains data={query.data.topDomains} />
              <CategoryBreakdown data={query.data.categoryBreakdown} />
            </div>

            <SourcesPanel
              sources={query.data.eventsBySource}
              browsers={query.data.topBrowsers}
            />
          </>
        ) : null}
      </div>
    </>
  );
}
