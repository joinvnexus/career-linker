# HireHub

HireHub is a full-stack job marketplace built with Next.js, TypeScript, Prisma, and PostgreSQL. It supports three core product surfaces in one codebase:

- Public job discovery for candidates
- Employer tools for posting jobs, reviewing applicants, and tracking hiring activity
- Admin operations for moderation, reporting, company review, payments visibility, and platform controls

## Product Overview

HireHub is designed as a multi-role hiring platform where:

- Job seekers can browse jobs, save listings, apply, and manage their profile from a polished dashboard
- Employers can create paid job posts, manage listings, review applicants, and maintain company profile data
- Admins can monitor users, moderate jobs, verify companies, inspect payment activity, and review marketplace health reports

## Key Capabilities

### Public Experience

- Home landing page with featured jobs, categories, company highlights, and career content
- Public jobs listing with search, filters, pagination, and polished job cards
- Job detail pages with company context, apply actions, and similar jobs
- Static marketing pages like about, companies, blog, and contact

### Job Seeker Experience

- Job seeker dashboard overview
- Saved jobs and applications tracking
- Profile editing and recruiter-facing profile preview
- Settings and dashboard-specific responsive UI

### Employer Experience

- Employer dashboard overview
- Job posting flow
- My jobs management
- Applicant review pages
- Analytics and company profile management
- Billing flow for paid job activation

### Admin Experience

- Dashboard overview with operational summaries
- User management with filtering and role updates
- Job moderation and pending approvals
- Company verification workspace with export and bulk verification tools
- Payment visibility with export tools
- Reports with funnel, trend, category, and payment health insights
- Runtime-aware settings visibility

## Tech Stack

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- UI primitives: Custom UI components with Radix-based building blocks
- Database: PostgreSQL
- ORM: Prisma
- Auth: NextAuth
- Payments: Stripe
- File uploads: UploadThing
- Email: Nodemailer

## Repository Structure

- `src/app`:
  App routes, dashboards, public pages, and API routes
- `src/components`:
  Shared UI, dashboard components, jobs UI, auth forms, and home sections
- `src/lib`:
  Auth, Prisma, Stripe, environment parsing, utilities, email helpers
- `prisma`:
  Database schema, migrations, and seed script
- `public`:
  Static assets

## Roles Supported

- `JOB_SEEKER`
- `EMPLOYER`
- `ADMIN`

## Main Workflows

### Candidate Flow

1. Browse public jobs
2. Save jobs or open a detailed job page
3. Apply to a job
4. Track application status from the dashboard
5. Maintain a profile recruiters can review

### Employer Flow

1. Create a job draft
2. Complete payment
3. Job becomes active after successful billing flow
4. Review applicants by job
5. Track hiring metrics from the employer dashboard

### Admin Flow

1. Monitor platform-wide activity
2. Moderate pending or low-quality job listings
3. Review company profiles and verification status
4. Inspect payment state and billing health
5. Use reports to assess hiring, supply, and moderation trends

## Current Quality Notes

- The frontend has been polished across public, job seeker, employer, and admin surfaces
- Admin tools now include dynamic data-backed views for companies, payments, reports, and settings
- Export tools exist for company and payment operations
- Typecheck and lint were passing at the time of the latest cleanup pass

## For Recruiters or Reviewers

If you are reviewing the project quickly, start here:

1. Read this file for product and architecture context
2. Open [`SETUP.md`](/e:/webdevlopment-learn/New%20folder%20(2)/hirehub/SETUP.md) for local run instructions
3. Review the main surfaces:
   - `src/app/(public)`
   - `src/app/dashboard/job-seeker`
   - `src/app/dashboard/employer`
   - `src/app/admin`

## Setup

Detailed local setup, environment configuration, database steps, and run commands live in `SETUP.md`.
