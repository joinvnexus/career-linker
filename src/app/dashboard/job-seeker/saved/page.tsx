"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-80 w-full" />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center">
          <Bookmark className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <CardTitle className="text-2xl">No saved jobs yet</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Saved Jobs</h1>
        <p className="mt-1 text-slate-600">Jobs you bookmarked for later review.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} employerId={job.employerId} job={job} userRole="JOB_SEEKER" />
        ))}
      </div>
    </div>
  );
}
