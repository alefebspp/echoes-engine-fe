import type { RibbonPoint } from "@/shared/components/SignalRibbon";

/**
 * A deterministic, plausible-looking activity pattern for decorative use on the
 * landing and auth screens, where no real data exists yet. It is clearly a
 * metaphor — never presented as captured numbers.
 */
export function sampleRibbon(days = 45): RibbonPoint[] {
  const start = new Date();
  start.setDate(start.getDate() - days);

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const day = date.getDay();
    const weekendDip = day === 0 || day === 6 ? 0.45 : 1;
    // Layered sine waves give a calm, irregular rhythm with occasional gaps.
    const wave =
      Math.sin(i / 3.1) * 0.5 + Math.sin(i / 7.7 + 1.2) * 0.35 + Math.sin(i / 1.7) * 0.15;
    const normalized = Math.max(0, (wave + 1) / 2) * weekendDip;
    const count = Math.round(normalized * 42);
    return {
      date: date.toISOString().slice(0, 10),
      count: i % 11 === 5 ? 0 : count,
    };
  });
}
