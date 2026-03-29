"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bookmark,
  Search,
  Sparkles,
  LayoutGrid,
  Rows3,
  Briefcase,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SavedJob = {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: string;
  jobType: "FULL_TIME" | "PART_TIME" | "REMOTE" | "CONTRACT" | "INTERNSHIP";
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "DRAFT" | "REJECTED";
  createdAt: string;
  applicationDeadline?: string;
  employerId: string;
  employer?: {
    id: string;
    name?: string | null;
    employerProfile?: {
      companyName?: string | null;
    } | null;
  };
};

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchSavedJobs = async (): Promise<void> => {
      try {
        const response = await fetch("/api/users/saved-jobs");
        const data = (await response.json()) as SavedJob[];
        const mapped: SavedJob[] = data.map((job) => ({
          ...job,
          salaryMin: job.salaryMin ?? undefined,
          salaryMax: job.salaryMax ?? undefined,
          salaryType: job.salaryType ?? undefined,
          applicationDeadline: job.applicationDeadline ?? undefined,
          companyName:
            job.employer?.employerProfile?.companyName ||
            job.employer?.name ||
            "Company",
        }));
        setJobs(mapped);
      } catch {
        toast.error("Failed to load saved jobs");
      } finally {
        setLoading(false);
      }
    };

    void fetchSavedJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-[2rem]" />
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              : "space-y-3"
          }
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-[1.75rem]" />
          ))}
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="border-white/80 bg-white/94">
        <CardContent className="py-14 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <Bookmark className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-950">No saved jobs yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            Save roles you want to revisit, compare, and apply for later.
          </p>
          <Link href="/jobs">
            <Button className="mt-5">Browse Jobs</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="surface-inverse relative overflow-hidden rounded-[2rem] border border-white/10 p-5 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(167,243,208,0.20),_transparent_22%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
          <div className="max-w-2xl">
            <div className="eyebrow border-white/10 bg-white/10 text-emerald-50">
              <Sparkles className="h-3.5 w-3.5" />
              Saved roles
            </div>
            <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] text-white lg:text-5xl">
              Your shortlist, ready when you are.
            </h1>
            <p className="mt-3 text-sm leading-7 text-emerald-50/85 lg:text-base">
              Keep a clean stack of interesting roles, scan them quickly, and jump back in when it is time to apply.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-white">Saved momentum</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight">{jobs.length}</p>
            <p className="mt-1 text-sm text-emerald-50/80">
              role{jobs.length !== 1 ? "s" : ""} ready to review
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-50">
              <MapPin className="h-3.5 w-3.5" />
              Stay organized
            </div>
          </div>
        </div>
      </section>

      <Card className="border-white/80 bg-white/94">
        <CardContent className="p-4 lg:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-xl flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search saved jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-[1rem] bg-slate-100 p-1 sm:flex">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "rounded-[0.85rem] px-3 py-2 transition-colors",
                    viewMode === "grid"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "rounded-[0.85rem] px-3 py-2 transition-colors",
                    viewMode === "list"
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  <Rows3 className="h-5 w-5" />
                </button>
              </div>

              <Link href="/jobs">
                <Button variant="outline">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Discover Jobs
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredJobs.length === 0 ? (
        <Card className="border-white/80 bg-white/94">
          <CardContent className="py-14 text-center">
            <Search className="mx-auto mb-3 h-8 w-8 text-slate-400" />
            <h3 className="font-semibold text-slate-950">No jobs found</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try a different title, company, or location.
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              employerId={job.employerId}
              job={job}
              userRole="JOB_SEEKER"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <Link href={`/jobs/${job.slug}`} key={job.id}>
              <Card className="border-white/80 bg-white/94 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-slate-950">{job.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{job.companyName}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">{job.location}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          {job.jobType.replaceAll("_", " ")}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          Saved {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      Open
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
