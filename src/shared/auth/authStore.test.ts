import { describe, it, expect, beforeEach } from "vitest";
import { authStore } from "./authStore";

describe("authStore", () => {
  beforeEach(() => {
    authStore.clear();
  });

  it("starts anonymous after clear", () => {
    expect(authStore.getStatus()).toBe("anonymous");
    expect(authStore.isAuthenticated()).toBe(false);
    expect(authStore.getUserId()).toBeNull();
  });

  it("tracks an authenticated session in memory", () => {
    authStore.setSession({
      id: "user-123",
      name: "Jane",
      surname: "Doe",
      email: "jane@example.com",
    });

    expect(authStore.isAuthenticated()).toBe(true);
    expect(authStore.getUserId()).toBe("user-123");
    expect(authStore.getUser()?.email).toBe("jane@example.com");
  });

  it("clears the session", () => {
    authStore.setSession({ id: "user-123" });
    authStore.clear();
    expect(authStore.isAuthenticated()).toBe(false);
    expect(authStore.getUser()).toBeNull();
  });

  it("notifies subscribers on change", () => {
    let calls = 0;
    const unsubscribe = authStore.subscribe(() => {
      calls += 1;
    });
    authStore.setSession({ id: "x" });
    authStore.clear();
    unsubscribe();
    authStore.setSession({ id: "y" });
    expect(calls).toBe(2);
  });
});
