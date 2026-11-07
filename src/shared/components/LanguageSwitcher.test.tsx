import { describe, it, expect, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { LoginPage } from "@/features/auth/LoginPage";
import { i18n } from "@/shared/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

describe("LanguageSwitcher", () => {
  afterEach(async () => {
    window.localStorage.clear();
    await i18n.changeLanguage("en");
  });

  it("switches the interface to Brazilian Portuguese and remembers the choice", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />, { route: "/login" });

    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Português (Brasil)" }));

    expect(screen.getByRole("button", { name: /^entrar$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Português (Brasil)" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(window.localStorage.getItem("echoes.language")).toBe("pt-BR");
    expect(document.documentElement.lang).toBe("pt-BR");

    await user.click(screen.getByRole("button", { name: /^entrar$/i }));
    expect(await screen.findByText("Informe seu e-mail.")).toBeInTheDocument();
  });

  it("switches back to English", async () => {
    await i18n.changeLanguage("pt-BR");
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />);

    await user.click(screen.getByRole("button", { name: "English" }));

    expect(i18n.language).toBe("en");
    expect(screen.getByRole("group", { name: "Language" })).toBeInTheDocument();
  });
});
