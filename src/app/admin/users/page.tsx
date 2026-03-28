"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Search, ShieldCheck, UserCog, Users } from "lucide-react";
import { toast } from "sonner";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { APP_ROLES, type AppRole } from "@/lib/client-enums";

type AdminUser = {
  id: string;
  name?: string | null;
  email: string;
  role: AppRole;
  createdAt: string;
};

const roleOptions = [...APP_ROLES];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST");

  useEffect(() => {
    const loadUsers = async (): Promise<void> => {
      try {
        const response = await fetch("/api/admin/users");
        const data = (await response.json()) as { users?: AdminUser[] };
        setUsers(data.users ?? []);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  const updateRole = async (userId: string, role: AppRole): Promise<void> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error || "Failed to update role");
        return;
      }

      setUsers((current) =>
        current.map((user) => (user.id === userId ? { ...user, role } : user))
      );
      toast.success("User role updated");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const employerCount = users.filter((user) => user.role === "EMPLOYER").length;
  const adminCount = users.filter((user) => user.role === "ADMIN").length;
  const recentCount = users.filter((user) => {
    const joinedAt = new Date(user.createdAt).getTime();
    return Date.now() - joinedAt <= 1000 * 60 * 60 * 24 * 30;
  }).length;
  const filteredUsers = useMemo(() => {
    return [...users]
      .filter((user) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          (user.name || "").toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query);
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        return matchesSearch && matchesRole;
      })
      .sort((a, b) => {
        if (sortOrder === "OLDEST") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortOrder === "NAME") {
          return (a.name || a.email).localeCompare(b.name || b.email);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [roleFilter, searchQuery, sortOrder, users]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 w-full rounded-[28px]" />
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 w-full rounded-[24px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_58%,#1d4ed8_100%)] p-6 text-white shadow-[0_28px_90px_-54px_rgba(15,23,42,0.85)] sm:p-8">
        <Badge className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-100 hover:bg-white/10">
          User Operations
        </Badge>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Manage access with context, not guesswork.
            </h1>
            <p className="mt-3 text-sm text-slate-200 sm:text-base">
              Review the newest accounts, track role distribution, and adjust
              permissions without losing sight of marketplace balance.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[28rem]">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Total people</p>
              <p className="mt-2 text-2xl font-semibold">{users.length}</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Joined 30 days</p>
              <p className="mt-2 text-2xl font-semibold">{recentCount}</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Admin seats</p>
              <p className="mt-2 text-2xl font-semibold">{adminCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="User Accounts"
          value={users.length}
          change={`${recentCount} new this month`}
          trend="up"
          icon={<Users className="h-7 w-7" />}
        />
        <StatsCard
          title="Employers"
          value={employerCount}
          change={`${users.length - employerCount - adminCount} job seekers`}
          trend="neutral"
          icon={<UserCog className="h-7 w-7" />}
        />
        <StatsCard
          title="Admins"
          value={adminCount}
          change="Governance access seats"
          trend="neutral"
          icon={<ShieldCheck className="h-7 w-7" />}
        />
      </div>

      <Card className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl text-slate-950">Workspace Users</CardTitle>
            <p className="text-sm text-slate-500">
              Role changes apply instantly, so this table is optimized for fast review.
            </p>
          </div>
          <Badge variant="outline" className="w-fit rounded-full px-3 py-1 text-slate-600">
            <ArrowRightLeft className="mr-2 h-3.5 w-3.5" />
            Live role switching
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search name or email..."
                className="h-11 rounded-full border-slate-300 bg-white pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-11 w-full rounded-full border-slate-300 bg-white lg:w-48">
                <SelectValue placeholder="Filter role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All roles</SelectItem>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role.replaceAll("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-11 w-full rounded-full border-slate-300 bg-white lg:w-48">
                <SelectValue placeholder="Sort users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEWEST">Newest first</SelectItem>
                <SelectItem value="OLDEST">Oldest first</SelectItem>
                <SelectItem value="NAME">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No users matched the current filters.
            </div>
          ) : (
            filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-900">{user.name || "Unnamed user"}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
                <p className="mt-1 text-xs text-slate-500">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {user.role.replaceAll("_", " ")}
                </Badge>
                <Select
                  value={user.role}
                  onValueChange={(value) => void updateRole(user.id, value as AppRole)}
                >
                  <SelectTrigger className="w-44 rounded-full border-slate-300 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
