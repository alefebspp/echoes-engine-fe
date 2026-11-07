import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SignalRibbon } from "@/shared/components/SignalRibbon";
import { Wordmark } from "@/shared/components/Wordmark";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { sampleRibbon } from "@/shared/utils/sampleRibbon";

interface AuthLayoutProps {
  eyebrow: string;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

const sample = sampleRibbon(56);

export function AuthLayout({ eyebrow, title, description, children, footer }: AuthLayoutProps) {
  const { t } = useTranslation();
  return (
    <main className="mx-auto flex min-h-screen max-w-shell flex-col px-5 py-6 lg:px-8">
      <header className="flex items-center justify-between">
        <Link to="/" aria-label={t("brand.home")}>
          <Wordmark />
        </Link>
        <div className="flex items-center gap-4">
          <span className="eyebrow hidden sm:block">{t("brand.tagline")}</span>
          <LanguageSwitcher />
        </div>
      </header>

      <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.05fr_minmax(360px,440px)]">
        {/* Metaphor panel — the ribbon as a promise, not real data. */}
        <section className="hidden flex-col gap-6 lg:flex" aria-hidden="true">
          <div className="panel flex flex-col gap-5 p-7">
            <span className="eyebrow">{t("auth.traceEyebrow")}</span>
            <SignalRibbon data={sample} height={132} caption={t("auth.ribbonCaption")} />
            <p className="max-w-[46ch] text-sm text-ink_text-muted">
              {t("auth.traceBody")}
            </p>
          </div>
        </section>

        <section className="w-full">
          <div className="flex flex-col gap-2">
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="text-h1">{title}</h1>
            <p className="text-ink_text-muted">{description}</p>
          </div>
          <div className="mt-7">{children}</div>
          <p className="mt-6 text-sm text-ink_text-muted">{footer}</p>
        </section>
      </div>
    </main>
  );
}
