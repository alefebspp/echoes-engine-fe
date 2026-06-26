import { describe, it, expect } from "vitest";
import { profileSchema, diffProfile } from "./schemas";

const original = { name: "Jane", surname: "Doe", email: "jane@example.com" };

describe("profileSchema", () => {
  it("treats an empty password as valid (unchanged)", () => {
    const result = profileSchema.safeParse({ ...original, password: "" });
    expect(result.success).toBe(true);
  });

  it("validates password length when provided", () => {
    expect(profileSchema.safeParse({ ...original, password: "short" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...original, password: "longenough" }).success).toBe(true);
  });
});

describe("diffProfile", () => {
  it("returns no changes when nothing differs", () => {
    const changes = diffProfile({ ...original, password: "" }, original);
    expect(changes).toEqual({});
  });

  it("includes only the fields that changed", () => {
    const changes = diffProfile(
      { ...original, name: "Janet", password: "" },
      original,
    );
    expect(changes).toEqual({ name: "Janet" });
  });

  it("includes a password only when set", () => {
    const changes = diffProfile({ ...original, password: "new-password" }, original);
    expect(changes).toEqual({ password: "new-password" });
  });
});
