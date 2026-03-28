"use client";

import { useEffect, useState } from "react";
import { BriefcaseBusiness, Clock3, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type JobItem = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  published: boolean;
  employer?: {
    id: string;
    name?: string | null;
    email?: string | null;
    employerProfile?: { companyName?: string | null };
  };
  category?: { name?: string | null };
};

const statusOptions = ["PENDING", "ACTIVE", "DRAFT", "EXPIRED", "REJECTED"];

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const load = async (): Promise<void> => {
      setLoading(true);

      try {
        const query = statusFilter === "ALL" ? "" : `?status=${statusFilter}`;
        const res = await fetch(`/api/admin/jobs${query}`);
        const data = (await res.json()) as { jobs?: JobItem[] };
        setJobs(data.jobs || []);
      } catch {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [statusFilter]);

  const updateStatus = async (id: string, status: string): Promise<void> => {
    try {
      const published = status === "ACTIVE";
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, published }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        toast.error(data.error || "Failed to update job");
        return;
      }

      setJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...job, status, published } : job))
      );
      toast.success("Job updated");
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="h-48 animate-pulse rounded-[28px]" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="h-24 animate-pulse rounded-[24px]" />
        ))}
      </div>
    );
  }

  const activeCount = jobs.filter((job) => job.status === "ACTIVE").length;
  const pendingCount = jobs.filter((job) => job.status === "PENDING").length;
  const rejectedCount = jobs.filter((job) => job.status === "REJECTED").length;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#082f49_0%,#0f172a_52%,#1d4ed8_100%)] p-6 text-white shadow-[0_28px_90px_-54px_rgba(15,23,42,0.85)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Badge className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-100 hover:bg-white/10">
              Job Moderation
            </Badge>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Approve faster without letting weak listings slip through.
            </h1>
            <p className="mt-3 text-sm text-slate-200 sm:text-base">
              Filter the full jobs inventory, audit employer submissions, and update
              visibility in a single responsive moderation workspace.
            </p>
          </div>
          <div className="w-full max-w-sm">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 rounded-full border-white/15 bg-white/10 px-5 text-white backdrop-blur [&>svg]:text-white">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.replaceAll("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Jobs in View"
          value={jobs.length}
          change={statusFilter === "ALL" ? "Full inventory" : `${statusFilter} filter applied`}
          trend="neutral"
          icon={<BriefcaseBusiness className="h-7 w-7" />}
        />
        <StatsCard
          title="Pending"
          value={pendingCount}
          change="Listings awaiting approval"
          trend={pendingCount > 0 ? "down" : "neutral"}
          icon={<Clock3 className="h-7 w-7" />}
        />
        <StatsCard
          title="Approved Live"
          value={activeCount}
          change={`${rejectedCount} rejected`}
          trend="up"
          icon={<ShieldCheck className="h-7 w-7" />}
        />
      </div>

      {jobs.length === 0 ? (
        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">No jobs found</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Try a different moderation filter.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => {
            const employerName =
              job.employer?.employerProfile?.companyName || job.employer?.name || "Employer";

            return (
              <Card
                key={job.id}
                className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)]"
              >
                <CardContent className="flex flex-col gap-5 py-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-lg font-semibold text-gray-900">{job.title}</div>
                      <Badge variant="secondary" className="rounded-full px-3 py-1">
                        {job.category?.name || "General"}
                      </Badge>
                      <Badge
                        variant={job.status === "ACTIVE" ? "success" : "outline"}
                        className="rounded-full px-3 py-1"
                      >
                        {job.status.replaceAll("_", " ")}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{employerName}</div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>{job.published ? "Published publicly" : "Hidden from marketplace"}</span>
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                      <span>{job.employer?.email || "No employer email"}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => void updateStatus(job.id, "ACTIVE")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => void updateStatus(job.id, "REJECTED")}
                    >
                      Reject
                    </Button>
                    <Select
                      value={job.status}
                      onValueChange={(value) => void updateStatus(job.id, value)}
                    >
                      <SelectTrigger className="h-10 w-44 rounded-full border-slate-300 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replaceAll("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
