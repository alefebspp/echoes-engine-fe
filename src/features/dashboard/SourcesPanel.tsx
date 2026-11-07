import { useTranslation } from "react-i18next";
import { Card, CardHeader, CardBody, CardDivider } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { BarMeter } from "./BarMeter";
import type { EventsBySourceItem, TopBrowserItem } from "./types";

interface Props {
  sources: EventsBySourceItem[];
  browsers: TopBrowserItem[];
}

export function SourcesPanel({ sources, browsers }: Props) {
  const { t } = useTranslation();
  const hasSources = sources.length > 0;
  const hasBrowsers = browsers.length > 0;

  return (
    <Card>
      <CardHeader
        as="h2"
        title={t("dashboard.sources.title")}
        subtitle={t("dashboard.sources.subtitle")}
      />
      <CardBody>
        {hasSources ? (
          <BarMeter
            tone="memory"
            rows={sources.map((item) => ({
              key: item.sourceCode,
              label: item.sourceName,
              sublabel: item.sourceCode,
              count: item.count,
            }))}
          />
        ) : (
          <EmptyState
            title={t("dashboard.sources.emptyTitle")}
            description={t("dashboard.sources.emptyBody")}
          />
        )}
      </CardBody>

      <CardDivider />

      <div className="px-[1.35rem] pb-[0.4rem] pt-[1.1rem]">
        <h3 className="font-display text-h3 font-semibold">{t("dashboard.sources.browsers")}</h3>
      </div>
      <CardBody>
        {hasBrowsers ? (
          <BarMeter
            tone="trace"
            rows={browsers.map((item) => ({
              key: item.browser,
              label: item.browser,
              count: item.count,
            }))}
          />
        ) : (
          <EmptyState
            title={t("dashboard.sources.browsersEmptyTitle")}
            description={t("dashboard.sources.browsersEmptyBody")}
            showBaseline={false}
          />
        )}
      </CardBody>
    </Card>
  );
}
