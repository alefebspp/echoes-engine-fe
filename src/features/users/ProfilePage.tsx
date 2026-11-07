import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/shared/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/shared/components/Card";
import { LoadingBlock, ErrorBlock } from "@/shared/components/Feedback";
import { toUserMessage } from "@/shared/api/apiErrors";
import { formatFullDate } from "@/shared/utils/formatDate";
import { fetchCurrentUser, userKeys } from "./api";
import { UserEditForm } from "./UserEditForm";
import { AccountMeta } from "./AccountMeta";

export function ProfilePage() {
  const { t } = useTranslation();
  const query = useQuery({
    queryKey: userKeys.me,
    queryFn: fetchCurrentUser,
  });

  return (
    <>
      <PageHeader
        eyebrow={t("profile.eyebrow")}
        title={t("profile.title")}
        description={t("profile.description")}
      />

      {query.isLoading ? (
        <Card>
          <CardBody>
            <LoadingBlock label={t("profile.loading")} />
          </CardBody>
        </Card>
      ) : query.isError ? (
        <Card>
          <CardBody>
            <ErrorBlock message={toUserMessage(query.error)} onRetry={() => query.refetch()} />
          </CardBody>
        </Card>
      ) : query.data ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_minmax(280px,340px)]">
          <Card>
            <CardHeader title={t("profile.editTitle")} subtitle={t("profile.editSubtitle")} />
            <CardBody>
              <UserEditForm user={query.data} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title={t("profile.accountTitle")} subtitle={t("profile.accountSubtitle")} />
            <CardBody>
              <AccountMeta
                rows={[
                  { label: t("profile.userId"), value: query.data.id, mono: true },
                  { label: t("profile.created"), value: formatFullDate(query.data.createdAt) },
                  { label: t("profile.updated"), value: formatFullDate(query.data.updatedAt) },
                ]}
              />
            </CardBody>
          </Card>
        </div>
      ) : null}
    </>
  );
}
