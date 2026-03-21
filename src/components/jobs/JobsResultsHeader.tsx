"use client";

import { SlidersHorizontal, X, ArrowUpDown, Clock, DollarSign, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobsCategory, JobsFilterState } from "@/components/jobs/types";
import { JOB_TYPE_LABELS, EXPERIENCE_LABELS, SALARY_LABELS } from "@/components/jobs/constants";

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

const jobTypeLabels = JOB_TYPE_LABELS;
const experienceLabels = EXPERIENCE_LABELS;
const salaryLabels = SALARY_LABELS;

const getCategoryLabel = (categories: JobsCategory[], categoryId: string) =>
  categories.find((item) => item.id === categoryId)?.name ?? "Category";

const getActiveFilterChips = (categories: JobsCategory[], filters: JobsFilterState) => {
  const chips: Array<{ key: keyof JobsFilterState; label: string }> = [];

  if (filters.search) chips.push({ key: "search", label: `🔍 ${filters.search}` });
  if (filters.location) chips.push({ key: "location", label: `📍 ${filters.location}` });
  if (filters.category) {
    chips.push({
      key: "category",
      label: `📂 ${getCategoryLabel(categories, filters.category)}`,
    });
  }
  if (filters.jobType) chips.push({ key: "jobType", label: `💼 ${jobTypeLabels[filters.jobType]}` });
  if (filters.experience) {
    chips.push({ key: "experience", label: `⭐ ${experienceLabels[filters.experience]}` });
  }
  if (filters.salaryMin) {
    chips.push({ key: "salaryMin", label: `💰 ${salaryLabels[filters.salaryMin]}` });
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
      : "Use filters and sort to narrow the list.";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.18)] transition-all duration-300 hover:shadow-[0_25px_70px_-30px_rgba(15,23,42,0.25)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
              Results
            </p>
            {loading && (
              <span className="flex h-2 w-2">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400"></span>
              </span>
            )}
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-slate-950">
            {loading ? (
              <span className="animate-pulse bg-slate-200 rounded h-8 w-40 inline-block" />
            ) : (
              <>
                {total.toLocaleString()} <span className="text-slate-400 font-normal text-lg">jobs found</span>
              </>
            )}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{summary}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button 
            className="rounded-full lg:hidden transition-all duration-200 hover:scale-105" 
            onClick={onOpenFilters} 
            variant="outline"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 rounded-full bg-sky-500 px-1.5 py-0.5 text-xs text-white">
                {activeChips.length}
              </span>
            )}
          </Button>
          <Select onValueChange={onSortChange} value={sort}>
            <SelectTrigger className="h-11 min-w-[180px] rounded-full bg-white border-slate-200 transition-all duration-200 hover:border-slate-300 focus:ring-2 focus:ring-sky-400/20">
              <ArrowUpDown className="mr-2 h-4 w-4 text-slate-400" />
              <SelectValue placeholder="Sort jobs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Newest first
                </span>
              </SelectItem>
              <SelectItem value="deadline">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Closest deadline
                </span>
              </SelectItem>
              <SelectItem value="salary">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  Highest salary
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-sm text-slate-500 font-medium">Active filters:</span>
          {activeChips.map((chip, index) => (
            <button
              key={`${chip.key}-${chip.label}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-all duration-200 hover:border-slate-300 hover:text-slate-900 hover:shadow-md hover:scale-105 active:scale-95"
              onClick={() => onRemoveFilter(chip.key)}
              type="button"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {chip.label}
              <X className="h-3.5 w-3.5 text-slate-400 hover:text-red-500 transition-colors" />
            </button>
          ))}
          <Button 
            className="rounded-full text-slate-500 hover:text-red-600" 
            onClick={onClearAll} 
            size="sm" 
            variant="ghost"
          >
            Clear all
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 animate-in fade-in duration-500">
          <span className="font-medium text-slate-400">💡 Suggested:</span>
          <span className="rounded-full bg-white px-3 py-2 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">🌍 Remote roles</span>
          <span className="rounded-full bg-white px-3 py-2 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">🚀 Entry level</span>
          <span className="rounded-full bg-white px-3 py-2 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer">💎 Highest salary</span>
        </div>
      )}
    </div>
  );
}
