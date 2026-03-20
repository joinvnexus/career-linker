# HireHub: Complete Job Portal

Production-ready job portal with Next.js 14, TypeScript, Prisma, PostgreSQL, Tailwind.

## Setup

1. Copy .env.example to .env.local and set DATABASE_URL
2. npm run db:generate
3. npm run db:migrate
4. npm run db:seed
5. npm run dev

## Database Notes

- Provider: PostgreSQL
- ORM: Prisma
- Seed file: `prisma/seed.ts`
- Saved jobs are stored in the `saved_jobs` table.
- `JobStatus` includes `PENDING`, `ACTIVE`, `EXPIRED`, `DRAFT`, and `REJECTED`.

## Available DB Scripts

- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:push`
- `npm run db:seed`

## Features
- Multi-role auth
- Job posting/application
- Dashboards
- Payments
- Admin panel

## Deployment Notes

- `npm run build`
- `npm run db:push` or `npm run db:migrate`
- Set all required auth, database, upload, email, and payment environment variables from `.env.example`
- Configure Stripe webhook to point at `/api/billing/webhook`
- Optional SSLCommerz credentials can be used through `src/lib/payment.ts`

See full docs in project.
