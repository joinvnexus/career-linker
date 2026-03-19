import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const optionalString = (schema: z.ZodString) =>
  z.preprocess((value) => (value === "" ? undefined : value), schema.optional())

const updateSchema = z.object({
  companyName: optionalString(z.string().min(2).max(120)),
  companyWebsite: optionalString(z.string().url()),
  companySize: optionalString(z.string().min(1).max(50)),
  industry: optionalString(z.string().min(2).max(80)),
  location: optionalString(z.string().min(2).max(120)),
  companyLogo: optionalString(z.string().url()),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "EMPLOYER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const profile = await prisma.employerProfile.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json({ profile })
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const data = updateSchema.parse(body)

    const profile = await prisma.employerProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        companyName: data.companyName || "Company",
        ...data,
      },
      update: { ...data },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error("[EMPLOYER_PROFILE]", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
