"use client"

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid, FileText, Bookmark, Settings, User } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
              <User className="h-6 w-6 text-emerald-600" />
              <span>HireHub Job Seeker</span>
            </div>
            <Link href="/jobs">
              <Button variant="outline">Browse Jobs</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex">
        <aside className="w-64 bg-white border-r shadow-sm">
          <nav className="p-6 space-y-2">
            <Link href="/dashboard/job-seeker" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 font-medium">
              <LayoutGrid className="h-5 w-5" />
              <span>Overview</span>
            </Link>
            <Link href="/dashboard/job-seeker/applied" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-gray-50">
              <FileText className="h-5 w-5" />
              <span>Applied Jobs</span>
            </Link>
            <Link href="/dashboard/job-seeker/saved" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-gray-50">
              <Bookmark className="h-5 w-5" />
              <span>Saved Jobs</span>
            </Link>
            <Link href="/dashboard/job-seeker/profile" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-gray-50">
              <Settings className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </nav>
        </aside>
        
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

