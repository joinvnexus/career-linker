import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendApplicationReceivedEmail } from "@/lib/email";
import { z } from "zod";

const applySchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().optional(),
  resumeUrl: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url,);
    const myApplied = searchParams.get("myApplied");
    const jobId = searchParams.get("jobId");

    if (myApplied && session.user.role === "JOB_SEEKER") {
      const applications = await prisma.jobApplication.findMany({
        where: { seekerId: session.user.id as string },
        include: {
          job: {
            include: {
              employer: {
                select: {
                  employerProfile: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ applications });
    }

    if (jobId && session.user.role === "EMPLOYER") {
      const applications = await prisma.jobApplication.findMany({
        where: { jobId },
        include: {
          seeker: {
            select: {
              id: true,
              name: true,
              email: true,
              jobSeekerProfile: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ applications });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "JOB_SEEKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = applySchema.parse(body);

    const existing = await prisma.jobApplication.findUnique({
      where: {
        jobId_seekerId: {
          jobId: data.jobId,
          seekerId: session.user.id as string,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Already applied" }, { status: 400 });
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId: data.jobId,
        seekerId: session.user.id as string,
        coverLetter: data.coverLetter,
        resumeUrl: data.resumeUrl || "",
      },
      include: {
        job: {
          include: {
            employer: true,
          },
        },
      },
    });

    const employerEmail = application.job.employer.email;
    if (employerEmail) {
      void sendApplicationReceivedEmail({
        applicantName: session.user.name || session.user.email || "A candidate",
        employerEmail,
        jobTitle: application.job.title,
      }).catch(() => undefined);
    }

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 });
  }
}
