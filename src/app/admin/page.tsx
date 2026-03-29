"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowRight,
  Clock3,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import { AdminPageHero } from "@/components/admin/admin-page-hero";
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
        <Skeleton className="h-52 w-full rounded-[32px]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-[28px]" />
          ))}
        </div>
      </div>
    );
  }

  const moderationPressure = stats.jobs.pending + stats.jobs.rejected;
  const hiringEfficiency =
    stats.applications.total > 0
      ? Math.round((stats.applications.hired / stats.applications.total) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <AdminPageHero
        badge="Admin Dashboard"
        title="Keep marketplace trust, growth, and moderation aligned."
        description="Live visibility into user growth, job quality, and hiring momentum so the operations team can move quickly without losing control."
        gradientClassName="surface-inverse"
        stats={[
          {
            label: "Moderation load",
            value: moderationPressure,
            description: "Pending or rejected listings need attention.",
          },
          {
            label: "Hiring rate",
            value: `${hiringEfficiency}%`,
            description: "Applications converting to hires.",
          },
          {
            label: "Admin seats",
            value: stats.roleBreakdown.admins,
            description: "People currently operating the system.",
          },
        ]}
        actions={
          <>
            <Link href="/admin/jobs/pending">
              <Button className="w-full rounded-full bg-white text-slate-950 hover:bg-slate-100 sm:w-auto">
                Review Pending Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button
                variant="outline"
                className="w-full rounded-full border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white sm:w-auto"
              >
                Open Reports
              </Button>
            </Link>
          </>
        }
      />

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
          icon={<Clock3 className="h-7 w-7" />}
        />
        <StatsCard
          title="Applications"
          value={stats.applications.total}
          change={`${stats.applications.hired} hires`}
          trend="up"
          icon={<UserCheck className="h-7 w-7" />}
        />
        <StatsCard
          title="Admin Team"
          value={stats.roleBreakdown.admins}
          change={`${stats.roleBreakdown.jobSeekers} seekers`}
          trend="neutral"
          icon={<ShieldAlert className="h-7 w-7" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
        <Card className="overflow-hidden rounded-[28px] border border-white/70 bg-white/94">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl text-slate-950">Recent Users</CardTitle>
              <p className="text-sm text-slate-500">
                Fresh accounts joining the marketplace today.
              </p>
            </div>
            <Link href="/admin/users">
              <Button variant="ghost" className="rounded-full text-slate-700">
                Manage Users
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{user.name || "Unnamed user"}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {user.role.replaceAll("_", " ")}
                  </Badge>
                  <span className="text-sm text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="overflow-hidden rounded-[28px] border border-white/70 bg-white/94">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Operations Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950 p-4 text-white">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-sky-300" />
                  <p className="text-sm font-medium text-slate-200">Review queue</p>
                </div>
                <p className="mt-3 text-3xl font-semibold">{stats.jobs.pending}</p>
                <p className="mt-2 text-sm text-slate-300">Listings waiting for a final decision.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  <p className="text-sm font-medium text-slate-700">Live marketplace</p>
                </div>
                <p className="mt-3 text-3xl font-semibold text-slate-950">{stats.jobs.active}</p>
                <p className="mt-2 text-sm text-slate-500">
                  Public listings currently driving candidate traffic.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-[28px] border border-white/70 bg-white/94">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-slate-950">Recent Jobs</CardTitle>
              <Link href="/admin/jobs">
                <Button variant="ghost" className="rounded-full text-slate-700">
                  Moderate
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-900">{job.title}</p>
                    <Badge
                      variant={job.status === "ACTIVE" ? "success" : "secondary"}
                      className="rounded-full px-3 py-1"
                    >
                      {job.status.replaceAll("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500">
                    {job.employer.employerProfile?.companyName || job.employer.name || "Employer"}
                  </p>
                  <p className="text-sm text-slate-500">
                    Added {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
