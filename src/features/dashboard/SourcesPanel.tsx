import { Card, CardHeader, CardBody, CardDivider } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { BarMeter } from "./BarMeter";
import type { EventsBySourceItem, TopBrowserItem } from "./types";

interface Props {
  sources: EventsBySourceItem[];
  browsers: TopBrowserItem[];
}

export function SourcesPanel({ sources, browsers }: Props) {
  const hasSources = sources.length > 0;
  const hasBrowsers = browsers.length > 0;

  return (
    <Card>
      <CardHeader as="h2" title="Sources" subtitle="Where signals came from" />
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
            title="No sources yet"
            description="Each capture channel (like a browser extension) will appear here."
          />
        )}
      </CardBody>

      <CardDivider />

      <div className="px-[1.35rem] pb-[0.4rem] pt-[1.1rem]">
        <h3 className="font-display text-h3 font-semibold">Browsers</h3>
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
            title="No browsers yet"
            description="Browser breakdown appears once visit events include a browser."
            showBaseline={false}
          />
        )}
      </CardBody>
    </Card>
  );
}
