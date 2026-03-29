"use client";

import { useEffect, useState } from "react";
import {
  BellRing,
  CreditCard,
  LockKeyhole,
  Settings2,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHero } from "@/components/admin/admin-page-hero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type AdminSettingsData = {
  moderation: {
    pendingJobs: number;
    activeJobs: number;
    suggestedSlaHours: number;
  };
  access: {
    adminSeats: number;
    oauthProvidersEnabled: number;
    nextAuthConfigured: boolean;
  };
  alerts: {
    failedPayments: number;
    hiredApplications: number;
    queueSpikeThreshold: number;
  };
  platform: {
    stripeConfigured: boolean;
    billingWebhookConfigured: boolean;
    uploadsConfigured: boolean;
    emailConfigured: boolean;
    jobPostPriceCents: number;
    currency: string;
    appUrl?: string | null;
  };
};

function formatMoney(amountCents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

function StatusPill({ ready, label }: { ready: boolean; label: string }) {
  return (
    <Badge
      variant={ready ? "success" : "secondary"}
      className="rounded-full px-3 py-1"
    >
      {label}: {ready ? "Ready" : "Missing"}
    </Badge>
  );
}

export default function SettingsPage() {
  const [data, setData] = useState<AdminSettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async (): Promise<void> => {
      try {
        const response = await fetch("/api/admin/settings");
        const json = (await response.json()) as AdminSettingsData & { error?: string };

        if (!response.ok) {
          toast.error(json.error || "Failed to load settings");
          return;
        }

        setData(json);
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    void loadSettings();
  }, []);

  if (loading || !data) {
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
      <AdminPageHero
        badge="System Settings"
        title="Runtime configuration and operational safeguards in one place."
        description="This admin surface reads real platform readiness signals from environment configuration and live marketplace activity, so the team can audit setup quickly."
        gradientClassName="bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_48%,#0f766e_100%)]"
        stats={[
          { label: "Pending jobs", value: data.moderation.pendingJobs },
          { label: "Admin seats", value: data.access.adminSeats },
          {
            label: "Job post price",
            value: formatMoney(data.platform.jobPostPriceCents, data.platform.currency),
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-slate-950">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Moderation Defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>Pending jobs currently waiting: {data.moderation.pendingJobs}</p>
            <p>Live jobs currently visible: {data.moderation.activeJobs}</p>
            <p>Suggested moderation SLA: {data.moderation.suggestedSlaHours} hours</p>
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
            <p>Admin seats in use: {data.access.adminSeats}</p>
            <p>OAuth providers enabled: {data.access.oauthProvidersEnabled}</p>
            <p>NextAuth secret status: {data.access.nextAuthConfigured ? "Configured" : "Missing"}</p>
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
            <p>Failed payments currently flagged: {data.alerts.failedPayments}</p>
            <p>Successful hires tracked: {data.alerts.hiredApplications}</p>
            <p>Queue spike alert threshold: {data.alerts.queueSpikeThreshold} pending jobs</p>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-slate-950">
              <Settings2 className="h-5 w-5 text-violet-600" />
              Platform Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p>
              Job post price:{" "}
              <span className="font-semibold text-slate-900">
                {formatMoney(data.platform.jobPostPriceCents, data.platform.currency)}
              </span>
            </p>
            <p>App URL: {data.platform.appUrl || "Not configured"}</p>
            <div className="flex flex-wrap gap-2">
              <StatusPill ready={data.platform.stripeConfigured} label="Stripe" />
              <StatusPill ready={data.platform.billingWebhookConfigured} label="Webhook" />
              <StatusPill ready={data.platform.emailConfigured} label="Email" />
              <StatusPill ready={data.platform.uploadsConfigured} label="Uploads" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-slate-950">
              <CreditCard className="h-5 w-5 text-indigo-600" />
              Billing Readiness
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Stripe secret and webhook state are now surfaced from runtime config so billing issues are easier to spot early.
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-slate-950">
              <Upload className="h-5 w-5 text-emerald-600" />
              Asset Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Upload infrastructure is checked from environment state, helping admins understand if employer logos and future file flows are ready.
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-slate-950">
              <ShieldCheck className="h-5 w-5 text-sky-600" />
              Operational Confidence
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            This page is now API-backed and responsive, so it can grow into writable controls later without redesigning the admin shell again.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
