"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Building2,
  BriefcaseBusiness,
  Download,
  MapPin,
  Search,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type AdminCompany = {
  id: string;
  ownerName?: string | null;
  ownerEmail: string;
  createdAt: string;
  companyName: string;
  companyWebsite?: string | null;
  companySize?: string | null;
  industry?: string | null;
  location?: string | null;
  companyLogo?: string | null;
  isVerified: boolean;
  totalJobs: number;
  activeJobs: number;
  pendingJobs: number;
  totalApplications: number;
  latestJobAt?: string | null;
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  useEffect(() => {
    const loadCompanies = async (): Promise<void> => {
      try {
        const response = await fetch("/api/admin/companies");
        const data = (await response.json()) as { companies?: AdminCompany[]; error?: string };

        if (!response.ok) {
          toast.error(data.error || "Failed to load companies");
          return;
        }

        setCompanies(data.companies ?? []);
      } catch {
        toast.error("Failed to load companies");
      } finally {
        setLoading(false);
      }
    };

    void loadCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.industry || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (company.location || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVerification =
        verificationFilter === "ALL" ||
        (verificationFilter === "VERIFIED" && company.isVerified) ||
        (verificationFilter === "UNVERIFIED" && !company.isVerified);

      return matchesSearch && matchesVerification;
    });
  }, [companies, searchQuery, verificationFilter]);

  const verifiedCount = companies.filter((company) => company.isVerified).length;
  const totalLiveJobs = companies.reduce((sum, company) => sum + company.activeJobs, 0);
  const totalPendingJobs = companies.reduce((sum, company) => sum + company.pendingJobs, 0);

  const downloadCsv = (rows: string[][], fileName: string): void => {
    const csvContent = rows
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const toggleVerification = async (companyId: string, isVerified: boolean): Promise<void> => {
    try {
      setUpdatingId(companyId);

      const response = await fetch(`/api/admin/companies/${companyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error || "Failed to update company");
        return;
      }

      setCompanies((current) =>
        current.map((company) =>
          company.id === companyId ? { ...company, isVerified } : company
        )
      );
      toast.success(isVerified ? "Company verified" : "Company moved back to review");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExport = (): void => {
    downloadCsv(
      [
        [
          "Company",
          "Owner",
          "Email",
          "Verified",
          "Industry",
          "Location",
          "Company Size",
          "Active Jobs",
          "Pending Jobs",
          "Applications",
          "Website",
          "Joined",
        ],
        ...filteredCompanies.map((company) => [
          company.companyName,
          company.ownerName || "Employer owner",
          company.ownerEmail,
          company.isVerified ? "Yes" : "No",
          company.industry || "",
          company.location || "",
          company.companySize || "",
          String(company.activeJobs),
          String(company.pendingJobs),
          String(company.totalApplications),
          company.companyWebsite || "",
          new Date(company.createdAt).toLocaleDateString(),
        ]),
      ],
      "admin-companies-export.csv"
    );
    toast.success("Company export downloaded");
  };

  const handleBulkVerify = async (): Promise<void> => {
    const targets = filteredCompanies.filter((company) => !company.isVerified);

    if (targets.length === 0) {
      toast.message("No unverified companies in the current view");
      return;
    }

    try {
      setBulkUpdating(true);

      const results = await Promise.all(
        targets.map((company) =>
          fetch(`/api/admin/companies/${company.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isVerified: true }),
          })
        )
      );

      const failed = results.filter((response) => !response.ok).length;

      if (failed > 0) {
        toast.error(`${failed} company updates failed`);
      }

      setCompanies((current) =>
        current.map((company) =>
          targets.some((target) => target.id === company.id)
            ? { ...company, isVerified: true }
            : company
        )
      );
      toast.success(`${targets.length - failed} companies verified`);
    } catch {
      toast.error("Bulk verification failed");
    } finally {
      setBulkUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 w-full rounded-[28px]" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-36 w-full rounded-[24px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,#172554_0%,#1d4ed8_50%,#0f172a_100%)] p-6 text-white shadow-[0_28px_90px_-54px_rgba(15,23,42,0.85)] sm:p-8">
        <Badge className="rounded-full border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-100 hover:bg-white/10">
          Company Accounts
        </Badge>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Moderate real company profiles, not just employer user accounts.
            </h1>
            <p className="mt-3 text-sm text-slate-200 sm:text-base">
              Review verification state, watch job volume, and spot marketplace risk
              from one responsive company oversight surface.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[28rem]">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Companies</p>
              <p className="mt-2 text-2xl font-semibold">{companies.length}</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Verified</p>
              <p className="mt-2 text-2xl font-semibold">{verifiedCount}</p>
            </div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Pending review</p>
              <p className="mt-2 text-2xl font-semibold">{companies.length - verifiedCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatsCard
          title="Verified Companies"
          value={verifiedCount}
          change={`${companies.length - verifiedCount} still in review`}
          trend="up"
          icon={<BadgeCheck className="h-7 w-7" />}
        />
        <StatsCard
          title="Live Jobs"
          value={totalLiveJobs}
          change={`${totalPendingJobs} waiting approval`}
          trend={totalPendingJobs > 0 ? "down" : "neutral"}
          icon={<BriefcaseBusiness className="h-7 w-7" />}
        />
        <StatsCard
          title="Company Profiles"
          value={companies.length}
          change="Backed by employer profiles"
          trend="neutral"
          icon={<Building2 className="h-7 w-7" />}
        />
      </div>

      <Card className="rounded-[28px] border border-white/70 bg-white/85 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.45)]">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-xl text-slate-950">Company Directory</CardTitle>
            <p className="text-sm text-slate-500">
              Search and filter by company profile, verification state, or operational signal.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 lg:w-auto">
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={handleExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button
                className="rounded-full"
                onClick={() => void handleBulkVerify()}
                disabled={bulkUpdating}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                {bulkUpdating ? "Verifying..." : "Verify Filtered"}
              </Button>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <div className="relative min-w-[16rem]">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search company, email, industry..."
                className="h-11 rounded-full border-slate-300 bg-white pl-10"
              />
            </div>
            <Select value={verificationFilter} onValueChange={setVerificationFilter}>
              <SelectTrigger className="h-11 w-full rounded-full border-slate-300 bg-white sm:w-48">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All companies</SelectItem>
                <SelectItem value="VERIFIED">Verified only</SelectItem>
                <SelectItem value="UNVERIFIED">Needs review</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredCompanies.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              No companies matched the current filters.
            </div>
          ) : (
            filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="flex flex-col gap-5 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-slate-900">{company.companyName}</p>
                      <Badge
                        variant={company.isVerified ? "success" : "secondary"}
                        className="rounded-full px-3 py-1"
                      >
                        {company.isVerified ? "Verified" : "Needs review"}
                      </Badge>
                      {company.industry ? (
                        <Badge variant="outline" className="rounded-full px-3 py-1">
                          {company.industry}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>{company.ownerName || "Employer owner"}</span>
                      <span>{company.ownerEmail}</span>
                      {company.location ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {company.location}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>{company.totalJobs} total jobs</span>
                      <span>{company.activeJobs} active</span>
                      <span>{company.pendingJobs} pending</span>
                      <span>{company.totalApplications} applications</span>
                      <span>Joined {new Date(company.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      className="rounded-full"
                      variant={company.isVerified ? "outline" : "default"}
                      disabled={updatingId === company.id}
                      onClick={() => void toggleVerification(company.id, !company.isVerified)}
                    >
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      {company.isVerified ? "Move To Review" : "Verify Company"}
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Company size</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {company.companySize || "Not provided"}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Website</p>
                    <p className="mt-2 truncate text-sm font-medium text-slate-900">
                      {company.companyWebsite || "Not provided"}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Latest job</p>
                    <p className="mt-2 text-sm font-medium text-slate-900">
                      {company.latestJobAt
                        ? new Date(company.latestJobAt).toLocaleDateString()
                        : "No jobs yet"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
