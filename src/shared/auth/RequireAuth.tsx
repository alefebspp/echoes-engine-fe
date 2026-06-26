import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoadingBlock } from "@/shared/components/Feedback";
import { useAuth } from "./useAuth";

/** Gate for /app/* — sends signed-out visitors to /login, remembering where they were headed. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <LoadingBlock label="Checking session…" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

/** Inverse gate for /login and /register — signed-in visitors skip ahead to the dashboard. */
export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <LoadingBlock label="Checking session…" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return <>{children}</>;
}
