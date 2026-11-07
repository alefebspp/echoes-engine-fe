import { useId } from "react";
import { Button } from "@/shared/components/Button";
import { AnswerText, sourceDomId } from "./AnswerText";
import { ScopeChips } from "./ScopeChips";
import { hasFilters, refusalMessage, scopeChips, scopeWithout } from "./scope";
import { formatOccurred, listSources } from "./sources";
import type { ListedSource } from "./sources";
import type { AskScope, ReadingRecord } from "./types";

interface AskReadingProps {
  reading: ReadingRecord;
  disabled?: boolean;
  onRestore: (question: string, scope: AskScope) => void;
}

export function AskReading({ reading, disabled = false, onRestore }: AskReadingProps) {
  const pagesId = useId();
  const sources = listSources(reading.response);
  const chips = scopeChips(reading.scope);
  const { response } = reading;

  return (
    <article
      id={`reading-${reading.id}`}
      tabIndex={-1}
      aria-labelledby={`reading-q-${reading.id}`}
      className="scroll-mt-24 py-8 first:pt-0 last:pb-0 focus:outline-none"
    >
      <h2
        id={`reading-q-${reading.id}`}
        className="break-words font-display text-h2 font-medium leading-snug tracking-[-0.02em] text-ink_text-bright"
      >
        {reading.question}
      </h2>

      <ScopeChips
        className="mt-3"
        chips={chips}
        label="Filters on this question"
        disabled={disabled}
        onRemove={(chip) => onRestore(reading.question, scopeWithout(reading.scope, chip))}
      />

      {response.mode === "answer" && response.answer && (
        <div className="mt-4">
          <AnswerText text={response.answer} sources={sources} turnId={reading.id} />
        </div>
      )}

      {response.mode === "snippets_only" && (
        <p className="mt-4 max-w-[62ch] font-mono text-sm leading-relaxed text-ink_text-muted">
          {response.answer ?? "A written summary is unavailable. These pages still matched."}
        </p>
      )}

      {response.mode === "refused" && (
        <div className="mt-4">
          <p className="max-w-[52ch] text-ink_text-muted">{refusalMessage(reading.scope)}</p>
          {hasFilters(reading.scope) && (
            <Button
              type="button"
              variant="secondary"
              className="mt-3"
              disabled={disabled}
              onClick={() => onRestore(reading.question, { from: "", to: "", tags: [] })}
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {sources.length > 0 && (
        <div className="mt-6">
          <h3 id={pagesId} className="eyebrow mb-1">
            Pages
          </h3>
          <ol aria-labelledby={pagesId} className="mt-1 list-none divide-y divide-hairline">
            {sources.map((source) => (
              <SourceRow key={`${source.eventId}-${source.n}`} source={source} turnId={reading.id} />
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}

function SourceRow({ source, turnId }: { source: ListedSource; turnId: string }) {
  return (
    <li
      id={sourceDomId(turnId, source.n)}
      tabIndex={-1}
      className="scroll-mt-24 grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 rounded-sm py-3.5 transition-colors duration-150 focus:bg-[var(--trace-amber-soft)] focus:outline-none"
    >
      <span className="pt-0.5 font-mono text-sm font-medium text-trace" aria-hidden="true">
        {source.n}
      </span>
      <div className="min-w-0">
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="break-words font-display text-h3 font-medium leading-snug"
          >
            {source.title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <p className="break-words font-display text-h3 font-medium leading-snug text-ink_text-bright">
            {source.title}
          </p>
        )}
        <SourceMeta source={source} />
      </div>
    </li>
  );
}

function SourceMeta({ source }: { source: ListedSource }) {
  const bits: Array<{ key: string; text: string; emphasized?: boolean }> = [];
  if (source.host) bits.push({ key: "host", text: source.host });
  bits.push({ key: "when", text: formatOccurred(source.occurredAt) });
  if (source.closeMatch) bits.push({ key: "match", text: "close match", emphasized: true });

  return (
    <p className="mt-1 font-mono text-micro leading-relaxed text-ink_text-faint">
      {bits.map((bit, index) => (
        <span key={bit.key}>
          {index > 0 && <span aria-hidden="true"> · </span>}
          <span className={bit.emphasized ? "text-ink_text-muted" : undefined}>{bit.text}</span>
        </span>
      ))}
    </p>
  );
}
