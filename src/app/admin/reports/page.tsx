"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Briefcase, Target, TrendingUp, Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
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
};

export default function ReportsPage() {
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
      <div className="space-y-4">
        <Skeleton className="h-44 w-full rounded-[28px]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full rounded-[24px]" />
          ))}
        </div>
      </div>
    );
  }

  const moderationRisk = stats.jobs.pending + stats.jobs.rejected;
  const hireRate =
    stats.applications.total > 0
      ? Math.round((stats.applications.hired / stats.applications.total) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#111827_0%,#0f172a_52%,#0369a1_100%)] p-6 text-white shadow-[0_28px_90px_-54px_rgba(15,23,42,0.85)] sm:p-8">
        <Badge className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-100 hover:bg-white/10">
          Marketplace Reports
        </Badge>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Convert raw platform activity into operational signals.
            </h1>
            <p className="mt-3 text-sm text-slate-200 sm:text-base">
              These summaries surface moderation pressure, supply balance, and hiring
              conversion so the admin team can spot problems before they spread.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-[24rem]">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                Hire conversion
              </p>
              <p className="mt-2 text-3xl font-semibold">{hireRate}%</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                Risk surface
              </p>
              <p className="mt-2 text-3xl font-semibold">{moderationRisk}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Moderation Queue"
          value={moderationRisk}
          change={`${stats.jobs.pending} pending review`}
          trend={moderationRisk > 0 ? "down" : "neutral"}
          icon={<AlertTriangle className="h-7 w-7" />}
        />
        <StatsCard
          title="Employer Base"
          value={stats.roleBreakdown.employers}
          change={`${stats.jobs.total} total jobs`}
          trend="up"
          icon={<Briefcase className="h-7 w-7" />}
        />
        <StatsCard
          title="Candidate Supply"
          value={stats.roleBreakdown.jobSeekers}
          change={`${stats.applications.total} total applications`}
          trend="up"
          icon={<Users className="h-7 w-7" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">Operational Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>
              Active jobs: <span className="font-semibold text-slate-900">{stats.jobs.active}</span>
            </p>
            <p>
              Rejected jobs:{" "}
              <span className="font-semibold text-slate-900">{stats.jobs.rejected}</span>
            </p>
            <p>
              Successful hires:{" "}
              <span className="font-semibold text-slate-900">{stats.applications.hired}</span>
            </p>
            <p>
              Admin seats in use:{" "}
              <span className="font-semibold text-slate-900">{stats.roleBreakdown.admins}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">What To Watch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl bg-slate-950 p-4 text-white">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-300" />
                <p className="font-medium">Moderation queue pressure</p>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Pending plus rejected jobs indicate how much manual review capacity is
                currently under strain.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm font-medium text-slate-700">Demand trend</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{stats.jobs.total}</p>
                <p className="mt-1 text-sm text-slate-500">Total jobs created on platform.</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-sky-600" />
                  <p className="text-sm font-medium text-slate-700">Talent response</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {stats.applications.total}
                </p>
                <p className="mt-1 text-sm text-slate-500">Applications submitted overall.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
