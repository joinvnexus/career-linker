import { JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;

    const employer = await prisma.user.findUnique({
      where: { id, role: "EMPLOYER" },
      include: {
        employerProfile: true,
        jobs: {
          where: { status: JobStatus.ACTIVE, published: true },
          include: {
            category: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!employer) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const activeJobs = employer.jobs.length;
    const companyName = employer.employerProfile?.companyName || employer.name || "Company";
    const industry = employer.employerProfile?.industry;
    const location = employer.employerProfile?.location;

    const company = {
      id: employer.id,
      companyName,
      description: `Welcome to ${companyName}. We are a leading employer in ${industry || "Bangladesh"} looking for talented individuals to join our team.`,
      industry,
      location,
      companySize: employer.employerProfile?.companySize,
      companyWebsite: employer.employerProfile?.companyWebsite,
      isVerified: employer.employerProfile?.isVerified ?? false,
      foundedYear: null,
      logo: employer.employerProfile?.companyLogo,
      openJobs: activeJobs,
      jobs: employer.jobs.map((job) => ({
        id: job.id,
        title: job.title,
        slug: job.slug,
        jobType: job.jobType,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryType: job.salaryType,
        location: job.location,
        experience: job.experience,
        category: job.category?.name,
        postedAt: job.createdAt.toISOString(),
      })),
      createdAt: employer.createdAt.toISOString(),
    };

    return NextResponse.json({ company });
  } catch (error) {
    console.error("Failed to fetch company:", error);
    return NextResponse.json({ error: "Failed to fetch company" }, { status: 500 });
  }
}