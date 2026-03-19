import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get("jobId") || undefined

  const applications = await prisma.jobApplication.findMany({
    where: {
      ...(jobId ? { jobId } : {}),
      job: {
        employerId: session.user.id,
      },
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
      seeker: {
        select: {
          id: true,
          name: true,
          email: true,
          jobSeekerProfile: {
            select: {
              headline: true,
              location: true,
              resumeUrl: true,
              phone: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ applications })
}
