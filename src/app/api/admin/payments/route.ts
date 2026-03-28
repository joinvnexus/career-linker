import { PaymentStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const priceCents = Number(process.env.STRIPE_JOB_POST_PRICE_CENTS || "5000");
const currency = (process.env.STRIPE_CURRENCY || "usd").toUpperCase();

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await prisma.job.findMany({
      select: {
        id: true,
        title: true,
        paymentStatus: true,
        stripeSessionId: true,
        paymentIntentId: true,
        paidAt: true,
        createdAt: true,
        employer: {
          select: {
            name: true,
            email: true,
            employerProfile: {
              select: {
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
    });

    const payments = jobs.map((job) => ({
      id: job.id,
      jobTitle: job.title,
      companyName: job.employer.employerProfile?.companyName || job.employer.name || "Company",
      ownerEmail: job.employer.email || "No email",
      status: job.paymentStatus,
      amountCents: priceCents,
      currency,
      stripeSessionId: job.stripeSessionId,
      paymentIntentId: job.paymentIntentId,
      paidAt: job.paidAt,
      createdAt: job.createdAt,
    }));

    const paidCount = payments.filter((payment) => payment.status === PaymentStatus.PAID).length;
    const failedCount = payments.filter((payment) => payment.status === PaymentStatus.FAILED).length;
    const unpaidCount = payments.filter((payment) => payment.status === PaymentStatus.UNPAID).length;

    return NextResponse.json({
      summary: {
        paidCount,
        failedCount,
        unpaidCount,
        totalCount: payments.length,
        paidRevenueCents: paidCount * priceCents,
        pendingRevenueCents: unpaidCount * priceCents,
        currency,
      },
      payments,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}
