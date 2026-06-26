import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/shared/components/PageHeader";
import { Card, CardBody, CardHeader } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import { FormBanner } from "@/shared/components/FormBanner";
import { useToast } from "@/shared/components/Toast";
import { toUserMessage } from "@/shared/api/apiErrors";
import { dashboardKeys } from "@/features/dashboard/api";
import { testEventSchema } from "./schemas";
import type { TestEventInput } from "./schemas";
import { sendTestEvent } from "./api";

/** A `datetime-local`-ready string for "now", in the user's local time. */
function localNow(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 16);
}

export function SendTestEventPage() {
  const queryClient = useQueryClient();
  const { notify } = useToast();

  const {
    register: field,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestEventInput>({
    resolver: zodResolver(testEventSchema),
    defaultValues: {
      url: "https://example.com",
      title: "Example Domain",
      browser: "chrome",
      timestamp: localNow(),
    },
  });

  const mutation = useMutation({
    mutationFn: sendTestEvent,
    onSuccess: async () => {
      notify("Event accepted. Dashboard data will refresh shortly.", "ok");
      await queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      reset({
        url: "https://example.com",
        title: "Example Domain",
        browser: "chrome",
        timestamp: localNow(),
      });
    },
  });

  return (
    <>
      <PageHeader
        eyebrow="Developer utility"
        title="Send test event"
        description="Push a single WEB_VISIT into the pipeline to see how it lands in the dashboard. This is a developer aid, not the primary capture flow."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,440px)_1fr]">
        <Card>
          <CardHeader title="WEB_VISIT" subtitle="Mimics a browser extension capture" />
          <CardBody>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit((values) => mutation.mutate(values))}
              noValidate
            >
              {mutation.isError && (
                <FormBanner tone="error">
                  The API rejected this event. {toUserMessage(mutation.error)}
                </FormBanner>
              )}
              {mutation.isSuccess && !mutation.isPending && (
                <FormBanner tone="ok">
                  Event accepted ·{" "}
                  <span className="mono">{mutation.data.id}</span>
                </FormBanner>
              )}

              <Input
                id="url"
                type="url"
                label="URL"
                placeholder="https://example.com"
                error={errors.url?.message}
                {...field("url")}
              />
              <Input
                id="title"
                label="Page title"
                placeholder="Example Domain"
                error={errors.title?.message}
                {...field("title")}
              />
              <Input
                id="browser"
                label="Browser"
                optional
                placeholder="chrome"
                error={errors.browser?.message}
                {...field("browser")}
              />
              <Input
                id="timestamp"
                type="datetime-local"
                label="Timestamp"
                hint="Defaults to now."
                error={errors.timestamp?.message}
                {...field("timestamp")}
              />

              <Button
                type="submit"
                isLoading={mutation.isPending}
                loadingText="Sending…"
              >
                Send test event
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="What happens next" subtitle="From capture to signal" />
          <CardBody>
            <ol className="flex flex-col gap-4">
              {[
                {
                  t: "The event is accepted",
                  d: "The API validates the payload and returns an id with status accepted.",
                },
                {
                  t: "It joins the period totals",
                  d: "Your dashboard queries are invalidated, so the next view reflects this capture.",
                },
                {
                  t: "It surfaces as a signal",
                  d: "The visit feeds events by day, domains, categories, sources, and the hourly rhythm.",
                },
              ].map((step, index) => (
                <li key={step.t} className="flex gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-hairline-strong font-mono text-micro text-signal tnum">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-lilac">{step.t}</p>
                    <p className="text-sm text-ink_text-muted">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
