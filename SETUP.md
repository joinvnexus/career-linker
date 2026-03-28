# Career-Linker Setup Guide

This guide explains how to run Career-Linker locally, configure required services, and understand the most important environment variables.

## Prerequisites

Install the following first:

- Node.js 20+
- npm
- PostgreSQL

Optional integrations:

- Stripe account for billing and webhook testing
- UploadThing for file uploads
- Google or GitHub OAuth credentials for social login
- Email SMTP credentials if email flows are required

## Install Dependencies

```bash
npm install
```

## Environment Setup

Copy the example environment file and create your local env file.

```bash
copy .env.example .env
```

If you prefer:

```bash
Copy-Item .env.example .env
```

## Minimum Required Variables

At minimum, set these values:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`

Recommended for auth:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

Recommended for production-like local testing:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_JOB_POST_PRICE_CENTS`
- `STRIPE_CURRENCY`

Optional services:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_ID`
- `GITHUB_SECRET`
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`
- `EMAIL_SERVER_HOST`
- `EMAIL_SERVER_PORT`
- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_FROM`

Legacy optional billing values that may still exist in env examples:

- `SSL_STORE_ID`
- `SSL_STORE_PASSWORD`
- `SSL_STORE_URL`

## Database Setup

Generate Prisma client:

```bash
npm run db:generate
```

Run migrations:

```bash
npm run db:migrate
```

Seed local data:

```bash
npm run db:seed
```

If you only want to sync schema without creating a migration:

```bash
npm run db:push
```

Open Prisma Studio when needed:

```bash
npm run db:studio
```

## Run The App

Start local development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Useful Validation Commands

Typecheck:

```bash
npm run typecheck
```

Lint:

```bash
npm run lint
```

Production build:

```bash
npm run build
```

## Seeded Local Accounts

The seed file creates baseline example data. Review `prisma/seed.ts` for exact seeded users and jobs.

## Main Project Areas

### Public

- `src/app/(public)`
- Home page, jobs listing, job details, companies, blog, contact

### Job Seeker Dashboard

- `src/app/dashboard/job-seeker`

### Employer Dashboard

- `src/app/dashboard/employer`

### Admin Dashboard

- `src/app/admin`

### API Routes

- `src/app/api`

## Payment Flow Notes

Current billing is job-post based.

- Employer creates a job draft
- Billing checkout is started from `/api/billing/checkout`
- Stripe webhook updates payment state in `/api/billing/webhook`
- Successful payment activates the job

Admin payment reporting reads from job payment fields:

- `paymentStatus`
- `stripeSessionId`
- `paymentIntentId`
- `paidAt`

## Upload Notes

Upload-related handlers live under:

- `src/app/api/upload`
- `src/app/api/uploadthing`

## Auth Notes

Auth is handled with NextAuth. Session and role checks are used heavily across:

- employer pages
- admin pages
- protected API routes

## Troubleshooting

### App fails on startup

Check:

- `DATABASE_URL` is valid
- database is running
- `npm install` completed successfully

### Prisma errors

Try:

```bash
npm run db:generate
npm run db:migrate
```

### Auth redirect issues

Check:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

### Stripe issues

Check:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- webhook endpoint path
- local tunnel setup if testing webhooks externally

## Reviewer Quick Start

If someone wants to review the app quickly:

1. Install dependencies
2. Configure `.env`
3. Run database generate, migrate, and seed
4. Start the app with `npm run dev`
5. Review public, employer, and admin surfaces

## Production Deployment

This repository now includes GitHub Actions workflows for CI and production deployment.

### Workflows Added

- `.github/workflows/ci.yml`
- `.github/workflows/deploy-production.yml`

### CI Pipeline

The CI workflow runs:

1. `npm ci`
2. `npm run db:generate`
3. `npm run lint`
4. `npm run typecheck`
5. `npm run build`

### Production CD Target

The deployment workflow is configured for Vercel production deployment.

It deploys automatically after the `CI` workflow succeeds on the `main` branch.

### Required GitHub Secrets

Add these repository secrets before enabling production deployment:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Required Production Environment Variables

Make sure your Vercel project also has the correct production environment variables configured, especially:

- `DATABASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_JOB_POST_PRICE_CENTS`
- `STRIPE_CURRENCY`
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`
- `EMAIL_SERVER_HOST`
- `EMAIL_SERVER_PORT`
- `EMAIL_SERVER_USER`
- `EMAIL_SERVER_PASSWORD`
- `EMAIL_FROM`

OAuth variables if used:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_ID`
- `GITHUB_SECRET`

### Recommended Production Rollout Order

1. Push the current code to GitHub
2. Create a Vercel project connected to the repository
3. Add all production environment variables in Vercel
4. Add the three Vercel GitHub secrets in the repository
5. Push to `main` or manually trigger the deployment workflow
6. Configure Stripe webhook to point to `/api/billing/webhook`
7. Run production database migration before or during release

### Production Notes

- CI uses placeholder values only to validate the codebase during build checks
- Real deployment configuration must live in Vercel project environment variables
- If your production database requires SSL-specific settings, ensure `DATABASE_URL` includes them
