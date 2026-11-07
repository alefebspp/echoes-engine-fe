import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card } from "@/shared/components/Card";
import { downloadLinkClasses } from "./downloadLink";

/** Points a user with no captured events at the extension install guide. */
export function ConnectExtensionCard() {
  const { t } = useTranslation();

  return (
    <Card className="border-memory/40">
      <div className="flex flex-col gap-4 px-[1.35rem] py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-[60ch] flex-col gap-1.5">
          <span className="eyebrow">{t("extension.connect.eyebrow")}</span>
          <h2 className="font-display text-h3 font-semibold text-ink_text-bright">
            {t("extension.connect.title")}
          </h2>
          <p className="text-sm text-ink_text-muted">{t("extension.connect.body")}</p>
        </div>
        <Link to="/app/extension" className={`${downloadLinkClasses} shrink-0 self-start sm:self-center`}>
          {t("extension.connect.cta")}
        </Link>
      </div>
    </Card>
  );
}
