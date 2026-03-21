"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FileText, Bookmark, TrendingUp, Calendar, Briefcase, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MobileStatsCard } from "@/components/dashboard/mobile-stats-card";
import { Skeleton } from "@/components/ui/skeleton";

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
        // Fetch applications
        const appsRes = await fetch("/api/applications/my");
        const appsData = await appsRes.json();
        
        // Fetch saved jobs
        const savedRes = await fetch("/api/users/saved-jobs");
        const savedData = await savedRes.json();
        
        // Calculate stats
        const applications = (appsData.applications || []).length;
        const interviews = (appsData.applications || []).filter(
          (a: any) => a.status === "INTERVIEW"
        ).length;
        
        setStats({
          applications,
          savedJobs: (savedData || []).length,
          interviews,
          profileCompletion: 75, // Mock for now
        });

        // Mock recent activities
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
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  const quickActions = [
    {
      label: "Browse Jobs",
      icon: Briefcase,
      href: "/jobs",
      color: "blue",
    },
    {
      label: "Saved Jobs",
      icon: Bookmark,
      href: "/dashboard/job-seeker/saved",
      color: "emerald",
    },
    {
      label: "Edit Profile",
      icon: TrendingUp,
      href: "/dashboard/job-seeker/profile",
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section - Mobile */}
      <div className="lg:hidden">
        <h1 className="text-2xl font-bold text-slate-900">
          Hello, {session?.user?.name?.split(" ")[0] || "there"}! 👋
        </h1>
        <p className="text-slate-500">Here&apos;s what&apos;s happening with your job search.</p>
      </div>

      {/* Desktop Welcome */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {session?.user?.name}</h1>
          <p className="text-slate-500 mt-1">Here&apos;s an overview of your job search progress.</p>
        </div>
        <Link href="/dashboard/job-seeker/profile">
          <Button>Update Profile</Button>
        </Link>
      </div>

      {/* Stats Grid - Mobile Optimized (2x2) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
        <MobileStatsCard
          label="Applications"
          value={stats.applications}
          icon={FileText}
          color="blue"
          change="+1"
          onClick={() => window.location.href = "/dashboard/job-seeker/applications"}
        />
        <MobileStatsCard
          label="Saved Jobs"
          value={stats.savedJobs}
          icon={Bookmark}
          color="emerald"
          onClick={() => window.location.href = "/dashboard/job-seeker/saved"}
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
          onClick={() => window.location.href = "/dashboard/job-seeker/profile"}
        />
      </div>

      {/* Quick Actions - Horizontal Scroll on Mobile */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3 lg:mb-4">Quick Actions</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:grid lg:grid-cols-3 lg:mx-0 lg:px-0 lg:overflow-visible scrollbar-hide">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex-shrink-0 w-[140px] lg:w-auto"
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all group cursor-pointer h-full">
                <CardContent className="p-4 lg:p-6 flex items-center gap-3 lg:block">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center bg-${action.color}-100 mb-0 lg:mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon className={`h-5 w-5 lg:h-6 lg:w-6 text-${action.color}-600`} />
                  </div>
                  <div className="lg:text-center">
                    <p className="font-medium text-slate-900 text-sm lg:text-base">{action.label}</p>
                    <ArrowRight className={`h-4 w-4 lg:hidden text-${action.color}-500 mt-1`} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Browse Jobs CTA - Mobile Only */}
      <div className="lg:hidden">
        <Link href="/jobs">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-emerald-500" size="lg">
            <Briefcase className="mr-2 h-5 w-5" />
            Find Your Next Job
          </Button>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Link href="/dashboard/job-seeker/applications" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No recent activity yet</p>
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
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    activity.type === "application" ? "bg-blue-100" :
                    activity.type === "interview" ? "bg-purple-100" : "bg-green-100"
                  }`}>
                    {activity.type === "application" ? (
                      <FileText className="h-5 w-5 text-blue-600" />
                    ) : activity.type === "interview" ? (
                      <Calendar className="h-5 w-5 text-purple-600" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 truncate">{activity.title}</p>
                    <p className="text-sm text-slate-500 truncate">{activity.subtitle}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{activity.date}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Completion Reminder */}
      {stats.profileCompletion < 100 && (
        <Card className="border border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-amber-900">Complete your profile</p>
                <p className="text-sm text-amber-700">
                  A complete profile increases your chances of getting hired by {100 - stats.profileCompletion}%
                </p>
              </div>
              <Link href="/dashboard/job-seeker/profile">
                <Button size="sm" variant="outline" className="bg-white border-amber-300 text-amber-700 hover:bg-amber-100">
                  Complete
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
