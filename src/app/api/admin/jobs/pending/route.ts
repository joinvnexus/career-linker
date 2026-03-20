import { JobStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobs = await prisma.job.findMany({
      where: { status: JobStatus.PENDING },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            email: true,
            employerProfile: { select: { companyName: true, isVerified: true } },
          },
        },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs });
  } catch {
    return NextResponse.json({ error: "Failed to fetch pending jobs" }, { status: 500 });
  }
}
