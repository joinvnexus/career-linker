"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Briefcase, Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
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
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const moderationRisk = stats.jobs.pending + stats.jobs.rejected;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="mt-1 text-slate-600">
          High-level marketplace health summary for moderation and operations.
        </p>
      </div>

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

      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Operational Summary</CardTitle>
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
    </div>
  );
}
