import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthLayout } from "./AuthLayout";
import { registerSchema } from "./schemas";
import type { RegisterInput } from "./schemas";
import { login, register as registerUser } from "./api";
import { bootstrapSession } from "@/shared/auth/bootstrapSession";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { FormBanner } from "@/shared/components/FormBanner";
import { toUserMessage } from "@/shared/api/apiErrors";
import { useFieldError } from "@/shared/i18n/useFieldError";

export function RegisterPage() {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const navigate = useNavigate();

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", surname: "", email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: async (values: RegisterInput) => {
      await registerUser(values);
      await login({ email: values.email, password: values.password });
    },
    onSuccess: async () => {
      await bootstrapSession();
      navigate("/app/dashboard", { replace: true });
    },
  });

  return (
    <AuthLayout
      eyebrow={t("auth.register.eyebrow")}
      title={t("auth.register.title")}
      description={t("auth.register.description")}
      footer={
        <>
          {t("auth.register.haveAccount")} <Link to="/login">{t("auth.register.signIn")}</Link>.
        </>
      }
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        noValidate
      >
        {mutation.isError && (
          <FormBanner tone="error">{toUserMessage(mutation.error)}</FormBanner>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="name"
            label={t("auth.register.firstName")}
            autoComplete="given-name"
            placeholder={t("auth.register.firstNamePlaceholder")}
            error={fieldError(errors.name?.message)}
            {...field("name")}
          />
          <Input
            id="surname"
            label={t("auth.register.surname")}
            autoComplete="family-name"
            placeholder={t("auth.register.surnamePlaceholder")}
            error={fieldError(errors.surname?.message)}
            {...field("surname")}
          />
        </div>
        <Input
          id="email"
          type="email"
          label={t("auth.email")}
          autoComplete="email"
          placeholder={t("auth.register.emailPlaceholder")}
          error={fieldError(errors.email?.message)}
          {...field("email")}
        />
        <Input
          id="password"
          type="password"
          label={t("auth.password")}
          autoComplete="new-password"
          placeholder={t("auth.register.passwordPlaceholder")}
          hint={t("auth.register.passwordHint")}
          error={fieldError(errors.password?.message)}
          {...field("password")}
        />

        <Button
          type="submit"
          block
          isLoading={mutation.isPending}
          loadingText={t("auth.register.submitting")}
        >
          {t("auth.register.submit")}
        </Button>
      </form>
    </AuthLayout>
  );
}
