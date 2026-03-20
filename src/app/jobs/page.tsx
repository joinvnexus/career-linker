"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Briefcase, Filter, MapPin, Search } from "lucide-react";
import { JobCard } from "@/components/job-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type Category = {
  id: string;
  name: string;
};

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const [filters, setFilters] = useState({
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

  useEffect(() => {
    const loadCategories = async (): Promise<void> => {
      try {
        const response = await fetch("/api/categories");
        const data = (await response.json()) as { categories?: Category[] };
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold text-transparent md:text-5xl">
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              Find Your Dream Job
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Discover thousands of job opportunities from top companies.
          </p>

          <div className="mx-auto max-w-4xl rounded-3xl border border-white/50 bg-white/70 p-1 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col gap-2 p-1 lg:flex-row">
              <div className="flex flex-1 gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    className="h-14 rounded-2xl border-2 border-gray-200 pl-12 focus:border-blue-500 focus-visible:ring-0"
                    onChange={(event) => {
                      setFilters((current) => ({
                        ...current,
                        search: event.target.value,
                      }));
                      setPage(1);
                    }}
                    placeholder="Job title, company, or keywords..."
                    value={filters.search}
                  />
                </div>
                <div className="relative hidden w-64 md:block">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    className="h-14 rounded-2xl border-2 border-gray-200 pl-12 focus:border-blue-500"
                    onChange={(event) => {
                      setFilters((current) => ({
                        ...current,
                        location: event.target.value,
                      }));
                      setPage(1);
                    }}
                    placeholder="Location"
                    value={filters.location}
                  />
                </div>
              </div>
                <Button className="h-14 px-8 text-lg font-bold" onClick={() => setPage(1)}>
                  Find Jobs
                </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
            <div className="sticky top-24 rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
              <div className="mb-8 flex items-center gap-2">
                <Filter className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Job Type
                  </label>
                  <Select
                    onValueChange={(value) => {
                      setFilters((current) => ({
                        ...current,
                        jobType: value === "ALL" ? "" : value,
                      }));
                      setPage(1);
                    }}
                    value={filters.jobType || "ALL"}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All types</SelectItem>
                      <SelectItem value="FULL_TIME">Full-time</SelectItem>
                      <SelectItem value="PART_TIME">Part-time</SelectItem>
                      <SelectItem value="REMOTE">Remote</SelectItem>
                      <SelectItem value="CONTRACT">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Experience
                  </label>
                  <Select
                    onValueChange={(value) => {
                      setFilters((current) => ({
                        ...current,
                        experience: value === "ALL" ? "" : value,
                      }));
                      setPage(1);
                    }}
                    value={filters.experience || "ALL"}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All levels</SelectItem>
                      <SelectItem value="ENTRY">Entry Level</SelectItem>
                      <SelectItem value="MID">Mid Level</SelectItem>
                      <SelectItem value="SENIOR">Senior Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Category
                  </label>
                  <Select
                    onValueChange={(value) => {
                      setFilters((current) => ({
                        ...current,
                        category: value === "ALL" ? "" : value,
                      }));
                      setPage(1);
                    }}
                    value={filters.category || "ALL"}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-700">
                    Minimum Salary
                  </label>
                  <Select
                    onValueChange={(value) => {
                      setFilters((current) => ({
                        ...current,
                        salaryMin: value === "ALL" ? "" : value,
                      }));
                      setPage(1);
                    }}
                    value={filters.salaryMin || "ALL"}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Any salary" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Any salary</SelectItem>
                      <SelectItem value="30000">30,000+</SelectItem>
                      <SelectItem value="50000">50,000+</SelectItem>
                      <SelectItem value="80000">80,000+</SelectItem>
                      <SelectItem value="120000">120,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={resetFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {loading ? "Loading..." : `${total} jobs found`}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-32 w-full" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="py-24 text-center">
                <Briefcase className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  No jobs found
                </h3>
                <p className="mb-6 text-gray-500">
                  Try adjusting your filters or search terms.
                </p>
                <Button onClick={resetFilters}>Browse all jobs</Button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      employerId={job.employerId}
                      job={job}
                      userId={session?.user?.id}
                      userRole={session?.user?.role}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
                  <p className="text-sm text-slate-500">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      disabled={page <= 1}
                      onClick={() => setPage((current) => Math.max(current - 1, 1))}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      disabled={page >= totalPages}
                      onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                      variant="outline"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
