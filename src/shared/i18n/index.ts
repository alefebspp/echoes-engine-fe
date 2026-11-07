import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { ptBR } from "./locales/pt-BR";

export const LANGUAGES = ["en", "pt-BR"] as const;
export type Language = (typeof LANGUAGES)[number];

const STORAGE_KEY = "echoes.language";

function isLanguage(value: unknown): value is Language {
  return (LANGUAGES as readonly unknown[]).includes(value);
}

/** Saved choice first, then the browser's language, then English. */
function detectLanguage(): Language {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isLanguage(saved)) return saved;
  } catch {
    // Storage can be blocked (private mode); fall through to the browser language.
  }
  const preferred = typeof navigator !== "undefined" ? navigator.language : "";
  return preferred.toLowerCase().startsWith("pt") ? "pt-BR" : "en";
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    "pt-BR": { translation: ptBR },
  },
  lng: detectLanguage(),
  fallbackLng: "en",
  supportedLngs: LANGUAGES,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  initAsync: false,
  showSupportNotice: false,
});

function syncDocumentLanguage(language: string) {
  if (typeof document !== "undefined") document.documentElement.lang = language;
}

syncDocumentLanguage(i18n.language);
i18n.on("languageChanged", syncDocumentLanguage);

export function currentLanguage(): Language {
  return isLanguage(i18n.language) ? i18n.language : "en";
}

export async function changeLanguage(language: Language): Promise<void> {
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Not persisted, but the switch still applies for this visit.
  }
  await i18n.changeLanguage(language);
}

export { i18n };
