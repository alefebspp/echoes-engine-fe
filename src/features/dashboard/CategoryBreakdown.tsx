import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardBody } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { BarMeter } from "./BarMeter";
import type { CategoryBreakdownItem } from "./types";

interface Props {
  data: CategoryBreakdownItem[];
}

export function CategoryBreakdown({ data }: Props) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader
        as="h2"
        title={t("dashboard.categories.title")}
        subtitle={t("dashboard.categories.subtitle")}
      />
      <CardBody>
        {data.length === 0 ? (
          <EmptyState
            title={t("dashboard.categories.emptyTitle")}
            description={t("dashboard.categories.emptyBody")}
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
