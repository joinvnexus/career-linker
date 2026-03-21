"use client";

import { cn } from "@/lib/utils";

/**
 * JobCardSkeleton - Mobile-first loading placeholder
 * Uses global color system (bg-muted, border, etc.)
 * Matches the actual JobCard component structure
 */
export function JobCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      // Base card styles - mobile-first
      "overflow-hidden rounded-[1.75rem] border border-border bg-card p-5 shadow-sm transition-all duration-300",
      className
    )}>
      {/* Top row: Job type badge and status */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
        <div className="h-6 w-16 rounded-full bg-muted animate-pulse" />
      </div>

      {/* Title */}
      <div className="mb-2">
        <div className="h-6 w-3/4 rounded-lg bg-muted animate-pulse" />
      </div>

      {/* Company name */}
      <div className="mb-3">
        <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
      </div>

      {/* Meta row: Location, Salary, Deadline */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-muted animate-pulse" />
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-muted animate-pulse" />
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-muted animate-pulse" />
          <div className="h-4 w-16 rounded bg-muted animate-pulse" />
        </div>
      </div>

      {/* Bottom row: CTA and Save */}
      <div className="flex items-center justify-between gap-3 border-t pt-4">
        <div className="h-9 w-20 rounded-lg bg-muted animate-pulse" />
        <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
      </div>
    </div>
  );
}

/**
 * JobCardsSkeletonGrid - Responsive grid for skeleton cards
 * Mobile-first: single column -> 2 columns -> 3 columns
 */
export function JobCardsSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  );
}
