"use client";

import { ArrowRight, Briefcase, Loader2, MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  { label: "Remote", key: "jobType", value: "REMOTE" },
  { label: "Full-time", key: "jobType", value: "FULL_TIME" },
  { label: "Worldwide", key: "location", value: "" },
  { label: "Entry level", key: "experience", value: "ENTRY" },
] as const;

const quickFilterIsActive = (filters: JobsFilterState, key: keyof JobsFilterState, value: string) =>
  filters[key] === value;

export function JobsSearchHeader({
  filters,
  total,
  loading,
  onSearchChange,
  onQuickApply,
  onSearchSubmit,
}: JobsSearchHeaderProps) {
  return (
    <section className="surface-inverse relative overflow-hidden rounded-[2.25rem] border border-white/10 px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_28%)]" />

      <div className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-200">
              <Sparkles className="h-4 w-4" />
              Job search workspace
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Find roles with less friction and better signal.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Search by role, company, or location, then tighten the list with filters designed for faster scanning.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-[1.4rem] bg-white/5 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Results</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">
                {loading ? (
                  <span className="inline-flex items-center gap-1">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </span>
                ) : (
                  total.toLocaleString()
                )}
              </p>
            </div>
            <div className="rounded-[1.4rem] bg-white/5 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Search mode</p>
              <p className="mt-2 text-lg font-semibold text-sky-100">Focused</p>
            </div>
            <div className="col-span-2 rounded-[1.4rem] bg-white/5 px-4 py-4 sm:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Workflow</p>
              <p className="mt-2 text-lg font-semibold">Filter, scan, apply</p>
            </div>
          </div>
        </div>

        <form
          className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-3 backdrop-blur-xl"
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                className="h-14 rounded-[1.3rem] border-white/10 bg-white pl-12 text-slate-950"
                onChange={(event) => onSearchChange("search", event.target.value)}
                placeholder="Job title, skill, or company"
                value={filters.search}
              />
            </label>

            <label className="relative block">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                className="h-14 rounded-[1.3rem] border-white/10 bg-white pl-12 text-slate-950"
                onChange={(event) => onSearchChange("location", event.target.value)}
                placeholder="City, country, or remote"
                value={filters.location}
              />
            </label>

            <Button className="h-14 rounded-[1.3rem] px-8 text-base font-semibold" onClick={onSearchSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  Find Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
            <span className="font-medium text-slate-400">Current focus:</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">{filters.search || "Any role"}</span>
            <span className="rounded-full bg-white/10 px-3 py-1.5">{filters.location || "Any location"}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Quick apply:</span>
            {quickFilters.map((item) => (
              <button
                key={`${item.key}-${item.value}`}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-all duration-200",
                  quickFilterIsActive(filters, item.key, item.value)
                    ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-100"
                    : "border-white/10 bg-white/10 text-white/90 hover:border-white/20 hover:bg-white/15"
                )}
                onClick={() => onQuickApply(item.key, item.value)}
                type="button"
              >
                {item.label}
              </button>
            ))}
            <span className="ml-auto hidden items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-200 sm:inline-flex">
              <Briefcase className="h-4 w-4" />
              Fresh listings, faster scan
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
