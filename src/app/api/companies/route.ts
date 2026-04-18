import { JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    // Get top companies with their activity data
    const employers = await prisma.user.findMany({
      where: { role: "EMPLOYER" },
      select: {
        id: true,
        name: true,
        employerProfile: {
          select: {
            companyName: true,
            companyWebsite: true,
            companySize: true,
            industry: true,
            location: true,
            companyLogo: true,
            isVerified: true,
          },
        },
        jobs: {
          where: { status: JobStatus.ACTIVE, published: true },
          select: {
            id: true,
            createdAt: true,
            jobType: true,
            salaryMin: true,
            salaryMax: true,
          },
        },
        _count: {
          select: {
            jobs: {
              where: { status: JobStatus.ACTIVE, published: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 12, // Limit to top companies
    });

    const companies = employers.map((employer) => {
      const activeJobs = employer.jobs.length;
      const remoteJobs = employer.jobs.filter(job => job.jobType === "REMOTE").length;
      const hybridJobs = employer.jobs.filter(job => job.jobType === "FULL_TIME").length;
      const avgSalary = employer.jobs.length > 0
        ? employer.jobs.reduce((sum, job) => sum + ((job.salaryMin || 0) + (job.salaryMax || 0)) / 2, 0) / employer.jobs.length
        : 0;

      // Determine company category based on their activity
      const getCompanyCategory = () => {
        if (remoteJobs > activeJobs * 0.5) return "remote";
        if (hybridJobs > activeJobs * 0.3) return "growth";
        if (avgSalary > 80000) return "product";
        return "creative";
      };

      const tag = getCompanyCategory();
      const companyName = employer.employerProfile?.companyName || employer.name || "Company";

      return {
        id: employer.id,
        companyName,
        tag,
        label: getCategoryLabel(tag),
        summary: getCategorySummary(tag, activeJobs, employer.employerProfile?.industry),
        signal: getCompanySignal(employer.employerProfile?.location, remoteJobs > 0),
        roleCount: `${activeJobs}+`,
        accentClass: getAccentClass(tag),
        iconBg: getIconBg(tag),
        iconName: getIconName(tag),
        iconColor: getIconColor(tag),
        location: employer.employerProfile?.location,
        industry: employer.employerProfile?.industry,
        companySize: employer.employerProfile?.companySize,
        isVerified: employer.employerProfile?.isVerified ?? false,
      };
    });

    return NextResponse.json({ companies });
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

function getCategoryLabel(tag: string): string {
  switch (tag) {
    case "product": return "Product-led";
    case "growth": return "Growth-driven";
    case "creative": return "Creative systems";
    case "remote": return "Remote-first";
    default: return "General";
  }
}

function getCategorySummary(tag: string, jobCount: number, industry?: string | null): string {
  const baseSummary = `Active employer with ${jobCount} open positions`;
  const industryText = industry ? ` in ${industry}` : "";

  switch (tag) {
    case "product":
      return `Building innovative products${industryText}. ${baseSummary}.`;
    case "growth":
      return `Scaling rapidly${industryText}. ${baseSummary}.`;
    case "creative":
      return `Creative and design-focused${industryText}. ${baseSummary}.`;
    case "remote":
      return `Remote-first culture${industryText}. ${baseSummary}.`;
    default:
      return baseSummary + industryText + ".";
  }
}

function getCompanySignal(location?: string | null, hasRemote?: boolean): string {
  if (hasRemote) return "Remote friendly";
  if (location) return location;
  return "Global teams";
}

function getAccentClass(tag: string): string {
  switch (tag) {
    case "product": return "bg-blue-500";
    case "growth": return "bg-emerald-500";
    case "creative": return "bg-orange-500";
    case "remote": return "bg-purple-500";
    default: return "bg-slate-500";
  }
}

function getIconBg(tag: string): string {
  switch (tag) {
    case "product": return "bg-blue-50";
    case "growth": return "bg-emerald-50";
    case "creative": return "bg-orange-50";
    case "remote": return "bg-purple-50";
    default: return "bg-slate-50";
  }
}

function getIconColor(tag: string): string {
  switch (tag) {
    case "product": return "text-blue-500";
    case "growth": return "text-emerald-500";
    case "creative": return "text-orange-500";
    case "remote": return "text-purple-500";
    default: return "text-slate-500";
  }
}

function getIconName(tag: string): string {
  switch (tag) {
    case "product": return "Globe2";
    case "growth": return "TrendingUp";
    case "creative": return "Sparkles";
    case "remote": return "Users2";
    default: return "Globe2";
  }
}