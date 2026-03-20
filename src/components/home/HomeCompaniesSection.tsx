import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Globe2,
  Sparkles,
  TrendingUp,
  Users2,
} from "lucide-react";
import { topCompanies } from "@/data";
import { Button } from "@/components/ui/button";

const companyProfiles = [
  {
    theme: "from-sky-500 to-cyan-500",
    tag: "Product-led",
    summary: "Shipping software with fast product and engineering cycles.",
    signal: "Global teams",
    icon: Globe2,
  },
  {
    theme: "from-emerald-500 to-teal-500",
    tag: "Growth-driven",
    summary: "Hiring across marketing, operations, and revenue roles.",
    signal: "Remote friendly",
    icon: TrendingUp,
  },
  {
    theme: "from-fuchsia-500 to-pink-500",
    tag: "Creative systems",
    summary: "Scaling brand, design, and customer-facing experiences.",
    signal: "Cross-functional",
    icon: Sparkles,
  },
  {
    theme: "from-amber-500 to-orange-500",
    tag: "Team expansion",
    summary: "Opening key roles as hiring demand accelerates.",
    signal: "Active pipeline",
    icon: Users2,
  },
] as const;

export function HomeCompaniesSection() {
  return (
    <section className="py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 grid gap-6 sm:mb-12 sm:gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <Building2 className="h-4 w-4" />
              Top companies hiring
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              Standout employers worth opening first.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
              A curated company showcase for candidates who want stronger hiring
              signals before they dive into the broader search.
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-slate-950 p-5 text-white shadow-[0_30px_70px_-35px_rgba(15,23,42,0.75)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Why start here
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              Faster company discovery, clearer hiring momentum, and fewer low-signal clicks.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            {topCompanies.map((company, index) => {
              const profile = companyProfiles[index % companyProfiles.length];
              const Icon = profile.icon;

              return (
                <div
                  key={company}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_65px_-35px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_34px_85px_-35px_rgba(15,23,42,0.35)] sm:p-7"
                >
                  <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${profile.theme}`} />
                  <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-slate-100/80 blur-2xl transition-transform duration-300 group-hover:scale-125" />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r text-white ${profile.theme}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        250+ roles
                      </span>
                    </div>

                    <p className="mt-6 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {profile.tag}
                    </p>
                    <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-slate-950">
                      {company}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {profile.summary}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                          Hiring signal
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {profile.signal}
                        </p>
                      </div>
                      <Link
                        href="/companies"
                        className="inline-flex items-center text-sm font-semibold text-emerald-700 transition-transform duration-300 hover:text-emerald-800 group-hover:translate-x-1"
                      >
                        Explore
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_35px_90px_-40px_rgba(15,23,42,0.8)] sm:p-8">
            <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              Employer spotlight
            </p>
            <h3 className="mt-6 text-3xl font-bold tracking-[-0.03em]">
              Browse companies the same way you browse high-quality roles.
            </h3>
            <p className="mt-5 text-sm leading-8 text-slate-300">
              This section is meant to feel like a shortlist, not a directory.
              Open the company board when you want stronger teams before wider exploration.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-2xl font-bold">4+</p>
                <p className="mt-1 text-sm text-slate-400">featured employers</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <p className="text-2xl font-bold">250+</p>
                <p className="mt-1 text-sm text-slate-400">roles highlighted</p>
              </div>
            </div>

            <Link href="/companies" className="mt-8 inline-block">
              <Button className="h-14 rounded-full px-8 text-base" size="lg">
                View All Companies
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
