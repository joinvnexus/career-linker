import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const job = await prisma.job.findUnique({
    where: { id },
    select: { employerId: true },
  })

  if (!job || job.employerId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  await prisma.job.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
