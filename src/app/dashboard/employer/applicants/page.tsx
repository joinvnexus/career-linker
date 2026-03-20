"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink, FileText, Mail, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Applicants</h1>
        <p className="mt-1 text-slate-600">
          Review recent candidates across all your job postings.
        </p>
      </div>

      {applications.length === 0 ? (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>No applications yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">
              Once candidates apply to your jobs, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="border-0 shadow-md">
              <CardContent className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {application.seeker.name || "Candidate"}
                      </p>
                      <p className="truncate text-sm text-slate-500">
                        {application.seeker.jobSeekerProfile?.headline || "Applicant"}
                      </p>
                    </div>
                    <Badge variant="secondary">{application.status.replaceAll("_", " ")}</Badge>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{application.job.title}</p>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {application.seeker.email || "No email"}
                    </span>
                    <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                  {application.coverLetter ? (
                    <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                      {application.coverLetter}
                    </p>
                  ) : null}
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/employer/applicants/${application.job.id}`}>
                    <Button variant="outline">Manage</Button>
                  </Link>
                  {application.resumeUrl ? (
                    <a href={application.resumeUrl} rel="noreferrer" target="_blank">
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Resume
                      </Button>
                    </a>
                  ) : (
                    <Button disabled variant="outline">
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
