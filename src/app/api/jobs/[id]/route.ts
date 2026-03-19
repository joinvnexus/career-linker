import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { JobStatus } from "@prisma/client"

const updateJobSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(50).optional(),
  requirements: z.string().min(20).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryType: z.enum(["Fixed", "Range", "Negotiable"]).optional(),
  location: z.string().min(2).optional(),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "REMOTE", "CONTRACT", "INTERNSHIP"]).optional(),
  experience: z.enum(["ENTRY", "MID", "SENIOR"]).optional(),
  categoryId: z.string().min(1).optional(),
  status: z.nativeEnum(JobStatus).optional(),
  published: z.boolean().optional(),
  applicationDeadline: z.string().datetime().optional(),
})

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function getUniqueSlug(base: string, currentId: string) {
  let slug = slugify(base)
  if (!slug) slug = "job"
  let suffix = 2
  while (
    await prisma.job.findFirst({
      where: { slug, NOT: { id: currentId } },
    })
  ) {
    slug = `${slugify(base)}-${suffix}`
    suffix += 1
  }
  return slug
}

async function requireEmployerJob(id: string, userId: string, isAdmin: boolean) {
  const job = await prisma.job.findUnique({ where: { id } })
  if (!job) return null
  if (isAdmin || job.employerId === userId) return job
  return null
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const job = await requireEmployerJob(
    params.id,
    session.user.id,
    session.user.role === "ADMIN"
  )
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ job })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const existing = await requireEmployerJob(
      params.id,
      session.user.id,
      session.user.role === "ADMIN"
    )
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const body = await req.json()
    const data = updateJobSchema.parse(body)

    if (data.salaryMin && data.salaryMax && data.salaryMin > data.salaryMax) {
      return NextResponse.json(
        { error: "Minimum salary cannot exceed maximum salary" },
        { status: 400 }
      )
    }

    let slug: string | undefined
    if (data.title && data.title !== existing.title) {
      slug = await getUniqueSlug(data.title, existing.id)
    }

    const job = await prisma.job.update({
      where: { id: existing.id },
      data: {
        ...data,
        ...(slug ? { slug } : {}),
        ...(data.applicationDeadline
          ? { applicationDeadline: new Date(data.applicationDeadline) }
          : {}),
      },
    })

    return NextResponse.json({ job })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("[UPDATE_JOB]", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const job = await requireEmployerJob(
    params.id,
    session.user.id,
    session.user.role === "ADMIN"
  )
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.job.delete({ where: { id: job.id } })
  return NextResponse.json({ success: true })
}
