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

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTag = "all" | "product" | "growth" | "creative" | "remote";

type CompanyProfile = {
  id: string;
  companyName: string;
  tag: FilterTag;
  label: string;
  summary: string;
  signal: string;
  roleCount: string;
  accentClass: string;
  iconBg: string;
  iconName: string;
  iconColor: string;
  location?: string;
  industry?: string;
  companySize?: string;
  isVerified: boolean;
};

const filterOptions: { label: string; value: FilterTag }[] = [
  { label: "All", value: "all" },
  { label: "Product-led", value: "product" },
  { label: "Growth-driven", value: "growth" },
  { label: "Creative systems", value: "creative" },
  { label: "Remote-first", value: "remote" },
];

function getIconComponent(iconName: string) {
  switch (iconName) {
    case "Globe2": return Globe2;
    case "TrendingUp": return TrendingUp;
    case "Sparkles": return Sparkles;
    case "Users2": return Users2;
    default: return Globe2;
  }
}

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
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/companies");
        if (!response.ok) throw new Error("Failed to fetch companies");
        const data = await response.json();
        setCompanies(data.companies);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load companies");
        // Fallback to static data
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();

    const interval = setInterval(() => {
      setCurrentSpotlight((prev) => (prev + 1) % spotlightMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const visibleCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesFilter = activeFilter === "all" || company.tag === activeFilter;
      const matchesSearch = searchQuery === "" ||
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.industry && company.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (company.location && company.location.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [companies, activeFilter, searchQuery]);

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
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={`loading-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-9 w-9 rounded-lg bg-slate-100 animate-pulse" />
                      <div className="h-6 w-16 rounded-full bg-slate-100 animate-pulse" />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
                      <div className="h-4 w-32 rounded bg-slate-100 animate-pulse" />
                      <div className="h-3 w-full rounded bg-slate-100 animate-pulse" />
                    </div>
                    <div className="mt-auto pt-4 border-t border-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="h-2 w-16 rounded bg-slate-100 animate-pulse" />
                          <div className="h-3 w-20 rounded bg-slate-100 animate-pulse" />
                        </div>
                        <div className="h-6 w-12 rounded bg-slate-100 animate-pulse" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : visibleCompanies.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="col-span-3 flex items-center justify-center rounded-2xl border border-dashed border-slate-200 py-16 text-sm text-slate-400"
                >
                  {error ? `Error: ${error}` : "No companies match this filter."}
                </motion.div>
              ) : (
                visibleCompanies.map((company, index) => {
                  const Icon = getIconComponent(company.iconName);

                  return (
                    <motion.div
                      key={company.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-200 hover:-translate-y-1 hover:border-slate-200 hover:shadow-lg"
                    >
                    {/* Top accent bar */}
                    <div className={`h-0.5 w-full ${company.accentClass}`} />

                    <div className="flex flex-1 flex-col p-5">
                      {/* Icon + role count */}
                      <div className="flex items-center justify-between">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${company.iconBg}`}
                        >
                          <Icon className={`h-4 w-4 ${company.iconColor}`} />
                        </div>
                        <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                          {company.roleCount} roles
                        </span>
                      </div>

                      {/* Company info */}
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                          {company.label}
                        </p>
                        <h3 className="mt-1 text-base font-bold text-slate-900">
                          {company.companyName}
                        </h3>
                        <p className="mt-2 text-xs leading-6 text-slate-500">
                          {company.summary}
                        </p>
                      </div>

                      {/* Expanded content */}
                      <AnimatePresence>
                        {expandedCard === company.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 rounded-lg bg-slate-50 p-3">
                              <p className="text-xs text-slate-600">
                                <strong>Industry:</strong> {company.industry || "Not specified"}
                              </p>
                              <p className="mt-2 text-xs text-slate-600">
                                <strong>Location:</strong> {company.location || "Not specified"}
                              </p>
                              <p className="mt-2 text-xs text-slate-600">
                                <strong>Company size:</strong> {company.companySize || "Not specified"}
                              </p>
                              {company.isVerified && (
                                <p className="mt-2 text-xs text-emerald-600 font-semibold">
                                  ✓ Verified employer
                                </p>
                              )}
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
                            {company.signal}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setExpandedCard(expandedCard === company.id ? null : company.id);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
                          >
                            {expandedCard === company.id ? "Less" : "More"}
                            {expandedCard === company.id ? (
                              <ChevronUp className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <Link
                            href={`/companies/${company.id}`}
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
                    {companies.length}+
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    featured employers
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-xl font-bold text-slate-900">
                    {companies.reduce((sum, company) => sum + parseInt(company.roleCount.replace('+', '')), 0)}+
                  </p>
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