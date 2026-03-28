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

const filterSections = FILTER_SECTIONS;

export function JobsFiltersPanel({
  categories,
  filters,
  onFilterChange,
  onReset,
}: JobsFiltersPanelProps) {
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className={cn(
      "rounded-[1.75rem] border border-border bg-card/85 p-6 shadow-sm",
      "transition-all duration-300 hover:shadow-md"
    )}>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            "bg-primary text-primary-foreground shadow-lg",
            "transition-transform duration-300 hover:scale-110"
          )}>
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-card-foreground">Filters</h3>
            <p className="text-sm text-muted-foreground">Refine the listing quickly</p>
          </div>
        </div>
        {activeFilterCount > 0 ? (
          <span className={cn(
            "animate-in fade-in zoom-in rounded-full",
            "bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
          )}>
            {activeFilterCount} active
          </span>
        ) : null}
      </div>

      <div className={cn(
        "mb-5 rounded-2xl bg-muted/50 px-4 py-4 border border-border"
      )}>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          💡 Good starting point
        </p>
        <p className="mt-2 text-sm leading-6 text-card-foreground">
          Start broad with search and location, then tighten by type,
          experience, and salary.
        </p>
      </div>

      <div className="space-y-4">
        <div className={cn(
          "group rounded-2xl border border-border bg-card p-4",
          "transition-all duration-200 hover:border-primary/30 hover:shadow-md"
        )}>
          <label className={cn(
            "mb-2 flex items-center gap-2 text-sm font-semibold",
            "text-card-foreground"
          )}>
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Category
          </label>
          <Select
            onValueChange={(value) => onFilterChange("category", value === "ALL" ? "" : value)}
            value={filters.category || "ALL"}
          >
            <SelectTrigger className={cn(
              "h-12 rounded-xl border-border bg-muted/50",
              "transition-all duration-200 hover:bg-muted",
              "focus:border-primary focus:ring-2 focus:ring-primary/20"
            )}>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent className="z-50 max-h-[300px] overflow-y-auto">
              <SelectItem value="ALL" className="font-medium">
                📂 All categories
              </SelectItem>
              {categories.map((category) => (
                <SelectItem 
                  key={category.id} 
                  value={category.id}
                  className="transition-colors hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filterSections.map((section, sectionIndex) => (
          <div 
            key={section.key} 
            className={cn(
              "group rounded-2xl border border-border bg-card p-4",
              "transition-all duration-200 hover:border-primary/30 hover:shadow-md"
            )}
            style={{ animationDelay: `${sectionIndex * 50}ms` }}
          >
            <label className={cn(
              "mb-2 flex items-center gap-2 text-sm font-semibold",
              "text-card-foreground"
            )}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                section.key === 'jobType' ? 'bg-accent' :
                section.key === 'experience' ? 'bg-violet-500' : 'bg-amber-500'
              }`} />
              {section.label}
            </label>
            <Select
              onValueChange={(value) =>
                onFilterChange(section.key, value === "ALL" ? "" : value)
              }
              value={filters[section.key] || "ALL"}
            >
              <SelectTrigger className={cn(
                "h-12 rounded-xl border-border bg-muted/50",
                "transition-all duration-200 hover:bg-muted",
                "focus:border-primary focus:ring-2 focus:ring-primary/20"
              )}>
                <SelectValue placeholder={`All ${section.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent className="z-50 max-h-[300px] overflow-y-auto">
                <SelectItem value="ALL" className="font-medium">
                  ✨ All {section.label.toLowerCase()}
                </SelectItem>
                {section.items.map((item) => (
                  <SelectItem 
                    key={item.value} 
                    value={item.value}
                    className="transition-colors hover:bg-primary/10 focus:bg-primary/10 cursor-pointer"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <Button 
          className="w-full rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]" 
          onClick={onReset} 
          variant="outline"
          disabled={activeFilterCount === 0}
        >
          <RotateCcw className={`mr-2 h-4 w-4 ${activeFilterCount > 0 ? 'animate-spin-once' : ''}`} />
          {activeFilterCount > 0 ? 'Clear All Filters' : 'No Filters Active'}
        </Button>
      </div>
    </div>
  );
}
