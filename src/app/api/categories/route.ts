import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Assuming lib/prisma.ts exists from auth setup

export async function GET() {
  try {
    const categories = await prisma.jobCategory.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

