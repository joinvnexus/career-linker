"use client"

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock, FileText, Send, User, Mail, Phone, GraduationCap, Award } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const applySchema = z.object({
  coverLetter: z.string().optional(),
  resumeUrl: z.string().optional(),
});

type ApplyFormData = z.infer<typeof applySchema>;

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState(null);
  const [applyLoading, setApplyLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const form = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
  });

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/jobs/${job.id || params.slug}?include=applications`);
      const data = await res.json();
      setJob(data.job);
    } catch (error) {
      toast.error("Failed to load job");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (data: ApplyFormData) {
    if (!session || !job) return;

    setApplyLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          ...data,
        }),
      });

      if (res.ok) {
        toast.success("Application submitted successfully!");
        setShowApplyModal(false);
        form.reset();
        // Refresh job to show new application
        fetchJob();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to apply");
      }
    } catch (error) {
      toast.error("Failed to apply");
    } finally {
      setApplyLoading(false);
    }
  };

  // Fetch job by slug or id
  useEffect(() => {
    if (params.slug) {
      // Find job by slug - for MVP use id if needed, or adjust API
      // Temporary: use recent logic or fetch all (for MVP assume slug = id or adjust)
      const res = await fetch(`/api/jobs?slug=${params.slug}`);
        const data = await res.json();
        if (data.jobs && data.jobs[0]) {
          setJob(data.jobs[0]);
        }
        setLoading(false);
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isApplied = session?.user?.id && job.applications?.some((app) => app.seekerId === session.user.id);
  const isOwner = session?.user?.role === "EMPLOYER" && session.user.id === job.employerId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to results
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Header */}
            <Card className="border-0 shadow-xl overflow-hidden bg-gradient-to-r from-blue-50 to-emerald-50">
              <CardContent className="p-8 pt-12">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                      <Briefcase className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{job.companyName || job.employer?.name || "Company"}</h1>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                        {job.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isOwner ? (
                      <>
                        <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>
                          <Button variant="outline">Edit Job</Button>
                        </Link>
                        <Button variant="destructive">Delete</Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => setShowApplyModal(true)}
                        disabled={isApplied || status !== "authenticated"}
                        className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 text-lg px-8 h-14 font-bold shadow-xl"
                      >
                        {isApplied ? "Applied" : "Apply Now"}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Job Meta */}
                <div className="flex flex-wrap gap-4 mb-8 text-sm">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    {job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : "Competitive"}
                    {job.salaryMax && ` - $${job.salaryMax.toLocaleString()}`}
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2 h-auto">
                    {job.jobType.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline" className="text-lg px-4 py-2 h-auto">
                    {job.experience.replace("_", " ")} Level
                  </Badge>
                  {job.applicationDeadline && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl">
                      <Clock className="h-4 w-4" />
                      Closes {new Date(job.applicationDeadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">About the Role</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-0">
                <div>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Responsibilities
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    {job.responsibilities ? job.responsibilities.split('\n').map((line, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{line.trim()}</span>
                      </li>
                    )) : <p>No responsibilities listed.</p>}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Requirements
                  </h3>
                  <div className="bg-blue-50 p-6 rounded-2xl">
                    <p className="whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Job Description
                  </h3>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{job.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Company Info */}
            <Card className="border-0 shadow-xl sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="h-6 w-6" />
                  Company
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-bold text-xl">{job.companyName || "Company"}</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    <span>Growing fast</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>50-200 employees</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-emerald-600">
                  Company Page
                </Button>
              </CardContent>
            </Card>

            {/* Applications */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest candidates (5)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.applications?.slice(0, 5).map((app) => (
                  <div key={app.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{app.seeker.name}</p>
                      <p className="text-xs text-gray-500">{app.status.replace("_", " ")}</p>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</div>
                  </div>
                )) || <p className="text-gray-500 text-sm text-center py-8">No applications yet</p>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Apply for {job.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(handleApply)} className="space-y-4">
                <div>
                  <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                  <Textarea 
                    id="coverLetter" 
                    {...form.register("coverLetter")}
                    rows={4}
                    placeholder="Tell the employer why you're perfect for this role..."
                  />
                </div>
                <div>
                  <Label htmlFor="resumeUrl">Resume URL or Upload (Optional)</Label>
                  <Input 
                    id="resumeUrl"
                    {...form.register("resumeUrl")}
                    placeholder="https://your-resume-link or upload"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowApplyModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600" disabled={applyLoading}>
                    {applyLoading ? "Applying..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

