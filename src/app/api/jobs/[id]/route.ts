import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const updateJobSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(50).optional(),
  requirements: z.string().min(20).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryType: z.enum(["Fixed", "Range", "Negotiable"]).optional(),
  location: z.string().min(2).optional(),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "REMOTE", "CONTRACT", "INTERNSHIP"]).optional(),
  experience: z.enum(["ENTRY", "MID", "SENIOR"]).optional(),
  categoryId: z.string().optional(),
  published: z.boolean().optional(),
  applicationDeadline: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);
    const job = await prisma.job.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            employerProfile: true,
          },
        },
        category: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const canSeeApplications =
      !!session?.user?.id &&
      (session.user.role === "ADMIN" ||
        (session.user.role === "EMPLOYER" && job.employerId === session.user.id));

    const applications = canSeeApplications
      ? await prisma.jobApplication.findMany({
          where: { jobId: job.id },
          include: {
            seeker: {
              select: {
                id: true,
                name: true,
                jobSeekerProfile: true,
              },
            },
          },
          take: 5,
          orderBy: { createdAt: "desc" },
        })
      : undefined;

    return NextResponse.json({ job: { ...job, applications } });
  } catch {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
    });

    if (!job || job.employerId !== session.user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const data = updateJobSchema.parse(body);

    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "EMPLOYER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
    });

    if (!job || job.employerId !== session.user.id) {
      return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
    }

    await prisma.job.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
