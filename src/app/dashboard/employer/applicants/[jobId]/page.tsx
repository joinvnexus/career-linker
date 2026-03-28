"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  FileText,
  Mail,
  User,
  Sparkles,
  MapPin,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const statusOptions = [
  "PENDING",
  "REVIEWED",
  "SHORTLISTED",
  "INTERVIEW",
  "REJECTED",
  "HIRED",
] as const;

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
        const response = await fetch(`/api/applications/employer?jobId=${params.jobId}`);
        const data = (await response.json()) as { applications?: Applicant[] };
        setApplications(data.applications ?? []);
      } finally {
        setLoading(false);
      }
    };

    void fetchApplicants();
  }, [params.jobId]);

  const jobTitle = useMemo(
    () => (applications.length > 0 ? "Applicants for selected role" : "Applicants"),
    [applications.length]
  );

  const updateStatus = (
    applicationId: string,
    status: (typeof statusOptions)[number]
  ): void => {
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
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-[2rem]" />
        <Skeleton className="h-40 rounded-[1.75rem]" />
        <Skeleton className="h-40 rounded-[1.75rem]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(140deg,_rgba(15,23,42,0.96),_rgba(8,47,73,0.92)_45%,_rgba(6,95,70,0.82))] p-5 text-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.9)] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.18),_transparent_24%)]" />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Applicant management
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-5xl">{jobTitle}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              Review candidate details, change hiring status, and keep the decision path clear.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-white">Applicants in queue</p>
            <p className="mt-2 text-4xl font-bold tracking-tight">{applications.length}</p>
            <p className="mt-1 text-sm text-slate-200">
              update status as you move candidates through review
            </p>
          </div>
        </div>
      </section>

      {applications.length === 0 ? (
        <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
          <CardContent className="py-14 text-center">
            <User className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-950">No candidates yet</h3>
            <p className="mt-2 text-slate-500">Applications for this job will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <Card
              key={application.id}
              className="border-white/80 bg-white/92 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.7)]"
            >
              <CardContent className="grid gap-5 p-5 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-emerald-500 text-white">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-950">
                          {application.seeker.name || "Candidate"}
                        </p>
                        <Badge variant="secondary">
                          {application.status.replaceAll("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        {application.seeker.jobSeekerProfile?.headline || "Applicant"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                      <Mail className="h-4 w-4" />
                      {application.seeker.email || "No email"}
                    </span>
                    {application.seeker.jobSeekerProfile?.location && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                        <MapPin className="h-4 w-4" />
                        {application.seeker.jobSeekerProfile.location}
                      </span>
                    )}
                    {application.seeker.jobSeekerProfile?.phone && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                        <Phone className="h-4 w-4" />
                        {application.seeker.jobSeekerProfile.phone}
                      </span>
                    )}
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Cover letter
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-700">
                      {application.coverLetter || "No cover letter provided."}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Update status
                    </p>
                    <Select
                      disabled={isPending}
                      onValueChange={(value) =>
                        updateStatus(application.id, value as (typeof statusOptions)[number])
                      }
                      value={application.status}
                    >
                      <SelectTrigger className="mt-3 rounded-2xl border-slate-200 bg-white">
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
                  </div>

                  {application.resumeUrl ? (
                    <a href={application.resumeUrl} rel="noreferrer" target="_blank">
                      <Button className="w-full rounded-2xl" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        View Resume
                      </Button>
                    </a>
                  ) : (
                    <Button className="w-full rounded-2xl" disabled variant="outline">
                      No Resume
                    </Button>
                  )}

                  <div className="rounded-[1.5rem] bg-emerald-50/70 p-4 text-sm text-emerald-800">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Changing status triggers candidate communication when applicable.</span>
                    </div>
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
