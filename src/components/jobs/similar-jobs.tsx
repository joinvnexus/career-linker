"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, DollarSign, Clock3, ChevronRight, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SimilarJob {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: string;
  createdAt: string;
}

interface ApiJob {
  id: string;
  slug: string;
  title: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType: string;
  createdAt: string;
  employer?: {
    name?: string;
    employerProfile?: { companyName?: string } | null;
  } | null;
}

interface SimilarJobsProps {
  currentJobId: string;
  jobType?: string;
  location?: string;
}

const typeConfig: Record<string, { label: string; cls: string }> = {
  FULL_TIME:  { label: "Full-time",  cls: "bg-emerald-50 text-emerald-700" },
  PART_TIME:  { label: "Part-time",  cls: "bg-amber-50  text-amber-700" },
  REMOTE:     { label: "Remote",     cls: "bg-sky-50    text-sky-700" },
  CONTRACT:   { label: "Contract",   cls: "bg-violet-50 text-violet-700" },
  INTERNSHIP: { label: "Internship", cls: "bg-orange-50 text-orange-700" },
};

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "";
  const fmt = (v: number) => `$${v.toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return max ? `Up to ${fmt(max)}` : "";
}

function timeAgo(dateString: string): string {
  const days = Math.ceil(
    Math.abs(new Date().getTime() - new Date(dateString).getTime()) / 86_400_000,
  );
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function SimilarJobCard({ job }: { job: SimilarJob }) {
  const cfg = typeConfig[job.jobType];
  const salary = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group block rounded-2xl border border-white/80 bg-white/92 p-5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200/60 hover:shadow-[0_16px_40px_-12px_rgba(14,165,233,0.18)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* company initial avatar */}
          <div className="mb-3 flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-xs font-bold text-white">
              {job.companyName.slice(0, 2).toUpperCase()}
            </div>
            <span className="truncate text-xs text-slate-500">{job.companyName}</span>
          </div>

          <h4 className="line-clamp-2 text-sm font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-sky-700">
            {job.title}
          </h4>
        </div>

        {cfg && (
          <span
            className={cn(
              "flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              cfg.cls,
            )}
          >
            {cfg.label}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1">
          <MapPin className="h-3 w-3" />
          {job.location}
        </span>

        {salary && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
            <DollarSign className="h-3 w-3" />
            {salary}
          </span>
        )}

        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1">
          <Clock3 className="h-3 w-3" />
          {timeAgo(job.createdAt)}
        </span>
      </div>
    </Link>
  );
}

function SimilarJobSkeleton() {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/92 p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4 rounded-full" />
      <Skeleton className="mt-1.5 h-4 w-1/2 rounded-full" />
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function SimilarJobs({ currentJobId, jobType, location }: SimilarJobsProps) {
  const [jobs, setJobs]       = useState<SimilarJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ limit: "4", exclude: currentJobId });
        if (jobType)  params.set("jobType", jobType);
        if (location) params.set("location", location);

        const res  = await fetch(`/api/jobs?${params.toString()}`);
        const data = await res.json();

        if (data.jobs) {
          setJobs(
            (data.jobs as ApiJob[]).slice(0, 4).map((j) => ({
              id:          j.id,
              slug:        j.slug,
              title:       j.title,
              companyName: j.employer?.employerProfile?.companyName || j.employer?.name || "Company",
              location:    j.location,
              salaryMin:   j.salaryMin,
              salaryMax:   j.salaryMax,
              jobType:     j.jobType,
              createdAt:   j.createdAt,
            })),
          );
        }
      } catch (err) {
        console.error("Failed to load similar jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    void fetchSimilarJobs();
  }, [currentJobId, jobType, location]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-slate-400" />
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">Similar Jobs</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SimilarJobSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
            <Briefcase className="h-4 w-4 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-slate-950">Similar Jobs</h3>
        </div>
        <Link
          href="/jobs"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-sky-700 transition-colors hover:text-sky-800"
        >
          View all
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {jobs.map((job) => (
          <SimilarJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}