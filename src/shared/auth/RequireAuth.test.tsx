import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { RequireAuth, RedirectIfAuthenticated } from "./RequireAuth";
import { authStore } from "./authStore";

function Protected() {
  return <p>secret dashboard</p>;
}
function LoginScreen() {
  return <p>login screen</p>;
}
function Dashboard() {
  return <p>dashboard screen</p>;
}

function renderApp(initial: string) {
  return render(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/app"
          element={
            <RequireAuth>
              <Protected />
            </RequireAuth>
          }
        />
        <Route
          path="/signin"
          element={
            <RedirectIfAuthenticated>
              <LoginScreen />
            </RedirectIfAuthenticated>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("route guards", () => {
  beforeEach(() => authStore.clear());

  it("redirects unauthenticated users away from protected routes", () => {
    renderApp("/app");
    expect(screen.getByText("login screen")).toBeInTheDocument();
    expect(screen.queryByText("secret dashboard")).not.toBeInTheDocument();
  });

  it("renders protected content when authenticated", () => {
    authStore.setSession({ id: "user-123" });
    renderApp("/app");
    expect(screen.getByText("secret dashboard")).toBeInTheDocument();
  });

  it("sends authenticated users away from auth-only routes", () => {
    authStore.setSession({ id: "user-123" });
    render(
      <MemoryRouter initialEntries={["/signin"]}>
        <Routes>
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route
            path="/signin"
            element={
              <RedirectIfAuthenticated>
                <LoginScreen />
              </RedirectIfAuthenticated>
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("dashboard screen")).toBeInTheDocument();
  });

  it("shows a loading state while the session is bootstrapping", () => {
    authStore.markPending();
    renderApp("/app");
    expect(screen.getByText(/checking session/i)).toBeInTheDocument();
  });
});
