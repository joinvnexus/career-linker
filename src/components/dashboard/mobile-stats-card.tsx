"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MobileStatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "emerald" | "purple" | "orange" | "red";
  change?: string;
  hint?: string;
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
  hint,
  onClick,
}: MobileStatsCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex min-h-[132px] flex-col overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/94 p-3.5 text-left shadow-[0_14px_35px_-24px_rgba(15,23,42,0.55)] ring-1 ring-slate-200/60 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_-24px_rgba(14,116,144,0.35)] active:translate-y-0 sm:min-h-[152px] sm:rounded-[1.75rem] sm:p-4",
        onClick && "cursor-pointer"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-100 transition-opacity duration-300",
          colorStyles[color]
        )}
      />
      <div className="absolute right-0 top-0 h-20 w-20 -translate-y-7 translate-x-7 rounded-full bg-white/60 blur-2xl transition-transform duration-300 group-hover:scale-125 sm:h-24 sm:w-24" />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-[1rem] ring-1 sm:h-12 sm:w-12 sm:rounded-2xl",
            iconBgStyles[color]
          )}
        >
          <Icon className="h-4.5 w-4.5 sm:h-6 sm:w-6" />
        </div>
        {change && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 sm:text-[11px]">
            {change}
          </span>
        )}
      </div>
      <div className="relative z-10 mt-4 flex-1">
        <p className="text-[1.45rem] font-bold tracking-tight text-slate-950 sm:text-[1.95rem]">
          {value}
        </p>
        <p className="mt-1 text-[13px] font-semibold text-slate-700 sm:text-sm">{label}</p>
        <p className="mt-1.5 max-w-[14ch] text-[11px] leading-4.5 text-slate-500 sm:mt-2 sm:text-sm sm:leading-6">
          {hint || "Tap to open the detailed view."}
        </p>
      </div>
      <div className="relative z-10 mt-3 flex items-center justify-end border-t border-slate-200/70 pt-2.5 sm:mt-4 sm:pt-3">
        <span className="text-sm font-semibold text-slate-700 transition-transform duration-200 group-hover:translate-x-1">
          Open
        </span>
      </div>
    </button>
  );
}
