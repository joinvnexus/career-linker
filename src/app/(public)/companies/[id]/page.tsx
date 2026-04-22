"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Calendar, CheckCircle2, Globe, MapPin, Star, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/layout/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
type Job = {
  id: string;
  title: string;
  slug: string;
  jobType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryType: string | null;
  location: string | null;
  experience: string | null;
  category: string | null;
  postedAt: string;
};

type CompanyApiResponse = {
  id: string;
  companyName: string;
  description: string;
  industry: string | null;
  location: string | null;
  companySize: string | null;
  companyWebsite: string | null;
  isVerified: boolean;
  foundedYear: number | null;
  logo: string | null;
  openJobs: number;
  jobs: Job[];
  createdAt: string;
};

type Company = CompanyApiResponse;

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "jobs", label: "Jobs" },
  { id: "reviews", label: "Reviews" },
] as const;

const benefits = [
  "Health Insurance",
  "Annual Bonus",
  "Remote Work",
  "Provident Fund",
  "Training & Dev",
  "Flexible Hours",
];

export default function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<typeof tabs[number]["id"]>("overview");

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await fetch(`/api/companies/${id}`);
        const data = await res.json();
        if (data.company) {
          setCompany(data.company);
        }
      } catch (error) {
        console.error("Failed to fetch company:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, [id]);

  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Negotiable";
    const formatNum = (n: number) => `৳${(n / 1000).toFixed(0)}k`;
    if (min && max) return `${formatNum(min)} – ${formatNum(max)}`;
    if (min) return `From ${formatNum(min)}`;
    return `Up to ${formatNum(max!)}`;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-background">
        <div className="h-36 surface-dark" />
        <div className="page-shell -mt-16 relative">
          <div className="flex items-end gap-4">
            <Skeleton className="h-20 w-20 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="mt-2 h-5 w-32" />
              <Skeleton className="mt-2 h-5 w-24" />
            </div>
          </div>
        </div>

        <div className="border-b border-white/10 bg-white/60">
          <div className="page-shell flex gap-6">
            <Skeleton className="h-12 w-20" />
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-12 w-20" />
          </div>
        </div>

        <div className="page-shell py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-36 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <div className="page-shell py-20 text-center">
          <Building2 className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h1 className="mt-4 text-2xl font-semibold">Company not found</h1>
          <p className="mt-2 text-muted-foreground">The company youre looking for doesnt exist.</p>
          <Link href="/companies">
            <Button className="mt-6">Browse Companies</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="surface-dark h-36 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-40 w-40 translate-x-10 -translate-y-10 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-10 translate-y-10 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>

      <div className="page-shell -mt-16 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-xl text-2xl font-semibold flex-shrink-0"
            style={{
              background: "#E6F1FB",
              color: "#0C447C",
              border: "4px solid white",
            }}
          >
            {company.logo ? (
              <Image src={company.logo} alt={company.companyName} className="h-full w-full rounded-xl object-cover" />
            ) : (
              getInitials(company.companyName)
            )}
          </div>
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">{company.companyName}</h1>
              {company.isVerified && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              )}
            </div>
            <p className="mt-1 text-muted-foreground">
              {company.industry} · {company.location || "Bangladesh"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <strong className="text-foreground">{company.companySize || "N/A"}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                <strong className="text-foreground">{company.openJobs}</strong> open jobs
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">Follow</Button>
            <Link href={`/jobs?company=${company.id}`} className="flex-1 sm:flex-none">
              <Button className="w-full gap-2">
                View All Jobs
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-white/60 backdrop-blur-xl overflow-x-auto">
        <div className="page-shell flex gap-4 sm:gap-6 whitespace-nowrap pt-5 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.id === "jobs" && ` (${company.openJobs})`}
            </button>
          ))}
        </div>
      </div>

      <div className="page-shell py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            {activeTab === "overview" && (
              <>
                <Reveal>
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold">About {company.companyName}</h2>
                      <p className="mt-4 leading-7 text-muted-foreground">{company.description}</p>
                    </CardContent>
                  </Card>
                </Reveal>

                <Reveal delay={0.05}>
                  <Card className="mb-6">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold">Company Info</h2>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                          <span className="text-muted-foreground">Industry</span>
                          <span className="font-medium">{company.industry || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border pb-3">
                          <span className="text-muted-foreground">Company size</span>
                          <span className="font-medium">{company.companySize || "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border pb-3">
                          <span className="text-muted-foreground">Headquarters</span>
                          <span className="font-medium">{company.location || "N/A"}</span>
                        </div>
                        {company.companyWebsite && (
                          <div className="flex items-center justify-between border-b border-border pb-3">
                            <span className="text-muted-foreground">Website</span>
                            <a
                              href={company.companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 font-medium text-primary hover:underline"
                            >
                              {company.companyWebsite.replace(/^https?:\/\//, "")}
                              <Globe className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>

                <Reveal delay={0.1}>
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold">Open Positions</h2>
                      <div className="mt-4 space-y-4">
                        {company.jobs.slice(0, 5).map((job) => (
                          <Link
                            key={job.id}
                            href={`/jobs/${job.slug}`}
                            className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                          >
                            <div
                              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
                              style={{ background: "#E6F1FB", color: "#0C447C" }}
                            >
                              {job.title.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{job.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {job.jobType} · {job.location || "N/A"} · {job.experience || "Any level"}
                              </p>
                              <p className="mt-1 text-sm font-medium text-primary">
                                {formatSalary(job.salaryMin, job.salaryMax)}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground">{getTimeAgo(job.postedAt)}</span>
                          </Link>
                        ))}
                        {company.jobs.length > 5 && (
                          <Link
                            href={`/jobs?company=${company.id}`}
                            className="block text-center text-sm font-medium text-primary hover:underline"
                          >
                            View all {company.jobs.length} jobs →
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              </>
            )}

            {activeTab === "jobs" && (
              <Reveal>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold">Open Positions ({company.openJobs})</h2>
                    <div className="mt-4 space-y-4">
                      {company.jobs.map((job) => (
                        <Link
                          key={job.id}
                          href={`/jobs/${job.slug}`}
                          className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                        >
                          <div
                            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-sm font-semibold"
                            style={{ background: "#E6F1FB", color: "#0C447C" }}
                          >
                            {job.title.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{job.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {job.jobType} · {job.location || "N/A"} · {job.experience || "Any level"}
                            </p>
                            <p className="mt-1 text-sm font-medium text-primary">
                              {formatSalary(job.salaryMin, job.salaryMax)}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">{getTimeAgo(job.postedAt)}</span>
                        </Link>
                      ))}
                      {company.jobs.length === 0 && (
                        <p className="text-center py-8 text-muted-foreground">No open positions at the moment.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            )}

            {activeTab === "reviews" && (
              <Reveal>
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold">Employee Reviews</h2>
                    <p className="mt-4 text-center py-8 text-muted-foreground">
                      No reviews yet. Be the first to review {company.companyName}!
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            )}
          </div>

          <div className="space-y-6">
            <Reveal>
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold">Overall Rating</h3>
                  <div className="mt-4 text-center">
                    <p className="text-4xl font-semibold">4.8</p>
                    <div className="mt-2 flex justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < 4 ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Based on reviews</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.05}>
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold">Benefits & Perks</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card className="surface-dark border-primary/20">
                <CardContent className="p-5">
                  <h3 className="text-base font-semibold text-white">Ready to apply?</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {company.companyName} has {company.openJobs} open roles waiting for you.
                  </p>
                  <Link href={`/jobs?company=${company.id}`} className="block mt-4">
                    <Button className="w-full gap-2">
                      Browse All Jobs
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}