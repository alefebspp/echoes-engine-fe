import { useId, useMemo } from "react";
import { formatFullDate } from "@/shared/utils/formatDate";
import { formatNumber } from "@/shared/utils/formatNumber";

export interface RibbonPoint {
  date: string;
  count: number;
}

interface SignalRibbonProps {
  data: RibbonPoint[];
  height?: number;
  /** Play the one-time reveal on mount. */
  animate?: boolean;
  /** A label describing what this ribbon represents, for the accessible summary. */
  caption?: string;
  className?: string;
}

const VIEW_W = 1000;

/**
 * The product's signature: a horizontal temporal band where each day becomes a
 * pulse. Height and color encode density; days with no captured activity sink to
 * a faint baseline tick, so gaps read as part of the rhythm rather than missing
 * data. When there is no data at all, it rests as a quiet dashed baseline.
 */
export function SignalRibbon({
  data,
  height = 96,
  animate = true,
  caption = "Captured activity over the selected period",
  className,
}: SignalRibbonProps) {
  const gradientId = useId();
  const glowId = useId();

  const { bars, peak, total, hasData } = useMemo(() => {
    const counts = data.map((d) => d.count);
    const max = Math.max(1, ...counts);
    const sum = counts.reduce((acc, n) => acc + n, 0);
    const peakPoint = data.reduce<RibbonPoint | null>(
      (best, point) => (best && best.count >= point.count ? best : point),
      null,
    );

    const n = data.length || 1;
    const slot = VIEW_W / n;
    const barW = Math.max(2, Math.min(slot * 0.62, 16));

    const computed = data.map((point, index) => {
      const intensity = point.count / max; // 0..1
      const cx = index * slot + slot / 2;
      return {
        key: `${point.date}-${index}`,
        cx,
        barW,
        intensity,
        count: point.count,
        date: point.date,
      };
    });

    return {
      bars: computed,
      peak: peakPoint,
      total: sum,
      hasData: sum > 0,
    };
  }, [data]);

  const mid = height / 2;
  const maxArm = height / 2 - 6;

  const summary = hasData
    ? `${caption}. ${formatNumber(total)} events total across ${data.length} days` +
      (peak ? `, peaking at ${formatNumber(peak.count)} on ${formatFullDate(peak.date)}.` : ".")
    : `${caption}. No activity captured yet.`;

  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        role="img"
        aria-label={summary}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--signal-cyan)" />
            <stop offset="100%" stopColor="var(--memory-blue)" />
          </linearGradient>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Center baseline — the instrument's resting line. */}
        <line
          x1="0"
          y1={mid}
          x2={VIEW_W}
          y2={mid}
          stroke="var(--hairline-strong)"
          strokeWidth="1"
        />

        {!hasData &&
          bars.map((bar) => (
            <circle
              key={bar.key}
              cx={bar.cx}
              cy={mid}
              r={1.4}
              fill="var(--memory-blue)"
              opacity={0.4}
            />
          ))}

        {hasData &&
          bars.map((bar, index) => {
            // Quiet days collapse to a small tick at the baseline.
            if (bar.count === 0) {
              return (
                <circle
                  key={bar.key}
                  cx={bar.cx}
                  cy={mid}
                  r={1.4}
                  fill="var(--text-faint)"
                  opacity={0.5}
                />
              );
            }
            const arm = 4 + bar.intensity * maxArm;
            const isPeak = peak?.date === bar.date && bar.intensity > 0.15;
            return (
              <g
                key={bar.key}
                style={
                  animate
                    ? {
                        transformBox: "fill-box",
                        transformOrigin: "center",
                        animation: `ribbon var(--dur) var(--ease) both`,
                        animationDelay: `${Math.min(index * 14, 700)}ms`,
                      }
                    : undefined
                }
              >
                <rect
                  x={bar.cx - bar.barW / 2}
                  y={mid - arm}
                  width={bar.barW}
                  height={arm * 2}
                  rx={bar.barW / 2}
                  fill={`url(#${gradientId})`}
                  opacity={0.35 + bar.intensity * 0.65}
                  filter={isPeak ? `url(#${glowId})` : undefined}
                >
                  <title>{`${formatFullDate(bar.date)} · ${formatNumber(bar.count)} events`}</title>
                </rect>
              </g>
            );
          })}
      </svg>
      <figcaption className="sr-only">{summary}</figcaption>
    </figure>
  );
}
