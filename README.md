# Echoes Engine — Front-end

A personal **memory observatory** for digital activity. This app connects to the Echoes Engine NestJS API and helps you answer:

> *What has my digital life been doing lately?*

Captured browser visits resolve into timelines, domains, categories, sources, and hourly rhythms — visualized through a dark-violet instrument panel with the **signal ribbon** as its signature element.

## Stack

- **React 18** + **TypeScript** + **Vite**
- **React Router** — public and authenticated routing
- **TanStack Query** — server state for dashboard and users
- **React Hook Form** + **Zod** — form validation
- **Tailwind CSS** — styling (tokens defined in `src/styles/tokens.css`, mapped in `tailwind.config.js`)
- **Vitest** + **Testing Library** — unit tests

## Prerequisites

- Node.js 18+
- Echoes Engine API running locally (default `http://localhost:3000`)

## Setup

```bash
# 1. Install dependencies
npm install

# If npm install hangs on your network (IPv6/DNS issue), force IPv4:
NODE_OPTIONS="--dns-result-order=ipv4first" npm install

# 2. Configure the API URL
cp .env.example .env

# 3. Start the dev server
npm run dev
```

The app runs at **http://localhost:5173**.

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api/v1` | Base URL for all API calls. Defaults to the Vite dev proxy so the `access_token` cookie stays same-site. |

## Authentication

Sign-in uses an **`access_token` HttpOnly cookie** set by the API on `POST /auth/login`. The front-end does **not** store the JWT in `localStorage`.

- All API calls send `credentials: "include"` so the browser attaches the cookie.
- On startup, `GET /users/me` bootstraps the in-memory session.
- `POST /auth/logout` clears the cookie; sign out always calls this endpoint.
- Session state lives in `authStore` (authenticated / anonymous / pending only).

For local dev, Vite proxies `/api` → `http://localhost:3000`. If you point `VITE_API_BASE_URL` at the API host directly, the back-end must allow credentialed CORS from `http://localhost:5173`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript check |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Landing page |
| `/login` | Public | Sign in |
| `/register` | Public | Create account |
| `/app/dashboard` | Auth | Main analytics dashboard |
| `/app/activity` | Auth | Hourly rhythm + domains |
| `/app/events/test` | Auth | Send test WEB_VISIT event |
| `/app/profile` | Auth | Edit your account |
| `/app/users` | Auth | Internal user list |
| `/app/users/:id` | Auth | User detail + edit |

Unauthenticated visits to `/app/*` redirect to `/login`. Signed-in users visiting `/login` or `/register` redirect to `/app/dashboard`.

## Profile / current user

The profile screen loads the signed-in user from **`GET /users/me`**. The user id comes from the API (derived from the JWT server-side), not from client-side token decoding.

## Design

The UI is built as a **memory observatory** — not a generic admin dashboard.

- **Palette:** midnight ink, deep violet, memory blue, signal cyan, soft lilac, trace amber (`src/styles/tokens.css`)
- **Type:** Space Grotesk (display), Inter (body), IBM Plex Mono (data)
- **Signature:** the **signal ribbon** — a horizontal temporal band where daily activity becomes pulses, gaps, and density changes

See `docs/setup.md` for the full product and API contract.

## Project structure

```
src/
  app/           Router, shell, providers
  shared/        HTTP client, auth store, UI primitives
  features/
    auth/        Login, register
    dashboard/   Analytics pages and charts
    events/      Test event ingestion
    users/       Profile and user management
    landing/     Public landing + 404
  styles/        Design tokens + Tailwind globals
```

## Testing

```bash
npm test
```

Tests cover cookie session bootstrap, credentialed fetch behavior, route guards, form validation, dashboard loading/error/empty/success states, period changes, test-event submission with dashboard invalidation, and profile diff validation.

## What is (and isn't) built

**Live today:** browser visit events, period analytics (7–90 days), dashboard charts, test ingestion, auth, profile/user management.

**Roadmap only** (labeled as such on the landing page, no active UI): semantic search, embeddings, knowledge graph, behavioral insights.
