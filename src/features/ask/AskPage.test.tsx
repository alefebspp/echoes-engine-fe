import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiError } from "@/shared/api/apiErrors";
import { renderWithProviders } from "@/test/renderWithProviders";
import { askQuestion } from "./api";
import { AskPage } from "./AskPage";
import { toRangeEnd, toRangeStart } from "./scope";
import type { AskResponse } from "./types";

vi.mock("./api", () => ({ askQuestion: vi.fn() }));

const mockAsk = vi.mocked(askQuestion);

const QUESTION = "What did I read about queues?";

function answerResponse(overrides: Partial<AskResponse> = {}): AskResponse {
  return {
    answer: "Queues showed up in [1] and an untitled note [2]. Ignore [99].",
    citations: [
      {
        eventId: "e1",
        title: "Message queues",
        url: "https://www.example.com/queues",
        occurredAt: "2026-06-12T15:00:00.000Z",
      },
      {
        eventId: "e2",
        title: null,
        url: null,
        occurredAt: "2026-06-02T15:00:00.000Z",
      },
    ],
    snippets: [
      {
        eventId: "e1",
        title: "Message queues",
        url: "https://www.example.com/queues",
        occurredAt: "2026-06-12T15:00:00.000Z",
        similarity: 0.91,
      },
      {
        eventId: "e2",
        title: null,
        url: null,
        occurredAt: "2026-06-02T15:00:00.000Z",
        similarity: 0.2,
      },
    ],
    retrievedCount: 2,
    refused: false,
    mode: "answer",
    ...overrides,
  };
}

function renderPage() {
  const user = userEvent.setup({ delay: null });
  renderWithProviders(<AskPage />, { route: "/app/ask" });
  return user;
}

async function ask(user: ReturnType<typeof userEvent.setup>, text: string) {
  const field = screen.getByLabelText("Question");
  await user.clear(field);
  await user.type(field, text);
  await user.click(screen.getByRole("button", { name: "Ask" }));
}

describe("AskPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("keeps a short question on the field and does not call the API", async () => {
    const user = renderPage();
    expect(screen.getByPlaceholderText("Ask what you read, watched, or opened.")).toBeInTheDocument();

    await ask(user, "no");

    expect(mockAsk).not.toHaveBeenCalled();
    expect(screen.getByText("Ask at least a few words.")).toBeInTheDocument();
    expect(screen.getByLabelText("Question")).toHaveValue("no");
  });

  it("shows the reading first, then pages in API order", async () => {
    mockAsk.mockResolvedValue(answerResponse());
    const user = renderPage();
    await ask(user, QUESTION);

    const reading = await screen.findByRole("article");
    expect(within(reading).getByRole("heading", { level: 2, name: QUESTION })).toBeInTheDocument();
    expect(reading).toHaveTextContent("[99]");
    expect(screen.queryByRole("button", { name: /source 99/i })).not.toBeInTheDocument();
    expect(screen.queryByText("0.91")).not.toBeInTheDocument();
    expect(screen.getAllByText("close match")).toHaveLength(1);

    const pages = within(reading).getByRole("list", { name: "Pages" });
    const items = within(pages).getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("Message queues");
    expect(items[0]).toHaveTextContent("example.com");
    expect(items[1]).toHaveTextContent("Untitled");
    expect(within(items[1]!).queryByRole("link")).not.toBeInTheDocument();

    const paragraph = reading.querySelector("p");
    expect(paragraph).not.toBeNull();
    expect(
      paragraph!.compareDocumentPosition(pages) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Source 1, Message queues" }));
    expect(items[0]).toHaveFocus();

    const link = within(items[0]!).getByRole("link", { name: /message queues/i });
    expect(link).toHaveAttribute("href", "https://www.example.com/queues");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("keeps earlier asks and sends only the new question", async () => {
    mockAsk.mockResolvedValue(answerResponse());
    const user = renderPage();
    await ask(user, QUESTION);
    await screen.findByRole("heading", { level: 2, name: QUESTION });

    await ask(user, "What did I watch about compilers?");

    expect(await screen.findByRole("heading", { level: 2, name: "What did I watch about compilers?" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: QUESTION })).toBeInTheDocument();
    expect(mockAsk).toHaveBeenCalledTimes(2);
    expect(mockAsk.mock.calls[1]?.[0]).toEqual({ question: "What did I watch about compilers?" });
    expect(mockAsk.mock.calls[1]?.[0]).not.toHaveProperty("answer");
  });

  it("sends a date range and tags, and shows them above the answer", async () => {
    mockAsk.mockResolvedValue(answerResponse({ answer: "A June note [1]." }));
    const user = renderPage();
    await user.click(screen.getByRole("button", { name: "Narrow the search" }));
    fireEvent.change(screen.getByLabelText("Start"), { target: { value: "2026-06-01" } });
    fireEvent.change(screen.getByLabelText("End"), { target: { value: "2026-06-30" } });
    await user.type(screen.getByLabelText("Must include a tag"), "developer tools");
    await user.click(screen.getByRole("button", { name: "Add tag" }));
    await ask(user, QUESTION);

    expect(mockAsk).toHaveBeenCalledWith(
      {
        question: QUESTION,
        from: toRangeStart("2026-06-01"),
        to: toRangeEnd("2026-06-30"),
        tags: ["developer tools"],
      },
      expect.any(AbortSignal),
    );

    const reading = await screen.findByRole("article");
    const filters = within(reading).getByRole("list", { name: "Filters on this question" });
    expect(within(filters).getByRole("button", { name: "Remove June 2026" })).toBeInTheDocument();
    expect(within(filters).getByRole("button", { name: "Remove developer tools" })).toBeInTheDocument();
    expect(
      filters.compareDocumentPosition(within(reading).getByRole("list", { name: "Pages" })) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("treats a refusal without filters as an empty result", async () => {
    mockAsk.mockResolvedValue(
      answerResponse({
        mode: "refused",
        refused: true,
        answer: null,
        citations: [],
        snippets: [],
        refusalReason: "No relevant events found for this question.",
      }),
    );
    const user = renderPage();
    await ask(user, QUESTION);

    expect(
      await screen.findByText("Nothing in your history was close to that question. Try a more specific one."),
    ).toBeInTheDocument();
    expect(screen.queryByText("No relevant events found for this question.")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear filters" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Pages" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: QUESTION })).toBeInTheDocument();
  });

  it("offers to clear filters after a scoped refusal", async () => {
    mockAsk.mockResolvedValue(
      answerResponse({
        mode: "refused",
        refused: true,
        answer: null,
        citations: [],
        snippets: [],
        refusalReason: "No matching events for the given filters.",
      }),
    );
    const user = renderPage();
    await user.click(screen.getByRole("button", { name: "Narrow the search" }));
    await user.type(screen.getByLabelText("Must include a tag"), "rust");
    await user.click(screen.getByRole("button", { name: "Add tag" }));
    await ask(user, QUESTION);

    expect(await screen.findByText("Nothing with those tags matched.")).toBeInTheDocument();
    expect(screen.getByLabelText("Question")).toHaveValue("");

    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(screen.getByLabelText("Question")).toHaveValue(QUESTION);
    expect(screen.queryByRole("list", { name: "Filters on the next question" })).not.toBeInTheDocument();
    expect(mockAsk).toHaveBeenCalledTimes(1);

    mockAsk.mockResolvedValueOnce(answerResponse());
    await user.click(screen.getByRole("button", { name: "Ask" }));
    expect(mockAsk).toHaveBeenLastCalledWith({ question: QUESTION }, expect.any(AbortSignal));
  });

  it("leads with pages when a summary is unavailable", async () => {
    mockAsk.mockResolvedValue(
      answerResponse({
        mode: "snippets_only",
        answer: "Found 2 related page(s); generation unavailable.",
        citations: [],
      }),
    );
    const user = renderPage();
    await ask(user, QUESTION);

    const note = await screen.findByText("Found 2 related page(s); generation unavailable.");
    const pages = screen.getByRole("list", { name: "Pages" });
    expect(note.compareDocumentPosition(pages) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(pages).getByText("Message queues")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /source 1/i })).not.toBeInTheDocument();
  });

  it("leaves the question in the field when the search fails", async () => {
    mockAsk.mockRejectedValueOnce(
      new ApiError("bad", 400, { message: ["question must be longer than or equal to 3 characters"] }),
    );
    const user = renderPage();
    await ask(user, "Hey");
    expect(await screen.findByText("Ask at least a few words.")).toBeInTheDocument();
    expect(screen.getByLabelText("Question")).toHaveValue("Hey");
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();

    mockAsk.mockRejectedValueOnce(
      new ApiError("ThrottlerException: Too Many Requests", 429, {
        message: "ThrottlerException: Too Many Requests",
      }),
    );
    await ask(user, QUESTION);
    expect(await screen.findByRole("alert")).toHaveTextContent(/10 questions for this minute/i);
    expect(screen.queryByText(/throttler/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ask" })).toBeDisabled();
    expect(screen.getByLabelText("Question")).toHaveValue(QUESTION);
    expect(mockAsk).toHaveBeenCalledTimes(2);
  });

  it("leaves the question in place after a server error and does not add a reading", async () => {
    mockAsk.mockRejectedValue(new ApiError("boom", 500, null));
    const user = renderPage();
    await ask(user, QUESTION);

    expect(await screen.findByText("The search didn't finish. Your question is still here.")).toBeInTheDocument();
    expect(screen.getByLabelText("Question")).toHaveValue(QUESTION);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ask" })).toBeEnabled();
  });

  it("does not send a 401 failure to the page", async () => {
    mockAsk.mockRejectedValue(new ApiError("Your session expired. Sign in again.", 401, null));
    const user = renderPage();
    await ask(user, QUESTION);

    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Question")).toHaveValue(QUESTION);
  });

  it("disables the question while looking through history", async () => {
    let resolveAsk: (value: AskResponse) => void = () => {};
    mockAsk.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveAsk = resolve;
        }),
    );
    const user = renderPage();
    await ask(user, QUESTION);

    expect(await screen.findByText("Looking through your history.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ask" })).toBeDisabled();
    expect(screen.getByLabelText("Question")).toBeDisabled();
    expect(screen.getByLabelText("Question")).toHaveValue(QUESTION);
    expect(mockAsk).toHaveBeenCalledOnce();

    resolveAsk(answerResponse());
    expect(await screen.findByRole("heading", { level: 2, name: QUESTION })).toBeInTheDocument();
    expect(screen.getByLabelText("Question")).toHaveValue("");
    expect(screen.queryByText("Looking through your history.")).not.toBeInTheDocument();
  });
});
