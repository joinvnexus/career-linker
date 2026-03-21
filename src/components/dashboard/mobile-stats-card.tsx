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
  blue: "from-blue-500 to-blue-600 bg-blue-50 text-blue-600",
  emerald: "from-emerald-500 to-emerald-600 bg-emerald-50 text-emerald-600",
  purple: "from-purple-500 to-purple-600 bg-purple-50 text-purple-600",
  orange: "from-orange-500 to-orange-600 bg-orange-50 text-orange-600",
  red: "from-red-500 to-red-600 bg-red-50 text-red-600",
};

const iconBgStyles = {
  blue: "bg-blue-100",
  emerald: "bg-emerald-100",
  purple: "bg-purple-100",
  orange: "bg-orange-100",
  red: "bg-red-100",
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
        "group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 text-left transition-all hover:shadow-lg",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            iconBgStyles[color]
          )}
        >
          <Icon className={cn("h-6 w-6", `text-${color}-600`)} />
        </div>
        {change && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            {change}
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="mt-0.5 text-sm text-slate-500">{label}</p>
      </div>
      
      {/* Gradient overlay on hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
          colorStyles[color]
        )}
        style={{ opacity: 0.05 }}
      />
    </button>
  );
}
