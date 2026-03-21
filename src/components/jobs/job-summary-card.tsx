"use client";

import Link from "next/link";
import { Building2, MapPin, Globe, Calendar, DollarSign, Briefcase, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobShareButton } from "@/components/job-share-button";
import { SaveJobButton } from "@/components/save-job-button";

interface JobSummaryCardProps {
  job: {
    id: string;
    slug: string;
    title: string;
    location: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    salaryType?: string | null;
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
        companySize?: string | null;
      } | null;
    };
  };
  isApplied: boolean;
  isOwner: boolean;
  userRole?: string;
  onApplyClick: () => void;
}

function formatSalary(min?: number | null, max?: number | null): string {
  if (!min && !max) return "Competitive";
  const format = (val: number) => `$${val.toLocaleString()}`;
  if (min && max) return `${format(min)} - ${format(max)}`;
  if (min) return `${format(min)}+`;
  return max ? `Up to ${format(max)}` : "Competitive";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function JobSummaryCard({
  job,
  isApplied,
  isOwner,
  userRole,
  onApplyClick,
}: JobSummaryCardProps) {
  const companyName =
    job.employer?.employerProfile?.companyName || job.employer?.name || "Company";
  const companyId = job.employer?.id;

  return (
    <div className="space-y-6">
      {/* Apply Card */}
      <Card className="sticky top-24 border-0 shadow-xl">
        <CardContent className="p-6">
          {isOwner ? (
            <Link href={`/dashboard/employer/jobs/${job.id}/edit`} className="block">
              <button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02] hover:shadow-lg">
                Edit This Job
              </button>
            </Link>
          ) : userRole === "JOB_SEEKER" ? (
            <button
              onClick={onApplyClick}
              disabled={isApplied}
              className={`w-full rounded-xl px-6 py-3 font-semibold text-white transition-all hover:shadow-lg ${
                isApplied
                  ? "bg-green-500"
                  : "bg-gradient-to-r from-blue-500 to-emerald-500 hover:scale-[1.02]"
              }`}
            >
              {isApplied ? "✓ Application Submitted" : "Apply for this Job"}
            </button>
          ) : userRole === "EMPLOYER" ? (
            <p className="rounded-xl bg-slate-100 p-4 text-center text-sm text-slate-600">
              Employer accounts cannot apply to jobs
            </p>
          ) : (
            <Link href="/login" className="block">
              <button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.02] hover:shadow-lg">
                Sign in to Apply
              </button>
            </Link>
          )}

          <div className="mt-4 flex gap-3">
            {userRole === "JOB_SEEKER" && !isOwner && (
              <SaveJobButton jobId={job.id} />
            )}
            <div className="flex-1">
              <JobShareButton
                jobTitle={job.title}
                companyName={companyName}
                jobSlug={job.slug}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Summary */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
            <div>
              <p className="font-medium text-slate-900">Location</p>
              <p className="text-sm text-slate-600">{job.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <DollarSign className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
            <div>
              <p className="font-medium text-slate-900">Salary Range</p>
              <p className="text-sm font-semibold text-emerald-600">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </p>
              {job.salaryType && (
                <p className="text-xs text-slate-500">{job.salaryType}</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Briefcase className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
            <div>
              <p className="font-medium text-slate-900">Job Type</p>
              <Badge variant="secondary" className="mt-1">
                {job.jobType.replaceAll("_", " ")}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
            <div>
              <p className="font-medium text-slate-900">Experience Level</p>
              <p className="text-sm text-slate-600">{job.experience}</p>
            </div>
          </div>

          {job.applicationDeadline && (
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
              <div>
                <p className="font-medium text-slate-900">Application Deadline</p>
                <p className="text-sm text-amber-600">
                  {formatDate(job.applicationDeadline)}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
            <div>
              <p className="font-medium text-slate-900">Posted</p>
              <p className="text-sm text-slate-600">{formatDate(job.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Card */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">About {companyName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{companyName}</h3>
              <p className="text-sm text-slate-500">
                {job.employer?.employerProfile?.industry || "Technology"}
              </p>
            </div>
          </div>

          {job.employer?.employerProfile?.companySize && (
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Company Size</p>
                <p className="text-sm text-slate-600">
                  {job.employer.employerProfile.companySize} employees
                </p>
              </div>
            </div>
          )}

          {job.employer?.employerProfile?.location && (
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Headquarters</p>
                <p className="text-sm text-slate-600">
                  {job.employer.employerProfile.location}
                </p>
              </div>
            </div>
          )}

          {companyId && (
            <Link
              href={`/companies/${companyId}`}
              className="block pt-2"
            >
              <button className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                View Company Profile
              </button>
            </Link>
          )}

          {job.employer?.employerProfile?.companyWebsite && (
            <a
              href={job.employer.employerProfile.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <Globe className="h-4 w-4" />
              Visit company website
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
