import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "./schemas";

describe("loginSchema", () => {
  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "x" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Use a valid email address.");
    }
  });

  it("rejects an empty password", () => {
    const result = loginSchema.safeParse({ email: "a@b.co", password: "" });
    expect(result.success).toBe(false);
  });

  it("accepts a valid login", () => {
    expect(loginSchema.safeParse({ email: "a@b.co", password: "secret" }).success).toBe(true);
  });
});

describe("registerSchema", () => {
  const valid = {
    name: "Jane",
    surname: "Doe",
    email: "jane@example.com",
    password: "strong-password",
  };

  it("accepts a complete registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a password of at least 8 characters", () => {
    const result = registerSchema.safeParse({ ...valid, password: "short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password must be at least 8 characters.");
    }
  });

  it("rejects a password longer than 72 characters", () => {
    const result = registerSchema.safeParse({ ...valid, password: "a".repeat(73) });
    expect(result.success).toBe(false);
  });

  it("requires name and surname", () => {
    expect(registerSchema.safeParse({ ...valid, name: "" }).success).toBe(false);
    expect(registerSchema.safeParse({ ...valid, surname: "  " }).success).toBe(false);
  });
});
