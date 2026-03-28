"use client";

import { useEffect, useState } from "react";
import { BellRing, LockKeyhole, Settings2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type AdminStats = {
  roleBreakdown: {
    admins: number;
  };
  jobs: {
    pending: number;
    active: number;
  };
};

export default function SettingsPage() {
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 w-full rounded-[24px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_48%,#0f766e_100%)] p-6 text-white shadow-[0_28px_90px_-54px_rgba(15,23,42,0.85)] sm:p-8">
        <Badge className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-100 hover:bg-white/10">
          System Settings
        </Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Governance defaults and operational safeguards at a glance.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
          These cards frame the most important policy areas while the backend
          settings layer evolves. Current marketplace activity is surfaced beside
          each area to keep decisions grounded in live usage.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-slate-950">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Moderation Defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Pending jobs currently waiting: {stats.jobs.pending}</p>
            <p>Live jobs currently visible: {stats.jobs.active}</p>
            <p>Use this section for approval rules, escalation flows, and moderation SLAs.</p>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-slate-950">
              <LockKeyhole className="h-5 w-5 text-sky-600" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Admin seats in use: {stats.roleBreakdown.admins}</p>
            <p>Extend here with audit logging, invite controls, and emergency lockouts.</p>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-slate-950">
              <BellRing className="h-5 w-5 text-amber-600" />
              Alerts and Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Operational alerts should prioritize queue spikes and unusual approval patterns.</p>
            <p>This responsive shell is ready for future alert thresholds and routing controls.</p>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-slate-950">
              <Settings2 className="h-5 w-5 text-violet-600" />
              Platform Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Use this area for feature flags, review automation, and global defaults.</p>
            <p>
              The UI intentionally avoids fake controls until writable config APIs are available.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
