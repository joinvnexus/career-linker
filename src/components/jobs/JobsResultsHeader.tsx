"use client";

import { ArrowUpDown, Clock, DollarSign, LayoutGrid, List, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobsCategory, JobsFilterState } from "@/components/jobs/types";
import { EXPERIENCE_LABELS, JOB_TYPE_LABELS, SALARY_LABELS } from "@/components/jobs/constants";

type LayoutMode = "list" | "grid";

type JobsResultsHeaderProps = {
  categories: JobsCategory[];
  filters: JobsFilterState;
  loading: boolean;
  total: number;
  sort: string;
  layout: LayoutMode;
  onSortChange: (value: string) => void;
  onLayoutChange: (value: LayoutMode) => void;
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
  { value: "newest", label: "Newest first" },
  { value: "deadline", label: "Deadline soonest" },
  { value: "salary", label: "Highest salary" },
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
    <div className="space-y-2.5">
      {/* Count + controls row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {loading ? (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 animate-pulse text-primary" />
                Searching...
              </span>
            ) : (
              <>{total.toLocaleString()} jobs found</>
            )}
          </p>
          {!loading && chips.length > 0 && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Filtered by {chips.map((c) => c.label).join(", ")}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile filter trigger */}
          <button
            type="button"
            onClick={onOpenFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {chips.length > 0 && (
              <span className="rounded-full bg-foreground px-1.5 py-0.5 text-[10px] text-background">
                {chips.length}
              </span>
            )}
          </button>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value)}
              className="h-9 appearance-none rounded-xl border border-border bg-card pl-8 pr-8 text-xs font-semibold text-foreground focus:border-ring focus:outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Layout toggle */}
          <div className="flex overflow-hidden rounded-xl border border-border">
            <button
              type="button"
              onClick={() => onLayoutChange("list")}
              aria-label="List view"
              className={cn(
                "flex items-center justify-center p-2 transition-colors",
                layout === "list"
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:bg-secondary"
              )}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onLayoutChange("grid")}
              aria-label="Grid view"
              className={cn(
                "flex items-center justify-center p-2 transition-colors",
                layout === "grid"
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:bg-secondary"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => onRemoveFilter(chip.key)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-full px-2.5 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}