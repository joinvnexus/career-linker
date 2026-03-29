"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FileText,
  Bookmark,
  TrendingUp,
  Calendar,
  Briefcase,
  ArrowRight,
  Sparkles,
  CircleCheckBig,
  Clock3,
  Target,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileStatsCard } from "@/components/dashboard/mobile-stats-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Stats = {
  applications: number;
  savedJobs: number;
  interviews: number;
  profileCompletion: number;
};

type RecentActivity = {
  id: string;
  type: "application" | "interview" | "profile";
  title: string;
  subtitle: string;
  date: string;
};

type ApplicationSummary = {
  status: string;
};

export default function JobSeekerOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    applications: 0,
    savedJobs: 0,
    interviews: 0,
    profileCompletion: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, savedRes] = await Promise.all([
          fetch("/api/applications/my"),
          fetch("/api/users/saved-jobs"),
        ]);

        const [appsData, savedData] = await Promise.all([
          appsRes.json(),
          savedRes.json(),
        ]);

        const applications = (appsData.applications || []).length;
        const interviews = (appsData.applications || []).filter(
          (application: ApplicationSummary) => application.status === "INTERVIEW"
        ).length;
        const savedJobs = (savedData || []).length;
        const profileCompletion = Math.min(
          95,
          55 + applications * 5 + (savedJobs > 0 ? 10 : 0) + (interviews > 0 ? 10 : 0)
        );

        setStats({
          applications,
          savedJobs,
          interviews,
          profileCompletion,
        });

        setActivities([
          {
            id: "1",
            type: "application",
            title: "Applied to Frontend Developer",
            subtitle: "TechCorp | Pending",
            date: "2 days ago",
          },
          {
            id: "2",
            type: "interview",
            title: "Interview Scheduled",
            subtitle: "Senior Product Manager | TechHub",
            date: "1 day ago",
          },
          {
            id: "3",
            type: "profile",
            title: "Profile viewed by recruiter",
            subtitle: "ABC Company",
            date: "3 hours ago",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-72 rounded-[2rem]" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-[1.75rem]" />
          ))}
        </div>
        <Skeleton className="h-56 rounded-[2rem]" />
      </div>
    );
  }

  const quickActions = [
    {
      label: "Browse Jobs",
      description: "Find fresh openings",
      icon: Briefcase,
      href: "/jobs",
      color: "from-sky-500 to-cyan-400",
    },
    {
      label: "Saved Jobs",
      description: "Review shortlisted roles",
      icon: Bookmark,
      href: "/dashboard/job-seeker/saved",
      color: "from-emerald-500 to-teal-400",
    },
    {
      label: "Edit Profile",
      description: "Increase recruiter visibility",
      icon: TrendingUp,
      href: "/dashboard/job-seeker/profile",
      color: "from-violet-500 to-indigo-400",
    },
  ];

  const progressItems = [
    {
      label: "Profile strength",
      value: `${stats.profileCompletion}%`,
      note:
        stats.profileCompletion >= 80
          ? "Strong match readiness"
          : "Add more details to stand out",
      icon: CircleCheckBig,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      label: "Applications sent",
      value: `${stats.applications}`,
      note:
        stats.applications > 0
          ? "Momentum is building"
          : "Start applying to unlock insights",
      icon: FileText,
      tone: "bg-sky-50 text-sky-700 ring-sky-100",
    },
    {
      label: "Interview pipeline",
      value: `${stats.interviews}`,
      note:
        stats.interviews > 0
          ? "Prepare your next conversation"
          : "Keep applying to create interview chances",
      icon: Calendar,
      tone: "bg-violet-50 text-violet-700 ring-violet-100",
    },
  ];

  const spotlightRoles = [
    {
      title: "Frontend Engineer",
      company: "Remote-first product teams",
      meta: "React, Next.js, Tailwind",
    },
    {
      title: "UI Engineer",
      company: "Growth-stage startups",
      meta: "Design systems, accessibility",
    },
    {
      title: "Product-minded Developer",
      company: "SaaS platforms",
      meta: "Experimentation, analytics",
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="surface-inverse relative overflow-hidden rounded-[2rem] border border-white/10 p-5 text-white lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.28),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.18),_transparent_24%)]" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.9fr)]">
          <div>
            <div className="eyebrow border-white/10 bg-white/10 text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Career dashboard
            </div>
            <h1 className="mt-4 max-w-2xl font-display text-4xl tracking-[-0.04em] text-white lg:text-5xl">
              {session?.user?.name?.split(" ")[0] || "You"} are closer to the next
              great role.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-sky-50/85 lg:text-base">
              Track progress, sharpen your profile, and keep your pipeline active
              from one polished workspace.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/jobs">
                <Button className="w-full bg-white text-slate-950 hover:bg-slate-100 sm:w-auto">
                  Explore Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/job-seeker/profile">
                <Button
                  variant="outline"
                  className="w-full border-white/25 bg-white/10 text-white hover:bg-white/15 sm:w-auto"
                >
                  Update Profile
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-4 backdrop-blur md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Next best move</p>
                <p className="mt-1 text-sm leading-6 text-sky-50/80">
                  {stats.profileCompletion < 80
                    ? "Complete your profile to improve search visibility and role matching."
                    : "Your profile looks strong. Keep applying consistently to maintain momentum."}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <Target className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-slate-950/20 p-4">
              <div className="flex items-center justify-between text-sm text-sky-50/90">
                <span>Profile completion</span>
                <span className="font-semibold">{stats.profileCompletion}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/15">
                <div
                  className="h-2 rounded-full bg-white transition-all"
                  style={{ width: `${stats.profileCompletion}%` }}
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-sky-50/80">
                <Clock3 className="h-4 w-4" />
                {stats.interviews > 0
                  ? "Interview prep should be your focus this week."
                  : "Save 3 roles and apply to at least 1 today."}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MobileStatsCard
          label="Applications"
          value={stats.applications}
          icon={FileText}
          color="blue"
          change="+1"
          onClick={() => {
            window.location.href = "/dashboard/job-seeker/applications";
          }}
        />
        <MobileStatsCard
          label="Saved Jobs"
          value={stats.savedJobs}
          icon={Bookmark}
          color="emerald"
          onClick={() => {
            window.location.href = "/dashboard/job-seeker/saved";
          }}
        />
        <MobileStatsCard
          label="Interviews"
          value={stats.interviews}
          icon={Calendar}
          color="purple"
          change="+1"
        />
        <MobileStatsCard
          label="Profile"
          value={`${stats.profileCompletion}%`}
          icon={TrendingUp}
          color="orange"
          onClick={() => {
            window.location.href = "/dashboard/job-seeker/profile";
          }}
        />
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <Card className="border-white/80 bg-white/94">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-slate-950">Quick actions</CardTitle>
                <p className="mt-1 text-sm text-slate-600">
                  Jump into the things that move your search forward.
                </p>
              </div>
              <Link
                href="/jobs"
                className="hidden text-sm font-semibold text-sky-700 lg:inline-flex"
              >
                Open jobs
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 lg:grid lg:grid-cols-3 lg:overflow-visible">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="min-w-[210px] flex-1 lg:min-w-0"
                >
                  <div className="group h-full rounded-[1.75rem] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.9),_rgba(248,250,252,0.95))] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                        action.color
                      )}
                    >
                      <action.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-5 text-base font-semibold text-slate-950">
                      {action.label}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {action.description}
                    </p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                      Continue
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/80 bg-slate-950 text-white shadow-[0_24px_60px_-40px_rgba(15,23,42,1)]">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">This week&apos;s focus</CardTitle>
            <p className="text-sm leading-6 text-slate-300">
              A compact view of where your effort will have the biggest payoff.
            </p>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {progressItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl ring-1",
                      item.tone
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold tracking-tight text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">{item.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Card className="border-white/80 bg-white/94">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl text-slate-950">Recent activity</CardTitle>
                <p className="mt-1 text-sm text-slate-600">
                  Stay on top of applications, interviews, and profile momentum.
                </p>
              </div>
              <Link
                href="/dashboard/job-seeker/applications"
                className="text-sm font-semibold text-sky-700 hover:text-sky-800"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {activities.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/80 py-10 text-center">
                <FileText className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                <p className="text-slate-600">No recent activity yet</p>
                <Link href="/jobs">
                  <Button variant="outline" className="mt-4">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200/70 bg-slate-50/75 p-4 transition-colors hover:bg-white"
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl",
                        activity.type === "application" && "bg-sky-100 text-sky-700",
                        activity.type === "interview" && "bg-violet-100 text-violet-700",
                        activity.type === "profile" && "bg-emerald-100 text-emerald-700"
                      )}
                    >
                      {activity.type === "application" ? (
                        <FileText className="h-5 w-5" />
                      ) : activity.type === "interview" ? (
                        <Calendar className="h-5 w-5" />
                      ) : (
                        <TrendingUp className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-950">{activity.title}</p>
                      <p className="text-sm text-slate-600">{activity.subtitle}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {activity.date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="border-white/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(240,249,255,0.92))]">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-slate-950">Recommended direction</CardTitle>
              <p className="text-sm leading-6 text-slate-600">
                A few role lanes that fit a modern product-minded profile.
              </p>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {spotlightRoles.map((role) => (
                <div
                  key={role.title}
                  className="rounded-[1.5rem] border border-slate-200/70 bg-white/90 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{role.title}</p>
                      <p className="mt-1 text-sm text-slate-600">{role.company}</p>
                    </div>
                    <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                      Match
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="h-4 w-4" />
                    {role.meta}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {stats.profileCompletion < 100 && (
            <Card className="border-amber-200/80 bg-[linear-gradient(180deg,_rgba(255,251,235,0.95),_rgba(254,243,199,0.75))]">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-amber-600 shadow-sm">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-amber-950">
                      Complete your profile
                    </p>
                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      A stronger profile helps you appear in more recruiter searches
                      and improves recommendation quality.
                    </p>
                    <Link href="/dashboard/job-seeker/profile" className="mt-4 inline-flex">
                      <Button size="sm" className="bg-amber-950 text-white hover:bg-amber-900">
                        Finish profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
