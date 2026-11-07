import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardBody } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { BarMeter } from "./BarMeter";
import type { TopDomainItem } from "./types";

interface Props {
  data: TopDomainItem[];
}

export function TopDomains({ data }: Props) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader
        as="h2"
        title={t("dashboard.topDomains.title")}
        subtitle={t("dashboard.topDomains.subtitle")}
      />
      <CardBody>
        {data.length === 0 ? (
          <EmptyState
            title={t("dashboard.topDomains.emptyTitle")}
            description={t("dashboard.topDomains.emptyBody")}
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
