import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { JobStatus, JobType } from "@prisma/client"

const createJobSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(50),
  requirements: z.string().min(20),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryType: z.enum(["Fixed", "Range", "Negotiable"]).optional(),
  location: z.string().min(2),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "REMOTE", "CONTRACT", "INTERNSHIP"]),
  experience: z.enum(["ENTRY", "MID", "SENIOR"]),
  categoryId: z.string(),
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const location = searchParams.get("location") || ""
    const category = searchParams.get("category") || ""
    const jobType = searchParams.get("jobType") || ""

    const where = {
      title: { contains: search, mode: "insensitive" as const },
      location: location ? { contains: location, mode: "insensitive" as const } : undefined,
      categoryId: category || undefined,
      jobType: (jobType as JobType) || undefined,
      published: true,
      status: JobStatus.ACTIVE
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            employerProfile: {
              select: {
                companyName: true
              }
            }
          }
        },
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ jobs })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = createJobSchema.parse(body)

    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    // Check slug uniqueness
    const existing = await prisma.job.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: "Job title already exists" }, { status: 400 })
    }

    const job = await prisma.job.create({
      data: {
        ...data,
        slug,
        employerId: session.user.id as string,
      },
      include: {
        employer: {
          select: {
            employerProfile: {
              select: { companyName: true }
            }
          }
        }
      }
    })

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("[POST_JOB]", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}

