"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  ArrowRight,
  Briefcase,
  Building2,
  LayoutGrid,
  Menu,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { getDashboardPathForRole } from "@/config/roles";
import { Button } from "@/components/ui/button";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { type AppRole } from "@/lib/client-enums";
import { cn } from "@/lib/utils";

type NavbarProps = {
  className?: string;
};

const navLinks = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Career Tips" },
] as const;

const roleCopy: Record<
  AppRole,
  {
    label: string;
    description: string;
    icon: typeof UserRound;
    primaryAction: { href: string; label: string };
    secondaryLinks: Array<{ href: string; label: string }>;
  }
> = {
  JOB_SEEKER: {
    label: "Job Seeker",
    description: "Track applications and saved roles",
    icon: UserRound,
    primaryAction: { href: "/dashboard/job-seeker/applied", label: "My Applications" },
    secondaryLinks: [
      { href: "/dashboard/job-seeker", label: "Overview" },
      { href: "/dashboard/job-seeker/saved", label: "Saved Jobs" },
    ],
  },
  EMPLOYER: {
    label: "Employer",
    description: "Manage jobs and applicants",
    icon: Building2,
    primaryAction: { href: "/dashboard/employer/post-job", label: "Post a Job" },
    secondaryLinks: [
      { href: "/dashboard/employer", label: "Employer Dashboard" },
      { href: "/dashboard/employer/applicants", label: "Applicants" },
    ],
  },
  ADMIN: {
    label: "Admin",
    description: "Control users, jobs, and reports",
    icon: ShieldCheck,
    primaryAction: { href: "/admin", label: "Admin Panel" },
    secondaryLinks: [
      { href: "/admin/users", label: "Manage Users" },
      { href: "/admin/jobs/pending", label: "Pending Jobs" },
    ],
  },
};

const isActiveLink = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export const Navbar = ({ className }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const dashboardPath = getDashboardPathForRole(session?.user.role);
  const currentRole = session?.user.role;
  const roleMeta = currentRole ? roleCopy[currentRole] : null;
  const RoleIcon = roleMeta?.icon ?? LayoutGrid;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70",
        className
      )}
    >
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 lg:gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 text-xl font-bold text-slate-900"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white shadow-lg shadow-sky-200/60">
              <Briefcase className="h-5 w-5" />
            </span>
            <div className="hidden sm:block">
              <span className="block leading-none">Career-Linker</span>
              <span className="mt-1 block text-xs font-medium text-slate-500">
                Careers for modern teams
              </span>
            </div>
          </Link>

        
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActiveLink(pathname, item.href)
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" && session ? (
            <>
              <Link href={roleMeta?.primaryAction.href ?? dashboardPath}>
                <Button className="rounded-full px-5">
                  {roleMeta?.primaryAction.label ?? "Dashboard"}
                </Button>
              </Link>
              <Dropdown
                label={
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                      <RoleIcon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 text-left">
                      <span className="block max-w-36 truncate text-sm font-semibold text-slate-900">
                        {session.user.name ?? session.user.email ?? "Account"}
                      </span>
                      <span className="block text-xs text-slate-500">
                        {roleMeta?.label ?? "Member"}
                      </span>
                    </span>
                  </div>
                }
                menuClassName="w-72"
              >
                <div className="rounded-2xl bg-slate-50 px-3 py-3">
                  <p className="text-sm font-semibold text-slate-900">
                    {session.user.name ?? "Career-Linker Account"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {session.user.email}
                  </p>
                </div>
                <div className="mt-2 space-y-1">
                  <Link
                    href={dashboardPath}
                    className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    Dashboard
                  </Link>
                  {roleMeta?.secondaryLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/jobs"
                    className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    Browse Jobs
                  </Link>
                </div>
                <DropdownSeparator />
                <DropdownItem
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </DropdownItem>
              </Dropdown>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button className="rounded-full" variant="outline">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full px-5">
                  Join Career-Linker
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="inline-flex rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition-colors hover:bg-slate-50 md:hidden"
          onClick={() => setMobileMenuOpen((current) => !current)}
          type="button"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:hidden">
          {status === "authenticated" && session ? (
            <div className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-700 shadow-sm">
                  <RoleIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {session.user.name ?? session.user.email ?? "Account"}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                    {roleMeta?.label ?? "Member"}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {roleMeta?.description ?? "Manage your Career-Linker account."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-4 rounded-3xl bg-gradient-to-r from-sky-600 to-emerald-500 p-4 text-white">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Find jobs and hire faster</p>
                  <p className="mt-1 text-sm text-white/80">
                    Search roles, save opportunities, and manage applications in one place.
                  </p>
                </div>
              </div>
            </div>
          )}

          <nav className="space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                  isActiveLink(pathname, item.href)
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                )}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 space-y-3">
            {status === "authenticated" && session ? (
              <>
                <Link href={roleMeta?.primaryAction.href ?? dashboardPath} onClick={closeMobileMenu}>
                  <Button className="w-full rounded-full">
                    {roleMeta?.primaryAction.label ?? "Dashboard"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {roleMeta?.secondaryLinks.map((item) => (
                  <Link key={item.href} href={item.href} onClick={closeMobileMenu}>
                    <Button className="w-full rounded-full" variant="outline">
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <Button
                  className="w-full rounded-full"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  variant="outline"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMobileMenu}>
                  <Button className="w-full rounded-full" variant="outline">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={closeMobileMenu}>
                  <Button className="w-full rounded-full">Join Career-Linker</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};
