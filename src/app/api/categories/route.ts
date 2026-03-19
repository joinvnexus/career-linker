import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const defaultCategories = [
  "General",
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Customer Support",
]

export async function GET() {
  let categories = await prisma.jobCategory.findMany({
    orderBy: { name: "asc" },
  })

  if (categories.length === 0) {
    await prisma.jobCategory.createMany({
      data: defaultCategories.map((name) => ({
        name,
        slug: slugify(name),
      })),
      skipDuplicates: true,
    })

    categories = await prisma.jobCategory.findMany({
      orderBy: { name: "asc" },
    })
  }

  return NextResponse.json({ categories })
}
