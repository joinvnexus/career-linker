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
  categoryId: z.string().min(1).optional(),
})

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function getUniqueSlug(base: string) {
  let slug = slugify(base)
  if (!slug) slug = "job"
  let suffix = 2
  while (await prisma.job.findUnique({ where: { slug } })) {
    slug = `${slugify(base)}-${suffix}`
    suffix += 1
  }
  return slug
}

async function getOrCreateDefaultCategoryId() {
  const existing = await prisma.jobCategory.findUnique({
    where: { slug: "general" },
  })
  if (existing) return existing.id

  const created = await prisma.jobCategory.create({
    data: { name: "General", slug: "general" },
  })
  return created.id
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("slug") || ""
    const search = searchParams.get("search") || ""
    const location = searchParams.get("location") || ""
    const category = searchParams.get("category") || ""
    const jobType = searchParams.get("jobType") || ""
    const experience = searchParams.get("experience") || ""
    const salaryMin = Number(searchParams.get("salaryMin") || "0")
    const includeApplications = searchParams.get("includeApplications") === "1"
    const page = Math.max(Number(searchParams.get("page") || "1"), 1)
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || "12"), 1), 50)

    const where = {
      slug: slug || undefined,
      OR: search
        ? [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ]
        : undefined,
      location: location ? { contains: location, mode: "insensitive" as const } : undefined,
      categoryId: category || undefined,
      jobType: (jobType as JobType) || undefined,
      experience: experience || undefined,
      salaryMin: salaryMin > 0 ? { gte: salaryMin } : undefined,
      published: true,
      status: JobStatus.ACTIVE,
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          employer: {
            select: {
              id: true,
              name: true,
              employerProfile: {
                select: {
                  companyName: true,
                },
              },
            },
          },
          category: {
            select: {
              name: true,
            },
          },
          applications: includeApplications
            ? {
                take: 5,
                orderBy: { createdAt: "desc" as const },
                include: {
                  seeker: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              }
            : false,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ])

    return NextResponse.json({ jobs, total, page, pageSize: limit })
  } catch {
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

    if (data.salaryMin && data.salaryMax && data.salaryMin > data.salaryMax) {
      return NextResponse.json(
        { error: "Minimum salary cannot exceed maximum salary" },
        { status: 400 }
      )
    }

    const categoryId = data.categoryId || (await getOrCreateDefaultCategoryId())
    const slug = await getUniqueSlug(data.title)

    const job = await prisma.job.create({
      data: {
        ...data,
        categoryId,
        slug,
        employerId: session.user.id as string,
        status: "DRAFT",
        published: false,
        paymentStatus: "UNPAID",
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

    return NextResponse.json({ job, paymentRequired: true }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("[POST_JOB]", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}

