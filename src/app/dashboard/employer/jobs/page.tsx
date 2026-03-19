"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, Edit, Trash2, MapPin, DollarSign } from "lucide-react"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"

type EmployerJob = {
  id: string
  title: string
  status: string
  createdAt: string
  location: string
  salaryMin?: number | null
}

export default function EmployerJobsPage() {
  const { data: session } = useSession()
  const [jobs, setJobs] = useState<EmployerJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchMyJobs()
    }
  }, [session])

  const fetchMyJobs = async () => {
    try {
      const res = await fetch(`/api/jobs/my-jobs`)
      const data = await res.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error("Failed to fetch jobs")
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return
    
    try {
      await fetch(`/api/jobs/${jobId}`, { method: "DELETE" })
      fetchMyJobs() // Refresh list
    } catch (error) {
      console.error("Failed to delete job")
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-64 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-600 mt-1">
            Manage your active job postings ({jobs.length})
          </p>
        </div>
        <Link href="/dashboard/employer/post-job">
          <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 text-white shadow-lg h-12 px-8">
            <Plus className="mr-2 h-5 w-5" />
            Post New Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <CardTitle className="text-2xl">No jobs posted yet</CardTitle>
            <CardDescription>
              Post your first job to start receiving applications from qualified candidates.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard/employer/post-job">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                Post Your First Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job: any) => (
            <Card key={job.id} className="hover:shadow-xl transition-all group">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {job.status.replace("_", " ")}
                      </span>
                      <span className="text-sm text-gray-500">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all ml-auto">
                    <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteJob(job.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salaryMin ? `$${job.salaryMin}k+` : "Competitive"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

