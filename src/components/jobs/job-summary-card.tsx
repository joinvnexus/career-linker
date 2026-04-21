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
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobShareButton } from "@/components/job-share-button";
import { SaveJobButton } from "@/components/save-job-button";
import { cn } from "@/lib/utils";

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
  const fmt = (v: number) => `$${v.toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return max ? `Up to ${fmt(max)}` : "Competitive";
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SnapshotRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: "green" | "amber" | "none";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm",
        accent === "green" && "bg-emerald-50/80",
        accent === "amber" && "bg-amber-50/70",
        (!accent || accent === "none") && "bg-slate-50/80",
      )}
    >
      <span
        className={cn(
          "flex-shrink-0",
          accent === "green" && "text-emerald-600",
          accent === "amber" && "text-amber-600",
          (!accent || accent === "none") && "text-slate-500",
        )}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500">{label}</p>
        <p
          className={cn(
            "mt-0.5 font-semibold",
            accent === "green" && "text-emerald-700",
            accent === "amber" && "text-amber-700",
            (!accent || accent === "none") && "text-slate-800",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
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
  const companyId   = job.employer?.id;
  const isJobSeeker = userRole === "JOB_SEEKER";
  const isEmployer  = userRole === "EMPLOYER";

  return (
    <div className="space-y-5">
      {/* ── CTA CARD ── */}
      <div className="sticky top-24 overflow-hidden rounded-3xl border border-white/80 bg-white/94 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)]">
        {/* dark gradient panel */}
        <div className="relative overflow-hidden rounded-2xl m-5 bg-gradient-to-b from-slate-950 to-sky-900 p-5 text-white">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sky-400/15 blur-2xl" />
          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sky-200 ring-1 ring-white/10">
              <Sparkles className="h-3 w-3" />
              Ready to move?
            </div>
            <p className="text-sm leading-6 text-slate-300">
              Keep high-signal details in view while reviewing the role. Apply when ready.
            </p>

            <div className="mt-5">
              {isOwner ? (
                <Link href={`/dashboard/employer/jobs/${job.id}/edit`} className="block">
                  <Button className="w-full bg-white font-bold text-slate-950 hover:bg-slate-100">
                    Edit This Job
                  </Button>
                </Link>
              ) : isJobSeeker ? (
                <Button
                  onClick={onApplyClick}
                  disabled={isApplied}
                  className="w-full bg-white font-bold text-slate-950 hover:bg-slate-100 disabled:opacity-60"
                >
                  {isApplied ? "Application Submitted ✓" : "Apply for this Job"}
                </Button>
              ) : isEmployer ? (
                <p className="rounded-xl bg-white/10 p-4 text-center text-sm text-slate-300 ring-1 ring-white/10">
                  Employer accounts cannot apply to jobs.
                </p>
              ) : (
                <Link href="/login" className="block">
                  <Button className="w-full bg-white font-bold text-slate-950 hover:bg-slate-100">
                    Sign in to Apply
                  </Button>
                </Link>
              )}
            </div>

            {isJobSeeker && !isOwner && (
              <div className="mt-3 flex gap-2">
                <div className="flex-shrink-0">
                  <SaveJobButton jobId={job.id} />
                </div>
                <div className="flex-1">
                  <JobShareButton
                    jobTitle={job.title}
                    companyName={companyName}
                    jobSlug={job.slug}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* snapshot rows */}
        <div className="space-y-2 px-5 pb-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            Job snapshot
          </p>

          <SnapshotRow
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
            value={job.location}
          />
          <SnapshotRow
            icon={<DollarSign className="h-4 w-4" />}
            label={job.salaryType ?? "Salary range"}
            value={formatSalary(job.salaryMin, job.salaryMax)}
            accent="green"
          />
          <SnapshotRow
            icon={<Briefcase className="h-4 w-4" />}
            label="Job type"
            value={job.jobType.replaceAll("_", " ")}
          />
          <SnapshotRow
            icon={<Users className="h-4 w-4" />}
            label="Experience level"
            value={job.experience}
          />
          {job.applicationDeadline && (
            <SnapshotRow
              icon={<Clock3 className="h-4 w-4" />}
              label="Application deadline"
              value={formatDate(job.applicationDeadline)}
              accent="amber"
            />
          )}
          <SnapshotRow
            icon={<Calendar className="h-4 w-4" />}
            label="Posted"
            value={formatDate(job.createdAt)}
          />
        </div>
      </div>

      {/* ── COMPANY CARD ── */}
      <div className="rounded-3xl border border-white/80 bg-white/94 p-5 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)]">
        <p className="mb-4 text-sm font-semibold text-slate-900">About {companyName}</p>

        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-md shadow-emerald-500/20">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-900">{companyName}</h3>
            <p className="text-sm text-slate-500">
              {job.employer?.employerProfile?.industry || "Technology"}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {job.employer?.employerProfile?.companySize && (
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">
                {job.employer.employerProfile.companySize} employees
              </span>
            </div>
          )}
          {job.employer?.employerProfile?.location && (
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">{job.employer.employerProfile.location}</span>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          {companyId && (
            <Link href={`/companies/${companyId}`} className="block">
              <Button
                variant="outline"
                className="w-full border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50"
              >
                View Company Profile
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
          {job.employer?.employerProfile?.companyWebsite && (
            <a
              href={job.employer.employerProfile.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 transition-colors hover:text-sky-800"
            >
              <Globe className="h-4 w-4" />
              Visit company website
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}