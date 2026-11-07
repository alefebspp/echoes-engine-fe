import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/Button";
import { FieldError } from "@/shared/components/FieldError";
import { FormBanner } from "@/shared/components/FormBanner";
import { Input } from "@/shared/components/Input";
import { rateLimitMessage } from "./askErrors";
import { ScopeChips } from "./ScopeChips";
import { QUESTION_MAX, TAG_MAX, scopeChips, scopeWithout } from "./scope";
import { formatNumber } from "@/shared/utils/formatNumber";
import type { AskScope, Notice } from "./types";

const fieldLabel =
  "font-mono text-micro font-medium uppercase tracking-[0.14em] text-ink_text-muted";

const questionField =
  "min-h-[7.5rem] w-full resize-y rounded-sm border bg-surface-0 px-[0.85rem] py-[0.68rem] text-[1.0625rem] leading-relaxed text-ink_text-bright transition-[border-color,box-shadow] duration-150 ease-ease placeholder:text-ink_text-faint hover:enabled:border-memory focus:border-signal focus:shadow-[0_0_0_3px_var(--signal-cyan-soft)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-60";

interface AskComposerProps {
  question: string;
  scope: AskScope;
  scopeOpen: boolean;
  pending: boolean;
  notice: Notice | null;
  questionRef: RefObject<HTMLTextAreaElement>;
  onQuestionChange: (value: string) => void;
  onScopeChange: (scope: AskScope) => void;
  onScopeOpen: (open: boolean) => void;
  onSubmit: () => void;
  onRateLimitDone: () => void;
}

export function AskComposer({
  question,
  scope,
  scopeOpen,
  pending,
  notice,
  questionRef,
  onQuestionChange,
  onScopeChange,
  onScopeOpen,
  onSubmit,
  onRateLimitDone,
}: AskComposerProps) {
  const { t } = useTranslation();
  const [draftTag, setDraftTag] = useState("");
  const [tagNote, setTagNote] = useState<string | undefined>();
  const fieldError = notice?.kind === "field" ? notice.message : undefined;
  const rateLimited = notice?.kind === "rate";
  const trimmedLength = question.trim().length;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  function handleQuestionKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      if (!pending && !rateLimited) onSubmit();
    }
  }

  function addTags() {
    const parts = draftTag
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length === 0) return;

    const next = [...scope.tags];
    let hitLimit = false;
    for (const tag of parts) {
      if (next.includes(tag)) continue;
      if (next.length >= TAG_MAX) {
        hitLimit = true;
        break;
      }
      next.push(tag);
    }

    onScopeChange({ ...scope, tags: next });
    setDraftTag("");
    setTagNote(hitLimit ? t("ask.validation.tagLimit") : undefined);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate aria-busy={pending || undefined}>
      <div className="flex flex-col gap-1.5">
        <label className={fieldLabel} htmlFor="ask-question">
          {t("ask.question")}
        </label>
        <textarea
          id="ask-question"
          ref={questionRef}
          value={question}
          onChange={(event) => onQuestionChange(event.target.value)}
          onKeyDown={handleQuestionKeyDown}
          placeholder={t("ask.placeholder")}
          maxLength={QUESTION_MAX}
          rows={3}
          disabled={pending}
          autoFocus
          autoComplete="off"
          aria-invalid={fieldError ? true : undefined}
          aria-describedby={fieldError ? "ask-question-hint ask-question-error" : "ask-question-hint"}
          className={`${questionField} ${fieldError ? "border-danger focus:border-danger focus:shadow-[0_0_0_3px_var(--danger-soft)]" : "border-hairline-strong"}`}
        />
        <p id="ask-question-hint" className="sr-only">
          {t("ask.questionHint")}
        </p>
        {fieldError && <FieldError id="ask-question-error" message={fieldError} />}
      </div>

      {notice?.kind === "server" && <FormBanner tone="error">{notice.message}</FormBanner>}
      {notice?.kind === "rate" && (
        <RateLimitNotice until={notice.until} onDone={onRateLimitDone} />
      )}
      {notice?.kind === "ready" && (
        <p aria-live="polite" className="font-mono text-sm text-signal">
          {t("ask.ready")}
        </p>
      )}

      <ScopeChips
        chips={scopeChips(scope)}
        label={t("ask.filtersNext")}
        disabled={pending}
        onRemove={(chip) => {
          onScopeChange(scopeWithout(scope, chip));
          setTagNote(undefined);
        }}
      />

      {scopeOpen && (
        <fieldset id="ask-scope" disabled={pending} className="flex flex-col gap-4 border-t border-hairline pt-4">
          <legend className={fieldLabel}>{t("ask.onlyFrom")}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              id="ask-from"
              label={t("ask.start")}
              type="date"
              value={scope.from}
              onChange={(event) => onScopeChange({ ...scope, from: event.target.value })}
              autoComplete="off"
              className="[color-scheme:dark]"
            />
            <Input
              id="ask-to"
              label={t("ask.end")}
              type="date"
              value={scope.to}
              onChange={(event) => onScopeChange({ ...scope, to: event.target.value })}
              autoComplete="off"
              className="[color-scheme:dark]"
            />
          </div>
          <Input
            id="ask-tag"
            label={t("ask.tag")}
            placeholder={t("ask.tagPlaceholder")}
            hint={
              scope.tags.length >= TAG_MAX
                ? t("ask.validation.tagLimit")
                : t("ask.tagHint")
            }
            error={tagNote}
            value={draftTag}
            disabled={scope.tags.length >= TAG_MAX}
            autoComplete="off"
            onChange={(event) => {
              setDraftTag(event.target.value);
              if (tagNote) setTagNote(undefined);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addTags();
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            className="self-start"
            disabled={draftTag.trim().length === 0 || scope.tags.length >= TAG_MAX}
            onClick={addTags}
          >
            {t("ask.addTag")}
          </Button>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          aria-expanded={scopeOpen}
          aria-controls={scopeOpen ? "ask-scope" : undefined}
          disabled={pending}
          onClick={() => onScopeOpen(!scopeOpen)}
        >
          {t("ask.narrow")}
        </Button>
        <div className="flex items-center gap-3">
          {trimmedLength >= 1600 && (
            <span className="font-mono text-micro text-ink_text-faint" aria-hidden="true">
              {formatNumber(trimmedLength)} / {formatNumber(QUESTION_MAX)}
            </span>
          )}
          <Button type="submit" disabled={pending || rateLimited}>
            {t("ask.submit")}
          </Button>
        </div>
      </div>

      <p
        className="flex min-h-[1.25rem] items-center gap-2 font-mono text-sm text-signal"
        aria-live="polite"
      >
        {pending && (
          <>
            <span
              className="size-1.5 shrink-0 animate-pulse rounded-full bg-signal"
              aria-hidden="true"
            />
            {t("ask.pending")}
          </>
        )}
      </p>
    </form>
  );
}

function RateLimitNotice({ until, onDone }: { until: number; onDone: () => void }) {
  const [now, setNow] = useState(() => Date.now());
  const done = useRef(false);

  useEffect(() => {
    done.current = false;
    const id = window.setInterval(() => {
      const next = Date.now();
      if (next >= until) {
        if (!done.current) {
          done.current = true;
          onDone();
        }
        return;
      }
      setNow(next);
    }, 1000);
    return () => window.clearInterval(id);
  }, [until, onDone]);

  const seconds = Math.max(0, Math.ceil((until - now) / 1000));

  return (
    <div className="rounded-sm border border-[rgba(246,193,119,0.45)] bg-[var(--trace-amber-soft)] px-3.5 py-3">
      <p className="sr-only" role="alert">
        {rateLimitMessage(60)}
      </p>
      <p aria-hidden="true" className="text-sm text-lilac">
        {rateLimitMessage(seconds)}
      </p>
    </div>
  );
}
