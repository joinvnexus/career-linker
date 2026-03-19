import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { JobStatus } from "@prisma/client"

const optionalString = (schema: z.ZodString) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional())

const applySchema = z.object({
  jobId: z.string().min(1),
  resumeUrl: optionalString(z.string().url()),
  coverLetter: optionalString(z.string().max(4000)),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "JOB_SEEKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = applySchema.parse(body)

    const job = await prisma.job.findUnique({
      where: { id: data.jobId },
    })
    if (!job || job.status !== JobStatus.ACTIVE || !job.published) {
      return NextResponse.json({ error: "Job not available" }, { status: 404 })
    }

    const existing = await prisma.jobApplication.findUnique({
      where: {
        jobId_seekerId: {
          jobId: data.jobId,
          seekerId: session.user.id,
        },
      },
    })
    if (existing) {
      return NextResponse.json(
        { error: "You already applied to this job" },
        { status: 400 }
      )
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId: data.jobId,
        seekerId: session.user.id,
        resumeUrl: data.resumeUrl,
        coverLetter: data.coverLetter,
      },
    })

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("[APPLY_JOB]", error)
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 })
  }
}
