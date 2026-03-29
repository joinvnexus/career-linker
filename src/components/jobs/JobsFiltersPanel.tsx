"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { JobsCategory, JobsFilterState } from "@/components/jobs/types";
import { FILTER_SECTIONS } from "@/components/jobs/constants";
import { cn } from "@/lib/utils";

type JobsFiltersPanelProps = {
  categories: JobsCategory[];
  filters: JobsFilterState;
  onFilterChange: (key: keyof JobsFilterState, value: string) => void;
  onReset: () => void;
};

export function JobsFiltersPanel({
  categories,
  filters,
  onFilterChange,
  onReset,
}: JobsFiltersPanelProps) {
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="surface-panel rounded-[1.9rem] border border-white/75 p-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-slate-950 text-white">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Filters</h3>
            <p className="text-sm text-slate-500">Refine the board without losing context.</p>
          </div>
        </div>
        {activeFilterCount > 0 ? (
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
            {activeFilterCount} active
          </span>
        ) : null}
      </div>

      <div className="mb-5 rounded-[1.5rem] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(240,249,255,0.84))] px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Good starting point</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          Start broad with search and location, then tighten by type, experience, and salary.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.4rem] border border-slate-200/80 bg-white/80 p-4">
          <label className="mb-2 block text-sm font-semibold text-slate-800">Category</label>
          <Select
            onValueChange={(value) => onFilterChange("category", value === "ALL" ? "" : value)}
            value={filters.category || "ALL"}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent className="z-50 max-h-[300px] overflow-y-auto">
              <SelectItem value="ALL">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {FILTER_SECTIONS.map((section) => (
          <div key={section.key} className="rounded-[1.4rem] border border-slate-200/80 bg-white/80 p-4">
            <label className="mb-2 block text-sm font-semibold text-slate-800">{section.label}</label>
            <Select
              onValueChange={(value) => onFilterChange(section.key, value === "ALL" ? "" : value)}
              value={filters[section.key] || "ALL"}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={`All ${section.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="z-50 max-h-[300px] overflow-y-auto">
                <SelectItem value="ALL">{`All ${section.label.toLowerCase()}`}</SelectItem>
                {section.items.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <Button
          className={cn("w-full rounded-full")}
          onClick={onReset}
          variant="outline"
          disabled={activeFilterCount === 0}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          {activeFilterCount > 0 ? "Clear All Filters" : "No Filters Active"}
        </Button>
      </div>
    </div>
  );
}
