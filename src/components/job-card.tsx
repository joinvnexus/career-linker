"use client";

import Link from "next/link";
import { MapPin, DollarSign, Clock3, Building2, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SaveJobButton } from "@/components/save-job-button";
import { type AppJobStatus, type AppJobType } from "@/lib/client-enums";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

type LayoutType = "list" | "grid";

interface JobCardProps {
  job: {
    id: string;
    slug: string;
    title: string;
    companyName?: string;
    companySlug?: string;
    location: string;
    salaryMin?: number;
    salaryMax?: number;
    salaryType?: string;
    jobType: AppJobType;
    experience?: string;
    status: AppJobStatus;
    createdAt: string;
    applicationDeadline?: string;
    description?: string;
  };
  employerId: string;
  userRole?: string;
  userId?: string;
  layout?: LayoutType;
}

const jobTypeStyles: Record<AppJobType, string> = {
  FULL_TIME: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PART_TIME: "bg-amber-50 text-amber-700 border-amber-200",
  REMOTE: "bg-sky-50 text-sky-700 border-sky-200",
  CONTRACT: "bg-violet-50 text-violet-700 border-violet-200",
  INTERNSHIP: "bg-orange-50 text-orange-700 border-orange-200",
};

const statusStyles: Record<AppJobStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  EXPIRED: "bg-slate-100 text-slate-600 ring-slate-200",
  DRAFT: "bg-slate-100 text-slate-600 ring-slate-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
};

const statusLabels: Record<AppJobStatus, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  EXPIRED: "Expired",
  DRAFT: "Draft",
  REJECTED: "Rejected",
};

const experienceLabels: Record<string, string> = {
  ENTRY: "Entry Level",
  MID: "Mid Level",
  SENIOR: "Senior Level",
};

export function JobCard({ job, employerId, userRole, userId, layout = "list" }: JobCardProps) {
  const isExpired = job.status !== "ACTIVE";
  const isOwnJob = userRole === "EMPLOYER" && userId && employerId === userId;
  const companyName = job.companyName || "Company";
  const hasSalary = job.salaryMin || job.salaryMax;

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `${formatCurrency(job.salaryMin)} - ${formatCurrency(job.salaryMax)}`;
    }
    if (job.salaryMin) {
      return `From ${formatCurrency(job.salaryMin)}`;
    }
    return "Salary not disclosed";
  };

  const getDaysAgo = (dateString: string) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(dateString).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  };

  const getDeadlineStatus = () => {
    if (!job.applicationDeadline) return null;
    const deadline = new Date(job.applicationDeadline);
    const now = new Date();
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) return { text: "Closed", urgent: false };
    if (daysLeft <= 3) return { text: `${daysLeft} days left`, urgent: true };
    if (daysLeft <= 7) return { text: `${daysLeft} days left`, urgent: false };
    return { text: `Closes ${formatDate(job.applicationDeadline)}`, urgent: false };
  };

  const deadlineStatus = getDeadlineStatus();

  if (layout === "grid") {
    return (
      <Card className="group h-full overflow-hidden border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-200">
        <CardContent className="flex h-full flex-col p-6">
          {/* Header with badges */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              <Badge
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                  jobTypeStyles[job.jobType] || jobTypeStyles.FULL_TIME
                )}
                variant="outline"
              >
                {job.jobType.replace("_", " ")}
              </Badge>
              {job.experience && (
                <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[10px] font-semibold">
                  {experienceLabels[job.experience] || job.experience}
                </Badge>
              )}
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ring-1",
                statusStyles[job.status]
              )}
            >
              {statusLabels[job.status]}
            </span>
          </div>

          {/* Job title */}
          <Link href={`/jobs/${job.slug}`} className="block flex-1">
            <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-950 transition-colors group-hover:text-sky-700">
              {job.title}
            </h3>
          </Link>

          {/* Company */}
          <Link
            href={`/companies/${employerId}`}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            <Building2 className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{companyName}</span>
          </Link>

          {/* Location and salary */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
              <span className="truncate">{job.location}</span>
            </div>

            {hasSalary && (
              <div className="flex items-center gap-2 text-sm text-emerald-700">
                <DollarSign className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span className="font-semibold truncate">{formatSalary()}</span>
              </div>
            )}

            {deadlineStatus && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock3 className={cn("h-4 w-4 flex-shrink-0", deadlineStatus.urgent ? "text-amber-500" : "text-slate-400")} />
                <span className={cn("truncate", deadlineStatus.urgent && "font-semibold text-amber-700")}>
                  {deadlineStatus.text}
                </span>
              </div>
            )}
          </div>

          {/* Posted date */}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Posted {getDaysAgo(job.createdAt)}</span>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
            {isOwnJob ? (
              <Button variant="outline" size="sm" className="flex-1 rounded-xl text-xs" asChild>
                <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>Edit job</Link>
              </Button>
            ) : (
              <Button
                size="sm"
                className="flex-1 rounded-xl text-xs font-semibold"
                asChild
                disabled={isExpired}
              >
                <Link href={`/jobs/${job.slug}`}>
                  {userRole === "JOB_SEEKER" ? "Apply now" : "View job"}
                  <ArrowRight className="ml-1.5 h-3 w-3" />
                </Link>
              </Button>
            )}
            <div className="flex-shrink-0">
              <SaveJobButton jobId={job.id} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // List layout (default)
  return (
    <Card className="group overflow-hidden border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          {/* Left side - content */}
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                <Badge
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                    jobTypeStyles[job.jobType] || jobTypeStyles.FULL_TIME
                  )}
                  variant="outline"
                >
                  {job.jobType.replace("_", " ")}
                </Badge>
                {job.experience && (
                  <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[10px] font-semibold">
                    {experienceLabels[job.experience] || job.experience}
                  </Badge>
                )}
                <span
                  className={cn(
                    "rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wide ring-1",
                    statusStyles[job.status]
                  )}
                >
                  {statusLabels[job.status]}
                </span>
              </div>
            </div>

            <Link href={`/jobs/${job.slug}`} className="block">
              <h3 className="line-clamp-2 text-xl font-bold leading-snug text-slate-950 transition-colors group-hover:text-sky-700">
                {job.title}
              </h3>
            </Link>

            <Link
              href={`/companies/${employerId}`}
              className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{companyName}</span>
            </Link>

            {job.description && (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                {job.description}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 flex-shrink-0 text-slate-400" />
                <span>{job.location}</span>
              </div>

              {hasSalary && (
                <div className="flex items-center gap-2 text-emerald-700">
                  <DollarSign className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                  <span className="font-semibold">{formatSalary()}</span>
                </div>
              )}

              {deadlineStatus && (
                <div className={`flex items-center gap-2 ${deadlineStatus.urgent ? 'text-amber-700' : 'text-slate-600'}`}>
                  <Clock3 className={cn("h-4 w-4 flex-shrink-0", deadlineStatus.urgent ? "text-amber-500" : "text-slate-400")} />
                  <span className={deadlineStatus.urgent ? "font-semibold" : ""}>{deadlineStatus.text}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-slate-500">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>Posted {getDaysAgo(job.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Right side - actions */}
          <div className="flex flex-col items-end gap-3">
            {isOwnJob ? (
              <Button variant="outline" size="sm" className="rounded-xl px-4" asChild>
                <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>Edit job</Link>
              </Button>
            ) : (
              <Button
                size="sm"
                className="rounded-xl px-4 font-semibold"
                asChild
                disabled={isExpired}
              >
                <Link href={`/jobs/${job.slug}`}>
                  {userRole === "JOB_SEEKER" ? "Apply now" : "View job"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
            <div className="flex items-center gap-2">
              <SaveJobButton jobId={job.id} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
