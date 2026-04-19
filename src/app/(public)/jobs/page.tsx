"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Briefcase } from "lucide-react";
import { JobCard } from "@/components/job-card";
import { JobsFiltersPanel } from "@/components/jobs/JobsFiltersPanel";
import { JobsResultsHeader } from "@/components/jobs/JobsResultsHeader";
import { JobsSearchHeader } from "@/components/jobs/JobsSearchHeader";
import type { JobsCategory, JobsFilterState } from "@/components/jobs/types";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type LayoutMode = "list" | "grid";

type JobListItem = {
  id: string;
  slug: string;
  title: string;
  companyName?: string;
  location: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryType?: string | null;
  jobType: "FULL_TIME" | "PART_TIME" | "REMOTE" | "CONTRACT" | "INTERNSHIP";
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "DRAFT" | "REJECTED";
  createdAt: string;
  applicationDeadline?: string | null;
  employerId: string;
  category?: { name: string };
  employer?: {
    id: string;
    name?: string | null;
    employerProfile?: {
      companyName?: string | null;
      companyLogo?: string | null;
    } | null;
  };
};

type JobsResponse = { jobs?: JobListItem[]; total?: number };

type JobCardItem = JobListItem & {
  companyName: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: string;
  applicationDeadline?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 12;
const INITIAL_FILTERS: JobsFilterState = {
  search: "",
  location: "",
  category: "",
  jobType: "",
  experience: "",
  salaryMin: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const { data: session } = useSession();

  const [jobs, setJobs] = useState<JobCardItem[]>([]);
  const [categories, setCategories] = useState<JobsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [layout, setLayout] = useState<LayoutMode>("list");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<JobsFilterState>(INITIAL_FILTERS);

  const deferredSearch = useDeferredValue(filters.search);
  const deferredLocation = useDeferredValue(filters.location);

  const totalPages = useMemo(
    () => Math.max(Math.ceil(total / PAGE_SIZE), 1),
    [total]
  );

  // Page numbers: current ± 2
  const pageNumbers = useMemo(() => {
    const nums: number[] = [];
    for (
      let i = Math.max(1, page - 2);
      i <= Math.min(totalPages, page + 2);
      i++
    ) {
      nums.push(i);
    }
    return nums;
  }, [page, totalPages]);

  const sortedJobs = useMemo(() => {
    const next = [...jobs];
    if (sort === "deadline") {
      next.sort((a, b) => {
        const aVal = a.applicationDeadline
          ? new Date(a.applicationDeadline).getTime()
          : Number.MAX_SAFE_INTEGER;
        const bVal = b.applicationDeadline
          ? new Date(b.applicationDeadline).getTime()
          : Number.MAX_SAFE_INTEGER;
        return aVal - bVal;
      });
    } else if (sort === "salary") {
      next.sort(
        (a, b) =>
          (b.salaryMax ?? b.salaryMin ?? 0) - (a.salaryMax ?? a.salaryMin ?? 0)
      );
    } else {
      next.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    return next;
  }, [jobs, sort]);

  // ── Fetch categories ──
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = (await res.json()) as { categories?: JobsCategory[] };
        setCategories(data.categories ?? []);
      } catch {
        console.error("Failed to load categories");
      }
    };
    void load();
  }, []);

  // ── Fetch jobs ──
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          limit: String(PAGE_SIZE),
        });
        if (deferredSearch) params.set("search", deferredSearch);
        if (deferredLocation) params.set("location", deferredLocation);
        if (filters.category) params.set("category", filters.category);
        if (filters.jobType) params.set("jobType", filters.jobType);
        if (filters.experience) params.set("experience", filters.experience);
        if (filters.salaryMin) params.set("salaryMin", filters.salaryMin);

        const res = await fetch(`/api/jobs?${params.toString()}`);
        const data = (await res.json()) as JobsResponse;

        const mapped: JobCardItem[] = (data.jobs ?? []).map((job) => ({
          ...job,
          salaryMin: job.salaryMin ?? undefined,
          salaryMax: job.salaryMax ?? undefined,
          salaryType: job.salaryType ?? undefined,
          applicationDeadline: job.applicationDeadline ?? undefined,
          companyName:
            job.employer?.employerProfile?.companyName ||
            job.employer?.name ||
            "Company",
        }));

        setJobs(mapped);
        setTotal(data.total ?? 0);
      } catch {
        console.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };
    void fetchJobs();
  }, [
    deferredSearch,
    deferredLocation,
    filters.category,
    filters.experience,
    filters.jobType,
    filters.salaryMin,
    page,
  ]);

  // ── Helpers ──
  const setFilter = (key: keyof JobsFilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };
  const removeFilter = (key: keyof JobsFilterState) => setFilter(key, "");
  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen py-8 sm:py-10 lg:py-12">
      <div className="page-shell space-y-5">

        {/* Search header */}
        <JobsSearchHeader
          filters={filters}
          loading={loading}
          onQuickApply={setFilter}
          onSearchChange={setFilter}
          onSearchSubmit={() => setPage(1)}
          total={total}
        />

        {/* Body */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start">

          {/* Sidebar */}
          <div className="hidden lg:block lg:w-52 lg:shrink-0">
            <div className="sticky top-24">
              <JobsFiltersPanel
                categories={categories}
                filters={filters}
                onFilterChange={setFilter}
                onReset={resetFilters}
              />
            </div>
          </div>

          {/* Results */}
          <div className="min-w-0 flex-1 space-y-3">
            <JobsResultsHeader
              categories={categories}
              filters={filters}
              layout={layout}
              loading={loading}
              onClearAll={resetFilters}
              onLayoutChange={setLayout}
              onOpenFilters={() => setMobileFiltersOpen(true)}
              onRemoveFilter={removeFilter}
              onSortChange={setSort}
              sort={sort}
              total={total}
            />

            {/* Skeletons */}
            {loading && (
              <div
                className={cn(
                  layout === "grid"
                    ? "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
                    : "space-y-2"
                )}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className={cn(
                      "w-full rounded-2xl",
                      layout === "grid" ? "h-48" : "h-20"
                    )}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && jobs.length === 0 && (
              <div className="surface-panel flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
                <Briefcase className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <h3 className="text-base font-semibold text-foreground">
                  No jobs found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-xl border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Browse all jobs
                </button>
              </div>
            )}

            {/* Job list / grid */}
            {!loading && jobs.length > 0 && (
              <div
                className={cn(
                  layout === "grid"
                    ? "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
                    : "space-y-2"
                )}
              >
                {sortedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    variant={layout}
                    userId={session?.user?.id}
                    userRole={session?.user?.role}
                    employerId={job.employerId}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="surface-panel flex items-center justify-between rounded-2xl border border-border px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Page{" "}
                  <span className="font-semibold text-foreground">{page}</span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {totalPages}
                  </span>{" "}
                  · {total.toLocaleString()} results
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Prev
                  </button>

                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                        n === page
                          ? "bg-foreground text-background"
                          : "border border-border bg-card text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter modal */}
      <Modal
        description="Adjust filters to refine the job listing."
        onClose={() => setMobileFiltersOpen(false)}
        open={mobileFiltersOpen}
        title="Filters"
      >
        <JobsFiltersPanel
          categories={categories}
          filters={filters}
          onFilterChange={setFilter}
          onReset={resetFilters}
        />
      </Modal>
    </div>
  );
}