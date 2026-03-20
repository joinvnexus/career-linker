"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SaveJobButton } from "@/components/save-job-button"
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react"
import { JobType, JobStatus } from "@prisma/client"
import { formatCurrency, formatDate } from "@/lib/utils"

interface JobCardProps {
  job: {
    id: string
    slug: string
    title: string
    companyName?: string
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
  userId?: string
}

export function JobCard({ job, employerId, userRole, userId }: JobCardProps) {
  const isExpired = job.status !== "ACTIVE"
  const isOwnJob = userRole === "EMPLOYER" && userId && employerId === userId
  const companyName = job.companyName || "Company"

  return (
    <Card className="group overflow-hidden border-0 bg-white transition-all duration-300 hover:shadow-xl">
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
          <CardTitle className="line-clamp-2 text-lg font-bold leading-snug transition-colors group-hover:text-blue-600">
            {job.title}
          </CardTitle>
        </Link>
        
        <div className="flex items-center gap-4 pt-1 text-sm text-muted-foreground">
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
        </div>
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
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-xs h-9 px-4"
                asChild
              >
                <Link href={`/jobs/${job.slug}`}>
                  {userRole === "JOB_SEEKER" ? "Apply Now" : "View Details"}
                </Link>
              </Button>
            )}
            <SaveJobButton jobId={job.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

