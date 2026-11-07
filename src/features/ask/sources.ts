import { formatDateTime } from "@/shared/utils/formatDate";
import type { AskCitation, AskResponse } from "./types";

const CLOSE_MATCH = 0.75;

export interface ListedSource {
  eventId: string;
  n: number;
  title: string;
  host: string | null;
  url: string | null;
  occurredAt: string;
  closeMatch: boolean;
}

export function formatOccurred(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return formatDateTime(date);
}

export function listSources(response: AskResponse): ListedSource[] {
  if (response.mode === "refused") return [];

  const rows: AskCitation[] =
    response.mode === "snippets_only" && response.snippets.length > 0
      ? response.snippets
      : response.citations;

  return rows.map((row, index) => {
    const own =
      "similarity" in row && typeof row.similarity === "number" ? row.similarity : undefined;
    const similarity = own ?? response.snippets[index]?.similarity;
    const url = safeHttpUrl(row.url);
    const host = url ? hostnameOf(url) : null;
    const named = row.title?.trim() || null;
    const title = named || host || "Untitled";

    return {
      eventId: row.eventId,
      n: index + 1,
      title,
      host: named && host && named.toLowerCase() !== host.toLowerCase() ? host : null,
      url,
      occurredAt: row.occurredAt,
      closeMatch:
        typeof similarity === "number" && Number.isFinite(similarity) && similarity >= CLOSE_MATCH,
    };
  });
}

function safeHttpUrl(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function hostnameOf(value: string): string | null {
  try {
    const host = new URL(value).hostname.replace(/^www\./, "");
    return host.length > 0 ? host : null;
  } catch {
    return null;
  }
}
