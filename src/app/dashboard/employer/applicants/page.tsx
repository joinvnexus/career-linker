"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  FileText,
  Mail,
  User,
  Sparkles,
  Users,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type EmployerApplication = {
  id: string;
  status: string;
  createdAt: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  job: {
    id: string;
    title: string;
    location: string;
  };
  seeker: {
    id: string;
    name?: string | null;
    email?: string | null;
    jobSeekerProfile?: {
      headline?: string | null;
    } | null;
  };
};

export default function EmployerApplicantsPage() {
  const [applications, setApplications] = useState<EmployerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async (): Promise<void> => {
      try {
        const response = await fetch("/api/applications/employer");
        const data = (await response.json()) as { applications?: EmployerApplication[] };
        setApplications(data.applications ?? []);
      } finally {
        setLoading(false);
      }
    };

    void fetchApplications();
  }, []);

  const groupedJobs = useMemo(() => {
    const unique = new Map<string, string>();
    applications.forEach((application) => {
      unique.set(application.job.id, application.job.title);
    });
    return Array.from(unique.entries());
  }, [applications]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-[2rem]" />
        <Skeleton className="h-28 w-full rounded-[1.75rem]" />
        <Skeleton className="h-28 w-full rounded-[1.75rem]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(140deg,_rgba(15,23,42,0.96),_rgba(6,95,70,0.90)_45%,_rgba(8,145,178,0.84))] p-5 text-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.9)] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.18),_transparent_24%)]" />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Candidate inbox
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-5xl">
              Review candidates across every live role.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              Scan recent applications, jump into job-specific management, and keep
              your shortlist moving without losing context.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Applications</p>
              <p className="mt-2 text-4xl font-bold tracking-tight">{applications.length}</p>
              <p className="mt-1 text-sm text-slate-200">candidate submissions in view</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Open job flows</p>
              <p className="mt-2 text-4xl font-bold tracking-tight">{groupedJobs.length}</p>
              <p className="mt-1 text-sm text-slate-200">roles currently receiving applicants</p>
            </div>
          </div>
        </div>
      </section>

      {groupedJobs.length > 0 && (
        <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-3">
              {groupedJobs.map(([jobId, title]) => (
                <Link key={jobId} href={`/dashboard/employer/applicants/${jobId}`}>
                  <Button variant="outline" className="rounded-full border-slate-200 bg-white/80">
                    <Briefcase className="mr-2 h-4 w-4" />
                    {title}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {applications.length === 0 ? (
        <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
          <CardContent className="py-14 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-950">No applications yet</h3>
            <p className="mt-2 text-slate-500">
              Once candidates apply to your jobs, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card
              key={application.id}
              className="border-white/80 bg-white/92 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.7)]"
            >
              <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-950">
                        {application.seeker.name || "Candidate"}
                      </p>
                      <p className="truncate text-sm text-slate-500">
                        {application.seeker.jobSeekerProfile?.headline || "Applicant"}
                      </p>
                    </div>
                    <Badge variant="secondary">{application.status.replaceAll("_", " ")}</Badge>
                  </div>

                  <p className="text-sm font-semibold text-slate-800">{application.job.title}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {application.seeker.email || "No email"}
                    </span>
                    <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                  {application.coverLetter ? (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                      {application.coverLetter}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/dashboard/employer/applicants/${application.job.id}`}>
                    <Button variant="outline" className="rounded-xl">
                      Manage
                    </Button>
                  </Link>
                  {application.resumeUrl ? (
                    <a href={application.resumeUrl} rel="noreferrer" target="_blank">
                      <Button variant="outline" className="rounded-xl">
                        <FileText className="mr-2 h-4 w-4" />
                        Resume
                      </Button>
                    </a>
                  ) : (
                    <Button disabled variant="outline" className="rounded-xl">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      No Resume
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
