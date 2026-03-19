import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "JOB_SEEKER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const applications = await prisma.jobApplication.findMany({
    where: { seekerId: session.user.id },
    include: {
      job: {
        select: {
          id: true,
          slug: true,
          title: true,
          location: true,
          createdAt: true,
          employer: {
            select: {
              id: true,
              name: true,
              employerProfile: { select: { companyName: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ applications })
}
