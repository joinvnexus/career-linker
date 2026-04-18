"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    description: "Track applications, saved jobs, and profile momentum",
    icon: UserRound,
    primaryAction: { href: "/dashboard/job-seeker/applied", label: "My Applications" },
    secondaryLinks: [
      { href: "/dashboard/job-seeker", label: "Overview" },
      { href: "/dashboard/job-seeker/saved", label: "Saved Jobs" },
    ],
  },
  EMPLOYER: {
    label: "Employer",
    description: "Publish roles and review applicants in one workspace",
    icon: Building2,
    primaryAction: { href: "/dashboard/employer/post-job", label: "Post a Job" },
    secondaryLinks: [
      { href: "/dashboard/employer", label: "Employer Dashboard" },
      { href: "/dashboard/employer/applicants", label: "Applicants" },
    ],
  },
  ADMIN: {
    label: "Admin",
    description: "Moderate the marketplace and track platform health",
    icon: ShieldCheck,
    primaryAction: { href: "/admin", label: "Admin Panel" },
    secondaryLinks: [
      { href: "/admin/users", label: "Users" },
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
        "sticky top-0 z-50 border-b border-white/65 bg-white/68 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60",
        className
      )}
    >
      <div className="page-shell">
        <div className="flex min-h-20 items-center justify-between gap-4 py-3">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" className="flex items-center gap-3 text-slate-950">
              <span className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] bg-[linear-gradient(135deg,#0284c7_0%,#0f766e_100%)] text-white shadow-[0_18px_40px_-18px_rgba(2,132,199,0.5)]">
                <Briefcase className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <span className="block truncate text-lg font-semibold tracking-tight">
                  Career-Linker
                </span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  Editorial hiring workspace
                </span>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                  isActiveLink(pathname, item.href)
                    ? "bg-slate-950 text-white shadow-[0_14px_30px_-18px_rgba(15,23,42,0.45)]"
                    : "text-slate-600 hover:bg-white hover:text-slate-950"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
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
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
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
                  <div className="rounded-[1.3rem] bg-slate-50 px-3 py-3">
                    <p className="text-sm font-semibold text-slate-900">
                      {session.user.name ?? "Career-Linker Account"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{session.user.email}</p>
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
                  <Button className="rounded-full px-5">Join Career-Linker</Button>
                </Link>
              </>
            )}
          </div>

          <Button
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen((current) => !current)}
            size="icon"
            variant="outline"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileMenuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-white/70 bg-white/90 px-4 py-4 backdrop-blur-2xl lg:hidden"
          >
            <div className="page-shell">
              {status === "authenticated" && session ? (
                <div className="mb-4 rounded-[1.8rem] border border-white/80 bg-[linear-gradient(135deg,rgba(2,132,199,0.12),rgba(15,118,110,0.1))] p-4">
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
                <div className="mb-4 rounded-[1.8rem] bg-[linear-gradient(135deg,#0284c7_0%,#0f766e_100%)] p-4 text-white shadow-[0_24px_60px_-30px_rgba(2,132,199,0.5)]">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                      <Sparkles className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">Find jobs and hire with less noise</p>
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
                      "block rounded-[1.2rem] px-4 py-3 text-sm font-medium transition-colors",
                      isActiveLink(pathname, item.href)
                        ? "bg-slate-950 text-white"
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
