"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Briefcase,
  CreditCard,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHero } from "@/components/admin/admin-page-hero";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ReportsData = {
  overview: {
    totalUsers: number;
    employers: number;
    jobSeekers: number;
    admins: number;
    totalJobs: number;
    activeJobs: number;
    pendingJobs: number;
    rejectedJobs: number;
    totalApplications: number;
    hiredApplications: number;
  };
  funnel: {
    shortlistedApplications: number;
    interviewApplications: number;
    hiredApplications: number;
  };
  payments: {
    paidJobs: number;
    failedPayments: number;
    unpaidJobs: number;
  };
  categories: Array<{
    name: string;
    jobs: number;
  }>;
  trends: Array<{
    label: string;
    users: number;
    jobs: number;
    applications: number;
  }>;
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async (): Promise<void> => {
      try {
        const response = await fetch("/api/admin/reports");
        const json = (await response.json()) as ReportsData & { error?: string };

        if (!response.ok) {
          toast.error(json.error || "Failed to load reports");
          return;
        }

        setData(json);
      } catch {
        toast.error("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    void loadReports();
  }, []);

  if (loading || !data) {
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

  const moderationRisk = data.overview.pendingJobs + data.overview.rejectedJobs;
  const hireRate =
    data.overview.totalApplications > 0
      ? Math.round((data.overview.hiredApplications / data.overview.totalApplications) * 100)
      : 0;
  const maxTrendValue = Math.max(
    1,
    ...data.trends.flatMap((item) => [item.users, item.jobs, item.applications])
  );
  const maxCategoryJobs = Math.max(1, ...data.categories.map((category) => category.jobs));

  return (
    <div className="space-y-8">
      <AdminPageHero
        badge="Marketplace Reports"
        title="See marketplace health through trendlines, funnel data, and billing signals."
        description="This report pulls a dedicated analytics dataset so admins can read growth, moderation pressure, and hiring quality from one responsive screen."
        gradientClassName="bg-[linear-gradient(135deg,#111827_0%,#0f172a_52%,#0369a1_100%)]"
        stats={[
          { label: "Hire conversion", value: `${hireRate}%` },
          { label: "Risk surface", value: moderationRisk },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Moderation Queue"
          value={moderationRisk}
          change={`${data.overview.pendingJobs} pending review`}
          trend={moderationRisk > 0 ? "down" : "neutral"}
          icon={<AlertTriangle className="h-7 w-7" />}
        />
        <StatsCard
          title="Employer Base"
          value={data.overview.employers}
          change={`${data.overview.totalJobs} total jobs`}
          trend="up"
          icon={<Briefcase className="h-7 w-7" />}
        />
        <StatsCard
          title="Candidate Supply"
          value={data.overview.jobSeekers}
          change={`${data.overview.totalApplications} total applications`}
          trend="up"
          icon={<Users className="h-7 w-7" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">6-Month Activity Trend</CardTitle>
            <p className="text-sm text-slate-500">
              User growth, job creation, and application volume over time.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.trends.map((item) => (
              <div key={item.label} className="space-y-3 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{item.label}</p>
                  <p className="text-sm text-slate-500">
                    {item.users + item.jobs + item.applications} total signals
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Users</span>
                      <span>{item.users}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-sky-500"
                        style={{ width: `${(item.users / maxTrendValue) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Jobs</span>
                      <span>{item.jobs}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-emerald-500"
                        style={{ width: `${(item.jobs / maxTrendValue) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Applications</span>
                      <span>{item.applications}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-violet-500"
                        style={{ width: `${(item.applications / maxTrendValue) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Hiring Funnel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-3xl bg-slate-950 p-4 text-white">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-sky-300" />
                  <p className="font-medium">Applications to hires</p>
                </div>
                <p className="mt-3 text-3xl font-semibold">{hireRate}%</p>
                <p className="mt-2 text-sm text-slate-300">
                  Based on {data.overview.totalApplications} submitted applications.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Shortlisted</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {data.funnel.shortlistedApplications}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Interview</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {data.funnel.interviewApplications}
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Hired</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {data.funnel.hiredApplications}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Top Hiring Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.categories.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{category.name}</span>
                    <span>{category.jobs} jobs</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-slate-950"
                      style={{ width: `${(category.jobs / maxCategoryJobs) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Payment Health</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Paid</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{data.payments.paidJobs}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Failed</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {data.payments.failedPayments}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-sky-600" />
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Unpaid</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {data.payments.unpaidJobs}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
