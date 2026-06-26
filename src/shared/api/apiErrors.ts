/**
 * A single error type for everything the HTTP client can surface, so the UI can
 * branch on `status` instead of guessing from message strings.
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

export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.isNetwork) {
      return "Can't reach the API. Check that the backend is running.";
    }
    if (error.isUnauthorized) {
      return "Your session expired. Sign in again.";
    }
    return extractApiMessage(error.body, error.message);
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Try again.";
}
