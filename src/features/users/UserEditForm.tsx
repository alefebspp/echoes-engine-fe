import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { FormBanner } from "@/shared/components/FormBanner";
import { useToast } from "@/shared/components/Toast";
import { toUserMessage } from "@/shared/api/apiErrors";
import { useFieldError } from "@/shared/i18n/useFieldError";
import { profileSchema, diffProfile } from "./schemas";
import type { ProfileInput } from "./schemas";
import { updateUser, userKeys } from "./api";
import type { User } from "./types";
import { authStore } from "@/shared/auth/authStore";

interface Props {
  user: User;
}

/** Edits the signed-in user's own profile. */
export function UserEditForm({ user }: Props) {
  const { t } = useTranslation();
  const fieldError = useFieldError();
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
    mutationFn: (changes: ReturnType<typeof diffProfile>) => updateUser(user.id, changes),
    onSuccess: (updated) => {
      notify(t("profile.form.saved"), "ok");
      queryClient.setQueryData(userKeys.me, updated);
      authStore.setSession(updated);
      reset({
        name: updated.name,
        surname: updated.surname,
        email: updated.email,
        password: "",
      });
    },
  });

  const submit = handleSubmit((values) => {
    const changes = diffProfile(values, user);
    if (Object.keys(changes).length === 0) {
      setError("root", { message: "profile.form.noChanges" });
      return;
    }
    mutation.mutate(changes);
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
      {(mutation.isError || errors.root) && (
        <FormBanner tone="error">
          {fieldError(errors.root?.message) ?? toUserMessage(mutation.error)}
        </FormBanner>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="name"
          label={t("profile.form.firstName")}
          error={fieldError(errors.name?.message)}
          {...field("name")}
        />
        <Input
          id="surname"
          label={t("profile.form.surname")}
          error={fieldError(errors.surname?.message)}
          {...field("surname")}
        />
      </div>
      <Input
        id="email"
        type="email"
        label={t("profile.form.email")}
        autoComplete="email"
        error={fieldError(errors.email?.message)}
        {...field("email")}
      />
      <Input
        id="password"
        type="password"
        label={t("profile.form.newPassword")}
        optional
        autoComplete="new-password"
        placeholder={t("profile.form.passwordPlaceholder")}
        hint={t("profile.form.passwordHint")}
        error={fieldError(errors.password?.message)}
        {...field("password")}
      />

      <div className="flex items-center gap-2.5">
        <Button type="submit" isLoading={mutation.isPending} loadingText={t("profile.form.saving")}>
          {t("profile.form.save")}
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
          {t("profile.form.reset")}
        </Button>
      </div>
    </form>
  );
}
