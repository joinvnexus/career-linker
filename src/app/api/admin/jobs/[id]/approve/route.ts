import { JobStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const approvalSchema = z.object({
  approved: z.boolean().default(true),
});

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { approved } = approvalSchema.parse(body);

    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        status: approved ? JobStatus.ACTIVE : JobStatus.REJECTED,
        published: approved,
      },
      select: {
        id: true,
        title: true,
        status: true,
        published: true,
      },
    });

    return NextResponse.json({ job });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to update job approval" }, { status: 500 });
  }
}
