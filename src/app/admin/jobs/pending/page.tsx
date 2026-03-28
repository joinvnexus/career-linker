"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowUpRight, Clock3 } from "lucide-react";
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
        <Skeleton className="h-44 w-full rounded-[28px]" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-44 w-full rounded-[24px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#450a0a_0%,#7f1d1d_38%,#0f172a_100%)] p-6 text-white shadow-[0_28px_90px_-54px_rgba(15,23,42,0.85)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Badge className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-100 hover:bg-white/10">
              Pending Queue
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Clear the moderation queue before weak listings hit the market.
            </h1>
            <p className="mt-3 text-sm text-slate-200 sm:text-base">
              Every card here represents a submission still waiting for review.
              The queue is designed for fast triage on both desktop and mobile.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-[24rem]">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-amber-300" />
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Waiting now</p>
              </div>
              <p className="mt-2 text-3xl font-semibold">{jobs.length}</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-300" />
                <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Focus</p>
              </div>
              <p className="mt-2 text-sm text-slate-100">
                Prioritize unverified companies and unclear listings first.
              </p>
            </div>
          </div>
        </div>
        <Link href="/admin/jobs">
          <Button
            variant="outline"
            className="mt-6 rounded-full border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white"
          >
            Open All Jobs
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      {jobs.length === 0 ? (
        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
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
            <Card
              key={job.id}
              className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)]"
            >
              <CardContent className="flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-semibold text-slate-900">{job.title}</p>
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      {job.jobType.replaceAll("_", " ")}
                    </Badge>
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      {job.location}
                    </Badge>
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
                  <Button className="rounded-full" onClick={() => void reviewJob(job.id, true)}>
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full text-rose-600 hover:bg-rose-50 hover:text-rose-700"
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
