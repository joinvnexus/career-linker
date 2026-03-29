"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FileText, Bookmark, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  className?: string;
}

const navItems = [
  {
    href: "/dashboard/job-seeker",
    icon: LayoutGrid,
    label: "Home",
  },
  {
    href: "/dashboard/job-seeker/applications",
    icon: FileText,
    label: "Applied",
  },
  {
    href: "/dashboard/job-seeker/saved",
    icon: Bookmark,
    label: "Saved",
  },
  {
    href: "/dashboard/job-seeker/profile",
    icon: User,
    label: "Profile",
  },
];

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t border-white/70 bg-white/90 shadow-[0_-18px_40px_-28px_rgba(15,23,42,0.55)] backdrop-blur-2xl lg:hidden",
        className
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-3 py-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard/job-seeker" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-[70px] flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 transition-all duration-200",
                isActive
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "text-white")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
