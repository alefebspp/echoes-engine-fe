import { z } from "zod";

export const testEventSchema = z.object({
  url: z
    .string()
    .min(1, "Enter a URL.")
    .url("Enter a valid URL, including https://."),
  title: z.string().trim().min(1, "Enter the page title."),
  browser: z.string().trim().max(60, "Keep the browser name short.").optional(),
  timestamp: z.string().min(1, "Pick a time."),
});

export type TestEventInput = z.infer<typeof testEventSchema>;
