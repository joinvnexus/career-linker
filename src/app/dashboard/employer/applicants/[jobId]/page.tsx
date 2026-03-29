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

  const summary = useMemo(
    () => ({
      total: applications.length,
      shortlisted: applications.filter((item) => item.status === "SHORTLISTED").length,
    }),
    [applications]
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
      <section className="surface-inverse relative overflow-hidden rounded-[2rem] border border-white/10 p-5 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.18),_transparent_24%)]" />
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)]">
          <div className="max-w-2xl">
            <div className="eyebrow border-white/10 bg-white/10 text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Applicant management
            </div>
            <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] text-white lg:text-5xl">
              Review this role&apos;s hiring queue.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              Compare candidate context, update status quickly, and keep the decision path clear on any screen size.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Applicants</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">{summary.total}</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
              <p className="text-sm font-semibold text-white">Shortlisted</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight">{summary.shortlisted}</p>
            </div>
          </div>
        </div>
      </section>

      {applications.length === 0 ? (
        <Card className="border-white/80 bg-white/94">
          <CardContent className="py-14 text-center">
            <User className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-950">No candidates yet</h3>
            <p className="mt-2 text-slate-500">Applications for this job will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application) => (
            <Card key={application.id} className="border-white/80 bg-white/94">
              <CardContent className="grid gap-5 p-5 xl:grid-cols-[1.25fr_0.75fr]">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.1rem] bg-[linear-gradient(135deg,#0284c7_0%,#0f766e_100%)] text-white">
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
                      <SelectTrigger className="mt-3 rounded-[1rem] bg-white">
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

                  <div className="rounded-[1.5rem] bg-emerald-50/70 p-4 text-sm text-emerald-800">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                      <span>Changing status helps your team keep the shortlist and outreach aligned.</span>
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
