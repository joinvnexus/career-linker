"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Search,
  Sparkles,
  Clock,
  Briefcase,
  Building2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

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

// ─── Placeholder job cards (replace with real data as needed) ───────────────
const PLACEHOLDER_JOBS = [
  {
    id: 1,
    role: "Senior Product Designer",
    company: "Shohoz",
    location: "Dhaka, BD",
    type: "Remote",
    typeColor: "bg-sky-50 text-sky-700 border-sky-100",
    logo: "SH",
    logoColor: "bg-violet-100 text-violet-700",
    postedAgo: "2h ago",
    salary: "৳ 80k–110k",
    featured: true,
  },
  {
    id: 2,
    role: "Frontend Engineer",
    company: "bKash Limited",
    location: "Dhaka, BD",
    type: "Full-time",
    typeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    logo: "BK",
    logoColor: "bg-emerald-100 text-emerald-700",
    postedAgo: "5h ago",
    salary: "৳ 70k–95k",
    featured: false,
  },
  {
    id: 3,
    role: "Growth Marketing Lead",
    company: "Chaldal",
    location: "Dhaka, BD",
    type: "Hybrid",
    typeColor: "bg-amber-50 text-amber-700 border-amber-100",
    logo: "CH",
    logoColor: "bg-amber-100 text-amber-700",
    postedAgo: "1d ago",
    salary: "৳ 55k–75k",
    featured: false,
  },
  {
    id: 4,
    role: "Backend Engineer (Go)",
    company: "Pathao",
    location: "Remote",
    type: "Remote",
    typeColor: "bg-sky-50 text-sky-700 border-sky-100",
    logo: "PA",
    logoColor: "bg-sky-100 text-sky-700",
    postedAgo: "2d ago",
    salary: "৳ 90k–120k",
    featured: false,
  },
];

type Job = (typeof PLACEHOLDER_JOBS)[number];

// ─── Single job card ────────────────────────────────────────────────────────
function JobCard({ job, index }: { job: Job; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.18 + index * 0.08, ease: "easeOut" }}
      className="group relative flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
    >
      {/* Featured badge */}
      {job.featured && (
        <span className="absolute right-4 top-4 rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-600 ring-1 ring-violet-100">
          Featured
        </span>
      )}

      {/* Logo */}
      <div
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold ${job.logoColor}`}
      >
        {job.logo}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{job.role}</p>

        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
          <Building2 className="h-3 w-3 flex-shrink-0" />
          <span>{job.company}</span>
          <span className="text-slate-300">·</span>
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span>{job.location}</span>
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${job.typeColor}`}
          >
            {job.type}
          </span>
          <span className="text-xs font-medium text-slate-700">{job.salary}</span>
        </div>

        <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="h-3 w-3" />
          {job.postedAgo}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Stat chip ───────────────────────────────────────────────────────────────
function StatChip({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-slate-50">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div>
        <p className="text-base font-semibold leading-none tracking-tight text-slate-950">
          {value}
        </p>
        <p className="mt-1 text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// ─── Main section ────────────────────────────────────────────────────────────
export function HomeHeroSection({
  totalJobs,
  categoriesCount,
  search,
  location,
  onSearchChange,
  onLocationChange,
  onSubmit,
}: HomeHeroSectionProps) {
  // Animate a live "new job" counter for visual delight
  const [liveCount, setLiveCount] = useState(totalJobs > 0 ? totalJobs : 197);

  useEffect(() => {
    const t = setTimeout(() => setLiveCount((n) => n + 1), 8000);
    return () => clearTimeout(t);
  }, [liveCount]);

  const heroStats = [
    {
      icon: Briefcase,
      label: "Live roles",
      value: liveCount > 0 ? `${liveCount}+` : "Fresh",
    },
    {
      icon: TrendingUp,
      label: "Role categories",
      value: categoriesCount > 0 ? `${categoriesCount}` : "12",
    },
  ] as const;

  return (
    <section className="relative overflow-hidden pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-18">
      <div className="page-shell">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">

          {/* ── LEFT: headline, search, CTAs, stats ── */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="eyebrow"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Smarter search for candidates and employers
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06, ease: "easeOut" }}
              className="display-title mt-6 text-slate-950"
            >
              Build your next move
              <span className="mt-2 block text-gradient">without the noisy workflow.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
              className="section-copy mt-5"
            >
              Career-Linker helps job seekers discover strong opportunities and gives employers a cleaner way to publish roles, review applicants, and hire faster.
            </motion.p>

            {/* Search bar */}
            <motion.form
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: "easeOut" }}
              className="surface-panel mt-7 rounded-[1.75rem] border border-white/80 p-3"
              onSubmit={onSubmit}
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative flex-1 block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="h-12 rounded-[1.2rem] bg-white pl-11 pr-4 text-sm"
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Role, skill, or company"
                    value={search}
                  />
                </label>

                <label className="relative block sm:w-44">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    className="h-12 rounded-[1.2rem] bg-white pl-11 pr-4 text-sm"
                    onChange={(e) => onLocationChange(e.target.value)}
                    placeholder="City or remote"
                    value={location}
                  />
                </label>

                <Button className="h-12 rounded-[1.2rem] px-6 text-sm font-semibold" type="submit">
                  Find Jobs
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Quick searches */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-400">Try:</span>
                {quickSearches.map((item) => (
                  <button
                    key={item}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 transition-colors hover:border-sky-200 hover:text-sky-700"
                    onClick={() => {
                      item === "Dhaka" ? onLocationChange(item) : onSearchChange(item);
                    }}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.form>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
              className="mt-5 flex flex-wrap gap-3"
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

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2"
            >
              {heroStats.map((s) => (
                <StatChip key={s.label} icon={s.icon} label={s.label} value={s.value} />
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT: live job card feed ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            className="lg:sticky lg:top-8"
          >
            {/* Feed header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm font-semibold text-slate-700">Live openings</span>
              </div>
              <Link
                href="/jobs"
                className="text-xs font-medium text-sky-600 transition-colors hover:text-sky-800"
              >
                View all →
              </Link>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-3">
              {PLACEHOLDER_JOBS.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} />
              ))}
            </div>

            {/* Employer CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.55, ease: "easeOut" }}
              className="mt-3 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                  Hiring?
                </p>
                <p className="mt-0.5 text-sm font-semibold text-slate-800">
                  Publish a role in minutes.
                </p>
              </div>
              <Link href="/dashboard/employer/post-job">
                <Button
                  size="sm"
                  className="rounded-full bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Post a Job
                  <ArrowRight className="ml-1.5 h-3 w-3" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}