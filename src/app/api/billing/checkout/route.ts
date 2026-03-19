import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const jobId = body?.jobId as string | undefined
    if (!jobId) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 })
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    })
    if (!job || job.employerId !== session.user.id) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }
    if (job.paymentStatus === "PAID") {
      return NextResponse.json({ error: "Job already paid" }, { status: 400 })
    }

    const priceCents = Number(process.env.STRIPE_JOB_POST_PRICE_CENTS || "5000")
    const currency = process.env.STRIPE_CURRENCY || "usd"
    const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency,
            unit_amount: priceCents,
            product_data: {
              name: "Job Post",
              description: job.title,
            },
          },
        },
      ],
      success_url: `${appUrl}/dashboard/employer/jobs?paid=1`,
      cancel_url: `${appUrl}/dashboard/employer/jobs?canceled=1`,
      metadata: {
        jobId: job.id,
        employerId: session.user.id,
      },
      payment_intent_data: {
        metadata: {
          jobId: job.id,
          employerId: session.user.id,
        },
      },
    })

    await prisma.job.update({
      where: { id: job.id },
      data: { stripeSessionId: checkout.id },
    })

    return NextResponse.json({ url: checkout.url })
  } catch (error) {
    console.error("[STRIPE_CHECKOUT]", error)
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
  }
}
