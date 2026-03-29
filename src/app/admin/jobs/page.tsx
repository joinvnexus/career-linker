"use client";

import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Clock3, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHero } from "@/components/admin/admin-page-hero";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("ALL");

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

  const activeCount = jobs.filter((job) => job.status === "ACTIVE").length;
  const pendingCount = jobs.filter((job) => job.status === "PENDING").length;
  const rejectedCount = jobs.filter((job) => job.status === "REJECTED").length;
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const employerName =
        job.employer?.employerProfile?.companyName || job.employer?.name || "Employer";
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(query) ||
        employerName.toLowerCase().includes(query) ||
        (job.employer?.email || "").toLowerCase().includes(query) ||
        (job.category?.name || "").toLowerCase().includes(query);
      const matchesVisibility =
        visibilityFilter === "ALL" ||
        (visibilityFilter === "PUBLISHED" && job.published) ||
        (visibilityFilter === "HIDDEN" && !job.published);
      return matchesSearch && matchesVisibility;
    });
  }, [jobs, searchQuery, visibilityFilter]);

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

  return (
    <div className="space-y-8">
      <AdminPageHero
        badge="Job Moderation"
        title="Approve faster without letting weak listings slip through."
        description="Filter the full jobs inventory, audit employer submissions, and update visibility in a single responsive moderation workspace."
        gradientClassName="bg-[linear-gradient(135deg,#082f49_0%,#0f172a_52%,#1d4ed8_100%)]"
        stats={[
          { label: "Jobs in view", value: filteredJobs.length },
          { label: "Pending", value: pendingCount },
          { label: "Approved live", value: activeCount },
        ]}
        actions={
          <div className="w-full sm:max-w-sm">
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
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Jobs in View"
          value={filteredJobs.length}
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

      <Card className="rounded-[28px] border border-white/70 bg-white/90 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
        <CardContent className="grid gap-3 p-5 lg:grid-cols-[minmax(0,1fr)_180px]">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search title, company, email, category..."
              className="h-11 rounded-full border-slate-300 bg-white pl-10"
            />
          </div>
          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger className="h-11 w-full rounded-full border-slate-300 bg-white">
              <SelectValue placeholder="Visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All visibility</SelectItem>
              <SelectItem value="PUBLISHED">Published only</SelectItem>
              <SelectItem value="HIDDEN">Hidden only</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filteredJobs.length === 0 ? (
        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">No jobs found</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Try a different moderation or search filter.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => {
            const employerName =
              job.employer?.employerProfile?.companyName || job.employer?.name || "Employer";

            return (
              <Card
                key={job.id}
                className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-56px_rgba(15,23,42,0.45)]"
              >
                <CardContent className="flex flex-col gap-5 py-5 xl:flex-row xl:items-center xl:justify-between">
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
                  <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
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
                      <SelectTrigger className="h-10 w-full rounded-full border-slate-300 bg-white sm:w-44">
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
