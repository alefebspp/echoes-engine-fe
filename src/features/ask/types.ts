export interface AskRequest {
  question: string;
  from?: string;
  to?: string;
  tags?: string[];
  limit?: number;
}

export interface AskCitation {
  eventId: string;
  title: string | null;
  url: string | null;
  occurredAt: string;
}

export interface AskSnippet extends AskCitation {
  similarity: number;
}

export type AskMode = "answer" | "refused" | "snippets_only";

export interface AskResponse {
  answer: string | null;
  citations: AskCitation[];
  snippets: AskSnippet[];
  retrievedCount: number;
  refused: boolean;
  mode: AskMode;
  refusalReason?: string;
}

/** Calendar dates from the date inputs (`YYYY-MM-DD`), or empty when unset. */
export interface AskScope {
  from: string;
  to: string;
  tags: string[];
}

export type ScopeChip =
  | { key: string; label: string; kind: "dates" | "from" | "to" }
  | { key: string; label: string; kind: "tag"; tag: string };

export type Notice =
  | { kind: "field"; message: string }
  | { kind: "rate"; until: number }
  | { kind: "server"; message: string }
  | { kind: "ready" };

export interface ReadingRecord {
  id: string;
  question: string;
  scope: AskScope;
  response: AskResponse;
}
