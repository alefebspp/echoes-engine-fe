import { Card, CardHeader, CardBody } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { BarMeter } from "./BarMeter";
import type { TopDomainItem } from "./types";

interface Props {
  data: TopDomainItem[];
}

export function TopDomains({ data }: Props) {
  return (
    <Card>
      <CardHeader as="h2" title="Top domains" subtitle="Most visited places" />
      <CardBody>
        {data.length === 0 ? (
          <EmptyState
            title="No domains yet"
            description="The sites you visit most will rank here once events arrive."
          />
        ) : (
          <BarMeter
            tone="memory"
            ranked
            rows={data.map((item) => ({
              key: item.domain,
              label: item.domain,
              count: item.count,
            }))}
          />
        )}
      </CardBody>
    </Card>
  );
}
