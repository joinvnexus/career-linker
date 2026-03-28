import { JobStatus, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employers = await prisma.user.findMany({
      where: { role: Role.EMPLOYER },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
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
          select: {
            id: true,
            status: true,
            createdAt: true,
            _count: {
              select: {
                applications: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const companies = employers.map((employer) => {
      const totalJobs = employer.jobs.length;
      const activeJobs = employer.jobs.filter((job) => job.status === JobStatus.ACTIVE).length;
      const pendingJobs = employer.jobs.filter((job) => job.status === JobStatus.PENDING).length;
      const totalApplications = employer.jobs.reduce(
        (sum, job) => sum + job._count.applications,
        0
      );
      const latestJob = employer.jobs.reduce<Date | null>(
        (latest, job) =>
          !latest || job.createdAt.getTime() > latest.getTime() ? job.createdAt : latest,
        null
      );

      return {
        id: employer.id,
        ownerName: employer.name,
        ownerEmail: employer.email,
        createdAt: employer.createdAt,
        companyName: employer.employerProfile?.companyName || employer.name || "Company",
        companyWebsite: employer.employerProfile?.companyWebsite || null,
        companySize: employer.employerProfile?.companySize || null,
        industry: employer.employerProfile?.industry || null,
        location: employer.employerProfile?.location || null,
        companyLogo: employer.employerProfile?.companyLogo || null,
        isVerified: employer.employerProfile?.isVerified ?? false,
        totalJobs,
        activeJobs,
        pendingJobs,
        totalApplications,
        latestJobAt: latestJob,
      };
    });

    return NextResponse.json({ companies });
  } catch {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}
