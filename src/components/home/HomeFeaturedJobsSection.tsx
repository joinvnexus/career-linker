import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import type { FeaturedJob } from "@/components/home/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type HomeFeaturedJobsSectionProps = {
  featuredJobs: FeaturedJob[];
  loading: boolean;
  totalJobs: number;
};

// ─── Job type → pill style ────────────────────────────────────────────────────
const getTypeMeta = (type?: string) => {
  const t = (type ?? "").toLowerCase();
  if (t.includes("remote"))
    return { label: "Remote", className: "bg-sky-50 text-sky-700 border-sky-100" };
  if (t.includes("hybrid"))
    return { label: "Hybrid", className: "bg-amber-50 text-amber-700 border-amber-100" };
  return { label: "Full-time", className: "bg-emerald-50 text-emerald-700 border-emerald-100" };
};

// ─── Single job card ─────────────────────────────────────────────────────────────
function JobRow({
  job,
}: {
  job: FeaturedJob;
}) {
  const type = getTypeMeta(job.jobType);

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} ${job.salaryType || '/yr'}`;
    }
    if (job.salaryMin) {
      return `$${job.salaryMin.toLocaleString()}+ ${job.salaryType || '/yr'}`;
    }
    return null;
  };

  const formatDeadline = () => {
    if (job.applicationDeadline) {
      const deadline = new Date(job.applicationDeadline);
      const now = new Date();
      const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));
      if (daysLeft > 0) {
        return `${daysLeft} days left`;
      }
      return "Deadline passed";
    }
    return null;
  };

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group block rounded-xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:border-sky-200 hover:shadow-md hover:-translate-y-0.5 sm:p-5"
    >
      <div className="flex items-start gap-4">
        {/* Company logo / initials */}
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 text-sm font-bold uppercase text-sky-700 shadow-sm">
          {job.companyName?.slice(0, 2) ?? "CO"}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-sky-700 line-clamp-1">
                {job.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                <Building2 className="mr-1.5 inline h-4 w-4" />
                {job.companyName}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${type.className}`}>
                {type.label}
              </span>
              {formatDeadline() && (
                <span className="text-xs text-slate-500">
                  <Clock className="mr-1 inline h-3 w-3" />
                  {formatDeadline()}
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                {job.location}
              </span>
            )}
            {formatSalary() && (
              <span className="font-medium text-slate-700">
                {formatSalary()}
              </span>
            )}
            <span className="text-xs">
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-sky-500" />
      </div>
    </Link>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export function HomeFeaturedJobsSection({
  featuredJobs,
  loading,
  totalJobs,
}: HomeFeaturedJobsSectionProps) {
  const featuredCount = featuredJobs.length;

  return (
    <section className="py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600">
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              Featured jobs
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-slate-950">
              Openings worth moving on now.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
              A faster shortlist of roles from active employers, framed for quick scanning.
            </p>
          </div>

          {/* Stat chips */}
          <div className="flex shrink-0 gap-3">
            <div className="rounded-2xl border border-slate-100 bg-white px-5 py-3 text-center shadow-sm">
              <p className="text-xl font-bold text-slate-950">
                {loading ? "…" : featuredCount}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">selected roles</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white px-5 py-3 text-center shadow-sm">
              <p className="text-xl font-bold text-slate-950">
                {loading ? "…" : `${totalJobs || featuredCount}+`}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">roles in search</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white px-5 py-3 text-center shadow-sm">
              <p className="text-xl font-bold text-slate-950">Fast</p>
              <p className="mt-0.5 text-xs text-slate-500">decision path</p>
            </div>
          </div>
        </div>

        {/* ── Jobs grid ── */}
        <div className="mt-8 grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-white p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4 rounded" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-20 rounded" />
                      <Skeleton className="h-4 w-24 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : featuredJobs.length > 0 ? (
            featuredJobs.map((job) => (
              <JobRow
                key={job.id}
                job={job}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center rounded-xl border border-slate-100 bg-white py-20 text-center">
              <Briefcase className="mb-5 h-16 w-16 text-slate-200" />
              <h3 className="text-lg font-bold text-slate-950">No featured jobs yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
                Explore the full board while employers publish new openings.
              </p>
              <Link href="/jobs" className="mt-6 inline-block">
                <Button size="lg">Browse All Jobs</Button>
              </Link>
            </div>
          )}
        </div>

        {/* ── CTA ── */}
        <div className="mt-10 flex justify-center">
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