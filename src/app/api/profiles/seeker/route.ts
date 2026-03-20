import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  jobSeekerProfileSchema,
  type JobSeekerProfileInput,
} from "@/schemas/job-seeker-profile";
import { z } from "zod";

const buildProfilePayload = (data: JobSeekerProfileInput) => ({
  headline: data.headline,
  bio: data.bio,
  phone: data.phone,
  location: data.location,
  resumeUrl: data.resumeUrl,
  websiteUrl: data.websiteUrl,
  linkedinUrl: data.linkedinUrl,
  isComplete: Boolean(
    data.headline &&
      data.location &&
      (data.resumeUrl || data.websiteUrl || data.linkedinUrl) &&
      data.skills.length > 0
  ),
});

const getProfileInclude = () => ({
  skills: {
    orderBy: { createdAt: "asc" as const },
  },
  experiences: {
    orderBy: [{ isCurrent: "desc" as const }, { startDate: "desc" as const }],
  },
  educations: {
    orderBy: [{ isCurrent: "desc" as const }, { endDate: "desc" as const }],
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "JOB_SEEKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.jobSeekerProfile.findUnique({
      where: { userId: session.user.id },
      include: getProfileInclude(),
    });

    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "JOB_SEEKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = jobSeekerProfileSchema.parse(body);

    const profile = await prisma.$transaction(async (tx) => {
      const existing = await tx.jobSeekerProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });

      const baseProfile = existing
        ? await tx.jobSeekerProfile.update({
            where: { userId: session.user.id },
            data: buildProfilePayload(data),
          })
        : await tx.jobSeekerProfile.create({
            data: {
              userId: session.user.id,
              ...buildProfilePayload(data),
            },
          });

      await tx.jobSeekerSkill.deleteMany({
        where: { profileId: baseProfile.id },
      });
      await tx.jobSeekerExperience.deleteMany({
        where: { profileId: baseProfile.id },
      });
      await tx.jobSeekerEducation.deleteMany({
        where: { profileId: baseProfile.id },
      });

      if (data.skills.length > 0) {
        await tx.jobSeekerSkill.createMany({
          data: data.skills.map((skill) => ({
            profileId: baseProfile.id,
            name: skill.name,
          })),
        });
      }

      if (data.experiences.length > 0) {
        await tx.jobSeekerExperience.createMany({
          data: data.experiences.map((experience) => ({
            profileId: baseProfile.id,
            title: experience.title,
            company: experience.company,
            location: experience.location,
            employmentType: experience.employmentType,
            startDate: new Date(experience.startDate),
            endDate: experience.endDate ? new Date(experience.endDate) : null,
            isCurrent: experience.isCurrent,
            description: experience.description,
          })),
        });
      }

      if (data.educations.length > 0) {
        await tx.jobSeekerEducation.createMany({
          data: data.educations.map((education) => ({
            profileId: baseProfile.id,
            institution: education.institution,
            degree: education.degree,
            fieldOfStudy: education.fieldOfStudy,
            startDate: education.startDate ? new Date(education.startDate) : null,
            endDate: education.endDate ? new Date(education.endDate) : null,
            isCurrent: education.isCurrent,
            description: education.description,
          })),
        });
      }

      return tx.jobSeekerProfile.findUnique({
        where: { id: baseProfile.id },
        include: getProfileInclude(),
      });
    });

    return NextResponse.json({ profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
