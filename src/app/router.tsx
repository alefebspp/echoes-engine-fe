import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth, RedirectIfAuthenticated } from "@/shared/auth/RequireAuth";
import { AppShell } from "./AppShell";
import { LandingPage } from "@/features/landing/LandingPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { RegisterPage } from "@/features/auth/RegisterPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { ActivityPage } from "@/features/dashboard/ActivityPage";
import { SendTestEventPage } from "@/features/events/SendTestEventPage";
import { ProfilePage } from "@/features/users/ProfilePage";
import { UsersPage } from "@/features/users/UsersPage";
import { UserDetailsPage } from "@/features/users/UserDetailsPage";
import { NotFoundPage } from "@/features/landing/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <LoginPage />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfAuthenticated>
            <RegisterPage />
          </RedirectIfAuthenticated>
        }
      />

      <Route
        path="/app"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="events/test" element={<SendTestEventPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="users/:id" element={<UserDetailsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
