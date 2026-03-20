"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Briefcase, Menu, X } from "lucide-react";
import { getDashboardPathForRole } from "@/config/roles";
import { Button } from "@/components/ui/button";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
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

export const Navbar = ({ className }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const dashboardPath = getDashboardPathForRole(session?.user.role);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/50 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-xl font-bold text-slate-900"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white">
            <Briefcase className="h-5 w-5" />
          </span>
          <span>HireHub</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" && session ? (
            <Dropdown
              label={
                <span className="max-w-36 truncate">
                  {session.user.name ?? session.user.email ?? "Account"}
                </span>
              }
            >
              <Link
                href={dashboardPath}
                className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/jobs"
                className="block rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                Browse Jobs
              </Link>
              <DropdownSeparator />
              <DropdownItem
                className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </DropdownItem>
            </Dropdown>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Join HireHub</Button>
              </Link>
            </>
          )}
        </div>

        <button
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
          className="inline-flex rounded-xl p-2 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
          onClick={() => setMobileMenuOpen((current) => !current)}
          type="button"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="space-y-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 space-y-3">
            {status === "authenticated" && session ? (
              <>
                <Link href={dashboardPath} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Dashboard</Button>
                </Link>
                <Button
                  className="w-full"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  variant="outline"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full" variant="outline">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Join HireHub</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};
