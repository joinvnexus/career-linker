"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MobileStatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "emerald" | "purple" | "orange" | "red";
  change?: string;
  onClick?: () => void;
}

const colorStyles = {
  blue: "from-sky-500/15 via-white to-sky-500/5",
  emerald: "from-emerald-500/15 via-white to-emerald-500/5",
  purple: "from-violet-500/15 via-white to-violet-500/5",
  orange: "from-amber-500/15 via-white to-amber-500/5",
  red: "from-rose-500/15 via-white to-rose-500/5",
};

const iconBgStyles = {
  blue: "bg-sky-100 text-sky-700 ring-sky-200/80",
  emerald: "bg-emerald-100 text-emerald-700 ring-emerald-200/80",
  purple: "bg-violet-100 text-violet-700 ring-violet-200/80",
  orange: "bg-amber-100 text-amber-700 ring-amber-200/80",
  red: "bg-rose-100 text-rose-700 ring-rose-200/80",
};

export function MobileStatsCard({
  label,
  value,
  icon: Icon,
  color = "blue",
  change,
  onClick,
}: MobileStatsCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/90 p-4 text-left shadow-[0_14px_35px_-24px_rgba(15,23,42,0.55)] ring-1 ring-slate-200/60 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-24px_rgba(14,116,144,0.35)]",
        onClick && "cursor-pointer"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-100 transition-opacity duration-300",
          colorStyles[color]
        )}
      />
      <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-white/60 blur-2xl transition-transform duration-300 group-hover:scale-125" />
      <div className="relative z-10 flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl ring-1",
            iconBgStyles[color]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        {change && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
            {change}
          </span>
        )}
      </div>
      <div className="relative z-10 mt-6">
        <p className="text-[1.9rem] font-bold tracking-tight text-slate-950">{value}</p>
        <p className="mt-1 text-sm font-medium text-slate-600">{label}</p>
      </div>
    </button>
  );
}
