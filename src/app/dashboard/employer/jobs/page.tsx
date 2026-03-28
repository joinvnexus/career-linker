"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, Edit, Trash2, MapPin, DollarSign, Sparkles, CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type EmployerJob = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  location: string;
  salaryMin?: number | null;
  paymentStatus?: string;
  published?: boolean;
};

export default function EmployerJobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      void fetchMyJobs();
    }
  }, [session]);

  const fetchMyJobs = async () => {
    try {
      const res = await fetch(`/api/jobs/my-jobs`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch {
      console.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
      void fetchMyJobs();
    } catch {
      console.error("Failed to delete job");
    }
  };

  const payForJob = async (jobId: string) => {
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        console.error("Failed to start payment");
        return;
      }
      window.location.href = data.url;
    } catch {
      console.error("Failed to start payment");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="h-56 animate-pulse rounded-[2rem] border-white/80 bg-white/90" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="h-72 animate-pulse rounded-[1.75rem] border-white/80 bg-white/90" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(140deg,_rgba(15,23,42,0.96),_rgba(30,41,59,0.94)_40%,_rgba(8,145,178,0.86))] p-5 text-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.9)] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.16),_transparent_24%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Job management
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-5xl">Manage your active roles with less friction.</h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              Review payment state, keep listings current, and jump into edits or applicants from one clean view.
            </p>
          </div>
          <Link href="/dashboard/employer/post-job">
            <Button className="bg-white text-slate-950 hover:bg-slate-100">
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </Link>
        </div>
      </section>

      {jobs.length === 0 ? (
        <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
          <CardHeader className="text-center">
            <Eye className="mx-auto mb-4 h-16 w-16 text-slate-400" />
            <CardTitle className="text-2xl text-slate-950">No jobs posted yet</CardTitle>
            <CardDescription>
              Post your first job to start receiving applications from qualified candidates.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard/employer/post-job">
              <Button className="bg-slate-950 text-white hover:bg-slate-800">
                Post Your First Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="group border-white/80 bg-white/92 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.75)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_55px_-34px_rgba(14,165,233,0.24)]"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <CardTitle className="text-xl font-bold tracking-tight text-slate-950 group-hover:text-sky-700">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant={job.status === "ACTIVE" ? "success" : "secondary"}>
                        {job.status.replace("_", " ")}
                      </Badge>
                      <Badge variant="secondary">
                        {job.paymentStatus === "PAID" ? "Paid" : "Unpaid"}
                      </Badge>
                      <span className="text-sm text-slate-500">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {job.paymentStatus !== "PAID" && (
                      <Button variant="outline" size="sm" onClick={() => payForJob(job.id)}>
                        <CreditCard className="mr-1 h-4 w-4" />
                        Pay
                      </Button>
                    )}
                    <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteJob(job.id)}
                      className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 text-sm">
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-700">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salaryMin ? `$${job.salaryMin}k+` : "Competitive"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
