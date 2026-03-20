"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Briefcase, FileText, TrendingUp, UserCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/dashboard/stats-card";

type EmployerStats = {
  totalJobs: number;
  activeJobs: number;
  pendingJobs: number;
  totalApplicants: number;
  shortlistedApplicants: number;
  hires: number;
  recentJobs: Array<{
    id: string;
    title: string;
    status: string;
    applicants: number;
  }>;
  recentApplications: Array<{
    id: string;
    status: string;
    createdAt: string;
    seeker: { name?: string | null };
    job: { id: string; title: string };
  }>;
};

export default function EmployerDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<EmployerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async (): Promise<void> => {
      try {
        const response = await fetch("/api/employer/stats");
        const data = (await response.json()) as EmployerStats;
        setStats(data);
      } finally {
        setLoading(false);
      }
    };

    void loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-lg text-slate-600">
            Welcome back, {session?.user?.name}. Here is the latest snapshot of your hiring pipeline.
          </p>
        </div>
        <Link href="/dashboard/employer/post-job">
          <Button size="lg">Post New Job</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          change={`${stats.activeJobs} active`}
          icon={<Briefcase className="h-7 w-7" />}
          title="Total Jobs"
          trend="up"
          value={stats.totalJobs}
        />
        <StatsCard
          change={`${stats.shortlistedApplicants} shortlisted`}
          icon={<Users className="h-7 w-7" />}
          title="Applicants"
          trend="up"
          value={stats.totalApplicants}
        />
        <StatsCard
          change={`${stats.pendingJobs} drafts pending payment`}
          icon={<TrendingUp className="h-7 w-7" />}
          title="Active Jobs"
          trend="neutral"
          value={stats.activeJobs}
        />
        <StatsCard
          change="Successful hires"
          icon={<UserCheck className="h-7 w-7" />}
          title="Hires Made"
          trend="up"
          value={stats.hires}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/employer/post-job">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
            </Link>
            <Link href="/dashboard/employer/applicants">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Review Applicants
              </Button>
            </Link>
            <Link href="/dashboard/employer/company-profile">
              <Button className="w-full justify-start" variant="outline">
                <Briefcase className="mr-2 h-4 w-4" />
                Update Company Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentJobs.length === 0 ? (
              <p className="text-slate-600">You have not posted any jobs yet.</p>
            ) : (
              stats.recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{job.title}</p>
                    <div className="mt-1 flex items-center gap-3 text-sm text-slate-500">
                      <Badge variant={job.status === "ACTIVE" ? "success" : "secondary"}>
                        {job.status.replaceAll("_", " ")}
                      </Badge>
                      <span>{job.applicants} applicants</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/employer/applicants/${job.id}`}>
                    <Button variant="outline">View Applicants</Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.recentApplications.length === 0 ? (
            <p className="text-slate-600">No applications received yet.</p>
          ) : (
            stats.recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {application.seeker.name || "Candidate"}
                  </p>
                  <p className="text-sm text-slate-500">
                    Applied for {application.job.title}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{application.status.replaceAll("_", " ")}</Badge>
                  <span className="text-sm text-slate-500">
                    {new Date(application.createdAt).toLocaleDateString()}
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
