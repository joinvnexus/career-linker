"use client";

import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { type LucideIcon, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  accent: string;
};

type WorkspaceShellProps = {
  title: string;
  eyebrow: string;
  brandIcon: LucideIcon;
  brandGradient: string;
  navItems: NavItem[];
  pathname: string;
  children: React.ReactNode;
  desktopHeaderActions?: React.ReactNode;
  mobileHeaderActions?: React.ReactNode;
  sidebarCalloutTitle: string;
  sidebarCalloutCopy: string;
  sidebarCalloutAction?: React.ReactNode;
  mobileBottomNav?: React.ReactNode;
};

export function WorkspaceShell({
  title,
  eyebrow,
  brandIcon: BrandIcon,
  brandGradient,
  navItems,
  pathname,
  children,
  desktopHeaderActions,
  mobileHeaderActions,
  sidebarCalloutTitle,
  sidebarCalloutCopy,
  sidebarCalloutAction,
  mobileBottomNav,
}: WorkspaceShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[var(--surface-page)]">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/72 backdrop-blur-2xl">
        <div className="app-shell">
          <div className="flex min-h-18 items-center justify-between gap-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-[1.4rem] text-white shadow-lg",
                  brandGradient
                )}
              >
                <BrandIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {eyebrow}
                </p>
                <p className="truncate text-lg font-semibold tracking-tight text-slate-950">
                  {title}
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-3 lg:flex">{desktopHeaderActions}</div>

            <div className="flex items-center gap-2 lg:hidden">
              {mobileHeaderActions}
              <Button
                aria-expanded={mobileNavOpen}
                aria-label="Toggle workspace navigation"
                className="h-11 w-11 rounded-2xl"
                onClick={() => setMobileNavOpen((current) => !current)}
                size="icon"
                variant="outline"
              >
                {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="app-shell py-4 sm:py-6">
        <div className="hidden gap-6 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="sticky top-24 h-[calc(100vh-7.5rem)]">
            <div className="surface-panel flex h-full flex-col rounded-[2rem] border border-white/75 p-4">
              <div className="rounded-[1.7rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(240,249,255,0.72))] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Workspace
                </p>
                <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                  A quieter way to move through high-signal tasks.
                </p>
              </div>

              <nav className="mt-4 space-y-2" aria-label={`${title} navigation`}>
                {navItems.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/dashboard/job-seeker" &&
                      item.href !== "/dashboard/employer" &&
                      item.href !== "/admin" &&
                      pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-[1.4rem] px-4 py-3.5 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15"
                          : "text-slate-600 hover:bg-white hover:text-slate-950"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm",
                          item.accent
                        )}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto rounded-[1.6rem] border border-slate-200/80 bg-white/90 p-5 shadow-[var(--shadow-soft)]">
                <p className="text-sm font-semibold text-slate-950">{sidebarCalloutTitle}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{sidebarCalloutCopy}</p>
                {sidebarCalloutAction ? <div className="mt-4">{sidebarCalloutAction}</div> : null}
              </div>
            </div>
          </aside>

          <main className="min-w-0">{children}</main>
        </div>

        <div className="lg:hidden">
          <AnimatePresence initial={false}>
            {mobileNavOpen ? (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
                exit={reduceMotion ? {} : { opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mb-4 rounded-[1.8rem] border border-white/75 bg-white/84 p-3 shadow-[var(--shadow-panel)] backdrop-blur-2xl"
              >
                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/dashboard/job-seeker" &&
                        item.href !== "/dashboard/employer" &&
                        item.href !== "/admin" &&
                        pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-medium transition-colors",
                          active ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100"
                        )}
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-sm",
                            item.accent
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <main className="min-w-0 pb-28">{children}</main>
          {mobileBottomNav}
        </div>
      </div>
    </div>
  );
}
