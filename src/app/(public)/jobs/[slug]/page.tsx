"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  FileText,
  Building2,
  Lightbulb,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobDetailHeader } from "@/components/jobs/job-detail-header";
import { JobSummaryCard } from "@/components/jobs/job-summary-card";
import { SimilarJobs } from "@/components/jobs/similar-jobs";
import { ApplicationTips } from "@/components/jobs/application-tips";

/* ─── types ─────────────────────────────────────────── */
type JobApplication = {
  id: string;
  status: string;
  createdAt: string;
  seekerId: string;
  seeker: { id: string; name?: string | null };
};

type JobDetails = {
  id: string;
  slug: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string | null;
  location: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  jobType: string;
  experience: string;
  employerId: string;
  applicationDeadline?: string | null;
  createdAt: string;
  employer?: {
    id: string;
    name?: string | null;
    employerProfile?: {
      companyName?: string | null;
      industry?: string | null;
      companyWebsite?: string | null;
      location?: string | null;
      companySize?: string | null;
    } | null;
  };
  applications?: JobApplication[];
};

/* ─── loading skeleton ───────────────────────────────── */
function PageSkeleton() {
  return (
    <div className="min-h-screen pb-24">
      <div className="page-shell max-w-6xl py-8">
        <Skeleton className="mb-6 h-64 w-full rounded-3xl" />
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <Skeleton className="h-10 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-3xl" />
            <Skeleton className="h-52 w-full rounded-3xl" />
          </div>
          <Skeleton className="h-[40rem] w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

/* ─── empty state ────────────────────────────────────── */
function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
          <Briefcase className="h-10 w-10 text-slate-400" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Job Not Found</h1>
        <p className="mb-7 text-slate-500">
          The job you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button onClick={onBack} className="gap-2">
          <ArrowUpRight className="h-4 w-4" />
          Browse All Jobs
        </Button>
      </div>
    </div>
  );
}

/* ─── insight card ───────────────────────────────────── */
function InsightCard({ label, copy }: { label: string; copy: string }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/92 p-5 shadow-[0_12px_40px_-20px_rgba(15,23,42,0.12)]">
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-sky-700">
        <Sparkles className="h-3 w-3" />
        Insight
      </div>
      <p className="text-sm font-semibold text-slate-900">{label}</p>
      <p className="mt-1.5 text-sm leading-6 text-slate-500">{copy}</p>
    </div>
  );
}

/* ─── page ───────────────────────────────────────────── */
export default function JobDetailsPage() {
  const params           = useParams<{ slug: string }>();
  const router           = useRouter();
  const { data: session } = useSession();

  const [job, setJob]               = useState<JobDetails | null>(null);
  const [loading, setLoading]       = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl]   = useState("");
  const [showMobileBar, setShowMobileBar] = useState(false);

  /* fetch job */
  useEffect(() => {
    const fetchJob = async (): Promise<void> => {
      try {
        setLoading(true);
        const res  = await fetch(`/api/jobs?slug=${params.slug}&includeApplications=1`);
        const data = (await res.json()) as { jobs?: JobDetails[] };
        setJob(data.jobs?.[0] ?? null);
      } catch {
        toast.error("Failed to load job");
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) void fetchJob();
  }, [params.slug]);

  /* mobile sticky bar */
  useEffect(() => {
    const onScroll = () => setShowMobileBar(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* apply */
  const handleApply = async (): Promise<void> => {
    if (!job || !session?.user?.id) return;
    setApplyLoading(true);
    try {
      const res  = await fetch("/api/applications", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ jobId: job.id, coverLetter, resumeUrl }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) { toast.error(data.error || "Failed to apply"); return; }
      toast.success("Application submitted successfully!");
      setShowApplyModal(false);
      setCoverLetter("");
      setResumeUrl("");
      router.refresh();
    } catch {
      toast.error("Failed to apply");
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <PageSkeleton />;
  if (!job)    return <NotFound onBack={() => router.push("/jobs")} />;

  const companyName = job.employer?.employerProfile?.companyName || job.employer?.name || "Company";
  const isApplied   = Boolean(
    session?.user?.id &&
    job.applications?.some((a) => a.seekerId === session.user.id),
  );
  const isOwner     = session?.user?.role === "EMPLOYER" && session.user.id === job.employerId;
  const isJobSeeker = session?.user?.role === "JOB_SEEKER";

  const detailHighlights = [
    {
      label: "Why this role stands out",
      copy:  "The page combines the employer story, role scope, and action path in one focused flow.",
    },
    {
      label: "What to do next",
      copy:  isApplied
        ? "You have already applied. Use the summary and tips tabs to prepare for next steps."
        : "Review the responsibilities, then apply once your resume and cover letter are ready.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50/60 to-white pb-28">
      <div className="page-shell max-w-6xl py-8">

        {/* ── HEADER ── */}
        <JobDetailHeader
          job={job}
          isApplied={isApplied}
          isOwner={isOwner}
          userRole={session?.user?.role}
          onApplyClick={() => setShowApplyModal(true)}
        />

        {/* ── INSIGHT STRIP ── */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {detailHighlights.map((item) => (
            <InsightCard key={item.label} label={item.label} copy={item.copy} />
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* left column */}
          <div className="space-y-6 lg:col-span-2">

            <Tabs defaultValue="overview" className="w-full">
              {/* tab list */}
              <TabsList className="mb-5 w-full justify-start gap-1 overflow-x-auto rounded-2xl border border-white/80 bg-white/88 p-1.5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:grid sm:w-auto sm:grid-cols-3">
                <TabsTrigger
                  value="overview"
                  className="gap-2 rounded-xl px-5 py-2.5 text-sm font-medium data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="company"
                  className="gap-2 rounded-xl px-5 py-2.5 text-sm font-medium data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md flex items-center gap-2"
                >
                  <Building2 className="h-4 w-4" />
                  Company
                </TabsTrigger>
                <TabsTrigger
                  value="tips"
                  className="gap-2 rounded-xl px-5 py-2.5 text-sm font-medium data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md flex items-center gap-2"
                >
                  <Lightbulb className="h-4 w-4" />
                  Tips
                </TabsTrigger>
              </TabsList>

              {/* ── OVERVIEW ── */}
              <TabsContent value="overview">
                <div className="rounded-3xl border border-white/80 bg-white/92 p-7 shadow-[0_16px_50px_-24px_rgba(15,23,42,0.14)]">
                  <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-950">
                    Job details
                  </h2>

                  {/* responsibilities */}
                  {(job.responsibilities || job.description) && (
                    <div className="mb-8">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100">
                          <FileText className="h-4 w-4 text-sky-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {job.responsibilities ? "Responsibilities" : "About this role"}
                        </h3>
                      </div>
                      <div className="space-y-2">
                        {(job.responsibilities || job.description)
                          .split("\n")
                          .filter(Boolean)
                          .map((line, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 rounded-xl bg-slate-50/80 px-4 py-3"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                              <span className="text-sm leading-6 text-slate-700">{line.trim()}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* requirements */}
                  {job.requirements && (
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-slate-900">Requirements</h3>
                      <div className="rounded-2xl border-l-4 border-sky-400 bg-sky-50/60 px-6 py-5 text-sm leading-7 text-slate-700">
                        {job.requirements}
                      </div>
                    </div>
                  )}

                  {/* description fallback */}
                  {job.description && !job.responsibilities && (
                    <div className="mt-6">
                      <h3 className="mb-3 text-lg font-semibold text-slate-900">Job description</h3>
                      <div className="whitespace-pre-wrap rounded-2xl bg-slate-50/80 px-6 py-5 text-sm leading-7 text-slate-700">
                        {job.description}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ── COMPANY ── */}
              <TabsContent value="company">
                <div className="rounded-3xl border border-white/80 bg-white/92 p-7 shadow-[0_16px_50px_-24px_rgba(15,23,42,0.14)]">
                  <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-950">
                    About {companyName}
                  </h2>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{companyName}</h3>
                      <p className="text-slate-500">
                        {job.employer?.employerProfile?.industry || "Technology Company"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50/80 px-6 py-5 text-sm leading-7 text-slate-700 mb-5">
                    {companyName} values thoughtful work, collaboration, and people who can turn
                    clarity into momentum. This section gives candidates a quick read on the team
                    behind the role.
                  </div>

                  {job.employer?.employerProfile?.companyWebsite && (
                    <a
                      href={job.employer.employerProfile.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-800"
                    >
                      Visit company website
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </TabsContent>

              {/* ── TIPS ── */}
              <TabsContent value="tips">
                {isJobSeeker ? (
                  <ApplicationTips
                    jobTitle={job.title}
                    requirements={job.requirements}
                    jobType={job.jobType}
                    experience={job.experience}
                  />
                ) : (
                  <div className="rounded-3xl border border-white/80 bg-white/92 p-7 shadow-[0_16px_50px_-24px_rgba(15,23,42,0.14)]">
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <Lightbulb className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">Tips for job seekers</h3>
                      <p className="mt-2 text-sm text-slate-500">
                        Sign in as a job seeker to access application tips and advice.
                      </p>
                      <Button className="mt-5" onClick={() => router.push("/login")}>
                        Sign In
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* similar jobs */}
            <SimilarJobs
              currentJobId={job.id}
              jobType={job.jobType}
              location={job.location}
            />
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-5">
            <JobSummaryCard
              job={job}
              isApplied={isApplied}
              isOwner={isOwner}
              userRole={session?.user?.role}
              onApplyClick={() => setShowApplyModal(true)}
            />
          </div>
        </div>
      </div>

      {/* ── MOBILE STICKY BAR ── */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 border-t border-white/60 bg-white/92 shadow-[0_-12px_40px_-16px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          showMobileBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 p-4 pb-safe">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{job.title}</p>
            <p className="truncate text-xs text-slate-500">{companyName}</p>
          </div>
          <Button
            className="flex-shrink-0 bg-slate-950 font-bold text-white hover:bg-slate-800 disabled:opacity-60"
            disabled={isApplied || !isJobSeeker}
            onClick={() => setShowApplyModal(true)}
          >
            {isApplied ? "Applied ✓" : "Apply"}
          </Button>
        </div>
      </div>

      {/* ── APPLY MODAL ── */}
      <Modal
        description="Submit your application details for this role."
        footer={
          <>
            <Button variant="outline" onClick={() => setShowApplyModal(false)}>
              Cancel
            </Button>
            <Button disabled={applyLoading} onClick={handleApply}>
              {applyLoading ? "Submitting…" : "Submit Application"}
            </Button>
          </>
        }
        onClose={() => setShowApplyModal(false)}
        open={showApplyModal}
        title={`Apply for ${job.title}`}
      >
        <div className="space-y-5">
          <div>
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input
              id="resumeUrl"
              placeholder="https://your-resume-link"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              className="mt-1"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Paste a link to your resume (Google Drive, Dropbox, etc.)
            </p>
          </div>
          <div>
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell the employer why you are a good fit for this role…"
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}