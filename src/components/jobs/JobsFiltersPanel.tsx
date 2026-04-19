"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { JobsCategory, JobsFilterState } from "@/components/jobs/types";
import { FILTER_SECTIONS } from "@/components/jobs/constants";

type JobsFiltersPanelProps = {
  categories: JobsCategory[];
  filters: JobsFilterState;
  onFilterChange: (key: keyof JobsFilterState, value: string) => void;
  onReset: () => void;
};

function FilterOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

export function JobsFiltersPanel({
  categories,
  filters,
  onFilterChange,
  onReset,
}: JobsFiltersPanelProps) {
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">

      {/* Dark header */}
      <div className="surface-inverse px-4 py-3.5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-sky-300" />
          <span className="text-sm font-semibold text-white">Filters</span>
        </div>
        <p className="mt-0.5 text-[11px] text-slate-400">
          Refine results below
        </p>
        {activeCount > 0 && (
          <span className="mt-2 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-sky-200">
            {activeCount} active
          </span>
        )}
      </div>

      {/* Category */}
      <div className="border-b border-border p-3">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Category
        </p>
        <div className="space-y-0.5">
          <FilterOption
            label="All categories"
            active={!filters.category}
            onClick={() => onFilterChange("category", "")}
          />
          {categories.map((cat) => (
            <FilterOption
              key={cat.id}
              label={cat.name}
              active={filters.category === cat.id}
              onClick={() => onFilterChange("category", cat.id)}
            />
          ))}
        </div>
      </div>

      {/* Dynamic filter sections */}
      {FILTER_SECTIONS.map((section) => (
        <div key={section.key} className="border-b border-border p-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {section.label}
          </p>
          <div className="space-y-0.5">
            <FilterOption
              label={`All ${section.label.toLowerCase()}`}
              active={!filters[section.key]}
              onClick={() => onFilterChange(section.key, "")}
            />
            {section.items.map((item) => (
              <FilterOption
                key={item.value}
                label={item.label}
                active={filters[section.key] === item.value}
                onClick={() => onFilterChange(section.key, item.value)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Salary min */}
      <div className="border-b border-border p-3">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Salary min
        </p>
        <input
          type="text"
          placeholder="e.g. 40000"
          value={filters.salaryMin}
          onChange={(e) => onFilterChange("salaryMin", e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
        />
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={onReset}
        disabled={activeCount === 0}
        className="flex w-full items-center justify-center gap-1.5 py-3 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        {activeCount > 0
          ? `Clear ${activeCount} filter${activeCount > 1 ? "s" : ""}`
          : "No filters active"}
      </button>
    </div>
  );
}