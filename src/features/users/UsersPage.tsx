import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/shared/components/PageHeader";
import { Card, CardBody } from "@/shared/components/Card";
import { LoadingBlock, ErrorBlock } from "@/shared/components/Feedback";
import { EmptyState } from "@/shared/components/EmptyState";
import { FormBanner } from "@/shared/components/FormBanner";
import { ConfirmDialog } from "@/shared/components/ConfirmDialog";
import { useToast } from "@/shared/components/Toast";
import { toUserMessage } from "@/shared/api/apiErrors";
import { formatFullDate } from "@/shared/utils/formatDate";
import { fetchUsers, deleteUser, userKeys } from "./api";
import type { User } from "./types";

export function UsersPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const [pendingDelete, setPendingDelete] = useState<User | null>(null);

  const query = useQuery({ queryKey: userKeys.all, queryFn: fetchUsers });

  const remove = useMutation({
    mutationFn: (user: User) => deleteUser(user.id),
    onSuccess: (_data, user) => {
      notify(`Removed ${user.name} ${user.surname}.`, "ok");
      setPendingDelete(null);
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  return (
    <>
      <PageHeader
        eyebrow="Internal · no roles yet"
        title="Users"
        description="A management view of every registered account. Roles and permissions aren't in the backend yet, so treat this as an internal area."
      />

      <Card>
        <CardBody>
          {query.isLoading ? (
            <LoadingBlock label="Loading users…" />
          ) : query.isError ? (
            <ErrorBlock message={toUserMessage(query.error)} onRetry={() => query.refetch()} />
          ) : !query.data || query.data.length === 0 ? (
            <EmptyState
              title="No users yet"
              description="Accounts created through registration will appear here."
              showBaseline={false}
            />
          ) : (
            <>
              {remove.isError && (
                <div className="mb-4">
                  <FormBanner tone="error">{toUserMessage(remove.error)}</FormBanner>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-hairline text-left">
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th className="hidden md:table-cell">Joined</Th>
                      <th className="px-3 py-2.5">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {query.data.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-hairline/60 transition-colors last:border-0 hover:bg-surface-1/60"
                      >
                        <td className="px-3 py-3">
                          <Link
                            to={`/app/users/${user.id}`}
                            className="font-medium text-lilac hover:text-signal"
                          >
                            {user.name} {user.surname}
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-ink_text-muted">{user.email}</td>
                        <td className="hidden px-3 py-3 text-ink_text-muted md:table-cell">
                          {formatFullDate(user.createdAt)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setPendingDelete(user)}
                            className="rounded-sm px-2 py-1 text-sm text-ink_text-muted transition-colors hover:bg-[var(--danger-soft)] hover:text-danger"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remove this user?"
        description={
          pendingDelete
            ? `${pendingDelete.name} ${pendingDelete.surname} (${pendingDelete.email}) will be permanently deleted. This can't be undone.`
            : ""
        }
        confirmLabel="Remove user"
        isWorking={remove.isPending}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete)}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-3 py-2.5 font-mono text-micro font-medium uppercase tracking-[0.1em] text-ink_text-faint ${className ?? ""}`}
    >
      {children}
    </th>
  );
}
