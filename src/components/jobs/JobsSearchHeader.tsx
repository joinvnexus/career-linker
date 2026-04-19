"use client";

import { Briefcase, Loader2, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobsFilterState } from "@/components/jobs/types";

type JobsSearchHeaderProps = {
  filters: JobsFilterState;
  total: number;
  loading: boolean;
  onSearchChange: (key: keyof JobsFilterState, value: string) => void;
  onQuickApply: (key: keyof JobsFilterState, value: string) => void;
  onSearchSubmit: () => void;
};

const quickFilters = [
  { label: "All types", key: "jobType" as const, value: "" },
  { label: "Full-time", key: "jobType" as const, value: "FULL_TIME" },
  { label: "Remote", key: "jobType" as const, value: "REMOTE" },
  { label: "Contract", key: "jobType" as const, value: "CONTRACT" },
  { label: "Internship", key: "jobType" as const, value: "INTERNSHIP" },
  { label: "Part-time", key: "jobType" as const, value: "PART_TIME" },
] as const;

export function JobsSearchHeader({
  filters,
  total,
  loading,
  onSearchChange,
  onQuickApply,
  onSearchSubmit,
}: JobsSearchHeaderProps) {
  return (
    <div className="space-y-3">
      {/* Search bar */}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
      >
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Job title, keyword, or company..."
            value={filters.search}
            onChange={(e) => onSearchChange("search", e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
          />
        </label>

        <label className="relative w-44 shrink-0">
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Location..."
            value={filters.location}
            onChange={(e) => onSearchChange("location", e.target.value)}
            className="h-11 w-full rounded-xl border border-input bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-5 text-sm font-semibold text-background transition-colors hover:opacity-90 disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {loading ? "Searching..." : "Search jobs"}
          </span>
        </button>
      </form>

      {/* Quick type chips + result count */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {quickFilters.map((item) => {
            const isActive = filters.jobType === item.value;
            return (
              <button
                key={item.value || "all"}
                type="button"
                onClick={() => onQuickApply(item.key, item.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                  isActive
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <Briefcase className="h-3.5 w-3.5" />
          {loading ? (
            <span>Loading...</span>
          ) : (
            <span>
              <span className="font-semibold text-foreground">
                {total.toLocaleString()}
              </span>{" "}
              jobs
            </span>
          )}
        </div>
      </div>
    </div>
  );
}