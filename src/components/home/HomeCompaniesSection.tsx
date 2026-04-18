"use client";

import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Globe2,
  Sparkles,
  TrendingUp,
  Users2,
  Plus,
  Clock,
  Layers,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { topCompanies } from "@/data";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTag = "all" | "product" | "growth" | "creative" | "expansion";

// ─── Static profile data ──────────────────────────────────────────────────────

const companyProfiles = [
  {
    tag: "product" as FilterTag,
    label: "Product-led",
    summary: "Shipping software with fast product and engineering cycles.",
    signal: "Global teams",
    roleCount: "250+",
    accentClass: "bg-blue-500",
    iconBg: "bg-blue-50",
    icon: Globe2,
    iconColor: "text-blue-500",
  },
  {
    tag: "growth" as FilterTag,
    label: "Growth-driven",
    summary: "Hiring across marketing, operations, and revenue roles.",
    signal: "Remote friendly",
    roleCount: "180+",
    accentClass: "bg-emerald-500",
    iconBg: "bg-emerald-50",
    icon: TrendingUp,
    iconColor: "text-emerald-500",
  },
  {
    tag: "creative" as FilterTag,
    label: "Creative systems",
    summary: "Scaling brand, design, and customer-facing experiences.",
    signal: "Cross-functional",
    roleCount: "90+",
    accentClass: "bg-orange-500",
    iconBg: "bg-orange-50",
    icon: Sparkles,
    iconColor: "text-orange-500",
  },
  {
    tag: "expansion" as FilterTag,
    label: "Team expansion",
    summary: "Opening key roles as hiring demand accelerates.",
    signal: "Active pipeline",
    roleCount: "120+",
    accentClass: "bg-amber-500",
    iconBg: "bg-amber-50",
    icon: Users2,
    iconColor: "text-amber-500",
  },
] as const;

const filterOptions: { label: string; value: FilterTag }[] = [
  { label: "All", value: "all" },
  { label: "Product-led", value: "product" },
  { label: "Growth-driven", value: "growth" },
  { label: "Creative systems", value: "creative" },
  { label: "Team expansion", value: "expansion" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const spotlightMessages = [
  "Browse companies the way you browse high-quality roles.",
  "Discover employers with strong hiring momentum.",
  "Find companies that match your career goals.",
  "Explore verified hiring signals and opportunities.",
];

export function HomeCompaniesSection() {
  const [activeFilter, setActiveFilter] = useState<FilterTag>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSpotlight, setCurrentSpotlight] = useState(0);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpotlight((prev) => (prev + 1) % spotlightMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const visibleCompanies = useMemo(() => {
    return topCompanies.filter((company, i) => {
      const profile = companyProfiles[i % companyProfiles.length];
      const matchesFilter = activeFilter === "all" || profile.tag === activeFilter;
      const matchesSearch = searchQuery === "" ||
        company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <section className="py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header row ── */}
        <div className="mb-8 flex flex-col gap-6 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700">
              <Building2 className="h-3.5 w-3.5" />
              Top companies hiring
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Standout employers worth opening first.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              A curated showcase for candidates who want stronger hiring signals
              before diving into the broader search.
            </p>
          </div>

          {/* Why card */}
          <div className="shrink-0 rounded-2xl border border-slate-100 bg-slate-50 p-5 lg:w-56">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Why start here
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Faster discovery, clearer momentum, fewer low-signal clicks.
            </p>
          </div>
        </div>

        {/* ── Filter chips ── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                  activeFilter === opt.value
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-2 pl-10 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100 sm:w-64"
            />
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid gap-5 lg:grid-cols-[1fr_200px]">

          {/* Company cards — 3 col */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibleCompanies.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-3 flex items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-sm text-slate-400"
                >
                  No companies match this filter.
                </motion.div>
              ) : (
                visibleCompanies.map((company, index) => {
                  const profile =
                    companyProfiles[
                      topCompanies.indexOf(company) % companyProfiles.length
                    ];
                  const Icon = profile.icon;

                  return (
                    <motion.div
                      key={company}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-slate-200 hover:shadow-lg"
                    >
                    {/* Top accent bar */}
                    <div className={`h-0.5 w-full ${profile.accentClass}`} />

                    <div className="flex flex-1 flex-col p-5">
                      {/* Icon + role count */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${profile.iconBg}`}
                        >
                          <Icon className={`h-4 w-4 ${profile.iconColor}`} />
                        </div>
                        <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                          {profile.roleCount} roles
                        </span>
                      </div>

                      {/* Company info */}
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                          {profile.label}
                        </p>
                        <h3 className="mt-1 text-base font-bold text-slate-900">
                          {company}
                        </h3>
                        <p className="mt-2 text-xs leading-6 text-slate-500">
                          {profile.summary}
                        </p>
                      </div>

                      {/* Signal row */}
                      {/* Expanded content */}
                      <AnimatePresence>
                        {expandedCard === company && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 rounded-lg bg-slate-50 p-3">
                              <p className="text-xs text-slate-600">
                                <strong>Key focus:</strong> {profile.summary}
                              </p>
                              <p className="mt-2 text-xs text-slate-600">
                                <strong>Current openings:</strong> {profile.roleCount}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4 mt-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            Hiring signal
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-slate-800">
                            {profile.signal}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setExpandedCard(expandedCard === company ? null : company);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
                          >
                            {expandedCard === company ? "Less" : "More"}
                            {expandedCard === company ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <Link
                            href="/companies"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 transition-transform duration-200 group-hover:translate-x-0.5 hover:text-emerald-700"
                          >
                            Explore
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* ── Sidebar spotlight ── */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-1 flex-col rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Employer spotlight
              </p>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={currentSpotlight}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="mt-3 text-sm font-bold leading-6 text-slate-900"
                >
                  {spotlightMessages[currentSpotlight]}
                </motion.h3>
              </AnimatePresence>
              <p className="mt-2 text-xs leading-6 text-slate-500">
                This shortlist surfaces hiring momentum before you open the
                broader board.
              </p>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xl font-bold text-slate-900">
                    {topCompanies.length}+
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    featured employers
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xl font-bold text-slate-900">1k+</p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    roles highlighted
                  </p>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/companies"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                View all companies
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Quick stats strip */}
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-white p-4">
              {[
                { icon: Clock, label: "Updated daily" },
                { icon: Layers, label: "Verified hiring signals" },
                { icon: Plus, label: "New employers weekly" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-50">
                    <Icon className="h-3 w-3 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}