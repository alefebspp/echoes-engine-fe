import { describe, it, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { env } from "@/shared/config/env";
import { ExtensionPage } from "./ExtensionPage";

describe("ExtensionPage", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("links to the latest build and lists the install steps", () => {
    const { container } = renderWithProviders(<ExtensionPage />, { route: "/app/extension" });

    expect(screen.getByRole("link", { name: /download the extension/i })).toHaveAttribute(
      "href",
      env.extensionDownloadUrl,
    );
    expect(container.querySelectorAll("ol > li")).toHaveLength(5);
    expect(screen.getByText(/turn on developer mode/i)).toBeInTheDocument();
  });

  it("copies the extensions page address", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ExtensionPage />, { route: "/app/extension" });
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();

    await user.click(screen.getByRole("button", { name: "Copy chrome://extensions" }));

    expect(writeText).toHaveBeenCalledWith("chrome://extensions");
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });
});
