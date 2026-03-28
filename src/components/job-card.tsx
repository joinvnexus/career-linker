"use client";

import Link from "next/link";
import { MapPin, DollarSign, Clock3, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SaveJobButton } from "@/components/save-job-button";
import { JobType, JobStatus } from "@prisma/client";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

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
    jobType: JobType;
    status: JobStatus;
    createdAt: string;
    applicationDeadline?: string;
  };
  employerId: string;
  userRole?: string;
  userId?: string;
}

const jobTypeStyles: Record<JobType, string> = {
  FULL_TIME: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PART_TIME: "bg-amber-50 text-amber-700 border-amber-200",
  REMOTE: "bg-sky-50 text-sky-700 border-sky-200",
  CONTRACT: "bg-violet-50 text-violet-700 border-violet-200",
  INTERNSHIP: "bg-orange-50 text-orange-700 border-orange-200",
};

const statusStyles: Record<JobStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  EXPIRED: "bg-slate-100 text-slate-600 ring-slate-200",
  DRAFT: "bg-slate-100 text-slate-600 ring-slate-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
};

const statusLabels: Record<JobStatus, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  EXPIRED: "Expired",
  DRAFT: "Draft",
  REJECTED: "Rejected",
};

export function JobCard({ job, employerId, userRole, userId }: JobCardProps) {
  const isExpired = job.status !== "ACTIVE";
  const isOwnJob = userRole === "EMPLOYER" && userId && employerId === userId;
  const companyName = job.companyName || "Company";
  const hasSalary = job.salaryMin || job.salaryMax;

  return (
    <Card className="group overflow-hidden border-white/80 bg-white/92 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.75)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-34px_rgba(14,165,233,0.32)]">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <Badge
            className={cn(
              "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
              jobTypeStyles[job.jobType] || jobTypeStyles.FULL_TIME
            )}
            variant="outline"
          >
            {job.jobType.replace("_", " ")}
          </Badge>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ring-1",
              statusStyles[job.status]
            )}
          >
            {statusLabels[job.status]}
          </span>
        </div>

        <Link href={`/jobs/${job.slug}`} className="block">
          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-slate-950 transition-colors group-hover:text-sky-700">
            {job.title}
          </h3>
        </Link>

        <Link
          href={`/companies/${employerId}`}
          className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <Building2 className="h-4 w-4" />
          {companyName}
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </span>

          {hasSalary && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
              <DollarSign className="h-3.5 w-3.5" />
              <span className="font-semibold">
                {job.salaryMin ? formatCurrency(job.salaryMin) : "Salary hidden"}
                {job.salaryMax && ` - ${formatCurrency(job.salaryMax)}`}
              </span>
            </span>
          )}

          {job.applicationDeadline && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              <span className={isExpired ? "text-slate-400" : ""}>
                {isExpired ? "Closed" : `Closes ${formatDate(job.applicationDeadline)}`}
              </span>
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          {isOwnJob ? (
            <Button variant="outline" size="sm" className="rounded-xl" asChild>
              <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>Edit job</Link>
            </Button>
          ) : (
            <Button
              size="sm"
              className="rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800"
              asChild
              disabled={isExpired}
            >
              <Link href={`/jobs/${job.slug}`}>
                {userRole === "JOB_SEEKER" ? "Apply now" : "View job"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}

          <SaveJobButton jobId={job.id} />
        </div>
      </CardContent>
    </Card>
  );
}
