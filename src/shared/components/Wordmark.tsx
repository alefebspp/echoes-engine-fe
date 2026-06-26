interface WordmarkProps {
  /** Hide the text, keeping only the mark (for collapsed nav). */
  markOnly?: boolean;
  className?: string;
}

/**
 * The brand mark: a point emitting concentric arcs — a captured signal echoing
 * outward. It doubles as the favicon motif.
 */
export function Wordmark({ markOnly = false, className }: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="8" cy="13" r="2.4" fill="var(--signal-cyan)" />
        <path
          d="M12.5 8.5a6.4 6.4 0 0 1 0 9"
          stroke="var(--memory-blue)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16.5 5.5a11 11 0 0 1 0 15"
          stroke="var(--memory-blue)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M20.5 2.8a15.4 15.4 0 0 1 0 20.4"
          stroke="var(--soft-lilac)"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.25"
        />
      </svg>
      {!markOnly && (
        <span className="font-display text-[1.05rem] font-semibold tracking-tight text-ink_text-bright">
          Echoes<span className="text-memory"> Engine</span>
        </span>
      )}
    </span>
  );
}
