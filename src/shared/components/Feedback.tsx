import type { ReactNode } from "react";
import { Button } from "./Button";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <span
      className="inline-block size-4 animate-spin rounded-full border-2 border-memory border-r-transparent"
      role="status"
      aria-label={label}
    />
  );
}

/** Centered loading block for cards and page sections. */
export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 px-5 py-8 text-sm text-ink_text-muted">
      <Spinner />
      <span aria-live="polite">{label}</span>
    </div>
  );
}

interface ErrorBlockProps {
  title?: ReactNode;
  message: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorBlock({
  title = "That didn't load",
  message,
  onRetry,
  retryLabel = "Try again",
}: ErrorBlockProps) {
  return (
    <div
      className="flex flex-col items-center gap-2.5 px-5 py-7 text-center"
      role="alert"
    >
      <span
        className="size-2 rounded-full bg-danger shadow-[0_0_12px_var(--danger)]"
        aria-hidden="true"
      />
      <p className="font-display text-h3 font-semibold text-lilac">{title}</p>
      <p className="max-w-[44ch] text-sm text-ink_text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-1.5">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
