import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HomeEmployerCtaSection() {
  return (
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
  );
}
