import { describe, it, expect, afterEach } from "vitest";
import { i18n } from "@/shared/i18n";
import { ApiError, toUserMessage } from "./apiErrors";

describe("toUserMessage", () => {
  afterEach(async () => {
    await i18n.changeLanguage("en");
  });

  it("translates a known API error code", async () => {
    const error = new ApiError("Email already registered", 409, {
      statusCode: 409,
      code: "USER_ALREADY_EXISTS",
      message: "Email already registered",
    });

    expect(toUserMessage(error)).toBe("An account with this email already exists.");
    await i18n.changeLanguage("pt-BR");
    expect(toUserMessage(error)).toBe("Já existe uma conta com este e-mail.");
  });

  it("shows invalid credentials instead of an expired session on a failed login", () => {
    const error = new ApiError("Invalid credentials", 401, {
      code: "INVALID_CREDENTIALS",
      message: "Invalid credentials",
    });

    expect(toUserMessage(error)).toBe("Incorrect email or password.");
  });

  it("falls back to the API message for an unknown code", () => {
    const error = new ApiError("x", 400, { code: "SOMETHING_NEW", message: "Something new" });

    expect(error.code).toBe("SOMETHING_NEW");
    expect(toUserMessage(error)).toBe("Something new");
  });

  it("reads validation details from the body", () => {
    const error = new ApiError("x", 400, {
      code: "VALIDATION_FAILED",
      details: [{ field: "email", rules: ["isEmail"] }],
    });

    expect(error.details).toEqual([{ field: "email", rules: ["isEmail"] }]);
    expect(toUserMessage(error)).toBe("Some fields aren't valid. Check them and try again.");
  });

  it("treats a 401 without a code as an expired session", () => {
    expect(toUserMessage(new ApiError("expired", 401, null))).toBe(
      "Your session expired. Sign in again.",
    );
  });
});
