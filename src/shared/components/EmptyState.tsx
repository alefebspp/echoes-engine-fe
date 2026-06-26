import type { ReactNode } from "react";

interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  /** A quiet flat baseline — the signal ribbon with nothing captured yet. */
  showBaseline?: boolean;
}

export function EmptyState({
  title,
  description,
  action,
  showBaseline = true,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2.5 px-5 py-7 text-center text-ink_text-muted">
      {showBaseline && (
        <svg
          width="120"
          height="20"
          viewBox="0 0 120 20"
          fill="none"
          aria-hidden="true"
          className="mb-1 opacity-60"
        >
          <line
            x1="2"
            y1="10"
            x2="118"
            y2="10"
            stroke="var(--memory-blue)"
            strokeWidth="1.5"
            strokeDasharray="2 5"
            strokeLinecap="round"
          />
        </svg>
      )}
      <p className="font-display text-h3 font-semibold text-lilac">{title}</p>
      {description && <p className="max-w-[40ch] text-sm">{description}</p>}
      {action && <div className="mt-1.5">{action}</div>}
    </div>
  );
}
