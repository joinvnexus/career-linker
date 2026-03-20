"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type PendingJob = {
  id: string;
  title: string;
  location: string;
  jobType: string;
  status: string;
  createdAt: string;
  employer: {
    id: string;
    name?: string | null;
    email?: string | null;
    employerProfile?: {
      companyName?: string | null;
      isVerified?: boolean | null;
    } | null;
  };
  category?: {
    name?: string | null;
  } | null;
};

export default function PendingJobsPage() {
  const [jobs, setJobs] = useState<PendingJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async (): Promise<void> => {
      try {
        const response = await fetch("/api/admin/jobs/pending");
        const data = (await response.json()) as { jobs?: PendingJob[] };
        setJobs(data.jobs ?? []);
      } catch {
        toast.error("Failed to load pending jobs");
      } finally {
        setLoading(false);
      }
    };

    void loadJobs();
  }, []);

  const reviewJob = async (jobId: string, approved: boolean): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error || "Failed to update job");
        return;
      }

      setJobs((current) => current.filter((job) => job.id !== jobId));
      toast.success(approved ? "Job approved" : "Job rejected");
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-72" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pending Job Approvals</h1>
          <p className="mt-1 text-slate-600">
            Review jobs awaiting moderation before they appear publicly.
          </p>
        </div>
        <Link href="/admin/jobs">
          <Button variant="outline">Open All Jobs</Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>No jobs waiting for approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">The moderation queue is clear right now.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="border-0 shadow-md">
              <CardContent className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-slate-900">{job.title}</p>
                    <Badge variant="secondary">{job.jobType.replaceAll("_", " ")}</Badge>
                    <Badge variant="outline">{job.location}</Badge>
                  </div>
                  <p className="text-sm text-slate-600">
                    {job.employer.employerProfile?.companyName || job.employer.name || "Employer"}
                    {" | "}
                    {job.category?.name || "General"}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>{job.employer.email || "No email"}</span>
                    <span>Submitted {new Date(job.createdAt).toLocaleDateString()}</span>
                    <span>
                      Company verified:{" "}
                      {job.employer.employerProfile?.isVerified ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => void reviewJob(job.id, true)}>Approve</Button>
                  <Button
                    variant="outline"
                    className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => void reviewJob(job.id, false)}
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
