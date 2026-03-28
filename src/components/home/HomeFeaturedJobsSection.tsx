import Link from "next/link";
import { ArrowRight, Briefcase, Sparkles } from "lucide-react";
import { JobCard } from "@/components/job-card";
import type { FeaturedJob } from "@/components/home/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type HomeFeaturedJobsSectionProps = {
  featuredJobs: FeaturedJob[];
  loading: boolean;
  totalJobs: number;
};

export function HomeFeaturedJobsSection({
  featuredJobs,
  loading,
  totalJobs,
}: HomeFeaturedJobsSectionProps) {
  const featuredCount = featuredJobs.length;

  return (
    <section className="py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.25rem] bg-slate-950 px-5 py-8 text-white shadow-[0_35px_90px_-40px_rgba(15,23,42,0.75)] sm:px-8 sm:py-9 lg:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-200">
                <Sparkles className="h-4 w-4" />
                Featured jobs
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                Openings worth moving on now.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                A faster shortlist of roles from active employers, framed for quick scanning.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:max-w-md sm:grid-cols-3">
              <div className="rounded-2xl bg-white/5 px-4 py-4 text-center">
                <p className="text-lg font-bold">{loading ? "..." : featuredCount}</p>
                <p className="mt-1 text-xs text-slate-400">selected roles</p>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-4 text-center">
                <p className="text-lg font-bold">{loading ? "..." : `${totalJobs || featuredCount}+`}</p>
                <p className="mt-1 text-xs text-slate-400">roles in search</p>
              </div>
              <div className="rounded-2xl bg-white/5 px-4 py-4 text-center">
                <p className="text-lg font-bold">Fast</p>
                <p className="mt-1 text-xs text-slate-400">decision path</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:mt-10 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[19rem] rounded-[1.75rem]" />
            ))
          ) : featuredJobs.length > 0 ? (
            featuredJobs.map((job) => (
              <JobCard key={job.id} employerId={job.employerId} job={job} />
            ))
          ) : (
            <div className="col-span-full rounded-[2rem] border border-dashed border-slate-300 bg-white/80 px-6 py-20 text-center">
              <Briefcase className="mx-auto mb-6 h-20 w-20 text-slate-300" />
              <h3 className="text-2xl font-bold text-slate-950">No featured jobs yet</h3>
              <p className="mx-auto mt-3 max-w-xl text-slate-600">
                Explore the full board while employers publish new openings.
              </p>
              <Link href="/jobs" className="mt-8 inline-block">
                <Button size="lg">Browse All Jobs</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-14 flex justify-center">
          <Link href="/jobs">
            <Button className="h-14 rounded-full px-10 text-base" size="lg" variant="outline">
              View All Jobs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
