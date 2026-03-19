import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { JobStatus } from "@prisma/client"

const updateSchema = z.object({
  status: z.nativeEnum(JobStatus),
  published: z.boolean().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = updateSchema.parse(body)

    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        status: data.status,
        published: data.published ?? (data.status === "ACTIVE"),
      },
    })

    return NextResponse.json({ job })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("[ADMIN_JOB_UPDATE]", error)
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 })
  }
}
