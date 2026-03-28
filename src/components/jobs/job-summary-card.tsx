"use client";

import Link from "next/link";
import {
  Building2,
  MapPin,
  Globe,
  Calendar,
  DollarSign,
  Briefcase,
  Clock3,
  Users,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobShareButton } from "@/components/job-share-button";
import { SaveJobButton } from "@/components/save-job-button";
import { Button } from "@/components/ui/button";

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
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
      <Card className="sticky top-24 border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.85)]">
        <CardContent className="p-6">
          <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,_rgba(15,23,42,0.98),_rgba(3,105,161,0.92))] p-5 text-white">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-100">
              <Sparkles className="h-3.5 w-3.5" />
              Ready to move?
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-200">
              This sidebar keeps the high-signal details close while you review the role.
            </p>

            <div className="mt-5">
              {isOwner ? (
                <Link href={`/dashboard/employer/jobs/${job.id}/edit`} className="block">
                  <Button className="w-full bg-white text-slate-950 hover:bg-slate-100">
                    Edit This Job
                  </Button>
                </Link>
              ) : userRole === "JOB_SEEKER" ? (
                <Button
                  onClick={onApplyClick}
                  disabled={isApplied}
                  className="w-full bg-white text-slate-950 hover:bg-slate-100"
                >
                  {isApplied ? "Application Submitted" : "Apply for this Job"}
                </Button>
              ) : userRole === "EMPLOYER" ? (
                <p className="rounded-2xl bg-white/10 p-4 text-center text-sm text-slate-200">
                  Employer accounts cannot apply to jobs.
                </p>
              ) : (
                <Link href="/login" className="block">
                  <Button className="w-full bg-white text-slate-950 hover:bg-slate-100">
                    Sign in to Apply
                  </Button>
                </Link>
              )}
            </div>

            <div className="mt-4 flex gap-3">
              {userRole === "JOB_SEEKER" && !isOwner && <SaveJobButton jobId={job.id} />}
              <div className="flex-1">
                <JobShareButton
                  jobTitle={job.title}
                  companyName={companyName}
                  jobSlug={job.slug}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
        <CardHeader>
          <CardTitle className="text-lg text-slate-950">Job snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-4">
            <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
            <div>
              <p className="font-medium text-slate-900">Location</p>
              <p className="text-sm text-slate-600">{job.location}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/70 p-4">
            <DollarSign className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
            <div>
              <p className="font-medium text-slate-900">Salary range</p>
              <p className="text-sm font-semibold text-emerald-700">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </p>
              {job.salaryType && <p className="text-xs text-slate-500">{job.salaryType}</p>}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-4">
            <Briefcase className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
            <div>
              <p className="font-medium text-slate-900">Job type</p>
              <Badge variant="secondary" className="mt-1 rounded-full">
                {job.jobType.replaceAll("_", " ")}
              </Badge>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-4">
            <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
            <div>
              <p className="font-medium text-slate-900">Experience level</p>
              <p className="text-sm text-slate-600">{job.experience}</p>
            </div>
          </div>

          {job.applicationDeadline && (
            <div className="flex items-start gap-3 rounded-2xl bg-amber-50/70 p-4">
              <Clock3 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-slate-900">Application deadline</p>
                <p className="text-sm text-amber-700">{formatDate(job.applicationDeadline)}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-4">
            <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
            <div>
              <p className="font-medium text-slate-900">Posted</p>
              <p className="text-sm text-slate-600">{formatDate(job.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
        <CardHeader>
          <CardTitle className="text-lg text-slate-950">About {companyName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900">{companyName}</h3>
              <p className="text-sm text-slate-500">
                {job.employer?.employerProfile?.industry || "Technology"}
              </p>
            </div>
          </div>

          {job.employer?.employerProfile?.companySize && (
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-4">
              <Users className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-500" />
              <div>
                <p className="font-medium text-slate-900">Company size</p>
                <p className="text-sm text-slate-600">
                  {job.employer.employerProfile.companySize} employees
                </p>
              </div>
            </div>
          )}

          {job.employer?.employerProfile?.location && (
            <div className="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-4">
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
            <Link href={`/companies/${companyId}`} className="block">
              <Button variant="outline" className="w-full border-slate-200 bg-white/80">
                View Company Profile
              </Button>
            </Link>
          )}

          {job.employer?.employerProfile?.companyWebsite && (
            <a
              href={job.employer.employerProfile.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-800"
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
