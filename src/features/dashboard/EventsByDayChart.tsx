import { useId, useMemo } from "react";
import { Card, CardHeader, CardBody } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { formatShortDate, formatFullDate } from "@/shared/utils/formatDate";
import { formatNumber } from "@/shared/utils/formatNumber";
import type { EventsByDayPoint } from "./types";

const W = 720;
const H = 220;
const PAD = { top: 16, right: 12, bottom: 26, left: 12 };

interface Props {
  data: EventsByDayPoint[];
}

export function EventsByDayChart({ data }: Props) {
  const fillId = useId();
  const strokeId = useId();

  const model = useMemo(() => {
    if (data.length === 0) return null;
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const max = Math.max(1, ...data.map((d) => d.count));
    const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

    const points = data.map((point, index) => {
      const x = PAD.left + (data.length > 1 ? index * stepX : innerW / 2);
      const y = PAD.top + innerH - (point.count / max) * innerH;
      return { ...point, x, y };
    });

    const line = points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(" ");
    const baseY = PAD.top + innerH;
    const area = `${line} L${points[points.length - 1].x.toFixed(1)},${baseY} L${points[0].x.toFixed(1)},${baseY} Z`;

    const total = data.reduce((acc, d) => acc + d.count, 0);
    const peak = points.reduce((best, p) => (p.count >= best.count ? p : best), points[0]);

    // Sparse x labels: first, middle, last.
    const labelIdx = new Set([0, Math.floor((data.length - 1) / 2), data.length - 1]);

    return { points, line, area, baseY, total, peak, labelIdx, max };
  }, [data]);

  return (
    <Card>
      <CardHeader
        as="h2"
        title="Events by day"
        subtitle={
          model
            ? `${formatNumber(model.total)} captured · peak ${formatNumber(model.peak.count)} on ${formatShortDate(model.peak.date)}`
            : "Daily capture volume"
        }
      />
      <CardBody>
        {!model ? (
          <EmptyState
            title="No daily activity yet"
            description="Once events are captured, each day's volume traces a line here."
          />
        ) : (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            height={H}
            role="img"
            aria-label={`Events by day. ${formatNumber(model.total)} events total, peaking at ${formatNumber(model.peak.count)} on ${formatFullDate(model.peak.date)}.`}
            className="overflow-visible"
          >
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--memory-blue)" stopOpacity="0.32" />
                <stop offset="100%" stopColor="var(--memory-blue)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={strokeId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--memory-blue)" />
                <stop offset="100%" stopColor="var(--signal-cyan)" />
              </linearGradient>
            </defs>

            <path d={model.area} fill={`url(#${fillId})`} />
            <path
              d={model.line}
              fill="none"
              stroke={`url(#${strokeId})`}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />

            {model.points.map((p) => (
              <g key={p.date} className="group">
                {/* Invisible wide hit area for easier hover. */}
                <rect
                  x={p.x - 8}
                  y={PAD.top}
                  width={16}
                  height={H - PAD.top - PAD.bottom}
                  fill="transparent"
                >
                  <title>{`${formatFullDate(p.date)} · ${formatNumber(p.count)} events`}</title>
                </rect>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={2.5}
                  fill="var(--signal-cyan)"
                  className="opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                />
              </g>
            ))}

            {model.points.map((p, i) =>
              model.labelIdx.has(i) ? (
                <text
                  key={`lbl-${p.date}`}
                  x={p.x}
                  y={H - 8}
                  textAnchor={i === 0 ? "start" : i === model.points.length - 1 ? "end" : "middle"}
                  className="fill-[var(--text-faint)] font-mono text-[11px]"
                >
                  {formatShortDate(p.date)}
                </text>
              ) : null,
            )}
          </svg>
        )}
      </CardBody>
    </Card>
  );
}
