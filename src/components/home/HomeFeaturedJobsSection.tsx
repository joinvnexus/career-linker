import Link from "next/link";
import { ArrowRight, Briefcase, Clock3, Sparkles, TrendingUp } from "lucide-react";
import { JobCard } from "@/components/job-card";
import type { FeaturedJob } from "@/components/home/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type HomeFeaturedJobsSectionProps = {
  featuredJobs: FeaturedJob[];
  loading: boolean;
};

const featuredJobStats = [
  { label: "Featured picks", value: "6 roles" },
  { label: "Updated", value: "Daily" },
  { label: "High intent", value: "Top employers" },
] as const;

export function HomeFeaturedJobsSection({
  featuredJobs,
  loading,
}: HomeFeaturedJobsSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50 py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_55%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/85 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              Curated opportunities
            </div>
            <h2 className="max-w-3xl text-4xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl">
              Featured jobs worth a faster look.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              A focused set of current openings from active employers so
              candidates can move quickly and hiring teams get stronger
              visibility.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="grid grid-cols-3 gap-3">
              {featuredJobStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-slate-50 px-3 py-4 text-center"
                >
                  <p className="text-lg font-bold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)] backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  Roles with active hiring momentum
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  These listings are surfaced to give candidates stronger,
                  fresher options instead of stale inventory.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_25px_70px_-35px_rgba(15,23,42,0.7)]">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Clock3 className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Hiring window is moving</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Browse current roles now, then open the full jobs list for a
                  wider search.
                </p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[19rem] w-full rounded-[1.75rem]" />
            ))}
          </div>
        ) : featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} employerId={job.employerId} job={job} />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 py-20 text-center shadow-sm backdrop-blur">
            <Briefcase className="mx-auto mb-6 h-20 w-20 text-slate-300" />
            <h3 className="mb-2 text-2xl font-bold text-slate-950">
              No featured jobs yet
            </h3>
            <p className="mx-auto mb-8 max-w-xl text-slate-600">
              Fresh opportunities will appear here as employers publish active
              roles. Explore the full job board in the meantime.
            </p>
            <Link href="/jobs">
              <Button size="lg">Browse All Jobs</Button>
            </Link>
          </div>
        )}

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
