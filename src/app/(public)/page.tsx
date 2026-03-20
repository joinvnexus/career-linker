"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { careerTips, topCompanies } from "@/data";
import { JobCard } from "@/components/job-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Briefcase, Building2, FileText, MapPin, Search, Sparkles } from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type FeaturedJob = {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  companySlug?: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: string;
  jobType: "FULL_TIME" | "PART_TIME" | "REMOTE" | "CONTRACT" | "INTERNSHIP";
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "DRAFT" | "REJECTED";
  createdAt: string;
  applicationDeadline?: string;
  employerId: string;
};

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState<FeaturedJob[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async (): Promise<void> => {
      try {
        const [jobsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/jobs?page=1&limit=6"),
          fetch("/api/categories"),
        ]);

        const jobsData = (await jobsResponse.json()) as { jobs?: FeaturedJob[] };
        const categoriesData = (await categoriesResponse.json()) as {
          categories?: Category[];
        };

        setFeaturedJobs(jobsData.jobs ?? []);
        setCategories(categoriesData.categories ?? []);
      } catch {
        console.error("Failed to load home page data");
      } finally {
        setLoading(false);
      }
    };

    void fetchFeatured();
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (location) {
      params.set("location", location);
    }

    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-blue-50 to-emerald-50">
      <section className="pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-transparent md:text-7xl">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-700 bg-clip-text">
              Find Your
            </span>
            <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text">
              Dream Job
            </span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-600 md:text-2xl">
            Discover thousands of opportunities from top companies. Simple
            search, easy apply, and career growth in one place.
          </p>

          <form
            className="mx-auto mb-20 max-w-4xl rounded-3xl border border-white/50 bg-white/70 p-1 shadow-2xl backdrop-blur-xl"
            onSubmit={handleSearch}
          >
            <div className="flex flex-col gap-3 p-4 lg:flex-row lg:p-6">
              <div className="relative flex-1">
                <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
                <Input
                  className="h-16 rounded-2xl border-2 border-gray-200 pl-16 pr-4 text-lg focus:border-blue-500"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Job title, skills, company..."
                  value={search}
                />
              </div>
              <div className="relative lg:w-80">
                <MapPin className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
                <Input
                  className="h-16 w-full rounded-2xl border-2 border-gray-200 pl-16 pr-4 text-lg focus:border-emerald-500"
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Location (e.g. Dhaka, Remote)"
                  value={location}
                />
              </div>
              <Button
                className="h-16 whitespace-nowrap px-12 text-xl font-bold"
                type="submit"
              >
                <Search className="mr-2 h-6 w-6" />
                Find Jobs
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="bg-white/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Trending Categories
            </h2>
            <p className="text-xl text-gray-600">Explore high-demand roles</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="mb-16 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/jobs?category=${category.id}`}
                  className="group flex h-24 flex-col items-center rounded-2xl border border-white/30 bg-white/50 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 transition-transform group-hover:scale-110">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-800 transition-colors group-hover:text-blue-600">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-gradient-to-b from-white to-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Featured Jobs
            </h2>
            <p className="text-xl text-gray-600">
              Latest opportunities from top employers
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-80 w-full" />
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} employerId={job.employerId} job={job} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <Briefcase className="mx-auto mb-6 h-20 w-20 text-gray-400" />
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                No featured jobs yet
              </h3>
              <p className="mb-8 text-gray-600">
                Check back soon for new opportunities
              </p>
              <Link href="/jobs">
                <Button size="lg">Browse All Jobs</Button>
              </Link>
            </div>
          )}

          <div className="mt-16 text-center">
            <Link href="/jobs">
              <Button className="h-14 px-12 text-lg" size="lg" variant="outline">
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Top Companies Hiring
            </h2>
            <p className="text-xl text-gray-600">
              Join these industry leaders
            </p>
          </div>

          <div className="mb-20 grid grid-cols-2 gap-6 md:grid-cols-4">
            {topCompanies.map((company) => (
              <div
                key={company}
                className="group rounded-3xl border border-white/50 bg-white/70 p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 transition-transform group-hover:rotate-12">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-1 text-lg font-bold transition-colors group-hover:text-blue-600">
                  {company}
                </h3>
                <p className="text-sm text-gray-600">250+ Openings</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
                <Sparkles className="h-4 w-4" />
                Career Tips
              </div>
              <h2 className="text-4xl font-bold text-slate-900">
                Advice for better applications and interviews
              </h2>
            </div>
            <Link href="/blog">
              <Button variant="outline">
                Visit Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {careerTips.map((tip) => (
              <Card key={tip.slug} className="h-full bg-white/90">
                <CardHeader className="space-y-4">
                  <Badge variant="secondary" className="w-fit">
                    {tip.label}
                  </Badge>
                  <CardTitle className="text-2xl leading-snug">
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-base leading-7 text-slate-600">
                    {tip.summary}
                  </p>
                  <Link
                    href={`/blog/${tip.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-sky-700 transition-colors hover:text-sky-900"
                  >
                    Read article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 px-6 py-10 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-14">
            <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
              <div className="space-y-6">
                <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-200">
                  For Employers
                </Badge>
                <h2 className="max-w-2xl text-4xl font-bold leading-tight">
                  Post jobs, manage applicants, and hire faster with one workflow.
                </h2>
                <p className="max-w-2xl text-lg leading-8 text-slate-300">
                  HireHub gives employers a clean dashboard for job posting,
                  candidate review, and application tracking without relying on
                  scattered tools.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href="/dashboard/employer/post-job">
                    <Button size="lg">Post a Job</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="lg" variant="outline">
                      Create Employer Account
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Time to publish</p>
                  <p className="mt-2 text-3xl font-bold">5 min</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Applicant tracking</p>
                  <p className="mt-2 text-3xl font-bold">Real-time</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm text-slate-400">Hiring workflow</p>
                  <p className="mt-2 text-3xl font-bold">End-to-end</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
