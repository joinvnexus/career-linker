"use client";

import Link from "next/link";
import {
  Building2,
  MapPin,
  DollarSign,
  Clock3,
  Briefcase,
  Calendar,
  ArrowLeft,
  Bookmark,
  Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SaveJobButton } from "@/components/save-job-button";
import { cn } from "@/lib/utils";

interface JobDetailHeaderProps {
  job: {
    id: string;
    slug: string;
    title: string;
    location: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    jobType: string;
    experience: string;
    applicationDeadline?: string | null;
    createdAt: string;
    employer?: {
      id: string;
      name?: string | null;
      employerProfile?: {
        companyName?: string | null;
        industry?: string | null;
        companyWebsite?: string | null;
        location?: string | null;
        logoUrl?: string | null;
      } | null;
    };
  };
  isApplied: boolean;
  isOwner: boolean;
  userRole?: string;
  onApplyClick: () => void;
}

const jobTypeConfig: Record<string, { label: string; color: string }> = {
  FULL_TIME:  { label: "Full-time",  color: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25" },
  PART_TIME:  { label: "Part-time",  color: "bg-amber-500/15  text-amber-300  ring-1 ring-amber-500/25" },
  REMOTE:     { label: "Remote",     color: "bg-sky-500/15    text-sky-300    ring-1 ring-sky-500/25" },
  CONTRACT:   { label: "Contract",   color: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25" },
  INTERNSHIP: { label: "Internship", color: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/25" },
};

function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return "Competitive";
  const fmt = (v: number) => `$${v.toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return max ? `Up to ${fmt(max)}` : "Competitive";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now  = new Date();
  const days = Math.ceil(Math.abs(now.getTime() - date.getTime()) / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function JobDetailHeader({
  job,
  isApplied,
  isOwner,
  userRole,
  onApplyClick,
}: JobDetailHeaderProps) {
  const companyName =
    job.employer?.employerProfile?.companyName || job.employer?.name || "Company";
  const companyId   = job.employer?.id;
  const typeConfig  = jobTypeConfig[job.jobType];
  const isJobSeeker = userRole === "JOB_SEEKER";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-8 text-white shadow-2xl">

      {/* decorative blobs */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-16 h-60 w-60 rounded-full bg-emerald-500/10 blur-3xl" />
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative">
        {/* back link */}
        <Link
          href="/jobs"
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/12 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>

        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          {/* left: logo + title */}
          <div className="flex items-start gap-5">
            <div className="relative flex-shrink-0">
              <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-emerald-400 shadow-lg shadow-sky-500/25">
                <Building2 className="h-9 w-9 text-white" />
              </div>
              {/* live indicator */}
              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sky-200">
                Live opportunity
              </div>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {job.title}
              </h1>
              {companyId ? (
                <Link
                  href={`/companies/${companyId}`}
                  className="mt-2 inline-flex items-center gap-2 text-lg text-slate-300 transition-colors hover:text-white"
                >
                  <Building2 className="h-4 w-4 text-slate-400" />
                  {companyName}
                </Link>
              ) : (
                <p className="mt-2 flex items-center gap-2 text-lg text-slate-300">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  {companyName}
                </p>
              )}
              <p className="mt-0.5 text-sm text-slate-400">
                {job.employer?.employerProfile?.industry || "Hiring company"}
              </p>
            </div>
          </div>

          {/* right: actions */}
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row xl:flex-col xl:items-end">
            {isOwner ? (
              <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>
                <Button
                  variant="outline"
                  className="w-full border-white/20 bg-white/8 text-white backdrop-blur-sm hover:bg-white/14 hover:text-white"
                >
                  Edit Job
                </Button>
              </Link>
            ) : (
              <>
                {isJobSeeker && (
                  <div className="flex gap-2">
                    <SaveJobButton jobId={job.id} />
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-white/20 bg-white/8 text-white hover:bg-white/14 hover:text-white"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {isApplied ? (
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 px-5 py-3 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Application Submitted
                  </div>
                ) : (
                  <Button
                    onClick={onApplyClick}
                    disabled={!isJobSeeker}
                    className="bg-white px-8 py-3 text-base font-bold text-slate-950 shadow-lg shadow-white/10 transition-all hover:scale-[1.02] hover:bg-slate-100 disabled:opacity-50"
                  >
                    Apply Now
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* pill row */}
        <div className="mt-8 flex flex-wrap gap-2.5">
          <div className="flex items-center gap-2 rounded-xl bg-white/8 px-4 py-2.5 text-sm font-medium text-slate-200 backdrop-blur-sm ring-1 ring-white/10">
            <MapPin className="h-4 w-4 text-slate-400" />
            {job.location}
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/12 px-4 py-2.5 text-sm font-medium text-emerald-300 ring-1 ring-emerald-500/20">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </div>

          {typeConfig && (
            <div className={cn("flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold", typeConfig.color)}>
              <Briefcase className="h-4 w-4" />
              {typeConfig.label}
            </div>
          )}

          <div className="flex items-center gap-2 rounded-xl bg-white/8 px-4 py-2.5 text-sm font-semibold text-slate-200 ring-1 ring-white/10">
            {job.experience} level
          </div>

          {job.applicationDeadline && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-500/12 px-4 py-2.5 text-sm font-medium text-amber-300 ring-1 ring-amber-500/20">
              <Clock3 className="h-4 w-4 text-amber-400" />
              Closes {new Date(job.applicationDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          )}

          <div className="flex items-center gap-2 rounded-xl bg-white/8 px-4 py-2.5 text-sm text-slate-300 ring-1 ring-white/10">
            <Calendar className="h-4 w-4 text-slate-400" />
            Posted {formatDate(job.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}