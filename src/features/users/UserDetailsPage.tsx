import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/shared/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/shared/components/Card";
import { LoadingBlock, ErrorBlock } from "@/shared/components/Feedback";
import { Button } from "@/shared/components/Button";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/shared/components/Toast";
import { toUserMessage } from "@/shared/api/apiErrors";
import { formatFullDate } from "@/shared/utils/formatDate";
import { fetchUser, deleteUser, userKeys } from "./api";
import { UserEditForm } from "./UserEditForm";
import { AccountMeta } from "./AccountMeta";

export function UserDetailsPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const [confirming, setConfirming] = useState(false);

  const query = useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: Boolean(id),
  });

  const remove = useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: () => {
      notify("User removed.", "ok");
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
      navigate("/app/users", { replace: true });
    },
  });

  return (
    <>
      <PageHeader
        eyebrow={<Link to="/app/users">← Back to users</Link>}
        title={query.data ? `${query.data.name} ${query.data.surname}` : "User"}
        description={query.data?.email}
        actions={
          query.data && (
            <Button variant="danger" onClick={() => setConfirming(true)}>
              Remove user
            </Button>
          )
        }
      />

      {query.isLoading ? (
        <Card>
          <CardBody>
            <LoadingBlock label="Loading user…" />
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
            <CardHeader title="Edit user" subtitle="Update account details" />
            <CardBody>
              <UserEditForm user={query.data} />
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

      <ConfirmDialog
        open={confirming}
        title="Remove this user?"
        description={
          query.data
            ? `${query.data.name} ${query.data.surname} (${query.data.email}) will be permanently deleted. This can't be undone.`
            : ""
        }
        confirmLabel="Remove user"
        isWorking={remove.isPending}
        onConfirm={() => remove.mutate()}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}
