"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, DollarSign, Clock, ChevronRight } from "lucide-react";
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

/**
 * API response job type from /api/jobs endpoint
 */
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
    <Card className="group h-full border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link href={`/jobs/${job.slug}`}>
              <h4 className="line-clamp-1 text-sm font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                {job.title}
              </h4>
            </Link>
            <p className="mt-0.5 text-sm text-slate-500">{job.companyName}</p>
          </div>
          <Badge
            variant="secondary"
            className={`flex-shrink-0 text-xs ${jobTypeStyles[job.jobType] || ""}`}
          >
            {job.jobType.replace("_", " ")}
          </Badge>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {job.location}
          </span>
          {job.salaryMin || job.salaryMax ? (
            <span className="flex items-center gap-1 text-emerald-600">
              <DollarSign className="h-3 w-3" />
              {formatSalary(job.salaryMin, job.salaryMax)}
            </span>
          ) : null}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(job.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function SimilarJobSkeleton() {
  return (
    <Card className="h-full border border-slate-200">
      <CardContent className="p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-2 h-3 w-1/2" />
        <div className="mt-3 flex gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
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
            companyName: job.employer?.employerProfile?.companyName || job.employer?.name || "Company",
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
        <h3 className="text-lg font-semibold text-slate-900">Similar Jobs</h3>
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
        <h3 className="text-lg font-semibold text-slate-900">Similar Jobs</h3>
        <Link href="/jobs" className="group flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
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
