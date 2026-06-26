import { httpClient } from "@/shared/api/httpClient";
import type { TestEventInput } from "./schemas";

interface SendEventResponse {
  id: string;
  status: string;
}

/** Submit a WEB_VISIT event, shaped to the backend's `/events` contract. */
export async function sendTestEvent(input: TestEventInput): Promise<SendEventResponse> {
  const metadata: Record<string, string> = {
    url: input.url,
    title: input.title,
  };
  if (input.browser && input.browser.trim().length > 0) {
    metadata.browser = input.browser.trim();
  }

  return httpClient.post<SendEventResponse>("/events", {
    type: "WEB_VISIT",
    timestamp: new Date(input.timestamp).toISOString(),
    source: "browser_extension",
    metadata,
  });
}
