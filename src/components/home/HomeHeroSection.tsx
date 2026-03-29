"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
    { label: "Hiring rhythm", value: "Fast" },
  ] as const;

  return (
    <section className="relative overflow-hidden pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-18">
      <div className="page-shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)] lg:gap-12">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="eyebrow"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Smarter search for candidates and employers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: "easeOut" }}
              className="display-title mt-6 text-slate-950"
            >
              Build your next move
              <span className="mt-2 block text-gradient">without the noisy workflow.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
              className="section-copy mt-6"
            >
              Career-Linker helps job seekers discover strong opportunities and gives employers a cleaner way to publish roles, review applicants, and hire faster.
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
              className="surface-panel mt-8 rounded-[2rem] border border-white/80 p-3"
              onSubmit={onSubmit}
            >
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px_auto]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <span className="sr-only">Search jobs</span>
                  <Input
                    className="h-14 rounded-[1.35rem] bg-white pl-14 pr-4 text-base"
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search by role, skill, or company"
                    value={search}
                  />
                </label>

                <label className="relative block">
                  <MapPin className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <span className="sr-only">Search location</span>
                  <Input
                    className="h-14 rounded-[1.35rem] bg-white pl-14 pr-4 text-base"
                    onChange={(event) => onLocationChange(event.target.value)}
                    placeholder="City, country, or remote"
                    value={location}
                  />
                </label>

                <Button className="h-14 rounded-[1.35rem] px-8 text-base font-semibold" type="submit">
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
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22, ease: "easeOut" }}
              className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28, ease: "easeOut" }}
              className="mt-8 grid gap-3 sm:grid-cols-3"
            >
              {heroStats.map((item) => (
                <div
                  key={item.label}
                  className="surface-panel min-w-0 rounded-[1.5rem] border border-white/80 px-4 py-4"
                >
                  <p className="text-2xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
            className="relative"
          >
            <div className="surface-inverse relative overflow-hidden rounded-[2rem] border border-white/10 p-5 sm:p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.22),_transparent_24%)]" />

              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">
                      Hiring Snapshot
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold leading-tight">
                      One workspace for search, apply, and review.
                    </h2>
                  </div>
                  <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-white/10 sm:flex">
                    <Building2 className="h-7 w-7 text-emerald-300" />
                  </div>
                </div>

                <div className="mt-7 grid gap-3 sm:gap-4">
                  {featureCards.map(({ icon: Icon, title, description }) => (
                    <div
                      key={title}
                      className="rounded-[1.6rem] border border-white/10 bg-white/6 p-5 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sky-200">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-white">{title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-emerald-400/20 bg-emerald-400/10 p-5">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
