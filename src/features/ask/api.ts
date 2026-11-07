import { httpClient } from "@/shared/api/httpClient";
import type { AskRequest, AskResponse } from "./types";

/** One stateless question. Callers must not attach earlier answers. */
export function askQuestion(input: AskRequest, signal?: AbortSignal): Promise<AskResponse> {
  const body: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) body[key] = value;
  }
  return httpClient.post<AskResponse>("/ai/ask", body, { signal });
}
