import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/shared/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/shared/components/Card";
import { LoadingBlock, ErrorBlock } from "@/shared/components/Feedback";
import { toUserMessage } from "@/shared/api/apiErrors";
import { formatFullDate } from "@/shared/utils/formatDate";
import { fetchCurrentUser, userKeys } from "./api";
import { UserEditForm } from "./UserEditForm";
import { AccountMeta } from "./AccountMeta";

export function ProfilePage() {
  const query = useQuery({
    queryKey: userKeys.me,
    queryFn: fetchCurrentUser,
  });

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="Your account"
        description="Update the name, email, and password tied to your observatory."
      />

      {query.isLoading ? (
        <Card>
          <CardBody>
            <LoadingBlock label="Loading your account…" />
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
            <CardHeader title="Edit profile" subtitle="Changes apply immediately" />
            <CardBody>
              <UserEditForm user={query.data} selfEdit />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Account" subtitle="Read-only details" />
            <CardBody>
              <AccountMeta
                rows={[
                  { label: "User id", value: query.data.id, mono: true },
                  { label: "Created", value: formatFullDate(query.data.createdAt) },
                  { label: "Updated", value: formatFullDate(query.data.updatedAt) },
                ]}
              />
            </CardBody>
          </Card>
        </div>
      ) : null}
    </>
  );
}
