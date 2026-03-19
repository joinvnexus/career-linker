"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Phone } from "lucide-react"

type EmployerJob = {
  id: string
  title: string
}

type ApplicationItem = {
  id: string
  status: string
  createdAt: string
  job: { id: string; title: string; location: string }
  seeker: {
    id: string
    name?: string | null
    email?: string | null
    jobSeekerProfile?: {
      headline?: string | null
      location?: string | null
      resumeUrl?: string | null
      phone?: string | null
    } | null
  }
}

const statusOptions = [
  "PENDING",
  "SHORTLISTED",
  "INTERVIEW",
  "REJECTED",
  "HIRED",
]

export default function EmployerApplicantsPage() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<EmployerJob[]>([])
  const [applications, setApplications] = useState<ApplicationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [jobFilter, setJobFilter] = useState<string>("ALL")

  useEffect(() => {
    const load = async () => {
      if (!session?.user?.id) return
      try {
        const jobsRes = await fetch("/api/jobs/my-jobs")
        const jobsData = await jobsRes.json()
        setJobs(jobsData.jobs || [])

        const appsRes = await fetch("/api/applications/employer")
        const appsData = await appsRes.json()
        setApplications(appsData.applications || [])
      } catch (error) {
        toast.error("Failed to load applicants")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [session])

  const filteredApplications =
    jobFilter === "ALL"
      ? applications
      : applications.filter((app) => app.job.id === jobFilter)

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to update status")
        return
      }
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      )
      toast.success("Status updated")
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="h-24 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
          <p className="text-gray-600">Manage candidates for your jobs</p>
        </div>
        <div className="w-full md:w-72">
          <Select value={jobFilter} onValueChange={setJobFilter}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Filter by job" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All jobs</SelectItem>
              {jobs.map((job) => (
                <SelectItem key={job.id} value={job.id}>
                  {job.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">No applicants yet</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Publish jobs and you’ll see applications here.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredApplications.map((app) => {
            const profile = app.seeker.jobSeekerProfile
            return (
              <Card key={app.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-gray-900">
                      {app.seeker.name || "Candidate"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {profile?.headline || "Job Seeker"}
                    </div>
                    <div className="text-sm text-gray-600 flex flex-wrap items-center gap-3">
                      {app.seeker.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {app.seeker.email}
                        </span>
                      )}
                      {profile?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {profile.phone}
                        </span>
                      )}
                      {profile?.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {profile.location}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Applied for: {app.job.title} • {app.job.location}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {profile?.resumeUrl ? (
                      <Button variant="outline" asChild>
                        <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
                          View Resume
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        No Resume
                      </Button>
                    )}
                    <Select
                      value={app.status}
                      onValueChange={(value) => updateStatus(app.id, value)}
                    >
                      <SelectTrigger className="h-10 rounded-xl w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
