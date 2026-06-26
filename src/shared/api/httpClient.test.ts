import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { httpClient, setUnauthorizedHandler } from "./httpClient";
import { ApiError } from "./apiErrors";
import { authStore } from "@/shared/auth/authStore";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("httpClient", () => {
  beforeEach(() => {
    authStore.clear();
    setUnauthorizedHandler(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends credentials on every request so auth cookies are included", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    await httpClient.get("/dashboard");

    const [, init] = fetchMock.mock.calls[0];
    expect(init.credentials).toBe("include");
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it("does not attach an Authorization header", async () => {
    authStore.setSession({ id: "user-123" });
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    await httpClient.get("/dashboard");

    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it("invokes the unauthorized handler and throws on 401 for protected routes", async () => {
    authStore.setSession({ id: "user-123" });
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 401)));

    await expect(httpClient.get("/dashboard")).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it("does not invoke the unauthorized handler for anonymous routes", async () => {
    const onUnauthorized = vi.fn();
    setUnauthorizedHandler(onUnauthorized);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 401)));

    await expect(
      httpClient.post("/auth/login", {}, { anonymous: true }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it("wraps network failures as an ApiError with status 0", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await expect(httpClient.get("/health", { anonymous: true })).rejects.toMatchObject({
      status: 0,
    });
  });
});
