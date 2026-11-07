import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthLayout } from "./AuthLayout";
import { loginSchema } from "./schemas";
import type { LoginInput } from "./schemas";
import { login } from "./api";
import { bootstrapSession } from "@/shared/auth/bootstrapSession";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { FormBanner } from "@/shared/components/FormBanner";
import { toUserMessage } from "@/shared/api/apiErrors";
import { useFieldError } from "@/shared/i18n/useFieldError";

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as LocationState | null)?.from?.pathname ?? "/app/dashboard";

  const {
    register: field,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await bootstrapSession();
      navigate(redirectTo, { replace: true });
    },
  });

  return (
    <AuthLayout
      eyebrow={t("auth.login.eyebrow")}
      title={t("auth.login.title")}
      description={t("auth.login.description")}
      footer={
        <>
          {t("auth.login.noAccount")} <Link to="/register">{t("auth.login.createOne")}</Link>.
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

        <Input
          id="email"
          type="email"
          label={t("auth.email")}
          autoComplete="email"
          placeholder={t("auth.login.emailPlaceholder")}
          error={fieldError(errors.email?.message)}
          {...field("email")}
        />
        <Input
          id="password"
          type="password"
          label={t("auth.password")}
          autoComplete="current-password"
          placeholder={t("auth.login.passwordPlaceholder")}
          error={fieldError(errors.password?.message)}
          {...field("password")}
        />

        <Button
          type="submit"
          block
          isLoading={mutation.isPending}
          loadingText={t("auth.login.submitting")}
        >
          {t("auth.login.submit")}
        </Button>
      </form>
    </AuthLayout>
  );
}
