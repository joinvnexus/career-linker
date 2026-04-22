"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Building2, Globe2, MapPin, Sparkles, Star, TrendingUp, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal } from "@/components/layout/reveal";
import { Skeleton } from "@/components/ui/skeleton";

type CompanyApiResponse = {
  id: string;
  companyName: string;
  tag: string;
  label: string;
  summary: string;
  signal: string;
  roleCount: string;
  accentClass: string;
  iconBg: string;
  iconName: string;
  iconColor: string;
  location: string | null;
  industry: string | null;
  companySize: string | null;
  isVerified: boolean;
};

type Company = CompanyApiResponse;

const ITEMS_PER_PAGE = 6;

const iconMap: Record<string, typeof Globe2> = {
  Globe2,
  TrendingUp,
  Sparkles,
  Users2,
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("most-jobs");
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueIndustries = useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => {
      if (c.industry) set.add(c.industry);
    });
    return ["All", ...Array.from(set).sort()] as [string, ...string[]];
  }, [companies]);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/companies");
        const data = await res.json();
        if (data.companies) {
          setCompanies(data.companies);
        }
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.industry?.toLowerCase() ?? "").includes(searchQuery.toLowerCase());
      const matchesIndustry =
        selectedIndustry === "All" ||
        (company.industry?.startsWith(selectedIndustry) ?? false);
      return matchesSearch && matchesIndustry;
    });
  }, [companies, searchQuery, selectedIndustry]);

  const sortedCompanies = useMemo(() => {
    return [...filteredCompanies].sort((a, b) => {
      const aJobs = parseInt(a.roleCount) || 0;
      const bJobs = parseInt(b.roleCount) || 0;
      if (sortBy === "most-jobs") return bJobs - aJobs;
      if (sortBy === "top-rated") {
        return a.isVerified === b.isVerified ? 0 : a.isVerified ? -1 : 1;
      }
      return a.id.localeCompare(b.id);
    });
  }, [filteredCompanies, sortBy]);

  const totalPages = Math.ceil(sortedCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = sortedCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedIndustry, sortBy]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < fullStars
                ? "fill-amber-400 text-amber-400"
                : i === fullStars && hasHalfStar
                ? "fill-amber-400/50 text-amber-400"
                : "fill-slate-200 text-slate-200"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-background">
        <section className="surface-dark relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16">
          <div className="page-shell relative">
            <div className="mx-auto max-w-3xl text-center">
              <Skeleton className="mx-auto h-6 w-40 bg-white/10" />
              <Skeleton className="mx-auto mt-6 h-10 w-64 bg-white/10" />
              <Skeleton className="mx-auto mt-4 h-6 w-80 bg-white/10" />
            </div>
          </div>
        </section>
        <section className="page-shell py-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-xl" />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <section className="surface-dark relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16">
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-20 -translate-y-20 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-20 translate-y-20 rounded-full bg-emerald-500/15 blur-3xl" />
        
        <div className="page-shell relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="eyebrow border-white/10 bg-white/5 text-sky-100">
              <Building2 className="h-3.5 w-3.5" />
              Company directory
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Explore Top Companies
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              {companies.length}+ companies actively hiring in Bangladesh
            </p>
            
            <div className="mt-8 flex gap-2 max-w-xl mx-auto">
              <Input
                placeholder="Search by company name or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-slate-400"
              />
              <Button variant="secondary" className="px-5">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-white/60 px-6 py-3 backdrop-blur-xl">
        <div className="page-shell">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-muted-foreground">Industry:</span>
            <div className="flex flex-wrap gap-2">
              {uniqueIndustries.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setSelectedIndustry(industry)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    selectedIndustry === industry
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/60 text-muted-foreground hover:bg-white hover:text-foreground"
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
            
            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Sort:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-white/80">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="most-jobs">Most Jobs</SelectItem>
                  <SelectItem value="top-rated">Top Rated</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-8">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Featured Companies
          </h2>
        </Reveal>
        
        {sortedCompanies.length === 0 ? (
          <div className="mt-8 text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">No companies found</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("");
                setSelectedIndustry("All");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedCompanies.map((company, index) => {
              const IconComponent = iconMap[company.iconName] || Globe2;
              const openJobs = parseInt(company.roleCount) || 0;
              
              return (
                <Reveal key={company.id} delay={index * 0.05}>
                  <Link href={`/companies/${company.id}`}>
                    <Card className="h-full cursor-pointer transition-all hover:border-primary/30 hover:shadow-lg">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div
                            className={`flex h-14 w-14 items-center justify-center rounded-xl ${company.iconBg}`}
                          >
                            <IconComponent className={`h-6 w-6 ${company.iconColor}`} />
                          </div>
                          <div className="flex items-center gap-2">
                            {company.isVerified && (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                                Verified
                              </span>
                            )}
                            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                              {openJobs} open
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="mt-4 text-lg font-semibold text-foreground">
                          {company.companyName}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {company.industry || "General"}
                        </p>
                        
                        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {company.location || "N/A"}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users2 className="h-4 w-4" />
                            {company.companySize || "N/A"}
                          </span>
                        </div>
                        
                        <div className="mt-4">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {company.label}
                          </span>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {company.summary}
                          </p>
                          <Button size="sm" variant="soft" className="gap-1.5">
                            View
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="icon"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </section>

      <section className="page-shell pb-12">
        <Reveal>
          <div className="surface-panel relative overflow-hidden rounded-[2rem] border border-white/80 px-6 py-8 sm:px-10">
            <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-10 translate-y-10 rounded-full bg-emerald-200/40 blur-3xl" />
            
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Pair company discovery with live roles
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Once a company stands out, jump directly into the job board and scan for active roles that match your skills.
                </p>
              </div>
              <Link href="/jobs">
                <Button size="lg" className="gap-2">
                  Browse Jobs
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}