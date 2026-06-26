import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { loginSchema } from "./schemas";
import type { LoginInput } from "./schemas";
import { login } from "./api";
import { bootstrapSession } from "@/shared/auth/bootstrapSession";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { FormBanner } from "@/shared/components/FormBanner";
import { toUserMessage } from "@/shared/api/apiErrors";

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
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
      eyebrow="Sign in"
      title="Return to your observatory"
      description="Pick up where your captured activity left off."
      footer={
        <>
          No account yet? <Link to="/register">Create one</Link>.
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
          label="Email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...field("email")}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Your password"
          error={errors.password?.message}
          {...field("password")}
        />

        <Button
          type="submit"
          block
          isLoading={mutation.isPending}
          loadingText="Signing in…"
        >
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
