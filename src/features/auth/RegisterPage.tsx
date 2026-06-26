import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import { registerSchema } from "./schemas";
import type { RegisterInput } from "./schemas";
import { login, register as registerUser } from "./api";
import { bootstrapSession } from "@/shared/auth/bootstrapSession";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { FormBanner } from "@/shared/components/FormBanner";
import { toUserMessage } from "@/shared/api/apiErrors";

export function RegisterPage() {
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
      eyebrow="Create account"
      title="Start your memory observatory"
      description="Register to begin turning captured activity into legible signals."
      footer={
        <>
          Already have an account? <Link to="/login">Sign in</Link>.
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
            label="First name"
            autoComplete="given-name"
            placeholder="Jane"
            error={errors.name?.message}
            {...field("name")}
          />
          <Input
            id="surname"
            label="Surname"
            autoComplete="family-name"
            placeholder="Doe"
            error={errors.surname?.message}
            {...field("surname")}
          />
        </div>
        <Input
          id="email"
          type="email"
          label="Email"
          autoComplete="email"
          placeholder="jane@example.com"
          error={errors.email?.message}
          {...field("email")}
        />
        <Input
          id="password"
          type="password"
          label="Password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          hint="Use 8–72 characters."
          error={errors.password?.message}
          {...field("password")}
        />

        <Button
          type="submit"
          block
          isLoading={mutation.isPending}
          loadingText="Creating account…"
        >
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
