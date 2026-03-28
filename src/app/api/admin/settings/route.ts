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

    const [pendingJobs, activeJobs, admins, failedPayments, hiredApplications] =
      await Promise.all([
        prisma.job.count({ where: { status: JobStatus.PENDING } }),
        prisma.job.count({ where: { status: JobStatus.ACTIVE, published: true } }),
        prisma.user.count({ where: { role: Role.ADMIN } }),
        prisma.job.count({ where: { paymentStatus: "FAILED" } }),
        prisma.jobApplication.count({ where: { status: ApplicationStatus.HIRED } }),
      ]);

    const stripePriceCents = Number(process.env.STRIPE_JOB_POST_PRICE_CENTS || "5000");
    const stripeCurrency = (process.env.STRIPE_CURRENCY || "usd").toUpperCase();

    return NextResponse.json({
      moderation: {
        pendingJobs,
        activeJobs,
        suggestedSlaHours: pendingJobs > 10 ? 12 : 24,
      },
      access: {
        adminSeats: admins,
        oauthProvidersEnabled: Number(Boolean(process.env.GOOGLE_CLIENT_ID)) +
          Number(Boolean(process.env.GITHUB_ID)),
        nextAuthConfigured: Boolean(process.env.NEXTAUTH_SECRET),
      },
      alerts: {
        failedPayments,
        hiredApplications,
        queueSpikeThreshold: 10,
      },
      platform: {
        stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
        billingWebhookConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
        uploadsConfigured: Boolean(process.env.UPLOADTHING_SECRET),
        emailConfigured: Boolean(process.env.EMAIL_SERVER_HOST),
        jobPostPriceCents: stripePriceCents,
        currency: stripeCurrency,
        appUrl: process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch admin settings" }, { status: 500 });
  }
}
