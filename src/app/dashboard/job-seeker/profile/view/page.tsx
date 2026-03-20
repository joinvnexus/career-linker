"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Briefcase, GraduationCap, Link2, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ProfileData = {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  headline?: string | null;
  bio?: string | null;
  phone?: string | null;
  location?: string | null;
  resumeUrl?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  skills?: Array<{ id: string; name: string }>;
  experiences?: Array<{
    id: string;
    title: string;
    company: string;
    location?: string | null;
    startDate: string;
    endDate?: string | null;
    isCurrent: boolean;
    description?: string | null;
  }>;
  educations?: Array<{
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    isCurrent: boolean;
    description?: string | null;
  }>;
};

const formatDate = (value?: string | null): string =>
  value ? new Date(value).toLocaleDateString() : "";

export default function ProfilePreviewPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const response = await fetch("/api/profiles/seeker");
        const data = (await response.json()) as { profile?: ProfileData };
        setProfile(data.profile ?? null);
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profile Preview</h1>
          <p className="mt-1 text-slate-600">This is how your profile currently reads.</p>
        </div>
        <Link href="/dashboard/job-seeker/profile">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Editor
          </Button>
        </Link>
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl text-slate-900">
            {profile?.user?.name || "Your Name"}
          </CardTitle>
          <p className="text-lg text-slate-600">{profile?.headline || "No headline yet"}</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            {profile?.location ? (
              <div className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </div>
            ) : null}
            {profile?.phone ? (
              <div className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {profile.phone}
              </div>
            ) : null}
            {profile?.websiteUrl ? (
              <a
                className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-900"
                href={profile.websiteUrl}
                rel="noreferrer"
                target="_blank"
              >
                <Link2 className="h-4 w-4" />
                Website
              </a>
            ) : null}
            {profile?.linkedinUrl ? (
              <a
                className="inline-flex items-center gap-2 text-sky-700 hover:text-sky-900"
                href={profile.linkedinUrl}
                rel="noreferrer"
                target="_blank"
              >
                <Link2 className="h-4 w-4" />
                LinkedIn
              </a>
            ) : null}
          </div>

          {profile?.bio ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900">Summary</h2>
              <p className="whitespace-pre-wrap leading-7 text-slate-700">{profile.bio}</p>
            </section>
          ) : null}

          {profile?.skills?.length ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-900">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill.id}>{skill.name}</Badge>
                ))}
              </div>
            </section>
          ) : null}

          {profile?.experiences?.length ? (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-slate-700" />
                <h2 className="text-xl font-semibold text-slate-900">Experience</h2>
              </div>
              {profile.experiences.map((experience) => (
                <div key={experience.id} className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{experience.title}</h3>
                  <p className="text-sm font-medium text-slate-600">{experience.company}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatDate(experience.startDate)} -{" "}
                    {experience.isCurrent ? "Present" : formatDate(experience.endDate)}
                  </p>
                  {experience.description ? (
                    <p className="mt-3 whitespace-pre-wrap text-slate-700">
                      {experience.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}

          {profile?.educations?.length ? (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-slate-700" />
                <h2 className="text-xl font-semibold text-slate-900">Education</h2>
              </div>
              {profile.educations.map((education) => (
                <div key={education.id} className="rounded-2xl border border-slate-200 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{education.degree}</h3>
                  <p className="text-sm font-medium text-slate-600">{education.institution}</p>
                  {education.fieldOfStudy ? (
                    <p className="text-sm text-slate-500">{education.fieldOfStudy}</p>
                  ) : null}
                  {education.description ? (
                    <p className="mt-3 whitespace-pre-wrap text-slate-700">
                      {education.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
