"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, MapPin, DollarSign, Clock, Bookmark } from "lucide-react"
import { JobType, JobStatus } from "@prisma/client"
import { formatCurrency, formatDate } from "@/lib/utils"

interface JobCardProps {
  job: {
    id: string
    slug: string
    title: string
    companyName: string
    companySlug?: string
    location: string
    salaryMin?: number
    salaryMax?: number
    salaryType?: string
    jobType: JobType
    status: JobStatus
    createdAt: string
    applicationDeadline?: string
  }
  employerId: string
  userRole?: string
}

export function JobCard({ job, employerId, userRole }: JobCardProps) {
  const isExpired = job.status !== "ACTIVE"
  const isOwnJob = userRole === "EMPLOYER" && employerId === "current-user-id" // Replace with session
  const companyName = job.companyName || "Company"

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Briefcase className="h-4 w-4" />
            <span>{job.jobType.replace("_", " ")}</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          {isExpired && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
              Expired
            </span>
          )}
        </div>
        
        <Link href={`/jobs/${job.slug}`} className="block">
          <CardTitle className="group-hover:text-blue-600 transition-colors font-bold text-xl leading-tight line-clamp-2">
            {job.title}
          </CardTitle>
        </Link>
        
        <CardDescription className="flex items-center gap-4 text-sm pt-1">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span>
              {job.salaryMin ? formatCurrency(job.salaryMin) : "Salary hidden"}
              {job.salaryMax && ` - ${formatCurrency(job.salaryMax)}`}
            </span>
          </div>
          {job.applicationDeadline && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Closes {formatDate(job.applicationDeadline)}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 pb-4">
        <div className="flex items-center justify-between">
          <Link href={`/companies/${employerId}`} className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
            {companyName}
          </Link>
          
          <div className="flex gap-2">
            {isOwnJob ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>Edit</Link>
              </Button>
            ) : (
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-xs h-9 px-4">
                {userRole === "JOB_SEEKER" ? "Apply Now" : "View Details"}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-9 w-9 p-0">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

