import "@testing-library/jest-dom/vitest";
import { afterEach, beforeAll } from "vitest";
import { cleanup } from "@testing-library/react";
import { authStore } from "@/shared/auth/authStore";
import { i18n } from "@/shared/i18n";

// Assertions are written against the English copy.
beforeAll(async () => {
  await i18n.changeLanguage("en");
});

afterEach(() => {
  cleanup();
  authStore.clear();
});
