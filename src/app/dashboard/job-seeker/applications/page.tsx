"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Sparkles,
  Clock3,
  Eye,
  CalendarDays,
  BadgeCheck,
  CircleX,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusFilterBar } from "@/components/dashboard/status-chip";
import {
  ApplicationCard,
  ApplicationCardSkeleton,
} from "@/components/dashboard/application-card";
import { cn } from "@/lib/utils";

type ApplicationStatus = "PENDING" | "VIEWED" | "INTERVIEW" | "OFFER" | "REJECTED";

type ApplicationItem = {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  job: {
    id: string;
    slug: string;
    title: string;
    location: string;
    employer?: {
      id: string;
      name?: string | null;
      employerProfile?: { companyName?: string | null };
    };
  };
};

type StatusCounts = {
  ALL: number;
  PENDING: number;
  VIEWED: number;
  INTERVIEW: number;
  OFFER: number;
  REJECTED: number;
};

const statusHighlights = [
  {
    status: "PENDING" as ApplicationStatus,
    label: "Pending",
    icon: Clock3,
    tone: "bg-amber-50 text-amber-700 ring-amber-100",
  },
  {
    status: "VIEWED" as ApplicationStatus,
    label: "Viewed",
    icon: Eye,
    tone: "bg-sky-50 text-sky-700 ring-sky-100",
  },
  {
    status: "INTERVIEW" as ApplicationStatus,
    label: "Interview",
    icon: CalendarDays,
    tone: "bg-violet-50 text-violet-700 ring-violet-100",
  },
  {
    status: "OFFER" as ApplicationStatus,
    label: "Offer",
    icon: BadgeCheck,
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  },
  {
    status: "REJECTED" as ApplicationStatus,
    label: "Rejected",
    icon: CircleX,
    tone: "bg-rose-50 text-rose-700 ring-rose-100",
  },
] as const;

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] =
    useState<ApplicationStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/applications/my");
        const data = await res.json();
        setApplications(data.applications || []);
      } catch {
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const statusCounts: StatusCounts = applications.reduce(
    (acc, app) => {
      const status = app.status as ApplicationStatus;
      acc.ALL++;
      acc[status]++;
      return acc;
    },
    { ALL: 0, PENDING: 0, VIEWED: 0, INTERVIEW: 0, OFFER: 0, REJECTED: 0 }
  );

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = selectedStatus === "ALL" || app.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.employer?.employerProfile?.companyName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="surface-inverse relative overflow-hidden rounded-[2rem] border border-white/10 p-5 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.18),_transparent_24%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="eyebrow border-white/10 bg-white/10 text-sky-100">
              <Sparkles className="h-3.5 w-3.5" />
              Application tracker
            </div>
            <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] text-white lg:text-5xl">
              Every application, one clean view.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              Filter your pipeline, keep tabs on recruiter engagement, and focus on the next conversation that matters.
            </p>
          </div>
          <Link href="/jobs">
            <Button className="w-full sm:w-auto" variant="inverse">
              <Briefcase className="mr-2 h-4 w-4" />
              Browse More Jobs
            </Button>
          </Link>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {statusHighlights.map((item) => (
          <Card key={item.status} className="border-white/80 bg-white/94">
            <CardContent className="flex items-center gap-4 p-4">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-[1.1rem] ring-1", item.tone)}>
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight text-slate-950">
                  {statusCounts[item.status]}
                </p>
                <p className="text-sm font-medium text-slate-600">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/80 bg-white/94">
        <CardContent className="p-4 lg:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative max-w-xl flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11"
              />
            </div>

            <div className="overflow-x-auto -mx-1 px-1 lg:mx-0 lg:px-0">
              <StatusFilterBar
                selectedStatus={selectedStatus}
                onStatusChange={(status) => setSelectedStatus(status)}
                counts={statusCounts}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ApplicationCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="border-white/80 bg-white/94">
          <CardContent className="py-14 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Briefcase className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-950">
              {searchQuery || selectedStatus !== "ALL" ? "No applications found" : "No applications yet"}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {searchQuery || selectedStatus !== "ALL"
                ? "Try adjusting your search or current status filter."
                : "Start applying to roles and this pipeline will come alive."}
            </p>
            <Link href="/jobs">
              <Button className="mt-5">Find Jobs</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-500">
            {filteredApplications.length} application
            {filteredApplications.length !== 1 ? "s" : ""} in view
          </p>

          {filteredApplications.map((app) => {
            const companyName =
              app.job.employer?.employerProfile?.companyName ||
              app.job.employer?.name ||
              "Company";
            return (
              <ApplicationCard
                key={app.id}
                id={app.job.slug}
                jobTitle={app.job.title}
                companyName={companyName}
                location={app.job.location}
                status={app.status}
                appliedDate={app.createdAt}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
