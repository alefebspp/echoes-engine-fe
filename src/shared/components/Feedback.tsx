import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

export function Spinner({ label }: { label?: string }) {
  const { t } = useTranslation();
  return (
    <span
      className="inline-block size-4 animate-spin rounded-full border-2 border-memory border-r-transparent"
      role="status"
      aria-label={label ?? t("common.spinner")}
    />
  );
}

/** Centered loading block for cards and page sections. */
export function LoadingBlock({ label }: { label?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 px-5 py-8 text-sm text-ink_text-muted">
      <Spinner />
      <span aria-live="polite">{label ?? t("common.loading")}</span>
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
  title,
  message,
  onRetry,
  retryLabel,
}: ErrorBlockProps) {
  const { t } = useTranslation();
  return (
    <div
      className="flex flex-col items-center gap-2.5 px-5 py-7 text-center"
      role="alert"
    >
      <span
        className="size-2 rounded-full bg-danger shadow-[0_0_12px_var(--danger)]"
        aria-hidden="true"
      />
      <p className="font-display text-h3 font-semibold text-lilac">{title ?? t("common.errorTitle")}</p>
      <p className="max-w-[44ch] text-sm text-ink_text-muted">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-1.5">
          {retryLabel ?? t("common.tryAgain")}
        </Button>
      )}
    </div>
  );
}
