"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, Search } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusFilterBar } from "@/components/dashboard/status-chip";
import { ApplicationCard, ApplicationCardSkeleton } from "@/components/dashboard/application-card";

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

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "ALL">("ALL");
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
    load();
  }, []);

  // Calculate status counts
  const statusCounts: StatusCounts = applications.reduce(
    (acc, app) => {
      const status = app.status as ApplicationStatus;
      acc.ALL++;
      acc[status]++;
      return acc;
    },
    { ALL: 0, PENDING: 0, VIEWED: 0, INTERVIEW: 0, OFFER: 0, REJECTED: 0 }
  );

  // Filter applications
  const filteredApplications = applications.filter((app) => {
    const matchesStatus = selectedStatus === "ALL" || app.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      app.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.job.employer?.employerProfile?.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Applications</h1>
          <p className="text-slate-500">Track your job applications and their status</p>
        </div>
        <Link href="/jobs">
          <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-emerald-500">
            <Briefcase className="mr-2 h-4 w-4" />
            Browse More Jobs
          </Button>
        </Link>
      </div>

      {/* Search Bar - Mobile */}
      <div className="relative lg:hidden">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Status Filter Bar */}
      <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
        <StatusFilterBar
          selectedStatus={selectedStatus}
          onStatusChange={(status) => setSelectedStatus(status)}
          counts={statusCounts}
        />
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ApplicationCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <Card className="border-0 shadow-xl">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Briefcase className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {searchQuery || selectedStatus !== "ALL"
                ? "No applications found"
                : "No applications yet"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchQuery || selectedStatus !== "ALL"
                ? "Try adjusting your filters"
                : "Start applying to jobs to see them here"}
            </p>
            {!searchQuery && selectedStatus === "ALL" && (
              <Link href="/jobs">
                <Button className="mt-4 bg-gradient-to-r from-blue-500 to-emerald-500">
                  Find Jobs
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Results count - Mobile */}
          <p className="text-sm text-slate-500 lg:hidden">
            {filteredApplications.length} application{filteredApplications.length !== 1 ? "s" : ""}
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

      {/* Desktop Stats */}
      <div className="hidden lg:grid grid-cols-5 gap-4 pt-4 border-t">
        {(["PENDING", "VIEWED", "INTERVIEW", "OFFER", "REJECTED"] as ApplicationStatus[]).map((status) => (
          <div key={status} className="text-center p-4 rounded-xl bg-slate-50">
            <p className="text-2xl font-bold text-slate-900">{statusCounts[status]}</p>
            <p className="text-sm text-slate-500">{status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
