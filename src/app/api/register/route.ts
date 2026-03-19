import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import * as z from "zod"
import { Role } from "@prisma/client"

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum([Role.JOB_SEEKER, Role.EMPLOYER]),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, role } = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        role,
      }
    })

    // Create profile stub
    if (role === "JOB_SEEKER") {
      await prisma.jobSeekerProfile.create({
        data: { userId: user.id }
      })
    } else {
      await prisma.employerProfile.create({
        data: { 
          userId: user.id,
          companyName: `${name}'s Company`
        }
      })
    }

    return NextResponse.json({ success: true, userId: user.id })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data" },
        { status: 400 }
      )
    }
    console.error("[REGISTER]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

