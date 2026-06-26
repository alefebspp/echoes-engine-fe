import { PageHeader } from "@/shared/components/PageHeader";
import { Card, CardBody } from "@/shared/components/Card";
import { LoadingBlock, ErrorBlock } from "@/shared/components/Feedback";
import { toUserMessage } from "@/shared/api/apiErrors";
import { DashboardPeriodSelect } from "./DashboardPeriodSelect";
import { ActivityByHourChart } from "./ActivityByHourChart";
import { TopDomains } from "./TopDomains";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { usePeriodParam, useDashboardQuery } from "./useDashboard";

export function ActivityPage() {
  const [period, setPeriod] = usePeriodParam();
  const query = useDashboardQuery(period);

  return (
    <>
      <PageHeader
        eyebrow="Activity"
        title="Where attention collected"
        description="The shape of your day by the hour, and the places it pointed to."
        actions={<DashboardPeriodSelect value={period} onChange={setPeriod} />}
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
              title="Couldn't load activity"
              message={toUserMessage(query.error)}
              onRetry={() => query.refetch()}
            />
          </CardBody>
        </Card>
      ) : query.data ? (
        <div className="flex flex-col gap-4">
          <ActivityByHourChart data={query.data.activityByHour} />
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <TopDomains data={query.data.topDomains} />
            <CategoryBreakdown data={query.data.categoryBreakdown} />
          </div>
        </div>
      ) : null}
    </>
  );
}
