import { PageHeader } from "@/shared/components/PageHeader";
import { Card, CardBody } from "@/shared/components/Card";
import { LoadingBlock, ErrorBlock } from "@/shared/components/Feedback";
import { toUserMessage } from "@/shared/api/apiErrors";
import { RibbonHeader } from "./RibbonHeader";
import { SummaryCards } from "./SummaryCards";
import { EventsByDayChart } from "./EventsByDayChart";
import { TopDomains } from "./TopDomains";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { SourcesPanel } from "./SourcesPanel";
import { usePeriodParam, useDashboardQuery } from "./useDashboard";

export function DashboardPage() {
  const [period, setPeriod] = usePeriodParam();
  const query = useDashboardQuery(period);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Your digital day, resolved into signals"
        description="A quiet instrument panel for what your browsing has been doing lately."
      />

      <div className="flex flex-col gap-4">
        <RibbonHeader
          stats={query.data}
          period={period}
          onPeriodChange={setPeriod}
          isFetching={query.isFetching}
        />

        {query.isLoading ? (
          <Card>
            <CardBody>
              <LoadingBlock label="Reading recent signals…" />
            </CardBody>
          </Card>
        ) : query.isError ? (
          <Card>
            <CardBody>
              <ErrorBlock
                title="Couldn't load the dashboard"
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
