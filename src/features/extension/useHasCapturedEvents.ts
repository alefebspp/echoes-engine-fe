import { useQuery } from "@tanstack/react-query";
import { fetchHasCapturedEvents } from "./api";

export function useHasCapturedEvents() {
  return useQuery({
    queryKey: ["events", "any"],
    queryFn: fetchHasCapturedEvents,
    staleTime: 60_000,
  });
}
