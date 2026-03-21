"use client"

import Link from "next/link"
import { Briefcase, MapPin, DollarSign, Clock, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SaveJobButton } from "@/components/save-job-button"
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

const jobTypeStyles: Record<JobType, string> = {
  FULL_TIME: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PART_TIME: "bg-amber-50 text-amber-700 border-amber-200",
  REMOTE: "bg-sky-50 text-sky-700 border-sky-200",
  CONTRACT: "bg-violet-50 text-violet-700 border-violet-200",
  INTERNSHIP: "bg-orange-50 text-orange-700 border-orange-200",
}

const statusStyles: Record<JobStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  PENDING: "bg-amber-100 text-amber-700",
  EXPIRED: "bg-slate-100 text-slate-600",
  DRAFT: "bg-slate-100 text-slate-600",
  REJECTED: "bg-red-100 text-red-700",
}

const statusLabels: Record<JobStatus, string> = {
  ACTIVE: "Active",
  PENDING: "Pending",
  EXPIRED: "Expired",
  DRAFT: "Draft",
  REJECTED: "Rejected",
}

export function JobCard({ job, employerId, userRole, userId }: JobCardProps) {
  const isExpired = job.status !== "ACTIVE"
  const isOwnJob = userRole === "EMPLOYER" && userId && employerId === userId
  const companyName = job.companyName || "Company"

  const hasSalary = job.salaryMin || job.salaryMax

  return (
    <Card className="group overflow-hidden border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      <CardContent className="p-5">
        {/* Top row: Job type badge and status */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <Badge 
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${jobTypeStyles[job.jobType] || jobTypeStyles.FULL_TIME}`}
            variant="outline"
          >
            {job.jobType.replace("_", " ")}
          </Badge>
          {isExpired && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[job.status]}`}>
              {statusLabels[job.status]}
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/jobs/${job.slug}`} className="block">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
            {job.title}
          </h3>
        </Link>

        {/* Company name */}
        <Link 
          href={`/companies/${employerId}`} 
          className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"
        >
          <Building2 className="h-3.5 w-3.5" />
          {companyName}
        </Link>

        {/* Meta row: Location, Salary, Deadline */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </span>
          
          {hasSalary && (
            <span className="inline-flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-slate-700 font-medium">
                {job.salaryMin ? formatCurrency(job.salaryMin) : "Salary hidden"}
                {job.salaryMax && ` - ${formatCurrency(job.salaryMax)}`}
              </span>
            </span>
          )}
          
          {job.applicationDeadline && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span className={isExpired ? "text-slate-400" : ""}>
                {isExpired ? "Closed" : `Closes ${formatDate(job.applicationDeadline)}`}
              </span>
            </span>
          )}
        </div>

        {/* Bottom row: CTA and Save */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          {isOwnJob ? (
            <Button variant="outline" size="sm" className="rounded-lg" asChild>
              <Link href={`/dashboard/employer/jobs/${job.id}/edit`}>Edit job</Link>
            </Button>
          ) : (
            <Button
              size="sm"
              className="rounded-lg bg-blue-600 px-4 text-sm font-medium hover:bg-blue-700"
              asChild
              disabled={isExpired}
            >
              <Link href={`/jobs/${job.slug}`}>
                {userRole === "JOB_SEEKER" ? "Apply" : "View"}
              </Link>
            </Button>
          )}
          
          <SaveJobButton jobId={job.id} />
        </div>
      </CardContent>
    </Card>
  )
}
