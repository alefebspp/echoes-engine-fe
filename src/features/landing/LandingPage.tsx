import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Wordmark } from "@/shared/components/Wordmark";
import { SignalRibbon } from "@/shared/components/SignalRibbon";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { sampleRibbon } from "@/shared/utils/sampleRibbon";

const heroSample = sampleRibbon(64);

const captureNow = ["visits", "analytics", "ask"] as const;

const resolvesInto = [
  "eventsByDay",
  "topDomains",
  "categories",
  "sources",
  "byHour",
  "ribbon",
] as const;

const roadmap = ["search", "embeddings", "graph", "insights"] as const;

export function LandingPage() {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-shell px-5 lg:px-8">
      <header className="flex items-center justify-between py-6">
        <Wordmark />
        <nav className="flex items-center gap-2.5" aria-label={t("landing.accountNav")}>
          <LanguageSwitcher className="mr-1" />
          <Link
            to="/login"
            className="rounded-sm px-3.5 py-2 text-sm font-medium text-ink_text-muted transition-colors hover:text-lilac"
          >
            {t("landing.signIn")}
          </Link>
          <Link
            to="/register"
            className="rounded-sm bg-memory px-3.5 py-2 font-display text-sm font-semibold text-ink transition-[transform,background-color] hover:-translate-y-px hover:bg-[#95b8ff]"
          >
            {t("landing.createAccount")}
          </Link>
        </nav>
      </header>

      {/* Hero — the ribbon is the thesis. */}
      <section className="py-10 lg:py-16">
        <span className="eyebrow">{t("landing.eyebrow")}</span>
        <h1 className="mt-4 max-w-[18ch] text-display font-semibold leading-[1.02]">
          {t("landing.title")}
        </h1>
        <p className="mt-5 max-w-[56ch] text-lg text-ink_text-muted">
          {t("landing.lead")}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="rounded-sm bg-memory px-5 py-3 font-display text-sm font-semibold text-ink transition-[transform,background-color] hover:-translate-y-px hover:bg-[#95b8ff]"
          >
            {t("landing.createAccount")}
          </Link>
          <Link
            to="/login"
            className="rounded-sm border border-hairline-strong px-5 py-3 font-display text-sm font-semibold text-lilac transition-colors hover:border-memory hover:bg-surface-2"
          >
            {t("landing.signIn")}
          </Link>
        </div>

        <figure className="panel mt-12 flex flex-col gap-4 p-6 lg:p-8">
          <figcaption className="flex items-center justify-between">
            <span className="eyebrow">{t("landing.figureEyebrow")}</span>
            <span className="font-mono text-micro text-ink_text-faint">
              {t("landing.figureNote")}
            </span>
          </figcaption>
          <SignalRibbon data={heroSample} height={168} caption={t("auth.ribbonCaption")} />
          <p className="font-mono text-micro text-ink_text-faint">
            {t("landing.figureCaption")}
          </p>
        </figure>
      </section>

      {/* What it captures today — honest about current scope. */}
      <section className="border-t border-hairline py-12">
        <h2 className="text-h2">{t("landing.capture.title")}</h2>
        <p className="mt-2 max-w-[56ch] text-ink_text-muted">
          {t("landing.capture.lead")}
        </p>
        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
          {captureNow.map((item) => (
            <div key={item} className="panel flex flex-col gap-2 p-5">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-pill border border-signal/40 px-2 py-0.5 font-mono text-micro uppercase tracking-[0.1em] text-signal">
                <span className="size-1.5 rounded-full bg-signal" aria-hidden="true" />
                {t("landing.capture.live")}
              </span>
              <h3 className="text-h3 font-semibold">{t(`landing.capture.${item}.label`)}</h3>
              <p className="text-sm text-ink_text-muted">{t(`landing.capture.${item}.body`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What the dashboard resolves activity into. */}
      <section className="border-t border-hairline py-12">
        <h2 className="text-h2">{t("landing.resolves.title")}</h2>
        <p className="mt-2 max-w-[56ch] text-ink_text-muted">
          {t("landing.resolves.lead")}
        </p>
        <dl className="mt-7 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
          {resolvesInto.map((item, index) => (
            <div key={item} className="flex gap-4 border-t border-hairline pt-4">
              <span className="font-mono text-micro text-ink_text-faint tnum">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <dt className="font-display font-semibold text-lilac">
                  {t(`landing.resolves.${item}.k`)}
                </dt>
                <dd className="mt-0.5 text-sm text-ink_text-muted">
                  {t(`landing.resolves.${item}.v`)}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* Roadmap — clearly labeled as not-yet-built. */}
      <section className="border-t border-hairline py-12">
        <div className="panel flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div>
            <span className="eyebrow">{t("landing.roadmap.eyebrow")}</span>
            <h2 className="mt-3 text-h2">{t("landing.roadmap.title")}</h2>
            <p className="mt-2 max-w-[48ch] text-sm text-ink_text-muted">
              {t("landing.roadmap.lead")}
            </p>
          </div>
          <ul className="flex flex-col gap-2.5">
            {roadmap.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-ink_text-muted">
                <span
                  className="size-1.5 rounded-full border border-trace"
                  aria-hidden="true"
                />
                {t(`landing.roadmap.items.${item}`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="flex flex-col gap-3 border-t border-hairline py-8 sm:flex-row sm:items-center sm:justify-between">
        <Wordmark />
        <p className="font-mono text-micro text-ink_text-faint">
          {t("landing.footer")}
        </p>
      </footer>
    </div>
  );
}
