"use client";

import { Role } from "@prisma/client";
import { useEffect, useState } from "react";
import { Building2, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type AdminUser = {
  id: string;
  name?: string | null;
  email: string;
  role: Role;
  createdAt: string;
};

export default function CompaniesPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async (): Promise<void> => {
      try {
        const response = await fetch("/api/admin/users");
        const data = (await response.json()) as { users?: AdminUser[] };
        setUsers(data.users ?? []);
      } catch {
        toast.error("Failed to load company operators");
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 w-full rounded-[28px]" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-[24px]" />
        ))}
      </div>
    );
  }

  const employers = users.filter((user) => user.role === Role.EMPLOYER);
  const recentEmployers = employers.filter((user) => {
    const createdAt = new Date(user.createdAt).getTime();
    return Date.now() - createdAt <= 1000 * 60 * 60 * 24 * 30;
  }).length;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#172554_0%,#1d4ed8_50%,#0f172a_100%)] p-6 text-white shadow-[0_28px_90px_-54px_rgba(15,23,42,0.85)] sm:p-8">
        <Badge className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-100 hover:bg-white/10">
          Company Accounts
        </Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Monitor employer-side presence across the marketplace.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
          Until dedicated company moderation APIs are added, this workspace keeps
          employer operators visible so the admin team can spot growth and review
          who is representing each business account.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Employer Accounts"
          value={employers.length}
          change={`${recentEmployers} joined this month`}
          trend="up"
          icon={<Building2 className="h-7 w-7" />}
        />
        <StatsCard
          title="New Company Ops"
          value={recentEmployers}
          change="Fresh employer operators"
          trend="up"
          icon={<Users className="h-7 w-7" />}
        />
        <StatsCard
          title="Accounts In Review"
          value={employers.length}
          change="Using current user data"
          trend="neutral"
          icon={<ShieldCheck className="h-7 w-7" />}
        />
      </div>

      <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
        <CardHeader>
          <CardTitle className="text-xl text-slate-950">Employer Operators</CardTitle>
          <p className="text-sm text-slate-500">
            Dynamic list of employer accounts currently powering company activity.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {employers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No employer accounts found yet.
            </div>
          ) : (
            employers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">{user.name || "Unnamed employer"}</p>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    Employer
                  </Badge>
                  <span className="text-sm text-slate-500">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
