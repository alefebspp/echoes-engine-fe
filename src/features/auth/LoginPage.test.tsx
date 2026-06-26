import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { LoginPage } from "./LoginPage";
import * as authApi from "./api";
import * as bootstrap from "@/shared/auth/bootstrapSession";

vi.mock("./api", () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
}));

vi.mock("@/shared/auth/bootstrapSession", () => ({
  bootstrapSession: vi.fn(),
}));

describe("LoginPage validation", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows field errors and does not call the API for an empty submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: "/login" });

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Enter your email.")).toBeInTheDocument();
    expect(screen.getByText("Enter your password.")).toBeInTheDocument();
    expect(authApi.login).not.toHaveBeenCalled();
  });

  it("rejects an invalid email format", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: "/login" });

    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText("Use a valid email address.")).toBeInTheDocument();
    expect(authApi.login).not.toHaveBeenCalled();
  });

  it("calls login and bootstraps the session on success", async () => {
    vi.mocked(authApi.login).mockResolvedValue();
    vi.mocked(bootstrap.bootstrapSession).mockResolvedValue();
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<LoginPage />, { route: "/login" });

    const email = screen.getByLabelText(/^email$/i);
    const password = screen.getByLabelText(/^password$/i);
    await user.clear(email);
    await user.type(email, "jane@example.com");
    await user.clear(password);
    await user.type(password, "secret123");
    await user.click(screen.getByRole("button", { name: /^sign in$/i }));

    await waitFor(() => expect(authApi.login).toHaveBeenCalledOnce());
    expect(vi.mocked(authApi.login).mock.calls[0][0]).toEqual({
      email: "jane@example.com",
      password: "secret123",
    });
    await waitFor(() => expect(bootstrap.bootstrapSession).toHaveBeenCalledOnce());
  });
});
