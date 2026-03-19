import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { ApplicationStatus } from "@prisma/client"

const updateSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const application = await prisma.jobApplication.findUnique({
      where: { id: params.id },
      include: { job: true },
    })
    if (!application) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const canEdit =
      session.user.role === "ADMIN" ||
      (session.user.role === "EMPLOYER" &&
        application.job.employerId === session.user.id)
    if (!canEdit) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const data = updateSchema.parse(body)

    const updated = await prisma.jobApplication.update({
      where: { id: application.id },
      data: { status: data.status },
    })

    return NextResponse.json({ application: updated })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("[UPDATE_APPLICATION]", error)
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 })
  }
}
