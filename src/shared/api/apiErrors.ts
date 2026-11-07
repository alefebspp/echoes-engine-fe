import { i18n } from "@/shared/i18n";

/** One rejected field from a `VALIDATION_FAILED` response. */
export interface ValidationDetail {
  field: string;
  rules: string[];
}

function bodyField(body: unknown, key: string): unknown {
  return body && typeof body === "object" ? (body as Record<string, unknown>)[key] : undefined;
}

/**
 * A single error type for everything the HTTP client can surface, so the UI can
 * branch on `status` and the backend's `code` instead of guessing from message strings.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }

  /** Stable error code from the API body, e.g. `USER_ALREADY_EXISTS`. */
  get code(): string | undefined {
    const code = bodyField(this.body, "code");
    return typeof code === "string" ? code : undefined;
  }

  get details(): ValidationDetail[] {
    const details = bodyField(this.body, "details");
    return Array.isArray(details) ? (details as ValidationDetail[]) : [];
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isValidation(): boolean {
    return this.status === 400 || this.status === 422;
  }

  get isNetwork(): boolean {
    return this.status === 0;
  }
}

/**
 * NestJS validation errors arrive as `{ message: string | string[] }`. Pull out
 * a human-readable sentence without leaking the raw payload shape into the UI.
 */
export function extractApiMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message: unknown }).message;
    if (Array.isArray(message) && message.length > 0) {
      return message.map(String).join(" ");
    }
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }
  return fallback;
}

/** The translated text for an API error code, or null when the code is unknown. */
export function messageForCode(code: string | undefined): string | null {
  if (!code) return null;
  const key = `errors.${code}`;
  return i18n.exists(key) ? i18n.t(key as "errors.INTERNAL_ERROR") : null;
}

export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isNetwork) {
      return i18n.t("api.unreachable");
    }
    const translated = messageForCode(error.code);
    if (translated) return translated;
    if (error.isUnauthorized) {
      return i18n.t("api.sessionExpired");
    }
    return extractApiMessage(error.body, error.message);
  }
  if (error instanceof Error) return error.message;
  return i18n.t("api.generic");
}
