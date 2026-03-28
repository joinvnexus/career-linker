import Link from "next/link";
import { ArrowRight, Building2, Sparkles, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HomeEmployerCtaSection() {
  return (
    <section className="py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-[linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(8,47,73,0.94)_45%,_rgba(6,95,70,0.92)_100%)] px-5 py-8 text-white shadow-[0_35px_90px_-40px_rgba(15,23,42,0.85)] sm:px-10 sm:py-10 lg:px-14 lg:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.18),_transparent_24%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <Badge className="border-emerald-400/30 bg-emerald-400/10 text-emerald-200">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                For Employers
              </Badge>
              <h2 className="max-w-2xl text-3xl font-bold leading-tight tracking-[-0.03em] sm:text-4xl lg:text-[2.8rem]">
                Post jobs, manage applicants, and hire faster with one workflow.
              </h2>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                HireHub gives employers a cleaner hiring cockpit for job posting,
                candidate review, and application tracking without scattered tools or tabs.
              </p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <Building2 className="h-5 w-5 text-sky-200" />
                  <p className="mt-3 text-lg font-bold">1 dashboard</p>
                  <p className="mt-1 text-sm text-slate-400">Roles, applicants, and updates together</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <Users2 className="h-5 w-5 text-emerald-200" />
                  <p className="mt-3 text-lg font-bold">Fast review</p>
                  <p className="mt-1 text-sm text-slate-400">Move through candidates with less friction</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <ArrowRight className="h-5 w-5 text-amber-200" />
                  <p className="mt-3 text-lg font-bold">Clear flow</p>
                  <p className="mt-1 text-sm text-slate-400">From publishing to shortlist, faster</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/dashboard/employer/post-job">
                  <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-100">
                    Post a Job
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                  >
                    Create Employer Account
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm text-slate-400">Time to publish</p>
                <p className="mt-2 text-2xl font-bold">5 min</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm text-slate-400">Applicant tracking</p>
                <p className="mt-2 text-2xl font-bold">Real-time</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-sm text-slate-400">Hiring workflow</p>
                <p className="mt-2 text-2xl font-bold">End-to-end</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
