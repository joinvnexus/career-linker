import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.jobCategory.findMany({
      include: {
        _count: {
          select: { jobs: { where: { published: true, status: "ACTIVE" } } },
        },
      },
      orderBy: { name: "asc" },
    });

    const categoriesWithCount = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      jobCount: cat._count.jobs,
    }));

    return NextResponse.json({ categories: categoriesWithCount });
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
