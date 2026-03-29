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
  ArrowRight,
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
      <section className="surface-inverse relative overflow-hidden rounded-[2rem] border border-white/10 p-5 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.18),_transparent_24%)]" />
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)]">
          <div className="max-w-2xl">
            <div className="eyebrow border-white/10 bg-white/10 text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Candidate inbox
            </div>
            <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] text-white lg:text-5xl">
              Review candidates across every live role.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              Scan recent applications, jump into role-specific review, and keep your shortlist moving without losing context.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/employer/jobs">
                <Button variant="inverse">
                  Open Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/employer/post-job">
                <Button variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                  Post New Role
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Applications</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">{applications.length}</p>
              <p className="mt-1 text-sm text-slate-200">candidate submissions in view</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Open job flows</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">{groupedJobs.length}</p>
              <p className="mt-1 text-sm text-slate-200">roles currently receiving applicants</p>
            </div>
          </div>
        </div>
      </section>

      {groupedJobs.length > 0 && (
        <Card className="border-white/80 bg-white/94">
          <CardContent className="p-4 sm:p-5">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {groupedJobs.map(([jobId, title]) => (
                <Link key={jobId} href={`/dashboard/employer/applicants/${jobId}`}>
                  <Button variant="outline" className="rounded-full whitespace-nowrap">
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
        <Card className="border-white/80 bg-white/94">
          <CardContent className="py-14 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-950">No applications yet</h3>
            <p className="mt-2 text-slate-500">
              Once candidates apply to your jobs, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application.id} className="border-white/80 bg-white/94">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(135deg,#0284c7_0%,#0f766e_100%)] text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold text-slate-950">
                          {application.seeker.name || "Candidate"}
                        </p>
                        <Badge variant="secondary">{application.status.replaceAll("_", " ")}</Badge>
                      </div>
                      <p className="truncate text-sm text-slate-500">
                        {application.seeker.jobSeekerProfile?.headline || "Applicant"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.3rem] border border-slate-200/80 bg-slate-50/80 p-4">
                    <p className="text-sm font-semibold text-slate-900">{application.job.title}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {application.seeker.email || "No email"}
                      </span>
                      <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                    </div>
                    {application.coverLetter ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                        {application.coverLetter}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Link href={`/dashboard/employer/applicants/${application.job.id}`} className="sm:flex-1">
                      <Button variant="outline" className="w-full">
                        Manage Candidate
                      </Button>
                    </Link>
                    {application.resumeUrl ? (
                      <a href={application.resumeUrl} rel="noreferrer" target="_blank" className="sm:flex-1">
                        <Button variant="outline" className="w-full">
                          <FileText className="mr-2 h-4 w-4" />
                          Resume
                        </Button>
                      </a>
                    ) : (
                      <Button disabled variant="outline" className="w-full sm:flex-1">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        No Resume
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
