import { ApiError } from "@/shared/api/apiErrors";
import type { ValidationDetail } from "@/shared/api/apiErrors";
import { i18n } from "@/shared/i18n";
import type { Notice } from "./types";

export const RATE_LIMIT_MS = 60_000;

/** Turns the first rejected field of a `VALIDATION_FAILED` response into a message. */
export function fieldMessageFromDetails(details: ValidationDetail[]): string {
  const first = details[0];
  if (first?.field === "question") {
    return first.rules.includes("maxLength")
      ? i18n.t("ask.validation.questionLong")
      : i18n.t("ask.validation.questionShort");
  }
  if (first?.field === "from") return i18n.t("ask.validation.startDate");
  if (first?.field === "to") return i18n.t("ask.validation.endDate");
  if (first?.field.startsWith("tags") && first.rules.includes("arrayMaxSize")) {
    return i18n.t("ask.validation.tagLimit");
  }
  return i18n.t("ask.validation.badRequest");
}

export function noticeFromError(error: unknown, now = Date.now()): Notice | null {
  if (error instanceof ApiError) {
    if (error.status === 401) return null;
    if (error.code === "RATE_LIMITED" || error.status === 429) return { kind: "rate", until: now + RATE_LIMIT_MS };
    if (error.isValidation) {
      return {
        kind: "field",
        message: fieldMessageFromDetails(error.details),
      };
    }
    if (error.isNetwork) {
      return { kind: "server", message: i18n.t("ask.errors.unreachable") };
    }
  }
  return { kind: "server", message: i18n.t("ask.errors.unfinished") };
}

export function rateLimitMessage(seconds: number): string {
  const remaining = Math.max(0, Math.ceil(seconds));
  const wait =
    remaining >= 60 ? i18n.t("ask.rate.minute") : i18n.t("ask.rate.seconds", { count: remaining });
  return i18n.t("ask.rate.message", { wait });
}
