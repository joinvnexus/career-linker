"use client";

import { useEffect, useState, useTransition } from "react";
import { FileText, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type Applicant = {
  id: string;
  status: string;
  createdAt: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  seeker: {
    id: string;
    name?: string | null;
    email?: string | null;
    jobSeekerProfile?: {
      headline?: string | null;
      location?: string | null;
      phone?: string | null;
    } | null;
  };
};

const statusOptions = ["PENDING", "REVIEWED", "SHORTLISTED", "INTERVIEW", "REJECTED", "HIRED"] as const;

export default function ApplicantsPage({
  params,
}: {
  params: { jobId: string };
}) {
  const [applications, setApplications] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchApplicants = async (): Promise<void> => {
      try {
        const response = await fetch(`/api/applications?jobId=${params.jobId}`);
        const data = (await response.json()) as { applications?: Applicant[] };
        setApplications(data.applications ?? []);
      } finally {
        setLoading(false);
      }
    };

    void fetchApplicants();
  }, [params.jobId]);

  const updateStatus = (applicationId: string, status: (typeof statusOptions)[number]): void => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/applications/${applicationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        const data = (await response.json()) as { error?: string };

        if (!response.ok) {
          toast.error(data.error || "Failed to update application");
          return;
        }

        setApplications((current) =>
          current.map((item) => (item.id === applicationId ? { ...item, status } : item))
        );
        toast.success("Application status updated");
      } catch {
        toast.error("Failed to update application");
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-60" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-slate-900">Applicants</h1>
        <Badge>{applications.length} candidates</Badge>
      </div>

      {applications.length === 0 ? (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>No candidates yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Applications for this job will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card key={application.id} className="border-0 shadow-md">
              <CardContent className="grid gap-5 py-5 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {application.seeker.name || "Candidate"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {application.seeker.jobSeekerProfile?.headline || "Applicant"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {application.seeker.email || "No email"}
                    </span>
                    <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                  </div>
                  {application.coverLetter ? (
                    <p className="text-sm leading-6 text-slate-600">{application.coverLetter}</p>
                  ) : null}
                </div>

                <div className="space-y-3">
                  <Select
                    disabled={isPending}
                    onValueChange={(value) =>
                      updateStatus(application.id, value as (typeof statusOptions)[number])
                    }
                    value={application.status}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {application.resumeUrl ? (
                    <a href={application.resumeUrl} rel="noreferrer" target="_blank">
                      <Button className="w-full" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Resume
                      </Button>
                    </a>
                  ) : (
                    <Button className="w-full" disabled variant="outline">
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
