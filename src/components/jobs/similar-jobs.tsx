"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, DollarSign, Clock3, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
    employerProfile?: {
      companyName?: string;
    } | null;
  } | null;
}

interface SimilarJobsProps {
  currentJobId: string;
  jobType?: string;
  location?: string;
}

const jobTypeStyles: Record<string, string> = {
  FULL_TIME: "bg-emerald-50 text-emerald-700",
  PART_TIME: "bg-amber-50 text-amber-700",
  REMOTE: "bg-sky-50 text-sky-700",
  CONTRACT: "bg-violet-50 text-violet-700",
  INTERNSHIP: "bg-orange-50 text-orange-700",
};

function formatSalary(min?: number, max?: number): string {
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
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function SimilarJobCard({ job }: { job: SimilarJob }) {
  return (
    <Card className="group h-full border-white/80 bg-white/92 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.7)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-32px_rgba(14,165,233,0.28)]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <Link href={`/jobs/${job.slug}`}>
              <h4 className="line-clamp-2 text-base font-semibold tracking-tight text-slate-950 transition-colors group-hover:text-sky-700">
                {job.title}
              </h4>
            </Link>
            <p className="mt-1 text-sm text-slate-500">{job.companyName}</p>
          </div>
          <Badge
            variant="secondary"
            className={`flex-shrink-0 rounded-full text-[11px] font-semibold uppercase tracking-[0.16em] ${jobTypeStyles[job.jobType] || ""}`}
          >
            {job.jobType.replace("_", " ")}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
          {(job.salaryMin || job.salaryMax) && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700">
              <DollarSign className="h-3 w-3" />
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
            <Clock3 className="h-3 w-3" />
            {formatDate(job.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function SimilarJobSkeleton() {
  return (
    <Card className="h-full border-white/80 bg-white/92">
      <CardContent className="p-5">
        <Skeleton className="h-5 w-3/4 rounded-full" />
        <Skeleton className="mt-2 h-4 w-1/2 rounded-full" />
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SimilarJobs({ currentJobId, jobType, location }: SimilarJobsProps) {
  const [jobs, setJobs] = useState<SimilarJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          limit: "4",
          exclude: currentJobId,
        });

        if (jobType) params.set("jobType", jobType);
        if (location) params.set("location", location);

        const response = await fetch(`/api/jobs?${params.toString()}`);
        const data = await response.json();

        if (data.jobs) {
          const mappedJobs: SimilarJob[] = data.jobs.map((job: ApiJob) => ({
            id: job.id,
            slug: job.slug,
            title: job.title,
            companyName:
              job.employer?.employerProfile?.companyName ||
              job.employer?.name ||
              "Company",
            location: job.location,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            jobType: job.jobType,
            createdAt: job.createdAt,
          }));
          setJobs(mappedJobs.slice(0, 4));
        }
      } catch (err) {
        setError("Failed to load similar jobs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchSimilarJobs();
  }, [currentJobId, jobType, location]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">Similar Jobs</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SimilarJobSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error || jobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">Similar Jobs</h3>
        <Link
          href="/jobs"
          className="group inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-800"
        >
          View all jobs
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
