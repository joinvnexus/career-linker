"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Briefcase } from "lucide-react";
import { JobCard } from "@/components/job-card";
import { JobsFiltersPanel } from "@/components/jobs/JobsFiltersPanel";
import { JobsResultsHeader } from "@/components/jobs/JobsResultsHeader";
import { JobsSearchHeader } from "@/components/jobs/JobsSearchHeader";
import type { JobsCategory, JobsFilterState } from "@/components/jobs/types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";

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
  employer?: {
    id: string;
    name?: string | null;
    employerProfile?: {
      companyName?: string | null;
    } | null;
  };
};

type JobsResponse = {
  jobs?: JobListItem[];
  total?: number;
};

type JobCardItem = JobListItem & {
  companyName: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: string;
  applicationDeadline?: string;
};

export default function JobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<JobCardItem[]>([]);
  const [categories, setCategories] = useState<JobsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const pageSize = 12;
  const [filters, setFilters] = useState<JobsFilterState>({
    search: "",
    location: "",
    category: "",
    jobType: "",
    experience: "",
    salaryMin: "",
  });
  const deferredSearch = useDeferredValue(filters.search);
  const deferredLocation = useDeferredValue(filters.location);
  const totalPages = useMemo(() => Math.max(Math.ceil(total / pageSize), 1), [total]);

  const sortedJobs = useMemo(() => {
    const nextJobs = [...jobs];

    switch (sort) {
      case "deadline":
        nextJobs.sort((a, b) => {
          const aValue = a.applicationDeadline
            ? new Date(a.applicationDeadline).getTime()
            : Number.MAX_SAFE_INTEGER;
          const bValue = b.applicationDeadline
            ? new Date(b.applicationDeadline).getTime()
            : Number.MAX_SAFE_INTEGER;
          return aValue - bValue;
        });
        break;
      case "salary":
        nextJobs.sort(
          (a, b) => (b.salaryMax ?? b.salaryMin ?? 0) - (a.salaryMax ?? a.salaryMin ?? 0)
        );
        break;
      case "newest":
      default:
        nextJobs.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return nextJobs;
  }, [jobs, sort]);

  useEffect(() => {
    const loadCategories = async (): Promise<void> => {
      try {
        const response = await fetch("/api/categories");
        const data = (await response.json()) as { categories?: JobsCategory[] };
        setCategories(data.categories ?? []);
      } catch {
        console.error("Failed to load categories");
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    const fetchJobs = async (): Promise<void> => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          limit: String(pageSize),
        });

        if (deferredSearch) params.set("search", deferredSearch);
        if (deferredLocation) params.set("location", deferredLocation);
        if (filters.category) params.set("category", filters.category);
        if (filters.jobType) params.set("jobType", filters.jobType);
        if (filters.experience) params.set("experience", filters.experience);
        if (filters.salaryMin) params.set("salaryMin", filters.salaryMin);

        const response = await fetch(`/api/jobs?${params.toString()}`);
        const data = (await response.json()) as JobsResponse;
        const mappedJobs: JobCardItem[] = (data.jobs ?? []).map((job) => ({
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

        setJobs(mappedJobs);
        setTotal(data.total ?? 0);
      } catch {
        console.error("Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    void fetchJobs();
  }, [
    deferredLocation,
    deferredSearch,
    filters.category,
    filters.experience,
    filters.jobType,
    filters.salaryMin,
    page,
  ]);

  const setFilter = (key: keyof JobsFilterState, value: string): void => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
    setPage(1);
  };

  const removeFilter = (key: keyof JobsFilterState): void => {
    setFilter(key, "");
  };

  const resetFilters = (): void => {
    setFilters({
      search: "",
      location: "",
      category: "",
      jobType: "",
      experience: "",
      salaryMin: "",
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.10),_transparent_22%),linear-gradient(180deg,_#f8fbff_0%,_#f8fafc_45%,_#ecfdf5_100%)] py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:space-y-10 sm:px-6 lg:px-8">
        <JobsSearchHeader
          filters={filters}
          loading={loading}
          onQuickApply={setFilter}
          onSearchChange={setFilter}
          onSearchSubmit={() => setPage(1)}
          total={total}
        />

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-24">
              <JobsFiltersPanel
                categories={categories}
                filters={filters}
                onFilterChange={setFilter}
                onReset={resetFilters}
              />
            </div>
          </div>

          <div className="flex-1">
            <JobsResultsHeader
              categories={categories}
              filters={filters}
              loading={loading}
              onClearAll={resetFilters}
              onOpenFilters={() => setMobileFiltersOpen(true)}
              onRemoveFilter={removeFilter}
              onSortChange={setSort}
              sort={sort}
              total={total}
            />

            {loading ? (
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-[18rem] rounded-[1.75rem]" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="mt-6 rounded-[2rem] border-2 border-dashed border-slate-200 bg-gradient-to-br from-white to-slate-50 py-20 text-center shadow-sm transition-all duration-300 hover:shadow-md">
                <div className="relative inline-flex">
                  <div className="absolute inset-0 rounded-full bg-amber-100 opacity-50 blur-xl" />
                  <Briefcase className="relative mx-auto mb-4 h-16 w-16 text-amber-400" />
                </div>
                <h3 className="mb-2 text-2xl font-bold text-slate-900">No jobs found</h3>
                <p className="mx-auto mb-6 max-w-md text-slate-500">
                  We couldn&apos;t find any jobs matching your criteria. Try adjusting
                  your filters or search terms.
                </p>
                <Button
                  onClick={resetFilters}
                  className="bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-200 hover:scale-105 hover:from-sky-600 hover:to-emerald-600"
                >
                  Browse all jobs
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {sortedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      employerId={job.employerId}
                      job={job}
                      userId={session?.user?.id}
                      userRole={session?.user?.role}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-col items-center justify-between gap-4 rounded-[1.75rem] border border-white/80 bg-white/90 p-4 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.7)] transition-all duration-300 hover:shadow-[0_22px_50px_-32px_rgba(15,23,42,0.75)] sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                      Page <span className="font-semibold text-card-foreground">{page}</span>{" "}
                      of{" "}
                      <span className="font-semibold text-card-foreground">
                        {totalPages}
                      </span>
                    </p>
                    <div className="flex items-center gap-3">
                      <Button
                        disabled={page <= 1}
                        onClick={() => setPage((current) => Math.max(current - 1, 1))}
                        variant="outline"
                        className="transition-all duration-200 hover:scale-105"
                      >
                        Previous
                      </Button>
                      <Button
                        disabled={page >= totalPages}
                        onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                        variant="outline"
                        className="transition-all duration-200 hover:scale-105"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        description="Adjust job filters and apply them to the current listing."
        onClose={() => setMobileFiltersOpen(false)}
        open={mobileFiltersOpen}
        title="Job Filters"
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
