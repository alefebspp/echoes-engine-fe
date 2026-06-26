import { Card, CardHeader, CardBody } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { BarMeter } from "./BarMeter";
import type { CategoryBreakdownItem } from "./types";

interface Props {
  data: CategoryBreakdownItem[];
}

export function CategoryBreakdown({ data }: Props) {
  return (
    <Card>
      <CardHeader as="h2" title="Categories" subtitle="Where attention concentrated" />
      <CardBody>
        {data.length === 0 ? (
          <EmptyState
            title="No categories yet"
            description="Captured events are tagged and grouped here as they accumulate."
          />
        ) : (
          <BarMeter
            tone="signal"
            valueMode="percentage"
            rows={data.map((item) => ({
              key: item.tag,
              label: item.tag,
              count: item.count,
              percentage: item.percentage,
            }))}
          />
        )}
      </CardBody>
    </Card>
  );
}
