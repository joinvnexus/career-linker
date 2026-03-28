"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Briefcase,
  Settings,
  Users,
  Bell,
  Sparkles,
  BarChart3,
  Building2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
];

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

  if (status === "loading") return <div>Loading...</div>;
  if (!session || session.user.role !== "EMPLOYER") return null;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.10),_transparent_30%),linear-gradient(180deg,_#f8fbff_0%,_#eff6ff_42%,_#ecfeff_100%)]">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-bold tracking-tight text-slate-950">Career-Linker</p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Employer Studio
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/employer/post-job">
                <Button className="bg-slate-950 text-white hover:bg-slate-800">
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Job
                </Button>
              </Link>
              <button className="rounded-full border border-slate-200 bg-white p-2.5 transition-colors hover:bg-slate-50">
                <Bell className="h-5 w-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-72 border-r border-white/70 bg-white/65 backdrop-blur-xl lg:block">
          <div className="p-6">
            <div className="rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,_rgba(56,189,248,0.10),_rgba(16,185,129,0.10))] p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.8)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Hiring momentum</p>
                  <p className="text-sm text-slate-600">
                    Keep new roles live and candidates moving through the pipeline.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-2 px-4 pb-6">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard/employer" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-white hover:text-slate-950 hover:shadow-sm",
                    isActive && "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200/70"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                      item.accent
                    )}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                  </div>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4">
            <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-5 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.8)]">
              <p className="text-sm font-semibold text-slate-950">Need more applicants?</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Refresh your listings, publish a new role, or review analytics for bottlenecks.
              </p>
              <Link href="/dashboard/employer/analytics" className="mt-4 inline-flex">
                <Button variant="outline" className="border-slate-200 bg-white/80">
                  Open Analytics
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
