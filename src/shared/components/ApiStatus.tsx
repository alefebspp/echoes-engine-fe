import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";

async function fetchHealth(): Promise<boolean> {
  await httpClient.get("/health", { anonymous: true });
  return true;
}

const STATES = {
  checking: { dot: "bg-ink_text-faint", label: "Checking API" },
  online: {
    dot: "bg-signal shadow-[0_0_10px_var(--signal-cyan)]",
    label: "API online",
  },
  offline: {
    dot: "bg-danger shadow-[0_0_10px_var(--danger)]",
    label: "API offline",
  },
} as const;

/** Small ambient indicator for the API connection — quiet, not alarming. */
export function ApiStatus({ className }: { className?: string }) {
  const { isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: fetchHealth,
    retry: false,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const state = isLoading ? STATES.checking : isError ? STATES.offline : STATES.online;

  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-micro uppercase tracking-[0.12em] text-ink_text-muted ${className ?? ""}`}
      role="status"
    >
      <span className={`size-2 rounded-full ${state.dot}`} aria-hidden="true" />
      {state.label}
    </span>
  );
}
