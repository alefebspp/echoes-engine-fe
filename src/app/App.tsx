import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./providers";
import { AppRoutes } from "./router";
import { setUnauthorizedHandler } from "@/shared/api/httpClient";
import { authStore } from "@/shared/auth/authStore";
import { SessionBootstrap } from "@/shared/auth/SessionBootstrap";
import { useToast } from "@/shared/components/Toast";

/**
 * Bridges the HTTP client's 401 handling into the app: clearing the session makes
 * RequireAuth redirect to /login on the next render.
 */
function AuthBridge() {
  const { notify } = useToast();
  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (authStore.isAuthenticated()) {
        authStore.clear();
        notify("Your session expired. Sign in again.", "warn");
      }
    });
    return () => setUnauthorizedHandler(() => {});
  }, [notify]);
  return null;
}

export function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <SessionBootstrap>
          <AuthBridge />
          <AppRoutes />
        </SessionBootstrap>
      </AppProviders>
    </BrowserRouter>
  );
}
