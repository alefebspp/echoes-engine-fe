/**
 * Centralized access to build-time configuration. Keeping this in one place
 * means the rest of the app never reads `import.meta.env` directly.
 */
const DEFAULT_API_BASE_URL = "/api/v1";
const DEFAULT_EXTENSION_DOWNLOAD_URL =
  "https://github.com/alefebspp/echoes-browser-extension/releases/latest/download/echoes-extension.zip";

function readApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim();
  const base = raw && raw.length > 0 ? raw : DEFAULT_API_BASE_URL;
  // Normalize away a trailing slash so path joins stay predictable.
  return base.replace(/\/+$/, "");
}

export const env = {
  apiBaseUrl: readApiBaseUrl(),
  /** The latest browser extension build, installed manually while unpublished. */
  extensionDownloadUrl:
    import.meta.env.VITE_EXTENSION_DOWNLOAD_URL?.trim() || DEFAULT_EXTENSION_DOWNLOAD_URL,
} as const;
