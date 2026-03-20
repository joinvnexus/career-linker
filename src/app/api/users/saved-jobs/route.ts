import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'JOB_SEEKER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await req.json();

    // Toggle saved status
    const existing = await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    });

    if (existing) {
      // Remove
      await prisma.savedJob.delete({
        where: {
          id: existing.id,
        },
      });
      return NextResponse.json({ message: 'Unsaved' });
    } else {
      // Save
      await prisma.savedJob.create({
        data: {
          userId: session.user.id,
          jobId,
        },
      });
      return NextResponse.json({ message: 'Saved' });
    }
  } catch (error) {
    console.error('Save job error', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        job: {
          include: {
            employer: true,
          },
        },
      },
    });

    return NextResponse.json(savedJobs.map((sj) => sj.job));
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "JOB_SEEKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await req.json();

    await prisma.savedJob.deleteMany({
      where: {
        userId: session.user.id,
        jobId,
      },
    });

    return NextResponse.json({ message: "Unsaved" });
  } catch (error) {
    console.error("Delete saved job error", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

