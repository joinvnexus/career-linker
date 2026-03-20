import Link from "next/link";
import { Briefcase } from "lucide-react";
import { JobCard } from "@/components/job-card";
import type { FeaturedJob } from "@/components/home/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type HomeFeaturedJobsSectionProps = {
  featuredJobs: FeaturedJob[];
  loading: boolean;
};

export function HomeFeaturedJobsSection({
  featuredJobs,
  loading,
}: HomeFeaturedJobsSectionProps) {
  return (
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
  );
}
