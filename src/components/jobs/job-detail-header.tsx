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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const jobTypeStyles: Record<string, string> = {
  FULL_TIME: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PART_TIME: "bg-amber-50 text-amber-700 border-amber-200",
  REMOTE: "bg-sky-50 text-sky-700 border-sky-200",
  CONTRACT: "bg-violet-50 text-violet-700 border-violet-200",
  INTERNSHIP: "bg-orange-50 text-orange-700 border-orange-200",
};

function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return "Competitive";
  const format = (val: number) => `$${val.toLocaleString()}`;
  if (min && max) return `${format(min)} - ${format(max)}`;
  if (min) return `${format(min)}+`;
  return max ? `Up to ${format(max)}` : "Competitive";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
  const companyId = job.employer?.id;

  return (
    <Card className="overflow-hidden border-white/10 bg-[var(--surface-dark)] text-white shadow-[0_32px_90px_-45px_rgba(15,23,42,0.9)]">
      <CardContent className="relative p-6 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.18),_transparent_24%)]" />
        <div className="relative">
          <Link
            href="/jobs"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to jobs
          </Link>

          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-sky-400 to-emerald-400 text-white shadow-lg sm:h-20 sm:w-20">
                <Building2 className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100">
                  Live opportunity
                </div>
                <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] sm:text-5xl">
                  {job.title}
                </h1>
                {companyId ? (
                  <Link
                    href={`/companies/${companyId}`}
                    className="mt-2 inline-flex items-center gap-2 text-lg text-slate-200 transition-colors hover:text-white"
                  >
                    <Building2 className="h-4 w-4" />
                    {companyName}
                  </Link>
                ) : (
                  <p className="mt-2 text-lg text-slate-200">{companyName}</p>
                )}
                <p className="mt-1 text-sm text-slate-300">
                  {job.employer?.employerProfile?.industry || "Hiring company"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {isOwner ? (
                <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>
                  <Button
                    variant="outline"
                    className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    Edit Job
                  </Button>
                </Link>
              ) : (
                <>
                  {userRole === "JOB_SEEKER" && <SaveJobButton jobId={job.id} />}
                  <Button
                    className="w-full bg-white px-8 text-lg font-bold text-slate-950 shadow-lg hover:bg-slate-100"
                    disabled={isApplied || userRole !== "JOB_SEEKER"}
                    onClick={onApplyClick}
                  >
                    {isApplied ? "Applied" : "Apply Now"}
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-slate-200" />
              <span className="text-sm font-medium">{job.location}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <DollarSign className="h-4 w-4 text-emerald-300" />
              <span className="text-sm font-medium text-emerald-100">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "rounded-2xl border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em]",
                jobTypeStyles[job.jobType] || ""
              )}
            >
              <Briefcase className="mr-1 h-3.5 w-3.5" />
              {job.jobType.replaceAll("_", " ")}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-2xl border-white/15 bg-white/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100"
            >
              {job.experience} level
            </Badge>
            {job.applicationDeadline && (
              <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
                <Clock3 className="h-4 w-4 text-amber-300" />
                <span className="text-sm font-medium text-amber-100">
                  Closes {new Date(job.applicationDeadline).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <Calendar className="h-4 w-4 text-slate-200" />
              <span className="text-sm text-slate-100">Posted {formatDate(job.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
