"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type JobItem = {
  id: string
  title: string
  status: string
  createdAt: string
  published: boolean
  employer?: {
    id: string
    name?: string | null
    email?: string | null
    employerProfile?: { companyName?: string | null }
  }
  category?: { name?: string | null }
}

const statusOptions = ["ACTIVE", "DRAFT", "EXPIRED", "REJECTED"]

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    const load = async () => {
      try {
        const query = statusFilter === "ALL" ? "" : `?status=${statusFilter}`
        const res = await fetch(`/api/admin/jobs${query}`)
        const data = await res.json()
        setJobs(data.jobs || [])
      } catch (error) {
        toast.error("Failed to load jobs")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [statusFilter])

  const updateStatus = async (id: string, status: string) => {
    try {
      const published = status === "ACTIVE"
      const res = await fetch(`/api/admin/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, published }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to update job")
        return
      }
      setJobs((prev) =>
        prev.map((job) =>
          job.id === id ? { ...job, status, published } : job
        )
      )
      toast.success("Job updated")
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
          <h1 className="text-3xl font-bold text-gray-900">Job Moderation</h1>
          <p className="text-gray-600">Approve or reject jobs</p>
        </div>
        <div className="w-full md:w-56">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 rounded-xl">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {jobs.length === 0 ? (
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">No jobs found</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Try a different filter.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => {
            const employerName =
              job.employer?.employerProfile?.companyName ||
              job.employer?.name ||
              "Employer"
            return (
              <Card key={job.id} className="border-0 shadow-md">
                <CardContent className="py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {job.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {employerName} • {job.category?.name || "General"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Status: {job.status} • {job.published ? "Published" : "Hidden"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => updateStatus(job.id, "ACTIVE")}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => updateStatus(job.id, "REJECTED")}
                    >
                      Reject
                    </Button>
                    <Select
                      value={job.status}
                      onValueChange={(value) => updateStatus(job.id, value)}
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
