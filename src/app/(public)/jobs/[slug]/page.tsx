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

type JobApplication = {
  id: string;
  status: string;
  createdAt: string;
  seekerId: string;
  seeker: {
    id: string;
    name?: string | null;
  };
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

export default function JobDetailsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [showMobileBar, setShowMobileBar] = useState(false);

  useEffect(() => {
    const fetchJob = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs?slug=${params.slug}&includeApplications=1`);
        const data = (await response.json()) as { jobs?: JobDetails[] };
        setJob(data.jobs?.[0] ?? null);
      } catch {
        toast.error("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      void fetchJob();
    }
  }, [params.slug]);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 400;
      setShowMobileBar(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleApply = async (): Promise<void> => {
    if (!job || !session?.user?.id) {
      return;
    }

    setApplyLoading(true);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          coverLetter,
          resumeUrl,
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(data.error || "Failed to apply");
        return;
      }

      toast.success("Application submitted successfully");
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

  if (loading) {
    return (
      <div className="min-h-screen pb-24">
        <div className="page-shell max-w-6xl py-8">
          <Skeleton className="mb-8 h-56 w-full rounded-[2rem]" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-[2rem]" />
              <Skeleton className="h-64 w-full rounded-[2rem]" />
            </div>
            <Skeleton className="h-[36rem] w-full rounded-[2rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Briefcase className="h-10 w-10 text-slate-400" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Job Not Found</h1>
          <p className="mb-6 text-slate-500">
            The job you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push("/jobs")}>Browse All Jobs</Button>
        </div>
      </div>
    );
  }

  const companyName =
    job.employer?.employerProfile?.companyName || job.employer?.name || "Company";
  const isApplied = Boolean(
    session?.user?.id &&
      job.applications?.some((application) => application.seekerId === session.user.id)
  );
  const isOwner = session?.user?.role === "EMPLOYER" && session.user.id === job.employerId;
  const isJobSeeker = session?.user?.role === "JOB_SEEKER";
  const detailHighlights = [
    {
      label: "Why this role stands out",
      copy: "The page combines the employer story, role scope, and action path in one focused flow.",
    },
    {
      label: "What to do next",
      copy: isApplied
        ? "You have already applied. Use the summary and tips tabs to prepare for next steps."
        : "Review the responsibilities, then apply once your resume link and cover letter are ready.",
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="page-shell max-w-6xl py-8">
        <JobDetailHeader
          job={job}
          isApplied={isApplied}
          isOwner={isOwner}
          userRole={session?.user?.role}
          onApplyClick={() => setShowApplyModal(true)}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              {detailHighlights.map((item) => (
                <Card
                  key={item.label}
                  className="border-white/80 bg-white/92 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.7)]"
                >
                  <CardContent className="p-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-700">
                      <Sparkles className="h-3.5 w-3.5" />
                      Insight
                    </div>
                    <p className="mt-4 text-base font-semibold text-slate-950">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-6 w-full justify-start overflow-x-auto rounded-[1.5rem] border border-white/80 bg-white/85 p-2 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.65)] sm:grid sm:w-auto sm:grid-cols-3">
                <TabsTrigger value="overview" className="gap-2 rounded-xl">
                  <FileText className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="company" className="gap-2 rounded-xl">
                  <Building2 className="h-4 w-4" />
                  Company
                </TabsTrigger>
                <TabsTrigger value="tips" className="gap-2 rounded-xl">
                  <Lightbulb className="h-4 w-4" />
                  Tips
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
                  <CardHeader>
                    <CardTitle className="text-2xl tracking-tight text-slate-950">
                      Job details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8 pt-0">
                    {(job.responsibilities || job.description) && (
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                          <FileText className="h-5 w-5 text-sky-600" />
                          {job.responsibilities ? "Responsibilities" : "About this role"}
                        </h3>
                        <div className="space-y-3 text-slate-700">
                          {(job.responsibilities || job.description)
                            .split("\n")
                            .filter(Boolean)
                            .map((line, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 rounded-2xl bg-slate-50/80 p-4"
                              >
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                                <span>{line.trim()}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {job.requirements && (
                      <div>
                        <h3 className="mb-4 text-xl font-bold text-slate-900">Requirements</h3>
                        <div className="whitespace-pre-wrap rounded-[1.75rem] bg-sky-50/80 p-6 leading-7 text-slate-700">
                          {job.requirements}
                        </div>
                      </div>
                    )}

                    {job.description && !job.responsibilities && (
                      <div>
                        <h3 className="mb-4 text-xl font-bold text-slate-900">
                          Job description
                        </h3>
                        <div className="whitespace-pre-wrap rounded-[1.75rem] bg-slate-50/80 p-6 leading-7 text-slate-700">
                          {job.description}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="company">
                <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
                  <CardHeader>
                    <CardTitle className="text-2xl tracking-tight text-slate-950">
                      About {companyName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-0">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{companyName}</h3>
                        <p className="text-slate-500">
                          {job.employer?.employerProfile?.industry || "Technology Company"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[1.75rem] bg-slate-50/80 p-6">
                      <p className="leading-7 text-slate-700">
                        {companyName} values thoughtful work, collaboration, and people
                        who can turn clarity into momentum. This section gives candidates
                        a quick read on the team behind the role.
                      </p>
                    </div>

                    {job.employer?.employerProfile?.companyWebsite && (
                      <a
                        href={job.employer.employerProfile.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-sky-800"
                      >
                        Visit company website
                      </a>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tips">
                {isJobSeeker ? (
                  <ApplicationTips
                    jobTitle={job.title}
                    requirements={job.requirements}
                    jobType={job.jobType}
                    experience={job.experience}
                  />
                ) : (
                  <Card className="border-white/80 bg-white/92 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]">
                    <CardContent className="py-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <Lightbulb className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Tips for job seekers
                      </h3>
                      <p className="mt-2 text-slate-500">
                        Sign in as a job seeker to access application tips and advice.
                      </p>
                      <Button className="mt-4" onClick={() => router.push("/login")}>
                        Sign In
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            <SimilarJobs
              currentJobId={job.id}
              jobType={job.jobType}
              location={job.location}
            />
          </div>

          <div className="space-y-6">
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

      <div
        className={`fixed bottom-0 left-0 right-0 z-50 border-t border-white/70 bg-white/92 shadow-[0_-16px_40px_-28px_rgba(15,23,42,0.65)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          showMobileBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{job.title}</p>
            <p className="truncate text-xs text-slate-500">{companyName}</p>
          </div>
          <Button
            className="flex-shrink-0 bg-slate-950 font-bold text-white hover:bg-slate-800"
            disabled={isApplied || !isJobSeeker}
            onClick={() => setShowApplyModal(true)}
          >
            {isApplied ? "Applied" : "Apply"}
          </Button>
        </div>
      </div>

      <Modal
        description="Submit your application details for this role."
        footer={
          <>
            <Button onClick={() => setShowApplyModal(false)} variant="outline">
              Cancel
            </Button>
            <Button disabled={applyLoading} onClick={handleApply}>
              {applyLoading ? "Applying..." : "Submit Application"}
            </Button>
          </>
        }
        onClose={() => setShowApplyModal(false)}
        open={showApplyModal}
        title={`Apply for ${job.title}`}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input
              id="resumeUrl"
              onChange={(event) => setResumeUrl(event.target.value)}
              placeholder="https://your-resume-link"
              value={resumeUrl}
            />
            <p className="mt-1 text-xs text-slate-500">
              Paste a link to your resume (Google Drive, Dropbox, etc.)
            </p>
          </div>
          <div>
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              onChange={(event) => setCoverLetter(event.target.value)}
              placeholder="Tell the employer why you are a good fit for this role..."
              rows={5}
              value={coverLetter}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
