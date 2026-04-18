"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import type { JobsCategory, JobsFilterState } from "@/components/jobs/types";
import { FILTER_SECTIONS } from "@/components/jobs/constants";
import { cn } from "@/lib/utils";

type JobsFiltersPanelProps = {
  categories: JobsCategory[];
  filters: JobsFilterState;
  onFilterChange: (key: keyof JobsFilterState, value: string) => void;
};

export function JobsFiltersPanel({
  categories,
  filters,
  onFilterChange,
}: JobsFiltersPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    jobType: true,
    experience: true,
    salary: false,
  });

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    Object.keys(filters).forEach(key => onFilterChange(key as keyof JobsFilterState, ""));
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">

      {/* ── Header with clear all ── */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* ── Category ── */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => toggleSection("category")}
          className="flex w-full items-center justify-between py-2 text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Category
          </p>
          {expandedSections.category ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {expandedSections.category && (
          <div className="mt-2 space-y-1">
            <button
              type="button"
              onClick={() => onFilterChange("category", "")}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200",
                !filters.category
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:shadow-sm"
              )}
            >
              <div className={cn(
                "h-2 w-2 rounded-full border-2",
                !filters.category ? "border-white bg-white" : "border-slate-300"
              )} />
              <span className="flex-1">All categories</span>
              {categories.length > 0 && (
                <span className="text-xs text-slate-400">({categories.length})</span>
              )}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange("category", cat.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200",
                  filters.category === cat.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "h-2 w-2 rounded-full border-2",
                  filters.category === cat.id ? "border-white bg-white" : "border-slate-300"
                )} />
                <span className="flex-1">{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Dynamic filter sections ── */}
      {FILTER_SECTIONS.map((section) => (
        <div
          key={section.key}
          className="mb-4 border-t border-slate-100 pt-4"
        >
          <button
            type="button"
            onClick={() => toggleSection(section.key)}
            className="flex w-full items-center justify-between py-2 text-left"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {section.label}
            </p>
            {expandedSections[section.key] ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {expandedSections[section.key] && (
            <div className="mt-2 space-y-1">
              <button
                type="button"
                onClick={() => onFilterChange(section.key, "")}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200",
                  !filters[section.key]
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:shadow-sm"
                )}
              >
                <div className={cn(
                  "h-2 w-2 rounded-full border-2",
                  !filters[section.key] ? "border-white bg-white" : "border-slate-300"
                )} />
                <span className="flex-1">All {section.label.toLowerCase()}</span>
              </button>
              {section.items.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => onFilterChange(section.key, item.value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200",
                    filters[section.key] === item.value
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:shadow-sm"
                  )}
                >
                  <div className={cn(
                    "h-2 w-2 rounded-full border-2",
                    filters[section.key] === item.value ? "border-white bg-white" : "border-slate-300"
                  )} />
                  <span className="flex-1">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* ── Salary min ── */}
      <div className="mb-4 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => toggleSection("salary")}
          className="flex w-full items-center justify-between py-2 text-left"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Salary minimum
          </p>
          {expandedSections.salary ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {expandedSections.salary && (
          <div className="mt-2">
            <input
              type="number"
              placeholder="e.g. 40000"
              value={filters.salaryMin}
              onChange={(e) => onFilterChange("salaryMin", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
            <p className="mt-1 text-xs text-slate-400">
              Enter minimum salary in your local currency
            </p>
          </div>
        )}
      </div>
    </div>
  );
}