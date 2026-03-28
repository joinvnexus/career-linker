import { ApplicationStatus, JobStatus, PaymentStatus, Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short" });
}

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalUsers,
      employers,
      jobSeekers,
      admins,
      totalJobs,
      activeJobs,
      pendingJobs,
      rejectedJobs,
      totalApplications,
      hiredApplications,
      shortlistedApplications,
      interviewApplications,
      paidJobs,
      failedPayments,
      unpaidJobs,
      categories,
      users,
      jobs,
      applications,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.EMPLOYER } }),
      prisma.user.count({ where: { role: Role.JOB_SEEKER } }),
      prisma.user.count({ where: { role: Role.ADMIN } }),
      prisma.job.count(),
      prisma.job.count({ where: { status: JobStatus.ACTIVE, published: true } }),
      prisma.job.count({ where: { status: JobStatus.PENDING } }),
      prisma.job.count({ where: { status: JobStatus.REJECTED } }),
      prisma.jobApplication.count(),
      prisma.jobApplication.count({ where: { status: ApplicationStatus.HIRED } }),
      prisma.jobApplication.count({ where: { status: ApplicationStatus.SHORTLISTED } }),
      prisma.jobApplication.count({ where: { status: ApplicationStatus.INTERVIEW } }),
      prisma.job.count({ where: { paymentStatus: PaymentStatus.PAID } }),
      prisma.job.count({ where: { paymentStatus: PaymentStatus.FAILED } }),
      prisma.job.count({ where: { paymentStatus: PaymentStatus.UNPAID } }),
      prisma.jobCategory.findMany({
        select: {
          name: true,
          _count: {
            select: { jobs: true },
          },
        },
        orderBy: {
          jobs: {
            _count: "desc",
          },
        },
        take: 5,
      }),
      prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.job.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
      prisma.jobApplication.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
      }),
    ]);

    const trendMap = new Map<string, { label: string; users: number; jobs: number; applications: number }>();
    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trendMap.set(monthKey(date), {
        label: monthLabel(date),
        users: 0,
        jobs: 0,
        applications: 0,
      });
    }

    users.forEach((user) => {
      const key = monthKey(user.createdAt);
      const bucket = trendMap.get(key);
      if (bucket) {
        bucket.users += 1;
      }
    });

    jobs.forEach((job) => {
      const key = monthKey(job.createdAt);
      const bucket = trendMap.get(key);
      if (bucket) {
        bucket.jobs += 1;
      }
    });

    applications.forEach((application) => {
      const key = monthKey(application.createdAt);
      const bucket = trendMap.get(key);
      if (bucket) {
        bucket.applications += 1;
      }
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        employers,
        jobSeekers,
        admins,
        totalJobs,
        activeJobs,
        pendingJobs,
        rejectedJobs,
        totalApplications,
        hiredApplications,
      },
      funnel: {
        shortlistedApplications,
        interviewApplications,
        hiredApplications,
      },
      payments: {
        paidJobs,
        failedPayments,
        unpaidJobs,
      },
      categories: categories.map((category) => ({
        name: category.name,
        jobs: category._count.jobs,
      })),
      trends: Array.from(trendMap.values()),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch admin reports" }, { status: 500 });
  }
}
