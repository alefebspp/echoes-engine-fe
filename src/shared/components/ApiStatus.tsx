import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { httpClient } from "@/shared/api/httpClient";

async function fetchHealth(): Promise<boolean> {
  await httpClient.get("/health", { anonymous: true });
  return true;
}

const STATES = {
  checking: { dot: "bg-ink_text-faint", label: "apiStatus.checking" },
  online: {
    dot: "bg-signal shadow-[0_0_10px_var(--signal-cyan)]",
    label: "apiStatus.online",
  },
  offline: {
    dot: "bg-danger shadow-[0_0_10px_var(--danger)]",
    label: "apiStatus.offline",
  },
} as const;

/** Small ambient indicator for the API connection — quiet, not alarming. */
export function ApiStatus({ className }: { className?: string }) {
  const { t } = useTranslation();
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
      {t(state.label)}
    </span>
  );
}
