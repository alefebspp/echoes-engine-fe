import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { DashboardPage } from "./DashboardPage";
import { fetchDashboard } from "./api";
import type { DashboardStats } from "./types";

vi.mock("./api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api")>();
  return { ...actual, fetchDashboard: vi.fn() };
});

const mockFetch = vi.mocked(fetchDashboard);

function makeStats(overrides: Partial<DashboardStats> = {}): DashboardStats {
  return {
    timezone: "UTC",
    periodDays: 30,
    summary: {},
    eventsByDay: [
      { date: "2026-06-01", count: 4 },
      { date: "2026-06-02", count: 9 },
    ],
    categoryBreakdown: [{ tag: "Reading", count: 8, percentage: 62 }],
    topDomains: [{ domain: "example.com", count: 12 }],
    topBrowsers: [{ browser: "chrome", count: 10 }],
    eventsBySource: [{ sourceCode: "ext", sourceName: "Extension", count: 13 }],
    activityByHour: [{ hour: 9, count: 6 }],
    ...overrides,
  };
}

describe("DashboardPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows a loading state, then renders data", async () => {
    let resolve!: (value: DashboardStats) => void;
    mockFetch.mockReturnValue(new Promise<DashboardStats>((r) => (resolve = r)));

    renderWithProviders(<DashboardPage />, { route: "/app/dashboard?days=30" });
    expect(screen.getByText(/reading recent signals/i)).toBeInTheDocument();

    resolve(makeStats());
    expect(await screen.findByText("example.com")).toBeInTheDocument();
    expect(screen.getByText(/captured this period/i)).toBeInTheDocument();
  });

  it("shows an error state with a retry that refetches", async () => {
    mockFetch.mockRejectedValue(new Error("boom"));
    const user = userEvent.setup({ delay: null });
    renderWithProviders(<DashboardPage />, { route: "/app/dashboard?days=30" });

    await waitFor(
      () =>
        expect(screen.getByText(/couldn.t load the dashboard/i)).toBeInTheDocument(),
      { timeout: 5000 },
    );

    mockFetch.mockResolvedValue(makeStats());
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(await screen.findByText("example.com")).toBeInTheDocument();
  });

  it("renders empty states when there is no captured activity", async () => {
    mockFetch.mockResolvedValue(
      makeStats({
        eventsByDay: [],
        categoryBreakdown: [],
        topDomains: [],
        topBrowsers: [],
        eventsBySource: [],
        activityByHour: [],
      }),
    );

    renderWithProviders(<DashboardPage />, { route: "/app/dashboard?days=30" });
    expect(await screen.findByText(/no daily activity yet/i)).toBeInTheDocument();
    expect(screen.getByText(/no domains yet/i)).toBeInTheDocument();
  });

  it("refetches with the new period when the selector changes", async () => {
    mockFetch.mockResolvedValue(makeStats());
    const user = userEvent.setup();
    renderWithProviders(<DashboardPage />, { route: "/app/dashboard?days=30" });

    await screen.findByText("example.com");
    await user.click(screen.getByRole("button", { name: "7d" }));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith(7));
  });
});
