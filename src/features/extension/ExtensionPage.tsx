import { useTranslation } from "react-i18next";
import { PageHeader } from "@/shared/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/shared/components/Card";
import { env } from "@/shared/config/env";
import { CopyButton } from "./CopyButton";
import { downloadLinkClasses } from "./downloadLink";

const EXTENSIONS_URL = "chrome://extensions";

const STEPS = ["unzip", "open", "devMode", "load", "signIn"] as const;
const NOTES = ["warning", "updates", "browsers"] as const;
const PRIVACY = ["captures", "never", "control"] as const;

/** Install guide for the unpublished browser extension (developer mode). */
export function ExtensionPage() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        eyebrow={t("extension.eyebrow")}
        title={t("extension.title")}
        description={t("extension.description")}
        actions={
          <div className="flex flex-col items-start gap-1.5">
            <a href={env.extensionDownloadUrl} className={downloadLinkClasses} download>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M3 13h10" />
              </svg>
              {t("extension.download")}
            </a>
            <span className="font-mono text-micro text-ink_text-faint">
              {t("extension.downloadHint")}
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_minmax(280px,360px)]">
        <Card>
          <CardHeader
            as="h2"
            title={t("extension.stepsTitle")}
            subtitle={t("extension.stepsSubtitle")}
          />
          <CardBody>
            <ol className="flex flex-col gap-5">
              {STEPS.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-hairline-strong font-mono text-micro text-signal tnum">
                    {index + 1}
                  </span>
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="text-sm font-medium text-lilac">
                      {t(`extension.steps.${step}.title`)}
                    </p>
                    <p className="text-sm text-ink_text-muted">
                      {t(`extension.steps.${step}.body`)}
                    </p>
                    {step === "open" && (
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <code className="rounded-sm border border-hairline bg-surface-0 px-2.5 py-1 font-mono text-sm text-ink_text-bright">
                          {EXTENSIONS_URL}
                        </code>
                        <CopyButton value={EXTENSIONS_URL} label={t("extension.copyLabel")} />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-hairline pt-4 text-sm text-ink_text-muted">
              {t("extension.afterInstall")}
            </p>
          </CardBody>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader as="h2" title={t("extension.notesTitle")} />
            <CardBody>
              <BulletList items={NOTES.map((note) => t(`extension.notes.${note}`))} tone="trace" />
            </CardBody>
          </Card>
          <Card>
            <CardHeader as="h2" title={t("extension.privacyTitle")} />
            <CardBody>
              <BulletList
                items={PRIVACY.map((item) => t(`extension.privacy.${item}`))}
                tone="signal"
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

function BulletList({ items, tone }: { items: string[]; tone: "trace" | "signal" }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm text-ink_text-muted">
          <span
            className={`mt-[0.45rem] size-1.5 shrink-0 rounded-full ${tone === "trace" ? "bg-trace" : "bg-signal"}`}
            aria-hidden="true"
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
