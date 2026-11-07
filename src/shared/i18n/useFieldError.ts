import { useTranslation } from "react-i18next";
import type { ParseKeys } from "i18next";

/** Zod schemas carry i18n keys as messages; this resolves them for display. */
export function useFieldError() {
  const { t } = useTranslation();
  return (message?: string) => (message ? t(message as ParseKeys) : undefined);
}
