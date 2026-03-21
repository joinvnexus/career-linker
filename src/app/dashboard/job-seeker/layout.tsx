"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { LayoutGrid, FileText, Bookmark, Settings, User, Bell } from "lucide-react";

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "JOB_SEEKER") {
      router.replace("/unauthorized");
    }
  }, [status, session, router]);

  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user.role !== "JOB_SEEKER") return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header - Desktop Only */}
      <header className="hidden lg:block bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
              <User className="h-6 w-6 text-emerald-600" />
              <span>HireHub</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/jobs">
                <Button variant="outline">Browse Jobs</Button>
              </Link>
              <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                <Bell className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Content - Desktop */}
      <div className="hidden lg:flex">
        <aside className="w-64 bg-white border-r shadow-sm min-h-[calc(100vh-64px)]">
          <nav className="p-6 space-y-2">
            <Link 
              href="/dashboard/job-seeker" 
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium transition-colors"
            >
              <LayoutGrid className="h-5 w-5" />
              <span>Overview</span>
            </Link>
            <Link 
              href="/dashboard/job-seeker/applications" 
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Applied Jobs</span>
            </Link>
            <Link 
              href="/dashboard/job-seeker/saved" 
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <Bookmark className="h-5 w-5" />
              <span>Saved Jobs</span>
            </Link>
            <Link 
              href="/dashboard/job-seeker/profile" 
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </nav>
        </aside>
        
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>

      {/* Mobile Content */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-slate-900">Welcome back!</h1>
                <p className="text-sm text-slate-500">{session.user.name}</p>
              </div>
              <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                <Bell className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 pb-24">
          {children}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
