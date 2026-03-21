"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Briefcase, FileText, Building2, Lightbulb } from "lucide-react";
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
  const { data: session, status } = useSession();
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
        const response = await fetch(
          `/api/jobs?slug=${params.slug}&includeApplications=1`
        );
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

  // Show/hide mobile sticky bar on scroll
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Skeleton className="mb-8 h-48 w-full rounded-2xl" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-white py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Briefcase className="h-10 w-10 text-slate-400" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-slate-900">Job Not Found</h1>
          <p className="mb-6 text-slate-500">
            The job you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push("/jobs")}>
            Browse All Jobs
          </Button>
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
  const isOwner =
    session?.user?.role === "EMPLOYER" && session.user.id === job.employerId;
  const isJobSeeker = session?.user?.role === "JOB_SEEKER";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <JobDetailHeader
          job={job}
          isApplied={isApplied}
          isOwner={isOwner}
          userRole={session?.user?.role}
          onApplyClick={() => setShowApplyModal(true)}
        />

        {/* Main Content Area */}
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Left Column - Tabbed Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              {/* Tab Navigation */}
              <TabsList className="mb-6 w-full justify-start overflow-x-auto sm:grid sm:w-auto sm:grid-cols-3">
                <TabsTrigger value="overview" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="company" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  Company
                </TabsTrigger>
                <TabsTrigger value="tips" className="gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Tips
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8 pt-0">
                    {/* Responsibilities */}
                    {(job.responsibilities || job.description) && (
                      <div>
                        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900">
                          <FileText className="h-5 w-5 text-blue-500" />
                          {job.responsibilities ? "Responsibilities" : "About this Role"}
                        </h3>
                        <div className="space-y-3 text-slate-700">
                          {(job.responsibilities || job.description)
                            .split("\n")
                            .filter(Boolean)
                            .map((line, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                                <span>{line.trim()}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    {job.requirements && (
                      <div>
                        <h3 className="mb-4 text-xl font-bold text-slate-900">
                          Requirements
                        </h3>
                        <div className="whitespace-pre-wrap rounded-2xl bg-blue-50 p-6 text-slate-700">
                          {job.requirements}
                        </div>
                      </div>
                    )}

                    {/* Full Description */}
                    {job.description && !job.responsibilities && (
                      <div>
                        <h3 className="mb-4 text-xl font-bold text-slate-900">
                          Job Description
                        </h3>
                        <div className="whitespace-pre-wrap text-slate-700">
                          {job.description}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Company Tab */}
              <TabsContent value="company">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl">About {companyName}</CardTitle>
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

                    <div className="rounded-2xl bg-slate-50 p-6">
                      <p className="text-slate-700">
                        {companyName} is a great place to work. We value innovation,
                        collaboration, and personal growth. Join our team to make an
                        impact and advance your career.
                      </p>
                    </div>

                    {job.employer?.employerProfile?.companyWebsite && (
                      <a
                        href={job.employer.employerProfile.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        Visit company website →
                      </a>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tips Tab */}
              <TabsContent value="tips">
                {isJobSeeker ? (
                  <ApplicationTips
                    jobTitle={job.title}
                    requirements={job.requirements}
                    jobType={job.jobType}
                    experience={job.experience}
                  />
                ) : (
                  <Card className="border-0 shadow-xl">
                    <CardContent className="py-12 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <Lightbulb className="h-8 w-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        Tips for Job Seekers
                      </h3>
                      <p className="mt-2 text-slate-500">
                        Sign in as a job seeker to access application tips and advice.
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => router.push("/login")}
                      >
                        Sign In
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Similar Jobs */}
            <div className="mt-8">
              <SimilarJobs
                currentJobId={job.id}
                jobType={job.jobType}
                location={job.location}
              />
            </div>
          </div>

          {/* Right Column - Sidebar */}
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

      {/* Mobile Sticky Apply Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-sm transition-transform duration-300 lg:hidden ${
          showMobileBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{job.title}</p>
            <p className="truncate text-xs text-slate-500">{companyName}</p>
          </div>
          <Button
            className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-emerald-500 font-bold"
            disabled={isApplied || !isJobSeeker}
            onClick={() => setShowApplyModal(true)}
          >
            {isApplied ? "Applied" : "Apply"}
          </Button>
        </div>
      </div>

      {/* Application Modal */}
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
