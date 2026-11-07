import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Wordmark } from "@/shared/components/Wordmark";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <main className="mx-auto flex min-h-screen max-w-shell flex-col px-5 lg:px-8">
      <header className="py-6">
        <Link to="/" aria-label={t("brand.home")}>
          <Wordmark />
        </Link>
      </header>
      <div className="flex flex-1 flex-col items-start justify-center gap-4 py-12">
        <span className="eyebrow">{t("notFound.eyebrow")}</span>
        <h1 className="max-w-[20ch] text-h1">
          {t("notFound.title")}
        </h1>
        <p className="max-w-[48ch] text-ink_text-muted">
          {t("notFound.description")}
        </p>
        <Link
          to="/app/dashboard"
          className="mt-2 rounded-sm bg-memory px-5 py-3 font-display text-sm font-semibold text-ink transition-[transform,background-color] hover:-translate-y-px hover:bg-[#95b8ff]"
        >
          {t("notFound.cta")}
        </Link>
      </div>
    </main>
  );
}
