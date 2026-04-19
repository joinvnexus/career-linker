"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, MapPin, Clock, Briefcase } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type JobType = "FULL_TIME" | "PART_TIME" | "REMOTE" | "CONTRACT" | "INTERNSHIP";
type JobStatus = "PENDING" | "ACTIVE" | "EXPIRED" | "DRAFT" | "REJECTED";

export type JobCardJob = {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: string;
  jobType: JobType;
  experience?: string;
  status: JobStatus;
  createdAt: string;
  applicationDeadline?: string;
  employerId: string;
  category?: { name: string };
  employer?: {
    id: string;
    name?: string | null;
    employerProfile?: {
      companyName?: string | null;
      companyLogo?: string | null;
    } | null;
  };
};

type JobCardProps = {
  job: JobCardJob;
  variant?: "list" | "grid";
  userId?: string;
  userRole?: string;
  employerId?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  REMOTE: "Remote",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  ENTRY: "Entry level",
  MID: "Mid level",
  SENIOR: "Senior",
  LEAD: "Lead",
};

function formatSalary(
  min?: number,
  max?: number,
  type?: string
): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) =>
    n >= 1000 ? `£${Math.round(n / 1000)}k` : `£${n}`;
  if (type === "Fixed" && min) return fmt(min);
  if (type === "Negotiable") return "Negotiable";
  if (min && max) return `${fmt(min)}–${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return null;
}

function daysAgo(dateStr: string): string {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86_400_000
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff}d ago`;
}

function deadlineLabel(dateStr?: string): string | null {
  if (!dateStr) return null;
  const diff = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / 86_400_000
  );
  if (diff < 0) return "Expired";
  if (diff === 0) return "Closes today";
  if (diff <= 3) return `Closes in ${diff}d`;
  return `Closes ${new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
}

function isNew(dateStr: string): boolean {
  return (
    (Date.now() - new Date(dateStr).getTime()) / 86_400_000 < 3
  );
}

function CompanyInitials({ name, logo }: { name: string; logo?: string | null }) {
  if (logo) {
    return (
      <img
        src={logo}
        alt={name}
        className="h-full w-full rounded-[inherit] object-cover"
      />
    );
  }
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return <span>{initials}</span>;
}

// ─── Pill ──────────────────────────────────────────────────────────────────

function Pill({
  children,
  color = "neutral",
}: {
  children: React.ReactNode;
  color?: "neutral" | "green" | "blue" | "amber";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        color === "green" &&
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        color === "blue" && "border-sky-200 bg-sky-50 text-sky-700",
        color === "amber" && "border-amber-200 bg-amber-50 text-amber-700",
        color === "neutral" &&
          "border-border bg-secondary text-muted-foreground"
      )}
    >
      {children}
    </span>
  );
}

// ─── List variant ─────────────────────────────────────────────────────────────

function JobCardList({ job, userId, userRole }: JobCardProps) {
  const [saved, setSaved] = useState(false);
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryType);
  const deadline = deadlineLabel(job.applicationDeadline);
  const fresh = isNew(job.createdAt);
  const logo = job.employer?.employerProfile?.companyLogo;
  const isEmployer = userRole === "EMPLOYER";
  const isOwner = isEmployer && job.employerId === userId;

  return (
    <div
      className={cn(
        "group relative grid grid-cols-[40px_minmax(0,1fr)_auto] items-start gap-3 rounded-2xl border bg-card px-4 py-3.5 transition-all duration-200 hover:shadow-[var(--shadow-soft)]",
        fresh && "border-l-2 border-l-accent"
      )}
    >
      {/* Company logo */}
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border bg-secondary text-xs font-semibold text-muted-foreground">
        <CompanyInitials
          name={job.companyName}
          logo={logo}
        />
      </div>

      {/* Middle: info */}
      <div className="min-w-0">
        <Link
          href={`/jobs/${job.slug}`}
          className="block text-sm font-semibold text-foreground hover:text-primary"
        >
          {job.title}
        </Link>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <span>{job.companyName}</span>
          <span className="text-border">·</span>
          <MapPin className="h-3 w-3 shrink-0" />
          <span>{job.location}</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {job.jobType === "REMOTE" ? (
            <Pill color="green">{JOB_TYPE_LABELS[job.jobType]}</Pill>
          ) : (
            <Pill color="blue">{JOB_TYPE_LABELS[job.jobType]}</Pill>
          )}
          {job.experience && (
            <Pill color="neutral">
              {EXPERIENCE_LABELS[job.experience] ?? job.experience}
            </Pill>
          )}
          {job.category?.name && (
            <Pill color="neutral">{job.category.name}</Pill>
          )}
          {fresh && <Pill color="amber">New</Pill>}
        </div>
      </div>

      {/* Right: salary + deadline + actions */}
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        {salary && (
          <p className="text-sm font-semibold text-foreground">{salary}</p>
        )}
        {deadline && (
          <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {deadline}
          </p>
        )}
        <div className="flex items-center gap-1 pt-0.5">
          {!isOwner && (
            <Link
              href={`/jobs/${job.slug}`}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              {userId && !isEmployer ? "Apply" : "View"}
            </Link>
          )}
          {isOwner && (
            <Link
              href={`/dashboard/employer/jobs/${job.id}/edit`}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Edit
            </Link>
          )}
          {!isEmployer && (
            <button
              type="button"
              onClick={() => setSaved((s) => !s)}
              aria-label={saved ? "Unsave job" : "Save job"}
              className="flex items-center justify-center rounded-lg border border-border bg-background p-1.5 text-muted-foreground transition-colors hover:text-accent"
            >
              {saved ? (
                <BookmarkCheck className="h-3.5 w-3.5 text-accent" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Grid variant ─────────────────────────────────────────────────────────────

function JobCardGrid({ job, userId, userRole }: JobCardProps) {
  const [saved, setSaved] = useState(false);
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryType);
  const deadline = deadlineLabel(job.applicationDeadline);
  const fresh = isNew(job.createdAt);
  const logo = job.employer?.employerProfile?.companyLogo;
  const isEmployer = userRole === "EMPLOYER";
  const isOwner = isEmployer && job.employerId === userId;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card p-4 transition-all duration-200 hover:shadow-[var(--shadow-soft)]",
        fresh && "border-t-2 border-t-accent"
      )}
    >
      {/* Top row: logo + salary + save */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border bg-secondary text-xs font-semibold text-muted-foreground">
          <CompanyInitials name={job.companyName} logo={logo} />
        </div>
        <div className="flex flex-1 items-start justify-end gap-1.5">
          {salary && (
            <span className="text-sm font-semibold text-foreground">
              {salary}
            </span>
          )}
          {!isEmployer && (
            <button
              type="button"
              onClick={() => setSaved((s) => !s)}
              aria-label={saved ? "Unsave job" : "Save job"}
              className="flex items-center justify-center rounded-lg border border-border bg-background p-1.5 text-muted-foreground transition-colors hover:text-accent"
            >
              {saved ? (
                <BookmarkCheck className="h-3.5 w-3.5 text-accent" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Title + company */}
      <Link
        href={`/jobs/${job.slug}`}
        className="block text-sm font-semibold leading-snug text-foreground hover:text-primary"
      >
        {job.title}
      </Link>
      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <span>{job.companyName}</span>
        <span className="text-border">·</span>
        <MapPin className="h-3 w-3 shrink-0" />
        <span className="truncate">{job.location}</span>
      </p>

      {/* Pills */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {job.jobType === "REMOTE" ? (
          <Pill color="green">{JOB_TYPE_LABELS[job.jobType]}</Pill>
        ) : (
          <Pill color="blue">{JOB_TYPE_LABELS[job.jobType]}</Pill>
        )}
        {job.experience && (
          <Pill color="neutral">
            {EXPERIENCE_LABELS[job.experience] ?? job.experience}
          </Pill>
        )}
        {fresh && <Pill color="amber">New</Pill>}
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between border-t border-border pt-3 mt-4">
        <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {deadline ?? daysAgo(job.createdAt)}
        </p>
        {isOwner ? (
          <Link
            href={`/dashboard/employer/jobs/${job.id}/edit`}
            className="text-[11px] font-semibold text-primary hover:underline"
          >
            Edit →
          </Link>
        ) : (
          <Link
            href={`/jobs/${job.slug}`}
            className="text-[11px] font-semibold text-accent hover:underline"
          >
            {userId && !isEmployer ? "Apply →" : "View →"}
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function JobCard({
  job,
  variant = "list",
  userId,
  userRole,
  employerId,
}: JobCardProps) {
  if (variant === "grid") {
    return (
      <JobCardGrid
        job={job}
        userId={userId}
        userRole={userRole}
        employerId={employerId}
      />
    );
  }
  return (
    <JobCardList
      job={job}
      userId={userId}
      userRole={userRole}
      employerId={employerId}
    />
  );
}