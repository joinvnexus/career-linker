"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin } from "lucide-react"

type ApplicationItem = {
  id: string
  status: string
  createdAt: string
  job: {
    id: string
    slug: string
    title: string
    location: string
    employer?: {
      id: string
      name?: string | null
      employerProfile?: { companyName?: string | null }
    }
  }
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/applications/my")
        const data = await res.json()
        setApplications(data.applications || [])
      } catch (error) {
        console.error("Failed to load applications")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="h-24 animate-pulse" />
        ))}
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <CardTitle className="text-2xl">No applications yet</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/jobs">
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
              Browse Jobs
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {applications.map((app) => {
        const companyName =
          app.job.employer?.employerProfile?.companyName ||
          app.job.employer?.name ||
          "Company"
        return (
          <Card key={app.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Link href={`/jobs/${app.job.slug}`} className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                  {app.job.title}
                </Link>
                <div className="mt-1 text-sm text-gray-600 flex items-center gap-3">
                  <span>{companyName}</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{app.job.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {app.status.replace("_", " ")}
                </span>
                <Link href={`/jobs/${app.job.slug}`}>
                  <Button variant="outline">View</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
