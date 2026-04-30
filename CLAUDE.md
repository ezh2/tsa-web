# CLAUDE.md — UIUC TSA Club Management Platform

> This file is the contract for every AI session on this repository.
> Read it in full before proposing code. It overrides default behavior.

---

## 1. Project Overview

The **UIUC Taiwanese Student Association (TSA) Club Management Platform** is a self-hosted web application that administers the Taiwanese Student Association at the University of Illinois Urbana-Champaign. It will grow continuously — new, independently-scoped features will be bolted on over time without rewriting what already works.

**User tiers (strict hierarchy):**
1. **Guest / Customer** — unauthenticated public, prospective members, event attendees.
2. **Member** — verified club members, event staff, workers.
3. **Director** — board admin, full control.

**Deployment:** Runs locally on the maintainer's machine (Docker for Supabase, `next start` for the web app) and is surfaced to a public custom domain via **Cloudflare Tunnel**.

---

## 2. Core Philosophy — Modular / Plugin-Based

The single most important rule of this codebase:

> **Core is immutable. Features are modules. Modules never touch core.**

This is **not** a typical monolithic Next.js app. It is a foundation (`core/`) that loads self-contained feature modules (`modules/<name>/`). Each module owns its:

- React components, client hooks, server actions, route handlers
- Database schema (migrations, RLS policies, seed data) — tables prefixed by module name
- Navigation entries and role-gated routes
- Types and its narrow public contract (`modules/<name>/index.ts`)

Adding a feature must never require editing `core/` or coupling the global routing tree to any one module. Core exposes extension points; modules plug in.

**Why this matters.** When a module breaks, only that module breaks. When core is healthy, the platform is healthy. Isolation is the feature.

---

## 3. API-First, Headless Mandate

> **Design the application using a strict API-first, headless approach. The Supabase backend must serve as the single source of truth, ensuring that future native iOS and Android clients can easily consume the exact same database and authentication endpoints without backend modification.**

**Practical consequences:**
- All business logic that mutates or reads data goes through Supabase (PostgREST / RPC / Edge Functions). Never through Next.js-only mechanisms that a mobile client cannot replicate.
- Authentication is **Supabase Auth**. JWTs issued by Supabase are the universal credential for web, iOS, and Android.
- Authorization is enforced at the database via **Postgres Row-Level Security (RLS)**. Web-layer role checks are a UX convenience, not a security boundary.
- No Next.js-only API routes for features a mobile client must also perform. Prefer Postgres functions or Supabase Edge Functions for server logic.

---

## 4. Tech Stack

| Layer       | Choice                                      | Notes                                                                  |
|-------------|---------------------------------------------|------------------------------------------------------------------------|
| Framework   | **Next.js 15** (App Router)                 | Server Components by default.                                          |
| Language    | **TypeScript** (strict)                     | `strict: true`, no implicit `any`, no `@ts-ignore`.                    |
| Styling     | **Tailwind CSS v4**                         | Utility-first. Shared primitives live in `components/ui/`.             |
| Backend     | **Self-hosted Supabase** via Docker         | Managed by the Supabase CLI — do not hand-write compose files.         |
| Auth        | **Supabase Auth** + `@supabase/ssr`         | Cookie sessions for web; JWTs for future mobile.                       |
| Database    | **Postgres** (inside Supabase)              | Migrations in `supabase/migrations/`. RLS enabled on every table.      |
| Public edge | **Cloudflare Tunnel** (`cloudflared`)       | Surfaces local ports to the custom domain.                             |
| Pkg manager | **npm**                                     | Lockfile committed.                                                    |

Do not introduce new runtime dependencies without a written reason — every added library fights modularity.

---

## 5. Folder Structure (authoritative)

```
TSA_App/
├── app/                          # Next.js App Router — routing shell only
│   ├── (public)/                 # Guest routes
│   ├── (members)/                # Member-gated routes
│   ├── (admin)/                  # Director-gated routes
│   ├── api/                      # HTTP route handlers (thin — defer to modules)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── core/                         # IMMUTABLE — changed only via deliberate core PRs
│   ├── rbac/                     # Role enum, guards, server checks
│   ├── registry/                 # Module registry — discovers and mounts modules
│   ├── supabase/                 # Browser + server + middleware Supabase clients
│   ├── middleware/               # Auth / session-refresh middleware
│   ├── config/                   # Env loading, constants
│   └── types/                    # Core-wide types (User, Role, ModuleManifest)
│
├── modules/                      # One directory per feature — fully self-contained
│   ├── _template/                # Copy this when creating a new module
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── server/               # Server actions + Supabase queries
│   │   ├── lib/
│   │   ├── schemas/              # SQL migrations specific to this module
│   │   ├── types/
│   │   ├── manifest.ts           # Declares routes, nav items, required roles
│   │   └── index.ts              # Public contract — only exports, nothing else
│   └── <feature-name>/
│
├── components/ui/                # Shared design-system primitives (button, input, card)
├── lib/                          # Cross-cutting helpers (cn, fmtDate, etc.)
├── types/                        # Truly global types only
│
├── supabase/                     # Supabase CLI managed
│   ├── config.toml
│   ├── migrations/               # Numbered SQL migrations (composed from modules/*/schemas)
│   └── seed.sql
│
├── docker/                       # Override files only when unavoidable
├── scripts/                      # One-shot scripts (module scaffolder, migration composer)
├── public/
├── CLAUDE.md                     # ← you are here
├── README.md
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local                    # git-ignored; see .env.example
```

Pages under route groups are **thin re-exports** from modules:

```tsx
// app/(admin)/events/page.tsx
export { EventsAdminPage as default } from "@/modules/events/components/EventsAdminPage";
```

---

## 6. Module Contract

Every `modules/<name>/` MUST:

1. Expose a `manifest.ts` declaring:
   - `name`, `version`
   - `routes: Array<{ path, group, component, requiredRole }>`
   - `navItems: Array<{ label, href, requiredRole, group }>`
   - `migrations: string[]` — paths to SQL files, composed into `supabase/migrations/`
2. Expose a narrow `index.ts` — only public components, hooks, and types. Internal files are **not** exported.
3. Own its database tables under the module prefix: `<module>_<table>` (e.g. `events_event`, `events_rsvp`). Never reference another module's tables directly — go through that module's server API.
4. Enable RLS on every table it creates. No exceptions.
5. Not import from `modules/<other>/…` except through that other module's `index.ts`.
6. Not import from `app/…` — ever.

`core/` imports from `modules/` only via the registry. Modules import from `core/` freely.

---

## 7. RBAC Rules (non-negotiable)

Three layers — all required:

1. **Database (RLS).** Every table has policies that evaluate against `auth.uid()` and the user's role in `public.profiles`. This is the **security boundary**.
2. **Server (route handlers, Server Components, server actions).** Read the session via `core/supabase/server.ts`, resolve the role, reject before doing any work.
3. **Client (UI).** Use `core/rbac` guards (`<RequireRole role="director">…</RequireRole>`) to hide gated UI. This is **UX only**, not security.

**Rules:**
- Always check RBAC before rendering any gated UI — on the server first, then the client.
- Never write a query that bypasses RLS (i.e., never use the service role key from the browser or from any user-facing request path).
- The `service_role` key is for trusted server-side admin scripts and migrations only.
- When in doubt, deny.

---

## 8. Rules for Claude (read before each change)

### Must
- Read `CLAUDE.md` and the target module's `manifest.ts` before editing.
- Place new features under `modules/<name>/`. Scaffold from `modules/_template/`.
- Add new DB tables via a migration in that module's `schemas/` — never by editing live DB state directly.
- Enable RLS on every new table in the same migration that creates it.
- Mirror every mutation through Supabase so a mobile client can perform it identically.
- Run `npm run typecheck` and `npm run lint` before reporting a task complete.

### Must Not
- Alter core routing (the `app/` route groups) to hard-code module knowledge. The registry mounts modules.
- Import across module boundaries except through `modules/<other>/index.ts`.
- Put secrets in `NEXT_PUBLIC_*` env vars — those ship to every browser.
- Introduce client-only business logic that a mobile client couldn't reproduce.
- Silence TypeScript (`any`, `@ts-ignore`) to make errors go away — fix the cause.
- Add a library when a small helper in `lib/` would do.

### When adding a new module
1. `cp -r modules/_template modules/<new-name>`
2. Fill in `manifest.ts` (routes, nav, required roles).
3. Write `schemas/0001_init.sql` with tables + RLS policies.
4. Run the migration composer (see `scripts/`) to stage it into `supabase/migrations/`.
5. `supabase db reset` to apply locally.
6. Add thin re-export files in `app/(<group>)/<path>/page.tsx`.
7. Register the module in `core/registry/`.

---

## 9. Local Development — Docker & Supabase

The Supabase CLI manages the entire local Docker stack (Postgres, GoTrue/Auth, PostgREST, Realtime, Storage, Studio). **Do not hand-write `docker-compose.yml`** — let the CLI own it.

### One-time setup
```bash
brew install supabase/tap/supabase   # Supabase CLI
brew install cloudflared             # Cloudflare Tunnel client

npm install                          # project deps
supabase init                        # first time only — creates supabase/config.toml
```

### Daily development
```bash
supabase start                       # boots the local Docker stack (Docker Desktop must be running)
# Note the printed values:
#   API URL            -> NEXT_PUBLIC_SUPABASE_URL
#   anon key           -> NEXT_PUBLIC_SUPABASE_ANON_KEY
#   service_role key   -> SUPABASE_SERVICE_ROLE_KEY   (server-only!)
# Paste into .env.local (template: .env.example)

npm run dev                          # http://localhost:3000
#                                      Supabase Studio: http://localhost:54323
```

### Production-like local run
```bash
npm run build
npm run start                        # http://localhost:3000 (prod build)
```

### Stop / reset
```bash
supabase stop                        # stops containers, keeps data
supabase db reset                    # drops DB, reapplies migrations + seed
supabase stop --no-backup            # stops AND wipes data
```

### Migrations
```bash
supabase migration new <short_name>  # create a numbered empty migration
supabase db reset                    # re-apply everything cleanly
```

---

## 10. Cloudflare Tunnel — Exposing to the Custom Domain

The app runs locally (`next start` + `supabase start`) and is exposed via `cloudflared`.

Expose only what must be public:
- `localhost:3000` — the Next.js app (public)
- `localhost:54321` — Supabase REST / Auth (public — mobile clients hit it directly per the API-first mandate)
- `localhost:54323` — Supabase Studio — **NEVER expose publicly**, keep on LAN

Tunnel config lives in `~/.cloudflared/config.yml`. Keep ingress rules minimal and reject-by-default. The tunnel is the public edge — treat everything behind it as internet-facing and rely on **RLS + Supabase Auth** for protection.

---

## 11. npm Scripts

```
npm run dev          # next dev
npm run build        # next build
npm run start        # next start
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run db:start     # supabase start
npm run db:stop      # supabase stop
npm run db:reset     # supabase db reset
npm run db:diff      # generate a migration from DB changes
npm run module:new   # scaffold a new module from the template
```

---

## 12. Environment Variables

- Committed: `.env.example` (template, no secrets)
- Git-ignored: `.env.local` (real values)

Required:
- `NEXT_PUBLIC_SUPABASE_URL` — e.g. `http://localhost:54321`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from `supabase start` output
- `SUPABASE_SERVICE_ROLE_KEY` — **server-only**, never exposed to the browser

Never prefix a secret with `NEXT_PUBLIC_`. Anything with that prefix is shipped to every browser.

---

## 13. Definition of Done

A task is not complete until every box below is checked:

- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero errors
- [ ] Change lives under the correct `modules/<name>/` (not `core/`, unless a deliberate core PR)
- [ ] Any new DB tables have RLS policies in the same migration
- [ ] `supabase db reset` still succeeds (migrations are idempotent)
- [ ] RBAC is enforced on **server AND client** for every new gated UI
- [ ] Mobile parity: the same action could be taken by a future iOS/Android client via Supabase directly
