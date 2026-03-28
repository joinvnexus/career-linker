"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HomeHeroSectionProps = {
  totalJobs: number;
  categoriesCount: number;
  search: string;
  location: string;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const quickSearches = ["Remote Product Designer", "Frontend Developer", "Marketing Lead", "Dhaka"];

const featureCards = [
  {
    icon: Briefcase,
    title: "Curated openings",
    description: "Search active roles across product, engineering, growth, and operations.",
  },
  {
    icon: ShieldCheck,
    title: "Cleaner hiring flow",
    description: "Track applications, shortlist candidates, and reduce tool switching.",
  },
  {
    icon: TrendingUp,
    title: "Built for momentum",
    description: "Move from discovery to application in a single, focused workflow.",
  },
] as const;

export function HomeHeroSection({
  totalJobs,
  categoriesCount,
  search,
  location,
  onSearchChange,
  onLocationChange,
  onSubmit,
}: HomeHeroSectionProps) {
  const heroStats = [
    { label: "Live roles", value: totalJobs > 0 ? `${totalJobs}+` : "Fresh" },
    {
      label: "Role categories",
      value: categoriesCount > 0 ? `${categoriesCount}` : "Growing",
    },
    { label: "Application flow", value: "Fast" },
  ] as const;

  return (
    <section className="relative overflow-hidden pb-14 pt-10 sm:pb-16 sm:pt-14 lg:pb-22 lg:pt-18">
      <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_32%),linear-gradient(180deg,_rgba(255,255,255,0.68)_0%,_rgba(248,250,252,0.22)_100%)]" />
      <div className="absolute left-[8%] top-20 -z-10 hidden h-40 w-40 rounded-full bg-sky-200/30 blur-3xl lg:block" />
      <div className="absolute right-[10%] top-12 -z-10 hidden h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl lg:block" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:gap-14 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            Smarter job search for candidates and employers
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-[1] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
            Build your next move
            <span className="mt-2 block bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-500 bg-clip-text text-transparent">
              without the noisy workflow.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Career-Linker helps job seekers discover strong opportunities and gives
            employers a cleaner way to publish roles, review applicants, and
            hire faster.
          </p>

          <form
            className="mt-7 rounded-[2rem] border border-white/60 bg-white/80 p-2.5 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-3"
            onSubmit={onSubmit}
          >
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px_auto]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <span className="sr-only">Search jobs</span>
                <Input
                  className="h-15 rounded-[1.35rem] border-slate-200 bg-slate-50 pl-14 pr-4 text-base shadow-none focus:border-sky-400 focus:bg-white"
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search by role, skill, or company"
                  value={search}
                />
              </label>

              <label className="relative block">
                <MapPin className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <span className="sr-only">Search location</span>
                <Input
                  className="h-15 rounded-[1.35rem] border-slate-200 bg-slate-50 pl-14 pr-4 text-base shadow-none focus:border-emerald-400 focus:bg-white"
                  onChange={(event) => onLocationChange(event.target.value)}
                  placeholder="City, country, or remote"
                  value={location}
                />
              </label>

              <Button className="h-15 rounded-[1.35rem] px-8 text-base font-semibold" type="submit">
                Find Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-500">Popular:</span>
              {quickSearches.map((item) => (
                <button
                  key={item}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition-colors hover:border-sky-200 hover:text-sky-700"
                  onClick={() => {
                    if (item === "Dhaka") {
                      onLocationChange(item);
                      return;
                    }

                    onSearchChange(item);
                  }}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          </form>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link href="/jobs">
              <Button className="rounded-full px-6" size="lg">
                Explore Opportunities
              </Button>
            </Link>
            <Link href="/dashboard/employer/post-job">
              <Button className="rounded-full px-6" size="lg" variant="outline">
                Post a Job
              </Button>
            </Link>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {heroStats.map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded-2xl border border-white/70 bg-white/75 px-4 py-4 shadow-sm backdrop-blur"
              >
                <p className="text-xl font-bold text-slate-950">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 p-5 text-white shadow-[0_30px_80px_-35px_rgba(15,23,42,0.65)] sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.22),_transparent_24%)]" />

            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
                    Hiring Snapshot
                  </p>
                  <h2 className="mt-2 text-2xl font-bold leading-tight">
                    One workspace for search, apply, and review.
                  </h2>
                </div>
                <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-white/10 sm:flex">
                  <Building2 className="h-7 w-7 text-emerald-300" />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4">
                {featureCards.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sky-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                  Employer flow
                </p>
                <p className="mt-3 text-base font-semibold text-white">
                  Publish a role, review candidates, and manage hiring from one dashboard.
                </p>
                <Link
                  href="/dashboard/employer"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-200 transition-colors hover:text-white"
                >
                  Open employer tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
