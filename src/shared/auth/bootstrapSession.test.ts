import { describe, it, expect, vi, beforeEach } from "vitest";
import { bootstrapSession } from "./bootstrapSession";
import { authStore } from "./authStore";
import { fetchCurrentUser } from "@/features/users/api";
import { ApiError } from "@/shared/api/apiErrors";

vi.mock("@/features/users/api", () => ({
  fetchCurrentUser: vi.fn(),
}));

const mockFetchCurrentUser = vi.mocked(fetchCurrentUser);

describe("bootstrapSession", () => {
  beforeEach(() => {
    authStore.clear();
    vi.clearAllMocks();
  });

  it("marks the user as authenticated when /users/me succeeds", async () => {
    mockFetchCurrentUser.mockResolvedValue({
      id: "user-1",
      name: "Jane",
      surname: "Doe",
      email: "jane@example.com",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    await bootstrapSession();

    expect(authStore.isAuthenticated()).toBe(true);
    expect(authStore.getUserId()).toBe("user-1");
  });

  it("clears the session when /users/me returns 401", async () => {
    mockFetchCurrentUser.mockRejectedValue(new ApiError("Unauthorized", 401, null));

    await bootstrapSession();

    expect(authStore.isAuthenticated()).toBe(false);
  });
});
