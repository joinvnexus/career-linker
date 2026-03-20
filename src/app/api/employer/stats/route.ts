import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { JobStatus, ApplicationStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const employerId = session.user.id;

    const [
      totalJobs,
      activeJobs,
      pendingJobs,
      totalApplicants,
      shortlistedApplicants,
      hires,
      recentJobs,
      recentApplications,
    ] = await Promise.all([
      prisma.job.count({
        where: { employerId },
      }),
      prisma.job.count({
        where: { employerId, status: JobStatus.ACTIVE, published: true },
      }),
      prisma.job.count({
        where: { employerId, status: JobStatus.DRAFT },
      }),
      prisma.jobApplication.count({
        where: {
          job: { employerId },
        },
      }),
      prisma.jobApplication.count({
        where: {
          job: { employerId },
          status: ApplicationStatus.SHORTLISTED,
        },
      }),
      prisma.jobApplication.count({
        where: {
          job: { employerId },
          status: ApplicationStatus.HIRED,
        },
      }),
      prisma.job.findMany({
        where: { employerId },
        select: {
          id: true,
          title: true,
          status: true,
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.jobApplication.findMany({
        where: {
          job: { employerId },
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          seeker: {
            select: {
              name: true,
            },
          },
          job: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      totalJobs,
      activeJobs,
      pendingJobs,
      totalApplicants,
      shortlistedApplicants,
      hires,
      recentJobs: recentJobs.map((job) => ({
        id: job.id,
        title: job.title,
        status: job.status,
        applicants: job._count.applications,
      })),
      recentApplications,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch employer stats" }, { status: 500 });
  }
}
