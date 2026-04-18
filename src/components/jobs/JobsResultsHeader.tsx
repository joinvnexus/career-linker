"use client";

import { ArrowUpDown, Clock, DollarSign, SlidersHorizontal, Sparkles, X, List, LayoutGrid } from "lucide-react";
import type { JobsCategory, JobsFilterState } from "@/components/jobs/types";
import { EXPERIENCE_LABELS, JOB_TYPE_LABELS, SALARY_LABELS } from "@/components/jobs/constants";
import { cn } from "@/lib/utils";

type JobsResultsHeaderProps = {
  categories: JobsCategory[];
  filters: JobsFilterState;
  loading: boolean;
  total: number;
  sort: string;
  layout: "list" | "grid";
  onSortChange: (value: string) => void;
  onLayoutChange: (layout: "list" | "grid") => void;
  onOpenFilters: () => void;
  onClearAll: () => void;
  onRemoveFilter: (key: keyof JobsFilterState) => void;
};

const getCategoryLabel = (categories: JobsCategory[], id: string) =>
  categories.find((c) => c.id === id)?.name ?? "Category";

const getActiveChips = (categories: JobsCategory[], filters: JobsFilterState) => {
  const chips: Array<{ key: keyof JobsFilterState; label: string }> = [];
  if (filters.search) chips.push({ key: "search", label: `"${filters.search}"` });
  if (filters.location) chips.push({ key: "location", label: filters.location });
  if (filters.category) chips.push({ key: "category", label: getCategoryLabel(categories, filters.category) });
  if (filters.jobType) chips.push({ key: "jobType", label: JOB_TYPE_LABELS[filters.jobType] });
  if (filters.experience) chips.push({ key: "experience", label: EXPERIENCE_LABELS[filters.experience] });
  if (filters.salaryMin) chips.push({ key: "salaryMin", label: `Min ${SALARY_LABELS[filters.salaryMin]}` });
  return chips;
};

const sortOptions = [
  { value: "newest", label: "Newest first", icon: null },
  { value: "deadline", label: "Deadline soonest", icon: Clock },
  { value: "salary", label: "Highest salary", icon: DollarSign },
] as const;

export function JobsResultsHeader({
  categories,
  filters,
  loading,
  total,
  sort,
  layout,
  onSortChange,
  onLayoutChange,
  onOpenFilters,
  onClearAll,
  onRemoveFilter,
}: JobsResultsHeaderProps) {
  const chips = getActiveChips(categories, filters);

  return (
    <div className="space-y-3">

      {/* ── Count + sort row ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {loading ? (
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Searching...
              </span>
            ) : (
              <>
                {total.toLocaleString()} jobs found
              </>
            )}
          </p>
          {!loading && (
            <p className="mt-0.5 text-xs text-slate-400">
              {chips.length > 0
                ? `Filtered by ${chips.map((c) => c.label).join(", ")}`
                : "Showing all active listings"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile filter trigger */}
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {chips.length > 0 && (
              <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] text-white">
                {chips.length}
              </span>
            )}
          </button>

          {/* Layout toggle */}
          <div className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 sm:flex">
            <button
              type="button"
              onClick={() => onLayoutChange("list")}
              className={cn(
                "rounded p-1.5 text-xs transition-colors",
                layout === "list"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              )}
              title="List view"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onLayoutChange("grid")}
              className={cn(
                "rounded p-1.5 text-xs transition-colors",
                layout === "grid"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              )}
              title="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Sort select */}
          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-9 appearance-none rounded-lg border border-slate-200 bg-white pl-8 pr-8 text-xs font-semibold text-slate-600 focus:border-slate-400 focus:outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Active filter chips ── */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => onRemoveFilter(chip.key)}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
            >
              {chip.label}
              <X className="h-3 w-3 text-slate-400" />
            </button>
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-full px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}