"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  LayoutGrid,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    href: "/dashboard/employer",
    label: "Overview",
    icon: LayoutGrid,
    accent: "from-sky-500 to-cyan-400",
  },
  {
    href: "/dashboard/employer/jobs",
    label: "My Jobs",
    icon: Briefcase,
    accent: "from-indigo-500 to-sky-400",
  },
  {
    href: "/dashboard/employer/applicants",
    label: "Applicants",
    icon: Users,
    accent: "from-emerald-500 to-teal-400",
  },
  {
    href: "/dashboard/employer/analytics",
    label: "Analytics",
    icon: BarChart3,
    accent: "from-violet-500 to-fuchsia-400",
  },
  {
    href: "/dashboard/employer/company-profile",
    label: "Company Profile",
    icon: Settings,
    accent: "from-amber-500 to-orange-400",
  },
] as const;

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "EMPLOYER") {
      router.replace("/unauthorized");
    }
  }, [status, session, router]);

  if (status === "loading") return <div className="p-8 text-sm text-slate-500">Loading...</div>;
  if (!session || session.user.role !== "EMPLOYER") return null;

  return (
    <WorkspaceShell
      title="Employer Studio"
      eyebrow="Employer"
      brandIcon={Building2}
      brandGradient="bg-gradient-to-br from-sky-500 to-emerald-500"
      navItems={[...navItems]}
      pathname={pathname}
      desktopHeaderActions={
        <>
          <Link href="/dashboard/employer/post-job">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </Link>
          <Button size="icon" variant="outline">
            <Bell className="h-5 w-5 text-slate-600" />
          </Button>
        </>
      }
      mobileHeaderActions={
        <Link href="/dashboard/employer/post-job">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Post
          </Button>
        </Link>
      }
      sidebarCalloutTitle="Need more applicants?"
      sidebarCalloutCopy="Refresh your listings, publish a new role, or review analytics to spot bottlenecks faster."
      sidebarCalloutAction={
        <Link href="/dashboard/employer/analytics" className="inline-flex">
          <Button variant="outline">Open Analytics</Button>
        </Link>
      }
    >
      {children}
    </WorkspaceShell>
  );
}
