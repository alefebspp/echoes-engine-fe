import { env } from "@/shared/config/env";
import { ApiError, extractApiMessage } from "./apiErrors";

type Json = Record<string, unknown> | unknown[] | undefined;

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: Json;
  /** Pre-serialized query params. */
  query?: Record<string, string | number | undefined>;
  /**
   * Public endpoints (login, register, logout). Skips the session-expired handler
   * on 401 so a failed login doesn't look like a logout.
   */
  anonymous?: boolean;
  signal?: AbortSignal;
}

/**
 * Called whenever a protected request returns 401. The router wires this up so
 * clearing the session makes RequireAuth redirect to /login.
 */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const base = env.apiBaseUrl;
  const pathname = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const url = base.startsWith("/")
    ? new URL(pathname, window.location.origin)
    : new URL(pathname);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, anonymous, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "include",
      signal,
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
    throw new ApiError("Network request failed", 0, cause);
  }

  if (response.status === 401 && !anonymous) {
    onUnauthorized?.();
    throw new ApiError("Your session expired. Sign in again.", 401, null);
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(
      extractApiMessage(payload, `Request failed (${response.status}).`),
      response.status,
      payload,
    );
  }

  return payload as T;
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return text.length > 0 ? text : null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export const httpClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: Json, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: Json, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, "method" | "body">) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
