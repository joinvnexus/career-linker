"use client";

import { useEffect, useState } from "react";
import { CreditCard, DollarSign, Receipt, ShieldCheck } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type AdminStats = {
  roleBreakdown: {
    employers: number;
    admins: number;
  };
  jobs: {
    total: number;
    active: number;
  };
  applications: {
    total: number;
    hired: number;
  };
};

export default function PaymentsPage() {
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

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#1e1b4b_0%,#312e81_44%,#0f172a_100%)] p-6 text-white shadow-[0_28px_90px_-54px_rgba(15,23,42,0.85)] sm:p-8">
        <Badge className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-100 hover:bg-white/10">
          Payments Ops
        </Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Financial operations ready for a deeper billing system.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
          This page uses current marketplace volume as a live proxy until dedicated
          payment APIs land. It keeps admins aware of monetization scale and support load.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Active Employers"
          value={stats.roleBreakdown.employers}
          change="Potential paying accounts"
          trend="up"
          icon={<CreditCard className="h-7 w-7" />}
        />
        <StatsCard
          title="Live Jobs"
          value={stats.jobs.active}
          change={`${stats.jobs.total} total created`}
          trend="up"
          icon={<Receipt className="h-7 w-7" />}
        />
        <StatsCard
          title="Successful Hires"
          value={stats.applications.hired}
          change={`${stats.applications.total} total applications`}
          trend="up"
          icon={<DollarSign className="h-7 w-7" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">Billing Readiness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>
              Employer volume suggests how many accounts may eventually need invoicing
              or subscription support.
            </p>
            <p>
              Live jobs are the clearest signal of active marketplace usage tied to
              future monetization.
            </p>
            <p>
              Admin seats in use:{" "}
              <span className="font-semibold text-slate-900">{stats.roleBreakdown.admins}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">Next Integration Layer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl bg-slate-950 p-4 text-white">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <p className="font-medium">Admin-safe placeholder</p>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                The UI is production-ready and responsive, but real transactions still
                need a dedicated payments API before settlement actions can appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
