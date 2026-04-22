"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  id: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  job?: {
    title?: string;
    employer?: {
      employerProfile?: {
        companyName?: string | null;
      } | null;
      name?: string | null;
    } | null;
  } | null;
};

type SavedJobSummary = {
  id: string;
  createdAt: string;
  title: string;
  employer?: {
    employerProfile?: {
      companyName?: string | null;
    } | null;
    name?: string | null;
  } | null;
};

type ProfileSummary = {
  headline?: string | null;
  location?: string | null;
  resumeUrl?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  skills?: Array<{ id: string; name: string }>;
  experiences?: Array<{ id: string; title: string }>;
  educations?: Array<{ id: string; degree: string }>;
};

const formatRelativeDate = (value?: string): string => {
  if (!value) return "Recently";

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "Recently";

  const minutes = Math.max(1, Math.round((Date.now() - timestamp) / 60000));
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
};

const getProfileCompletion = (profile?: ProfileSummary | null): number => {
  if (!profile) return 0;

  let score = 0;
  if (profile.headline?.trim()) score += 20;
  if (profile.location?.trim()) score += 10;
  if (profile.resumeUrl?.trim() || profile.websiteUrl?.trim() || profile.linkedinUrl?.trim()) {
    score += 20;
  }
  if (profile.skills?.some((skill) => skill.name.trim())) score += 20;
  if (profile.experiences?.some((experience) => experience.title.trim())) score += 15;
  if (profile.educations?.some((education) => education.degree.trim())) score += 15;

  return score;
};

export default function JobSeekerOverview() {
  const { data: session } = useSession();
  const router = useRouter();
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
        const [appsRes, savedRes, profileRes] = await Promise.all([
          fetch("/api/applications/my"),
          fetch("/api/users/saved-jobs"),
          fetch("/api/profiles/seeker"),
        ]);

        const [appsData, savedData, profileData] = await Promise.all([
          appsRes.json(),
          savedRes.json(),
          profileRes.json(),
        ]);

        const applicationItems = (appsData.applications || []) as ApplicationSummary[];
        const savedItems = (savedData || []) as SavedJobSummary[];
        const profile = (profileData.profile || null) as ProfileSummary | null;

        const applications = applicationItems.length;
        const interviews = applicationItems.filter(
          (application: ApplicationSummary) => application.status === "INTERVIEW"
        ).length;
        const savedJobs = savedItems.length;
        const profileCompletion = getProfileCompletion(profile);

        const applicationActivities = applicationItems
          .slice(0, 3)
          .map((application) => {
            const companyName =
              application.job?.employer?.employerProfile?.companyName ||
              application.job?.employer?.name ||
              "Employer";
            const isInterview = application.status === "INTERVIEW";

            return {
              timestamp: application.updatedAt || application.createdAt || "",
              activity: {
              id: application.id,
              type: (isInterview ? "interview" : "application") as RecentActivity["type"],
              title: isInterview
                ? `Interview in progress for ${application.job?.title || "your application"}`
                : `Applied to ${application.job?.title || "a role"}`,
              subtitle: `${companyName} | ${application.status.replaceAll("_", " ")}`,
              date: formatRelativeDate(application.updatedAt || application.createdAt),
              },
            };
          });

        const savedActivities = savedItems.slice(0, 2).map((job) => ({
          timestamp: job.createdAt || "",
          activity: {
            id: `saved-${job.id}`,
            type: "profile" as const,
            title: `Saved ${job.title}`,
            subtitle:
              job.employer?.employerProfile?.companyName ||
              job.employer?.name ||
              "Saved for later",
            date: formatRelativeDate(job.createdAt),
          },
        }));

        const nextActivities = [...applicationActivities, ...savedActivities]
          .sort((left, right) => {
            const leftDate = new Date(left.timestamp).getTime() || 0;
            const rightDate = new Date(right.timestamp).getTime() || 0;
            return rightDate - leftDate;
          })
          .map((item) => item.activity)
          .slice(0, 4);

        setStats({
          applications,
          savedJobs,
          interviews,
          profileCompletion,
        });

        setActivities(nextActivities);
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

  const dashboardHighlights = [
    {
      label: "Applications",
      value: stats.applications,
      note: stats.applications > 0 ? "Active search" : "Start applying",
    },
    {
      label: "Saved roles",
      value: stats.savedJobs,
      note: stats.savedJobs > 0 ? "Shortlist ready" : "Build a shortlist",
    },
    {
      label: "Interviews",
      value: stats.interviews,
      note: stats.interviews > 0 ? "Prep in motion" : "Pipeline still early",
    },
  ];

  return (
    <div className="space-y-4 lg:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-[#042C53] p-4 text-white sm:p-5 lg:p-8">
        <div className="absolute right-0 top-0 h-48 w-48 translate-x-12 -translate-y-12 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-12 translate-y-12 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.9fr)]">
          <div>
            <div className="eyebrow border-white/10 bg-white/10 text-sky-100">
              <Sparkles className="h-3.5 w-3.5" />
              Career dashboard
            </div>
            <h1 className="mt-3.5 max-w-xl font-display text-[1.8rem] leading-[0.95] tracking-[-0.05em] text-white sm:text-[2.45rem] lg:text-5xl">
              Good morning, {session?.user?.name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="mt-2.5 max-w-xl text-sm leading-6 text-slate-300 lg:text-base lg:leading-7">
              Track progress, sharpen your profile, and keep your pipeline active
              from one polished workspace.
            </p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <Link href="/jobs">
                <Button className="w-full bg-[#FAC775] text-[#412402] hover:bg-amber-400 sm:w-auto">
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
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {dashboardHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.2rem] border border-white/10 bg-white/10 px-3 py-2.5 backdrop-blur"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {item.value}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-4 text-slate-400 sm:text-sm sm:leading-5">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-3.5 backdrop-blur md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Next best move</p>
                <p className="mt-1 text-sm leading-5 text-sky-50/80 sm:leading-6">
                  {stats.profileCompletion < 80
                    ? "Complete your profile to improve search visibility and role matching."
                    : "Your profile looks strong. Keep applying consistently to maintain momentum."}
                </p>
              </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </div>
            <div className="mt-4 rounded-2xl bg-slate-950/20 p-3.5 sm:p-4">
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

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <MobileStatsCard
          label="Applications"
          value={stats.applications}
          icon={FileText}
          color="blue"
          hint="Review the latest status changes in your application flow."
          onClick={() => {
            router.push("/dashboard/job-seeker/applications");
          }}
        />
        <MobileStatsCard
          label="Interviews"
          value={stats.interviews}
          icon={Calendar}
          color="emerald"
          hint="See roles that are moving toward recruiter conversations."
          onClick={() => {
            router.push("/dashboard/job-seeker/applications");
          }}
        />
        <MobileStatsCard
          label="Saved Jobs"
          value={stats.savedJobs}
          icon={Bookmark}
          color="orange"
          hint="Jump back into the roles you wanted to compare later."
          onClick={() => {
            router.push("/dashboard/job-seeker/saved");
          }}
        />
        <MobileStatsCard
          label="Profile Views"
          value={stats.profileCompletion}
          icon={TrendingUp}
          color="purple"
          hint="Tighten your profile details to improve recruiter visibility."
          onClick={() => {
            router.push("/dashboard/job-seeker/profile");
          }}
        />
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card className="border-white/80 bg-white/94">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <CardTitle className="text-lg text-slate-950 sm:text-xl">Quick actions</CardTitle>
                <p className="mt-1 text-sm leading-5 text-slate-600 sm:leading-6">
                  Jump into the things that move your search forward.
                </p>
              </div>
              <Link
                href="/jobs"
                className="inline-flex text-sm font-semibold text-sky-700"
              >
                Open jobs
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="block h-full"
                >
                  <div className="group flex h-full min-h-[148px] flex-col rounded-[1.45rem] border border-slate-200/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(248,250,252,0.96))] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg sm:min-h-[164px] sm:rounded-[1.75rem] sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-[1rem] bg-gradient-to-br text-white shadow-lg sm:h-12 sm:w-12 sm:rounded-2xl",
                          action.color
                        )}
                      >
                        <action.icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Action
                      </span>
                    </div>
                    <div className="mt-4 flex-1">
                      <p className="text-[15px] font-semibold text-slate-950 sm:text-base">
                        {action.label}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
                        {action.description}
                      </p>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 sm:mt-4 sm:text-sm sm:normal-case sm:tracking-normal">
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
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">This week&apos;s focus</CardTitle>
            <p className="text-sm leading-5 text-slate-300 sm:leading-6">
              A compact view of where your effort will have the biggest payoff.
            </p>
          </CardHeader>
          <CardContent className="grid gap-2.5 pt-0 sm:gap-3">
            {progressItems.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.25rem] border border-white/10 bg-white/5 p-3.5 sm:rounded-2xl sm:p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[1rem] ring-1 sm:h-11 sm:w-11 sm:rounded-2xl",
                      item.tone
                    )}
                  >
                    <item.icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 min-[440px]:flex-row min-[440px]:items-start min-[440px]:justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:text-xs sm:tracking-[0.18em]">
                        {item.label}
                      </p>
                      <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                        {item.value}
                      </p>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6">
                      {item.note}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
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
                <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 py-7 text-center sm:rounded-[1.75rem] sm:py-10">
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
