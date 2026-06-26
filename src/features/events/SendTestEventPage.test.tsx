import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, createTestQueryClient } from "@/test/renderWithProviders";
import { SendTestEventPage } from "./SendTestEventPage";
import { sendTestEvent } from "./api";
import { dashboardKeys } from "@/features/dashboard/api";

vi.mock("./api", () => ({ sendTestEvent: vi.fn() }));

const mockSend = vi.mocked(sendTestEvent);

describe("SendTestEventPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("submits the prefilled event and invalidates dashboard data", async () => {
    mockSend.mockResolvedValue({ id: "evt-1", status: "accepted" });
    const queryClient = createTestQueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const user = userEvent.setup({ delay: null });

    renderWithProviders(<SendTestEventPage />, {
      route: "/app/events/test",
      queryClient,
    });

    await user.click(screen.getByRole("button", { name: /send test event/i }));

    await waitFor(() => expect(mockSend).toHaveBeenCalledOnce());
    await waitFor(() =>
      expect(screen.getAllByText(/event accepted/i).length).toBeGreaterThan(0),
    );
    expect(invalidate).toHaveBeenCalledWith({ queryKey: dashboardKeys.all });
  });

  it("surfaces a rejection from the API", async () => {
    mockSend.mockRejectedValue(new Error("bad url"));
    const user = userEvent.setup();
    renderWithProviders(<SendTestEventPage />, { route: "/app/events/test" });

    await user.click(screen.getByRole("button", { name: /send test event/i }));

    expect(await screen.findByText(/the api rejected this event/i)).toBeInTheDocument();
  });
});
