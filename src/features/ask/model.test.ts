import { describe, expect, it } from "vitest";
import { ApiError } from "@/shared/api/apiErrors";
import { noticeFromError, rateLimitMessage, RATE_LIMIT_MS } from "./askErrors";
import {
  buildAskRequest,
  refusalMessage,
  scopeChips,
  scopeWithout,
  toRangeEnd,
  toRangeStart,
  validateQuestion,
  validateScope,
} from "./scope";
import { listSources } from "./sources";
import type { AskResponse, AskScope } from "./types";

const emptyScope = (): AskScope => ({ from: "", to: "", tags: [] });

function response(overrides: Partial<AskResponse> = {}): AskResponse {
  return {
    answer: null,
    citations: [],
    snippets: [],
    retrievedCount: 0,
    refused: false,
    mode: "answer",
    ...overrides,
  };
}

describe("ask scope", () => {
  it("labels a full month and each tag", () => {
    const chips = scopeChips({
      from: "2026-06-01",
      to: "2026-06-30",
      tags: ["developer tools"],
    });
    expect(chips.map((chip) => chip.label)).toEqual(["June 2026", "developer tools"]);
  });

  it("labels a leap-year February and a partial range", () => {
    expect(scopeChips({ from: "2024-02-01", to: "2024-02-29", tags: [] })[0]?.label).toBe(
      "February 2024",
    );
    expect(scopeChips({ from: "2026-06-02", to: "2026-06-18", tags: [] })[0]?.label).toBe(
      "Jun 2, 2026 – Jun 18, 2026",
    );
  });

  it("drops a cleared chip without touching the others", () => {
    const scope = { from: "2026-06-01", to: "2026-06-30", tags: ["queues", "rust"] };
    const [dates, queues] = scopeChips(scope);
    expect(scopeWithout(scope, dates!).tags).toEqual(["queues", "rust"]);
    expect(scopeWithout(scope, dates!).from).toBe("");
    expect(scopeWithout(scope, queues!).tags).toEqual(["rust"]);
  });

  it("rejects a short question, an inverted range, and an impossible day", () => {
    expect(validateQuestion("no")).toBe("Ask at least a few words.");
    expect(validateQuestion("   hey")).toBeNull();
    expect(validateScope({ from: "2026-06-30", to: "2026-06-01", tags: [] })).toMatch(/before/);
    expect(validateScope({ from: "2026-02-31", to: "", tags: [] })).toMatch(/start date/);
  });

  it("omits empty filters from the request", () => {
    expect(buildAskRequest("  hello there  ", emptyScope())).toEqual({ question: "hello there" });

    const body = buildAskRequest("hello there", {
      from: "2026-06-01",
      to: "2026-06-30",
      tags: ["developer tools"],
    });
    expect(body).toEqual({
      question: "hello there",
      from: toRangeStart("2026-06-01"),
      to: toRangeEnd("2026-06-30"),
      tags: ["developer tools"],
    });
    expect(body).not.toHaveProperty("limit");
  });

  it("writes refusal copy from the filters that were sent", () => {
    expect(refusalMessage(emptyScope())).toMatch(/nothing in your history/i);
    expect(refusalMessage({ from: "2026-06-01", to: "", tags: [] })).toBe(
      "Nothing in that range matched.",
    );
    expect(refusalMessage({ from: "", to: "", tags: ["rust"] })).toBe(
      "Nothing with those tags matched.",
    );
  });
});

describe("ask sources", () => {
  it("keeps API order and only marks a close match", () => {
    const sources = listSources(
      response({
        mode: "answer",
        answer: "See [1] and [2].",
        citations: [
          {
            eventId: "low",
            title: "Lower match",
            url: "https://www.example.com/low",
            occurredAt: "2026-06-01T12:00:00.000Z",
          },
          {
            eventId: "high",
            title: null,
            url: null,
            occurredAt: "not-a-date",
          },
        ],
        snippets: [
          {
            eventId: "low",
            title: "Lower match",
            url: "https://www.example.com/low",
            occurredAt: "2026-06-01T12:00:00.000Z",
            similarity: 0.2,
          },
          {
            eventId: "high",
            title: null,
            url: null,
            occurredAt: "not-a-date",
            similarity: 0.91,
          },
        ],
      }),
    );

    expect(sources.map((source) => source.title)).toEqual(["Lower match", "Untitled"]);
    expect(sources[0]).toMatchObject({ n: 1, host: "example.com", closeMatch: false });
    expect(sources[1]).toMatchObject({ n: 2, url: null, closeMatch: true });
    expect(sources[1]?.occurredAt).toBe("not-a-date");
  });

  it("drops non-http links and hides sources on a refusal", () => {
    const sources = listSources(
      response({
        citations: [
          {
            eventId: "bad",
            title: "Click",
            url: "javascript:alert(1)",
            occurredAt: "2026-06-01T00:00:00.000Z",
          },
        ],
      }),
    );
    expect(sources[0]).toMatchObject({ title: "Click", url: null, host: null });

    expect(
      listSources(
        response({
          mode: "refused",
          refused: true,
          citations: [
            {
              eventId: "e",
              title: "Hidden",
              url: "https://example.com",
              occurredAt: "2026-06-01T00:00:00.000Z",
            },
          ],
        }),
      ),
    ).toEqual([]);
  });
});

describe("ask errors", () => {
  it("maps validation, rate limit, and server failures", () => {
    expect(
      noticeFromError(
        new ApiError("bad", 400, {
          code: "VALIDATION_FAILED",
          message: ["question must be longer than or equal to 3 characters"],
          details: [{ field: "question", rules: ["minLength"] }],
        }),
      ),
    ).toEqual({ kind: "field", message: "Ask at least a few words." });

    const now = 1_000_000;
    expect(
      noticeFromError(new ApiError("ThrottlerException: Too Many Requests", 429, null), now),
    ).toEqual({ kind: "rate", until: now + RATE_LIMIT_MS });

    expect(noticeFromError(new ApiError("nope", 500, null))).toEqual({
      kind: "server",
      message: "The search didn't finish. Your question is still here.",
    });

    expect(noticeFromError(new ApiError("expired", 401, null))).toBeNull();
    expect(noticeFromError(new ApiError("offline", 0, null))?.kind).toBe("server");
    expect(rateLimitMessage(60)).toMatch(/10 questions/);
    expect(rateLimitMessage(60)).toMatch(/1 minute/);
    expect(rateLimitMessage(1)).toMatch(/1 second\.$/);
  });
});
