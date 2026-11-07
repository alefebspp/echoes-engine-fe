import { useTranslation } from "react-i18next";
import type { ScopeChip } from "./types";

interface ScopeChipsProps {
  chips: ScopeChip[];
  onRemove: (chip: ScopeChip) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

export function ScopeChips({ chips, onRemove, label, disabled = false, className }: ScopeChipsProps) {
  const { t } = useTranslation();
  if (chips.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-2 ${className ?? ""}`} aria-label={label}>
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            disabled={disabled}
            onClick={() => onRemove(chip)}
            aria-label={t("ask.removeChip", { label: chip.label })}
            className="inline-flex items-center gap-1.5 rounded-pill border border-[rgba(246,193,119,0.45)] bg-[var(--trace-amber-soft)] px-2.5 py-1 font-mono text-micro text-trace transition-colors duration-150 hover:border-trace disabled:cursor-not-allowed disabled:opacity-50"
          >
            {chip.label}
            <span aria-hidden="true">×</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
