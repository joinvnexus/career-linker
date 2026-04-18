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

type JobListItem = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  location: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryType?: string | null;
  jobType: "FULL_TIME" | "PART_TIME" | "REMOTE" | "CONTRACT" | "INTERNSHIP";
  experience?: string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "DRAFT" | "REJECTED";
  createdAt: string;
  applicationDeadline?: string | null;
  employerId: string;
  employer?: {
    id: string;
    name?: string | null;
    employerProfile?: { companyName?: string | null } | null;
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
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<JobsFilterState>(INITIAL_FILTERS);

  const deferredSearch = useDeferredValue(filters.search);
  const deferredLocation = useDeferredValue(filters.location);

  const totalPages = useMemo(
    () => Math.max(Math.ceil(total / PAGE_SIZE), 1),
    [total]
  );

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

  // Pagination page numbers to show
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const delta = 2;
    for (
      let i = Math.max(1, page - delta);
      i <= Math.min(totalPages, page + delta);
      i++
    ) {
      pages.push(i);
    }
    return pages;
  }, [page, totalPages]);

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
    const fetch_ = async () => {
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
    void fetch_();
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
      <div className="page-shell space-y-6">

        {/* ── Search header ── */}
        <JobsSearchHeader
          filters={filters}
          loading={loading}
          onQuickApply={setFilter}
          onSearchChange={setFilter}
          onSearchSubmit={() => setPage(1)}
          total={total}
        />

        {/* ── Body: sidebar + results ── */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">

          {/* Sidebar — sticky on desktop */}
          <div className="hidden lg:block lg:w-52 lg:flex-shrink-0">
            <div className="sticky top-24">
              <JobsFiltersPanel
                categories={categories}
                filters={filters}
                onFilterChange={setFilter}
              />
            </div>
          </div>

          {/* Results column */}
          <div className="min-w-0 flex-1 space-y-3">

            <JobsResultsHeader
              categories={categories}
              filters={filters}
              loading={loading}
              layout={layout}
              onClearAll={resetFilters}
              onLayoutChange={setLayout}
              onOpenFilters={() => setMobileFiltersOpen(true)}
              onRemoveFilter={removeFilter}
              onSortChange={setSort}
              sort={sort}
              total={total}
            />

            {/* ── Loading skeletons ── */}
            {loading && (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-xl" />
                ))}
              </div>
            )}

            {/* ── Empty state ── */}
            {!loading && jobs.length === 0 && (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 py-16 text-center">
                <Briefcase className="mb-3 h-10 w-10 text-slate-300" />
                <h3 className="text-base font-semibold text-slate-800">
                  No jobs found
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-400">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Browse all jobs
                </button>
              </div>
            )}

            {/* ── Job cards ── */}
            {!loading && jobs.length > 0 && (
              <div className={cn(
                layout === "grid"
                  ? "grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                  : "space-y-3"
              )}>
                {sortedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    employerId={job.employerId}
                    job={job}
                    layout={layout}
                    userId={session?.user?.id}
                    userRole={session?.user?.role}
                  />
                ))}
              </div>
            )}

            {/* ── Pagination ── */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-400">
                  Page{" "}
                  <span className="font-semibold text-slate-700">{page}</span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {totalPages}
                  </span>{" "}
                  · {total.toLocaleString()} results
                </p>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ← Prev
                  </button>

                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setPage(n)}
                      className={
                        n === page
                          ? "rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white"
                          : "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50"
                      }
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter modal ── */}
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
        />
      </Modal>
    </div>
  );
}