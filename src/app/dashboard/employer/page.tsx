"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  FileText,
  TrendingUp,
  UserCheck,
  Users,
  Sparkles,
  ArrowRight,
  Clock3,
} from "lucide-react";
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
        <Skeleton className="h-72 w-full rounded-[2rem]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-44 w-full rounded-[1.75rem]" />
          ))}
        </div>
      </div>
    );
  }

  const insightCards = [
    {
      title: "Active pipeline",
      copy:
        stats.totalApplicants > 0
          ? `${stats.totalApplicants} candidates are currently in motion across your listings.`
          : "Publish roles and applicant flow will start building here.",
    },
    {
      title: "Next best move",
      copy:
        stats.pendingJobs > 0
          ? `${stats.pendingJobs} jobs still need attention before they can drive more applications.`
          : "Your live roles are clear. Next step is to review fresh applicants faster.",
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(140deg,_rgba(15,23,42,0.96),_rgba(8,47,73,0.92)_45%,_rgba(6,95,70,0.82))] p-5 text-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.9)] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.18),_transparent_24%)]" />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Employer dashboard
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-5xl">
              {session?.user?.name?.split(" ")[0] || "Your team"} can hire with more clarity.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 lg:text-base">
              Track job performance, stay close to recent applicants, and keep
              hiring momentum strong from one focused workspace.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/employer/post-job">
                <Button className="w-full bg-white text-slate-950 hover:bg-slate-100 sm:w-auto">
                  Post New Job
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/employer/jobs">
                <Button
                  variant="outline"
                  className="w-full border-white/20 bg-white/10 text-white hover:bg-white/15 sm:w-auto"
                >
                  Review Jobs
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-white">Hiring snapshot</p>
            <div className="mt-4 grid gap-3">
              {insightCards.map((item) => (
                <div key={item.title} className="rounded-2xl bg-slate-950/20 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-200">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          change={`${stats.activeJobs} active`}
          icon={<Briefcase className="h-6 w-6" />}
          title="Total Jobs"
          trend="up"
          value={stats.totalJobs}
        />
        <StatsCard
          change={`${stats.shortlistedApplicants} shortlisted`}
          icon={<Users className="h-6 w-6" />}
          title="Applicants"
          trend="up"
          value={stats.totalApplicants}
        />
        <StatsCard
          change={`${stats.pendingJobs} pending review`}
          icon={<TrendingUp className="h-6 w-6" />}
          title="Active Jobs"
          trend="neutral"
          value={stats.activeJobs}
        />
        <StatsCard
          change="Successful hires"
          icon={<UserCheck className="h-6 w-6" />}
          title="Hires Made"
          trend="up"
          value={stats.hires}
        />
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/employer/post-job">
              <Button className="w-full justify-start rounded-2xl" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
            </Link>
            <Link href="/dashboard/employer/applicants">
              <Button className="w-full justify-start rounded-2xl" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Review Applicants
              </Button>
            </Link>
            <Link href="/dashboard/employer/company-profile">
              <Button className="w-full justify-start rounded-2xl" variant="outline">
                <Briefcase className="mr-2 h-4 w-4" />
                Update Company Profile
              </Button>
            </Link>
            <Link href="/dashboard/employer/analytics">
              <Button className="w-full justify-start rounded-2xl" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Open Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
          <CardHeader>
            <CardTitle className="text-xl text-slate-950">Recent jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentJobs.length === 0 ? (
              <p className="text-slate-600">You have not posted any jobs yet.</p>
            ) : (
              stats.recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-950">{job.title}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <Badge variant={job.status === "ACTIVE" ? "success" : "secondary"}>
                        {job.status.replaceAll("_", " ")}
                      </Badge>
                      <span>{job.applicants} applicants</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/employer/applicants/${job.id}`}>
                    <Button variant="outline" className="rounded-xl">
                      View Applicants
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
        <CardHeader>
          <CardTitle className="text-xl text-slate-950">Recent applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.recentApplications.length === 0 ? (
            <p className="text-slate-600">No applications received yet.</p>
          ) : (
            stats.recentApplications.map((application) => (
              <div
                key={application.id}
                className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-950">
                    {application.seeker.name || "Candidate"}
                  </p>
                  <p className="text-sm text-slate-500">
                    Applied for {application.job.title}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{application.status.replaceAll("_", " ")}</Badge>
                  <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                    <Clock3 className="h-4 w-4" />
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
