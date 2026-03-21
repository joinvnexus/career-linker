"use client";

import Link from "next/link";
import { Building2, MapPin, DollarSign, Clock, Briefcase, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SaveJobButton } from "@/components/save-job-button";
import { JobShareButton } from "@/components/job-share-button";

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
  const companyId = job.employer?.id;

  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl">
      <CardContent className="p-6 sm:p-8">
        {/* Back Button */}
        <Link
          href="/jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to jobs
        </Link>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Company Info & Job Title */}
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 shadow-lg sm:h-20 sm:w-20">
              <Building2 className="h-8 w-8 text-white sm:h-10 sm:w-10" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {job.title}
              </h1>
              {companyId && (
                <Link
                  href={`/companies/${companyId}`}
                  className="mt-1 inline-flex items-center gap-2 text-lg text-slate-300 transition-colors hover:text-white"
                >
                  <Building2 className="h-4 w-4" />
                  {companyName}
                </Link>
              )}
              <p className="mt-1 text-sm text-slate-400">
                {job.employer?.employerProfile?.industry || "Hiring company"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {isOwner ? (
              <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>
                <Button variant="outline" className="w-full border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white">
                  Edit Job
                </Button>
              </Link>
            ) : (
              <>
                {userRole === "JOB_SEEKER" && (
                  <SaveJobButton jobId={job.id} />
                )}
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 px-8 text-lg font-bold shadow-lg hover:from-blue-600 hover:to-emerald-600"
                  disabled={isApplied || userRole !== "JOB_SEEKER"}
                  onClick={onApplyClick}
                >
                  {isApplied ? "✓ Applied" : "Apply Now"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
            <MapPin className="h-4 w-4 text-slate-300" />
            <span className="text-sm font-medium">{job.location}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          </div>
          <Badge
            variant="outline"
            className={`border-slate-600 bg-white/10 px-4 py-2 text-slate-200 ${jobTypeStyles[job.jobType] || ""}`}
          >
            <Briefcase className="mr-1 h-3 w-3" />
            {job.jobType.replaceAll("_", " ")}
          </Badge>
          <Badge variant="outline" className="border-slate-600 bg-white/10 px-4 py-2 text-slate-200">
            {job.experience} Level
          </Badge>
          {job.applicationDeadline && (
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">
                Closes {new Date(job.applicationDeadline).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Calendar className="h-4 w-4 text-slate-300" />
            <span className="text-sm text-slate-300">Posted {formatDate(job.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
