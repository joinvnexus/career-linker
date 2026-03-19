import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { JobStatus } from "@prisma/client"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status") || ""

  const jobs = await prisma.job.findMany({
    where: {
      status: status ? (status as JobStatus) : undefined,
    },
    include: {
      employer: {
        select: {
          id: true,
          name: true,
          email: true,
          employerProfile: { select: { companyName: true } },
        },
      },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ jobs })
}
