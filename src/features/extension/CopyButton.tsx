import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

/** Copies a value to the clipboard and briefly confirms it. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        void navigator.clipboard?.writeText(value).then(() => setCopied(true));
      }}
      className="rounded-sm border border-hairline-strong px-2.5 py-1 font-mono text-micro uppercase tracking-[0.08em] text-lilac transition-colors hover:border-memory hover:bg-surface-2"
    >
      <span aria-live="polite">{copied ? t("extension.copied") : t("extension.copy")}</span>
    </button>
  );
}
