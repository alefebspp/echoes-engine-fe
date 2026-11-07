import { httpClient } from "@/shared/api/httpClient";

interface EventsPage {
  items: unknown[];
}

/** Whether the signed-in user has ever captured an event, regardless of period. */
export async function fetchHasCapturedEvents(): Promise<boolean> {
  const page = await httpClient.get<EventsPage>("/events", { query: { limit: 1 } });
  return Array.isArray(page.items) && page.items.length > 0;
}
