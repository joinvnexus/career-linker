"use client"

import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, MapPin, Briefcase } from "lucide-react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 12
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    category: "",
    jobType: "",
    experience: "",
  })
  const { data: session } = useSession()

  useEffect(() => {
    // Fetch jobs with filters
    fetchJobs()
  }, [filters, page])


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        const data = await res.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error("Failed to load categories")
      }
    }
    loadCategories()
  }, [])

  const fetchJobs = async () => {
    try {
      if (page === 1) setLoading(true)
      const params = new URLSearchParams({
        ...filters,
        page: String(page),
        limit: String(pageSize),
      })
      const res = await fetch(`/api/jobs?${params.toString()}`)
      const data = await res.json()
      const mappedJobs = (data.jobs || []).map((job: any) => ({
        ...job,
        companyName:
          job.employer?.employerProfile?.companyName ||
          job.employer?.name ||
          "Company",
      }))
      setTotal(data.total || 0)
      setJobs((prev) => (page === 1 ? mappedJobs : [...prev, ...mappedJobs]))
    } catch (error) {
      console.error("Failed to fetch jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const JobSkeleton = () => (
    <div className="space-y-4">
      {[1,2,3,4].map((i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Search */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover thousands of job opportunities from top companies. Start your career journey today.
          </p>
          
          <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-md rounded-3xl p-1 shadow-2xl border border-white/50">
            <div className="flex flex-col lg:flex-row gap-2 p-1">
              <div className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Job title, company, or keywords..."
                    className="h-14 pl-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus-visible:ring-0"
                    value={filters.search}
                    onChange={(e) => {
                      setFilters({ ...filters, search: e.target.value })
                      setPage(1)
                    }}
                  />
                </div>
                <div className="w-64">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Location"
                    className="h-14 pl-12 rounded-2xl border-2 border-gray-200 focus:border-blue-500"
                    value={filters.location}
                    onChange={(e) => {
                      setFilters({ ...filters, location: e.target.value })
                      setPage(1)
                    }}
                  />
                  </div>
                </div>
              </div>
              <Button
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold text-lg shadow-xl whitespace-nowrap"
                onClick={() => setPage(1)}
              >
                Find Jobs
              </Button>
            </div>
          </div>
        </div>

        {/* Filters + Jobs Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-8">
                <Filter className="h-6 w-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Job Type</label>
                  <Select
                    value={filters.jobType || "ALL"}
                    onValueChange={(value) => {
                      setFilters({ ...filters, jobType: value === "ALL" ? "" : value })
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All types</SelectItem>
                      <SelectItem value="FULL_TIME">Full-time</SelectItem>
                      <SelectItem value="PART_TIME">Part-time</SelectItem>
                      <SelectItem value="REMOTE">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Experience</label>
                  <Select
                    value={filters.experience || "ALL"}
                    onValueChange={(value) => {
                      setFilters({ ...filters, experience: value === "ALL" ? "" : value })
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All levels</SelectItem>
                      <SelectItem value="ENTRY">Entry Level</SelectItem>
                      <SelectItem value="MID">Mid Level</SelectItem>
                      <SelectItem value="SENIOR">Senior Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">Category</label>
                  <Select
                    value={filters.category || "ALL"}
                    onValueChange={(value) => {
                      setFilters({ ...filters, category: value === "ALL" ? "" : value })
                      setPage(1)
                    }}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-2xl font-bold text-gray-900">
                  {loading ? "Loading..." : `${total} jobs found`}
                </span>
              </div>
              <Button variant="outline" className="border-2">
                Sort by: Newest
              </Button>
            </div>

            {loading ? (
              <JobSkeleton />
            ) : jobs.length === 0 ? (
              <div className="text-center py-24">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-600">
                  Browse all jobs
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job: any) => (
                  <JobCard 
                    key={job.id} 
                    job={job}
                    employerId={job.employerId}
                    userRole={session?.user?.role}
                    userId={session?.user?.id}
                  />
                ))}
              </div>
            )}

            {!loading && jobs.length > 0 && jobs.length < total && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  className="border-2"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Load more
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

