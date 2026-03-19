import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature")
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature" }, { status: 400 })
  }

  const payload = await req.text()
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err) {
    console.error("[STRIPE_WEBHOOK]", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const jobId = session.metadata?.jobId
    const paymentIntentId = session.payment_intent as string | null

    if (jobId) {
      await prisma.job.update({
        where: { id: jobId },
        data: {
          paymentStatus: "PAID",
          status: "ACTIVE",
          published: true,
          paymentIntentId: paymentIntentId || undefined,
          paidAt: new Date(),
          stripeSessionId: session.id,
        },
      })
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent
    const jobId = intent.metadata?.jobId
    if (jobId) {
      await prisma.job.update({
        where: { id: jobId },
        data: { paymentStatus: "FAILED" },
      })
    }
  }

  return NextResponse.json({ received: true })
}
