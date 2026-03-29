"use client";

import { ArrowUpDown, Clock, DollarSign, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobsCategory, JobsFilterState } from "@/components/jobs/types";
import { EXPERIENCE_LABELS, JOB_TYPE_LABELS, SALARY_LABELS } from "@/components/jobs/constants";

type JobsResultsHeaderProps = {
  categories: JobsCategory[];
  filters: JobsFilterState;
  loading: boolean;
  total: number;
  sort: string;
  onSortChange: (value: string) => void;
  onOpenFilters: () => void;
  onClearAll: () => void;
  onRemoveFilter: (key: keyof JobsFilterState) => void;
};

const getCategoryLabel = (categories: JobsCategory[], categoryId: string) =>
  categories.find((item) => item.id === categoryId)?.name ?? "Category";

const getActiveFilterChips = (categories: JobsCategory[], filters: JobsFilterState) => {
  const chips: Array<{ key: keyof JobsFilterState; label: string }> = [];

  if (filters.search) chips.push({ key: "search", label: `Search: ${filters.search}` });
  if (filters.location) chips.push({ key: "location", label: `Location: ${filters.location}` });
  if (filters.category) {
    chips.push({
      key: "category",
      label: `Category: ${getCategoryLabel(categories, filters.category)}`,
    });
  }
  if (filters.jobType) chips.push({ key: "jobType", label: `Type: ${JOB_TYPE_LABELS[filters.jobType]}` });
  if (filters.experience) {
    chips.push({ key: "experience", label: `Experience: ${EXPERIENCE_LABELS[filters.experience]}` });
  }
  if (filters.salaryMin) {
    chips.push({ key: "salaryMin", label: `Salary: ${SALARY_LABELS[filters.salaryMin]}` });
  }

  return chips;
};

export function JobsResultsHeader({
  categories,
  filters,
  loading,
  total,
  sort,
  onSortChange,
  onOpenFilters,
  onClearAll,
  onRemoveFilter,
}: JobsResultsHeaderProps) {
  const activeChips = getActiveFilterChips(categories, filters);
  const hasActiveFilters = activeChips.length > 0;
  const contextParts = [filters.search, filters.location].filter(Boolean);
  const summary =
    contextParts.length > 0
      ? `Showing matches for ${contextParts.join(" in ")}`
      : "Use filters and sorting to shape a faster shortlist.";

  return (
    <div className="space-y-4">
      <div className="surface-panel flex flex-col gap-4 rounded-[1.8rem] border border-white/75 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Results</p>
            {loading ? <Sparkles className="h-4 w-4 text-sky-500" /> : null}
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {loading ? "Refreshing..." : `${total.toLocaleString()} jobs found`}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{summary}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button className="rounded-full lg:hidden" onClick={onOpenFilters} variant="outline">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters ? (
              <span className="ml-2 rounded-full bg-slate-950 px-2 py-0.5 text-xs text-white">
                {activeChips.length}
              </span>
            ) : null}
          </Button>
          <Select onValueChange={onSortChange} value={sort}>
            <SelectTrigger className="min-w-[190px] rounded-full">
              <ArrowUpDown className="mr-2 h-4 w-4 text-slate-400" />
              <SelectValue placeholder="Sort jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="deadline">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-sky-600" />
                  Closest deadline
                </span>
              </SelectItem>
              <SelectItem value="salary">
                <span className="inline-flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  Highest salary
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={`${chip.key}-${chip.label}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-all hover:border-slate-300 hover:text-slate-900"
              onClick={() => onRemoveFilter(chip.key)}
              type="button"
            >
              {chip.label}
              <X className="h-3.5 w-3.5 text-slate-400" />
            </button>
          ))}
          <Button className="rounded-full" onClick={onClearAll} size="sm" variant="ghost">
            Clear all
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-2 shadow-[var(--shadow-soft)]">
            <Search className="h-4 w-4" />
            Start broad, then narrow by signal.
          </span>
        </div>
      )}
    </div>
  );
}
