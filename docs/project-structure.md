# HireHub Project Structure

This repository already contains a substantial application surface. The folders below define the baseline structure that the remaining implementation steps will follow.

## Source Layout

```text
src/
  app/                  Next.js App Router pages, layouts, route handlers
  actions/              Cross-feature server actions entrypoints
  components/           Reusable UI and feature components
  config/               App-level static configuration
  data/                 Static datasets and mock content
  hooks/                Client-side React hooks
  lib/                  Shared utilities, auth, Prisma, upload helpers
  providers/            React context/providers
  schemas/              Shared Zod schemas
  server/
    actions/            Feature-specific server actions
    queries/            Read-only server data access helpers
    services/           Business logic and integrations
    validations/        Server-side validation composition
  types/                Shared TypeScript types
```

## Feature Direction

- `src/app/api` exists today for current route handlers.
- New mutations should move toward Server Actions under `src/server/actions`.
- Shared validation should be centralized in `src/schemas` and `src/server/validations`.
- Data fetching logic should be extracted into `src/server/queries` to reduce duplication and N+1 query risk.

## Current Setup Notes

- The existing repository is already populated beyond a fresh scaffold.
- Step 1 focuses on normalizing the setup instead of recreating the app from scratch.
- A later auth migration is still needed because the current codebase uses `next-auth` v4 patterns.
