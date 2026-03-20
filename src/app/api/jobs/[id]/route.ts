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
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            employerProfile: true,
          },
        },
        category: true,
        applications: {
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
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}

