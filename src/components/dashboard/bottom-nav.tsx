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
        "fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-sm lg:hidden",
        className
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard/job-seeker" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 transition-colors min-w-[64px]",
                isActive
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive && "fill-blue-100")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
