"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

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
  employer?: {
    id: string;
    name?: string | null;
    employerProfile?: {
      companyName?: string | null;
      industry?: string | null;
      companyWebsite?: string | null;
      location?: string | null;
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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="mb-8 h-12 w-48" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-96" />
              <Skeleton className="h-80" />
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
        <div className="text-center">
          <Briefcase className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Job Not Found</h1>
          <Button className="mt-4" onClick={() => router.push("/jobs")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to jobs
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Button className="mb-6" onClick={() => router.push("/jobs")} variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to results
          </Button>
        </div>
      </div>

      <div className="relative z-10 mx-auto -mt-8 max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <Card className="overflow-hidden border-0 bg-gradient-to-r from-blue-50 to-emerald-50 shadow-xl">
              <CardContent className="p-8 pt-12">
                <div className="mb-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500">
                      <Building2 className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{companyName}</h1>
                      <p className="mt-1 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
                        {job.title}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isOwner ? (
                      <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>
                        <Button variant="outline">Edit Job</Button>
                      </Link>
                    ) : (
                      <Button
                        className="px-8 text-lg font-bold"
                        disabled={isApplied || status !== "authenticated"}
                        onClick={() => setShowApplyModal(true)}
                      >
                        {isApplied ? "Applied" : "Apply Now"}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mb-8 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 rounded-xl bg-white/60 px-4 py-2">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/60 px-4 py-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    {job.salaryMin ? `${job.salaryMin.toLocaleString()}` : "Competitive"}
                    {job.salaryMax ? ` - ${job.salaryMax.toLocaleString()}` : ""}
                  </div>
                  <Badge variant="secondary">{job.jobType.replaceAll("_", " ")}</Badge>
                  <Badge variant="outline">{job.experience} Level</Badge>
                  {job.applicationDeadline ? (
                    <div className="flex items-center gap-2 rounded-xl bg-white/60 px-4 py-2">
                      <Clock className="h-4 w-4" />
                      Closes {new Date(job.applicationDeadline).toLocaleDateString()}
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">About the Role</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-0">
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
                    <FileText className="h-5 w-5" />
                    Responsibilities
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    {(job.responsibilities || "")
                      .split("\n")
                      .filter(Boolean)
                      .map((line) => (
                        <div key={line} className="flex items-start gap-3">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                          <span>{line.trim()}</span>
                        </div>
                      ))}
                    {!job.responsibilities ? <p>No responsibilities listed.</p> : null}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-bold">Requirements</h3>
                  <div className="whitespace-pre-wrap rounded-2xl bg-blue-50 p-6">
                    {job.requirements}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-bold">Job Description</h3>
                  <div className="whitespace-pre-wrap text-gray-700">{job.description}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="sticky top-24 border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Company</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-6 text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600">
                    <Building2 className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{companyName}</h3>
                  <p className="text-sm text-gray-500">
                    {job.employer?.employerProfile?.industry || "Hiring company"}
                  </p>
                </div>
                {job.employer?.employerProfile?.location ? (
                  <p className="text-sm text-gray-600">
                    Location: {job.employer.employerProfile.location}
                  </p>
                ) : null}
                {job.employer?.employerProfile?.companyWebsite ? (
                  <Link
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    href={job.employer.employerProfile.companyWebsite}
                    target="_blank"
                  >
                    Visit website
                  </Link>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.applications?.length ? (
                  job.applications.slice(0, 5).map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {application.seeker.name || "Candidate"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {application.status.replaceAll("_", " ")}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-center text-sm text-gray-500">
                    No applications yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
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
          </div>
          <div>
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              onChange={(event) => setCoverLetter(event.target.value)}
              placeholder="Tell the employer why you are a good fit..."
              rows={5}
              value={coverLetter}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
