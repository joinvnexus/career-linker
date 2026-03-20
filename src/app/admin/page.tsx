"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Briefcase, UserCheck, Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type AdminStats = {
  totalUsers: number;
  roleBreakdown: {
    jobSeekers: number;
    employers: number;
    admins: number;
  };
  jobs: {
    total: number;
    pending: number;
    active: number;
    rejected: number;
  };
  applications: {
    total: number;
    hired: number;
  };
  recentUsers: Array<{
    id: string;
    name?: string | null;
    email: string;
    role: string;
    createdAt: string;
  }>;
  recentJobs: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    employer: {
      name?: string | null;
      employerProfile?: { companyName?: string | null } | null;
    };
  }>;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async (): Promise<void> => {
      try {
        const response = await fetch("/api/admin/stats");
        const data = (await response.json()) as AdminStats;
        setStats(data);
      } finally {
        setLoading(false);
      }
    };

    void loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600">
            Monitor users, moderate jobs, and keep the marketplace healthy.
          </p>
        </div>
        <Link href="/admin/jobs/pending">
          <Button>
            Review Pending Jobs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          change={`${stats.roleBreakdown.employers} employers`}
          trend="up"
          icon={<Users className="h-7 w-7" />}
        />
        <StatsCard
          title="Pending Jobs"
          value={stats.jobs.pending}
          change={`${stats.jobs.active} active listings`}
          trend={stats.jobs.pending > 0 ? "down" : "neutral"}
          icon={<Briefcase className="h-7 w-7" />}
        />
        <StatsCard
          title="Applications"
          value={stats.applications.total}
          change={`${stats.applications.hired} hires`}
          trend="up"
          icon={<UserCheck className="h-7 w-7" />}
        />
        <StatsCard
          title="Admins"
          value={stats.roleBreakdown.admins}
          change={`${stats.roleBreakdown.jobSeekers} seekers`}
          trend="neutral"
          icon={<Users className="h-7 w-7" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Users</CardTitle>
            <Link href="/admin/users">
              <Button variant="ghost">Manage</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{user.name || "Unnamed user"}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{user.role.replaceAll("_", " ")}</Badge>
                  <span className="text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Jobs</CardTitle>
            <Link href="/admin/jobs">
              <Button variant="ghost">Moderate</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col gap-2 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{job.title}</p>
                  <p className="text-sm text-slate-500">
                    {job.employer.employerProfile?.companyName || job.employer.name || "Employer"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={job.status === "ACTIVE" ? "success" : "secondary"}>
                    {job.status.replaceAll("_", " ")}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
