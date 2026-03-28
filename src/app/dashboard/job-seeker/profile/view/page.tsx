"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Link2,
  MapPin,
  Phone,
  Sparkles,
  Mail,
  FileText,
} from "lucide-react";
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
        <Skeleton className="h-72 rounded-[2rem]" />
        <Skeleton className="h-80 rounded-[2rem]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,_rgba(3,105,161,0.94),_rgba(14,116,144,0.88)_45%,_rgba(15,23,42,0.95))] p-5 text-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.85)] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(103,232,249,0.20),_transparent_22%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Recruiter view
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-5xl">
              Your profile, as employers see it.
            </h1>
            <p className="mt-3 text-sm leading-7 text-sky-50/85 lg:text-base">
              Preview tone, clarity, and completeness before recruiters open your
              candidate story.
            </p>
          </div>
          <Link href="/dashboard/job-seeker/profile">
            <Button className="w-full bg-white text-slate-950 hover:bg-slate-100 sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Editor
            </Button>
          </Link>
        </div>
      </section>

      <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
        <CardHeader className="border-b border-slate-100/80 pb-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <CardTitle className="text-3xl tracking-tight text-slate-950">
                {profile?.user?.name || "Your Name"}
              </CardTitle>
              <p className="mt-2 text-lg text-slate-600">
                {profile?.headline || "No headline yet"}
              </p>
            </div>
            {profile?.resumeUrl ? (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" className="border-slate-200 bg-white/80">
                  <FileText className="mr-2 h-4 w-4" />
                  Open Resume
                </Button>
              </a>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            {profile?.location ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </div>
            ) : null}
            {profile?.phone ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
                <Phone className="h-4 w-4" />
                {profile.phone}
              </div>
            ) : null}
            {profile?.user?.email ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2">
                <Mail className="h-4 w-4" />
                {profile.user.email}
              </div>
            ) : null}
            {profile?.websiteUrl ? (
              <a
                className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sky-700 hover:text-sky-900"
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
                className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-sky-700 hover:text-sky-900"
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
              <h2 className="text-xl font-semibold text-slate-950">Summary</h2>
              <div className="rounded-[1.75rem] border border-slate-200/80 bg-slate-50/70 p-5">
                <p className="whitespace-pre-wrap leading-7 text-slate-700">{profile.bio}</p>
              </div>
            </section>
          ) : null}

          {profile?.skills?.length ? (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-slate-950">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill.id} className="rounded-full px-3 py-1.5">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}

          {profile?.experiences?.length ? (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-slate-700" />
                <h2 className="text-xl font-semibold text-slate-950">Experience</h2>
              </div>
              {profile.experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.55)]"
                >
                  <h3 className="text-lg font-semibold text-slate-950">{experience.title}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {experience.company}
                    {experience.location ? ` • ${experience.location}` : ""}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {formatDate(experience.startDate)} -{" "}
                    {experience.isCurrent ? "Present" : formatDate(experience.endDate)}
                  </p>
                  {experience.description ? (
                    <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">
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
                <h2 className="text-xl font-semibold text-slate-950">Education</h2>
              </div>
              {profile.educations.map((education) => (
                <div
                  key={education.id}
                  className="rounded-[1.75rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.55)]"
                >
                  <h3 className="text-lg font-semibold text-slate-950">{education.degree}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {education.institution}
                  </p>
                  {education.fieldOfStudy ? (
                    <p className="mt-1 text-sm text-slate-500">{education.fieldOfStudy}</p>
                  ) : null}
                  {(education.startDate || education.endDate || education.isCurrent) && (
                    <p className="mt-2 text-sm text-slate-500">
                      {formatDate(education.startDate)} -{" "}
                      {education.isCurrent ? "Present" : formatDate(education.endDate)}
                    </p>
                  )}
                  {education.description ? (
                    <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700">
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
