import { ApplicationStatus, JobStatus, Role } from "@prisma/client";
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

    const [
      totalUsers,
      jobSeekers,
      employers,
      admins,
      totalJobs,
      pendingJobs,
      activeJobs,
      rejectedJobs,
      totalApplications,
      hiredApplications,
      recentUsers,
      recentJobs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.JOB_SEEKER } }),
      prisma.user.count({ where: { role: Role.EMPLOYER } }),
      prisma.user.count({ where: { role: Role.ADMIN } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: JobStatus.PENDING } }),
      prisma.job.count({ where: { status: JobStatus.ACTIVE, published: true } }),
      prisma.job.count({ where: { status: JobStatus.REJECTED } }),
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: ApplicationStatus.HIRED } }),
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.job.findMany({
        select: {
          id: true,
          title: true,
          status: true,
          createdAt: true,
          employer: {
            select: {
              name: true,
              employerProfile: { select: { companyName: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      roleBreakdown: {
        jobSeekers,
        employers,
        admins,
      },
      jobs: {
        total: totalJobs,
        pending: pendingJobs,
        active: activeJobs,
        rejected: rejectedJobs,
      },
      applications: {
        total: totalApplications,
        hired: hiredApplications,
      },
      recentUsers,
      recentJobs,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
