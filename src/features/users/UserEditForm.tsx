import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { FormBanner } from "@/shared/components/FormBanner";
import { useToast } from "@/shared/components/Toast";
import { toUserMessage } from "@/shared/api/apiErrors";
import { profileSchema, diffProfile } from "./schemas";
import type { ProfileInput } from "./schemas";
import { updateUser, userKeys } from "./api";
import type { User } from "./types";
import { authStore } from "@/shared/auth/authStore";

interface Props {
  user: User;
  /** Label tweaks when editing your own profile vs. another user. */
  selfEdit?: boolean;
}

export function UserEditForm({ user, selfEdit = false }: Props) {
  const queryClient = useQueryClient();
  const { notify } = useToast();

  const {
    register: field,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ProfileInput) => {
      const changes = diffProfile(values, user);
      if (Object.keys(changes).length === 0) {
        return Promise.reject(new Error("Change at least one field before saving."));
      }
      return updateUser(user.id, changes);
    },
    onSuccess: (updated) => {
      notify(selfEdit ? "Profile saved." : "User updated.", "ok");
      queryClient.setQueryData(userKeys.detail(user.id), updated);
      if (selfEdit) {
        queryClient.setQueryData(userKeys.me, updated);
        authStore.setSession(updated);
      }
      void queryClient.invalidateQueries({ queryKey: userKeys.all });
      reset({
        name: updated.name,
        surname: updated.surname,
        email: updated.email,
        password: "",
      });
    },
    onError: (error) => {
      if (error instanceof Error && error.message.startsWith("Change at least one")) {
        setError("root", { message: error.message });
      }
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      {(mutation.isError || errors.root) && (
        <FormBanner tone="error">
          {errors.root?.message ?? toUserMessage(mutation.error)}
        </FormBanner>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input id="name" label="First name" error={errors.name?.message} {...field("name")} />
        <Input
          id="surname"
          label="Surname"
          error={errors.surname?.message}
          {...field("surname")}
        />
      </div>
      <Input
        id="email"
        type="email"
        label="Email"
        autoComplete="email"
        error={errors.email?.message}
        {...field("email")}
      />
      <Input
        id="password"
        type="password"
        label="New password"
        optional
        autoComplete="new-password"
        placeholder="Leave blank to keep current"
        hint="8–72 characters."
        error={errors.password?.message}
        {...field("password")}
      />

      <div className="flex items-center gap-2.5">
        <Button type="submit" isLoading={mutation.isPending} loadingText="Saving…">
          Save changes
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            reset({
              name: user.name,
              surname: user.surname,
              email: user.email,
              password: "",
            })
          }
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
