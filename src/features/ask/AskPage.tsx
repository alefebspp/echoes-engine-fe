import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/shared/components/PageHeader";
import { askQuestion } from "./api";
import { noticeFromError } from "./askErrors";
import { AskComposer } from "./AskComposer";
import { AskReading } from "./AskReading";
import { buildAskRequest, validateQuestion, validateScope } from "./scope";
import type { AskScope, Notice, ReadingRecord } from "./types";

const emptyScope = (): AskScope => ({ from: "", to: "", tags: [] });

/**
 * One question at a time over the signed-in person's own pages.
 * Earlier readings stay on screen, but each submit is a new request.
 */
export function AskPage() {
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const [scope, setScope] = useState<AskScope>(emptyScope);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [readings, setReadings] = useState<ReadingRecord[]>([]);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const pendingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const focusReadingId = useRef<string | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    const id = focusReadingId.current;
    if (!id) return;
    focusReadingId.current = null;
    document.getElementById(`reading-${id}`)?.focus();
  }, [readings]);

  const finishRateLimit = useCallback(() => {
    setNotice({ kind: "ready" });
  }, []);

  function changeQuestion(value: string) {
    setQuestion(value);
    setNotice((current) => (current?.kind === "rate" ? current : null));
  }

  function changeScope(next: AskScope) {
    setScope(next);
    setNotice((current) => (current?.kind === "field" ? null : current));
  }

  function restore(nextQuestion: string, nextScope: AskScope) {
    setQuestion(nextQuestion);
    setScope({ from: nextScope.from, to: nextScope.to, tags: [...nextScope.tags] });
    setNotice((current) => (current?.kind === "rate" ? current : null));
    questionRef.current?.focus();
  }

  async function submit() {
    if (pendingRef.current) return;
    if (notice?.kind === "rate" && notice.until > Date.now()) return;

    const questionError = validateQuestion(question);
    if (questionError) {
      setNotice({ kind: "field", message: questionError });
      return;
    }
    const scopeError = validateScope(scope);
    if (scopeError) {
      setScopeOpen(true);
      setNotice({ kind: "field", message: scopeError });
      return;
    }

    const request = buildAskRequest(question, scope);
    const snapshot = {
      question: request.question,
      scope: { from: scope.from, to: scope.to, tags: [...scope.tags] },
    };
    const controller = new AbortController();
    abortRef.current = controller;
    pendingRef.current = true;
    setPending(true);
    setNotice(null);

    try {
      const response = await askQuestion(request, controller.signal);
      if (controller.signal.aborted) return;
      const id = crypto.randomUUID();
      focusReadingId.current = id;
      setReadings((current) => [{ id, ...snapshot, response }, ...current]);
      setQuestion("");
    } catch (error) {
      if (isAbort(error) || controller.signal.aborted) return;
      setNotice(noticeFromError(error));
    } finally {
      if (!controller.signal.aborted) {
        pendingRef.current = false;
        setPending(false);
      }
    }
  }

  return (
    <>
      <PageHeader
        eyebrow={t("ask.eyebrow")}
        title={t("ask.title")}
        description={t("ask.description")}
      />

      <div className="min-w-0 max-w-[46rem] border-l-2 border-trace pl-4 sm:pl-5">
        <AskComposer
          question={question}
          scope={scope}
          scopeOpen={scopeOpen}
          pending={pending}
          notice={notice}
          questionRef={questionRef}
          onQuestionChange={changeQuestion}
          onScopeChange={changeScope}
          onScopeOpen={setScopeOpen}
          onSubmit={submit}
          onRateLimitDone={finishRateLimit}
        />

        {readings.length > 0 && (
          <div className="mt-10 divide-y divide-hairline">
            {readings.map((reading) => (
              <AskReading
                key={reading.id}
                reading={reading}
                disabled={pending}
                onRestore={restore}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}
