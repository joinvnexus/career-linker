"use client";

import { ArrowRight, Briefcase, MapPin, Search, Sparkles, Loader2, Search as SearchIcon, MapPin as MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  { label: "Remote", key: "jobType", value: "REMOTE", icon: "🌍" },
  { label: "Full-time", key: "jobType", value: "FULL_TIME", icon: "💼" },
  { label: "Worldwide", key: "location", value: "", icon: "✨" },
  { label: "Entry level", key: "experience", value: "ENTRY", icon: "🚀" },
] as const;

const quickFilterIsActive = (
  filters: JobsFilterState,
  key: keyof JobsFilterState,
  value: string
) => filters[key] === value;

export function JobsSearchHeader({
  filters,
  total,
  loading,
  onSearchChange,
  onQuickApply,
  onSearchSubmit,
}: JobsSearchHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] bg-slate-950 px-5 py-8 text-white shadow-[0_35px_90px_-40px_rgba(15,23,42,0.75)] sm:px-8 sm:py-10 lg:px-10">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_28%)]" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
      
      <div className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex animate-in fade-in slide-in-from-bottom-2 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-200 duration-500">
              <Sparkles className="h-4 w-4 animate-pulse" />
              Job search workspace
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-white via-sky-100 to-emerald-100 bg-clip-text text-transparent">
                Find roles with less friction
              </span>
              <br />
              <span className="text-slate-300">and better signal.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Search by role, company, or location, then tighten the list with
              filters built for fast scanning.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="group rounded-2xl bg-white/5 px-4 py-4 transition-all duration-300 hover:bg-white/10 hover:scale-105">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Results
              </p>
              <p className="mt-2 text-2xl font-bold tabular-nums">
                {loading ? (
                  <span className="inline-flex items-center gap-1">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </span>
                ) : (
                  total.toLocaleString()
                )}
              </p>
            </div>
            <div className="group rounded-2xl bg-white/5 px-4 py-4 transition-all duration-300 hover:bg-white/10 hover:scale-105">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Search mode
              </p>
              <p className="mt-2 text-lg font-bold">
                <span className="bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-transparent">
                  Focused
                </span>
              </p>
            </div>
            <div className="col-span-2 group rounded-2xl bg-white/5 px-4 py-4 transition-all duration-300 hover:bg-white/10 hover:scale-105 sm:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Workflow
              </p>
              <p className="mt-2 text-lg font-bold">Filter, scan, apply</p>
            </div>
          </div>
        </div>

        <form 
          className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-3 backdrop-blur-xl transition-all duration-300 hover:border-white/20 focus-within:border-white/30 focus-within:bg-white/10" 
          onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_260px_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-hover:text-slate-300" />
              <Input
                className="h-14 rounded-2xl border-white/10 bg-white text-slate-950 pl-12 transition-all duration-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 placeholder:text-slate-400"
                onChange={(event) => onSearchChange("search", event.target.value)}
                placeholder="Job title, skill, or company"
                value={filters.search}
              />
            </label>

            <label className="relative block">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors" />
              <Input
                className="h-14 rounded-2xl border-white/10 bg-white text-slate-950 pl-12 transition-all duration-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 placeholder:text-slate-400"
                onChange={(event) => onSearchChange("location", event.target.value)}
                placeholder="City, country, or remote"
                value={filters.location}
              />
            </label>

            <Button 
              className="h-14 rounded-2xl px-8 text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
              onClick={onSearchSubmit}
              disabled={loading}
            >
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
            <span className="rounded-full bg-white/10 px-3 py-1.5 transition-colors hover:bg-white/15">
              {filters.search || "Any role"}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1.5 transition-colors hover:bg-white/15">
              {filters.location || "Any location"}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-300">Quick apply:</span>
            {quickFilters.map((item, index) => (
              <button
                key={`${item.key}-${item.value}`}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
                  quickFilterIsActive(filters, item.key, item.value)
                    ? "border-emerald-300/40 bg-emerald-400/15 text-emerald-100 shadow-lg shadow-emerald-500/20"
                    : "border-white/10 bg-white/10 text-white/90 hover:bg-white/15 hover:border-white/20"
                }`}
                onClick={() => onQuickApply(item.key, item.value)}
                type="button"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="text-xs">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <span className="ml-auto hidden items-center gap-2 rounded-full bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-200 sm:inline-flex animate-pulse">
              <Briefcase className="h-4 w-4" />
              Fresh listings, faster scan
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
