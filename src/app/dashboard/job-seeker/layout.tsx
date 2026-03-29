"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Bell, Bookmark, FileText, LayoutGrid, Settings, User } from "lucide-react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    href: "/dashboard/job-seeker",
    label: "Overview",
    icon: LayoutGrid,
    accent: "from-sky-500 to-cyan-400",
  },
  {
    href: "/dashboard/job-seeker/applications",
    label: "Applied Jobs",
    icon: FileText,
    accent: "from-indigo-500 to-sky-400",
  },
  {
    href: "/dashboard/job-seeker/saved",
    label: "Saved Jobs",
    icon: Bookmark,
    accent: "from-emerald-500 to-teal-400",
  },
  {
    href: "/dashboard/job-seeker/profile",
    label: "Profile",
    icon: Settings,
    accent: "from-amber-500 to-orange-400",
  },
  {
    href: "/dashboard/job-seeker/settings",
    label: "Settings",
    icon: Bell,
    accent: "from-slate-700 to-slate-500",
  },
] as const;

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "JOB_SEEKER") {
      router.replace("/unauthorized");
    }
  }, [status, session, router]);

  if (status === "loading") return <div className="p-8 text-sm text-slate-500">Loading...</div>;
  if (!session || session.user.role !== "JOB_SEEKER") return null;

  return (
    <WorkspaceShell
      title={session.user.name ?? "Job Seeker Studio"}
      eyebrow="Job Seeker"
      brandIcon={User}
      brandGradient="bg-gradient-to-br from-emerald-500 to-sky-500"
      navItems={[...navItems]}
      pathname={pathname}
      desktopHeaderActions={
        <>
          <Link href="/jobs">
            <Button variant="outline">Browse Jobs</Button>
          </Link>
          <Button size="icon" variant="outline">
            <Bell className="h-5 w-5 text-slate-600" />
          </Button>
        </>
      }
      mobileHeaderActions={
        <Link href="/jobs">
          <Button size="sm" variant="outline">
            Jobs
          </Button>
        </Link>
      }
      sidebarCalloutTitle="Keep your profile in motion"
      sidebarCalloutCopy="Refresh your profile, revisit saved jobs, and make it easier for recruiters to read your signal."
      sidebarCalloutAction={
        <Link href="/jobs" className="inline-flex">
          <Button>Explore Jobs</Button>
        </Link>
      }
      mobileBottomNav={<BottomNav />}
    >
      {children}
    </WorkspaceShell>
  );
}
