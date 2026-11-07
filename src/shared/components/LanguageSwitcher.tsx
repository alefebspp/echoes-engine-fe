import { useTranslation } from "react-i18next";
import { LANGUAGES, changeLanguage, currentLanguage } from "@/shared/i18n";

const SHORT_LABEL = { en: "EN", "pt-BR": "PT" } as const;

/** Compact segmented control for the interface language. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { t } = useTranslation();
  const active = currentLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-sm border border-hairline bg-surface-0 p-1 ${className ?? ""}`}
      role="group"
      aria-label={t("language.label")}
    >
      {LANGUAGES.map((language) => {
        const selected = language === active;
        return (
          <button
            key={language}
            type="button"
            lang={language}
            onClick={() => void changeLanguage(language)}
            aria-pressed={selected}
            aria-label={t(`language.${language}`)}
            title={t(`language.${language}`)}
            className={`rounded-[4px] px-2 py-1 font-mono text-micro font-medium uppercase tracking-[0.08em] transition-colors duration-150 ${
              selected
                ? "bg-memory text-ink"
                : "text-ink_text-muted hover:bg-surface-2 hover:text-lilac"
            }`}
          >
            {SHORT_LABEL[language]}
          </button>
        );
      })}
    </div>
  );
}
