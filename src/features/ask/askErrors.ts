import { ApiError, extractApiMessage } from "@/shared/api/apiErrors";
import type { Notice } from "./types";

export const RATE_LIMIT_MS = 60_000;

export function fieldMessageFromApi(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("2000")) return "Keep the question under 2,000 characters.";
  if (
    lower.includes("question") &&
    (lower.includes("3") || lower.includes("short") || lower.includes("few"))
  ) {
    return "Ask at least a few words.";
  }
  if (lower === "bad request") return "Check the question and the filters, then ask again.";
  return message;
}

export function noticeFromError(error: unknown, now = Date.now()): Notice | null {
  if (error instanceof ApiError) {
    if (error.status === 401) return null;
    if (error.status === 429) return { kind: "rate", until: now + RATE_LIMIT_MS };
    if (error.isValidation) {
      return {
        kind: "field",
        message: fieldMessageFromApi(extractApiMessage(error.body, error.message)),
      };
    }
    if (error.isNetwork) {
      return { kind: "server", message: "Can't reach the API. Your question is still here." };
    }
  }
  return { kind: "server", message: "The search didn't finish. Your question is still here." };
}

export function rateLimitMessage(seconds: number): string {
  const remaining = Math.max(0, Math.ceil(seconds));
  const wait =
    remaining >= 60 ? "1 minute" : remaining === 1 ? "1 second" : `${remaining} seconds`;
  return `You've used the 10 questions for this minute. Try again in ${wait}.`;
}
