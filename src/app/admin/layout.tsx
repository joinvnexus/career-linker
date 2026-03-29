"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart3,
  Briefcase,
  Building2,
  CreditCard,
  LayoutGrid,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutGrid, accent: "from-slate-900 to-slate-700" },
  { href: "/admin/users", label: "Users", icon: Users, accent: "from-sky-600 to-cyan-500" },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase, accent: "from-violet-600 to-fuchsia-500" },
  { href: "/admin/jobs/pending", label: "Pending Jobs", icon: ShieldCheck, accent: "from-amber-500 to-orange-500" },
  { href: "/admin/companies", label: "Companies", icon: Building2, accent: "from-emerald-600 to-teal-500" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, accent: "from-indigo-600 to-sky-500" },
  { href: "/admin/reports", label: "Reports", icon: BarChart3, accent: "from-rose-600 to-pink-500" },
  { href: "/admin/settings", label: "Settings", icon: Settings2, accent: "from-slate-700 to-slate-500" },
] as const;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session || session.user.role !== "ADMIN") {
      router.replace("/unauthorized");
    }
  }, [router, session, status]);

  if (status === "loading") {
    return <div className="p-8 text-sm text-slate-500">Loading admin panel...</div>;
  }

  if (!session || session.user.role !== "ADMIN") {
    return <></>;
  }

  return (
    <WorkspaceShell
      title="Admin Command Center"
      eyebrow="Career-Linker"
      brandIcon={ShieldCheck}
      brandGradient="bg-gradient-to-br from-slate-950 to-slate-700"
      navItems={[...adminLinks]}
      pathname={pathname}
      desktopHeaderActions={
        <>
          <span className="hidden text-sm text-slate-500 xl:inline">{session.user.email}</span>
          <Link href="/jobs">
            <Button variant="outline">View Site</Button>
          </Link>
        </>
      }
      mobileHeaderActions={
        <Link href="/jobs">
          <Button size="sm" variant="outline">
            View Site
          </Button>
        </Link>
      }
      sidebarCalloutTitle="Marketplace control"
      sidebarCalloutCopy="Moderate listings, protect trust, and keep platform operations moving with less friction."
    >
      {children}
    </WorkspaceShell>
  );
}
