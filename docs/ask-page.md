# Ask endpoint — frontend contract

`POST /api/v1/ai/ask` is a single, stateless question about the signed-in user’s own history. The frontend sends the question and optional filters, then renders one of three successful outcomes. There is no conversation id: a follow-up does not remember the previous turn.

## Contract

**`POST /api/v1/ai/ask`**

Auth is the same as the rest of the API: `Authorization: Bearer <token>`, or the `access_token` cookie with `credentials: 'include'`. Rate limit is **10 requests per 60 seconds** per client. The call is slow on purpose (embed the question, search, then generate), so expect a few seconds and do not fire a second request while one is in flight.

```ts
type AskRequest = {
  question: string;       // required, 3–2000 chars
  from?: string;          // ISO-8601, inclusive
  to?: string;            // ISO-8601, inclusive
  tags?: string[];        // max 20; event must have at least one
  limit?: number;         // 1–20, server default 8
};

type AskCitation = {
  eventId: string;
  title: string | null;
  url: string | null;
  occurredAt: string;     // ISO-8601
};

type AskSnippet = AskCitation & {
  similarity: number;     // cosine similarity, about 0–1
};

type AskResponse = {
  answer: string | null;
  citations: AskCitation[];
  snippets: AskSnippet[];
  retrievedCount: number;
  refused: boolean;
  mode: "answer" | "refused" | "snippets_only";
  refusalReason?: string;
};
```

Omit optional fields. Extra properties are rejected. `tags` may also be a comma-separated string; send an array.

A successful body always returns **200**, including refusal and the degraded path. Branch on `mode`, not on the HTTP status.

| `mode` | Meaning | What to show |
| --- | --- | --- |
| `answer` | Pages were found and a summary was written. | `answer`, then the sources. `refused` is `false`. `citations` and `snippets` are the same hits, same order. |
| `refused` | Nothing passed the search (or the filters). The model was not called. | No sources. `answer` is `null`. Use `refusalReason`. |
| `snippets_only` | Pages were found, but the written summary failed. | The sources are the result. `answer` is a short fallback sentence such as “Found 2 related page(s); generation unavailable.” `refused` is still `false`. |

`citations[0]` is source `[1]` in the answer text, `citations[1]` is `[2]`, and so on. `title` and `url` can be `null`. `similarity` is only on `snippets`.

Refusal copy from the API:

- No filters: `"No relevant events found for this question."`
- Any of `from`, `to`, or `tags` was sent: `"No matching events for the given filters."`

Filters are never widened for you. A date window with no visits is a refusal, even if the same question would hit outside that window.

Errors:

| Status | When | Body |
| --- | --- | --- |
| `400` | Validation (length, bad date, `limit` out of range, unknown field) | `{ statusCode, message: string[], error: "Bad Request" }` |
| `401` | Missing or invalid JWT | Nest unauthorized body |
| `429` | Over 10 requests in 60 seconds | `{ statusCode: 429, message: "ThrottlerException: Too Many Requests" }` |
| `500` | Embedding or database failed before a result existed | Generic server error. This is different from `snippets_only`, which is still `200`. |

Example:

```http
POST /api/v1/ai/ask
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "What did I read about message queues?",
  "from": "2026-06-01T00:00:00.000Z",
  "to": "2026-06-30T23:59:59.999Z",
  "tags": ["developer tools"],
  "limit": 8
}
```

## How the screen should behave

This is a search over memory, with a short written reading on top. The pages the person actually opened are the result. The paragraph is a guide to those pages.

**One question at a time.** A thread on screen can keep earlier asks so the person can scroll back, but each submit is a new request with the full question. Do not send prior answers back, and do not imply the product remembers the chat. Placeholder copy should say what the box does: “Ask what you read, watched, or opened.”

**Scope sits next to the question, closed by default.** Date range and tags change the search. Label them as narrowing, for example “Only pages from” and “Must include a tag.” Show the active scope as chips above the answer (“June 2026 · developer tools”) so a refusal is understandable. Clearing a chip and asking again is the recovery.

**Waiting.** Disable the control until the response arrives. One status line is enough: “Looking through your history.” Do not stream fake tokens. If it fails with `500`, leave the question in the field.

**`answer`.** Show the paragraph first. Turn each `[1]`, `[2]` into a control that points at that source. Ignore a number that does not exist in `citations`. Under the paragraph, list every citation as a card: title (or the hostname, or “Untitled”), the date, the tags if you have them from elsewhere, and a link when `url` is present. Order is the API order. `similarity` can stay off the card; if you show it, a quiet label such as “close match” is enough. Do not sort the cards yourself.

**`refused`.** This is an empty result, not an error. Keep the question visible. If filters were sent, say nothing in that range matched and offer to clear them. If there were no filters, say nothing in their history was close to that question and invite a more specific one. Do not show a toast.

**`snippets_only`.** Lead with the source cards. Put the fallback sentence above them as a note that a written summary is unavailable. The pages are still a successful result.

**Failures.** `400` stays on the field (“Ask at least a few words”). `401` sends the person to sign in. `429` tells them they have used the 10 questions for this minute and when they can try again. Do not auto-retry `429` or `500`.

**What the screen should not do.** Do not hide sources behind a disclosure. Do not add a confidence score to the paragraph. Do not let the person chat with a general assistant from this box: every answer is only about their events, and the model is instructed to stop when those events are not enough.
