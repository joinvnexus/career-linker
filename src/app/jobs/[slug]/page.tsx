import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MapPin, Briefcase, DollarSign, Clock } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { JobApplyCard } from "@/components/job-apply-card"

export default async function JobDetailsPage({
  params,
}: {
  params: { slug: string }
}) {
  const job = await prisma.job.findFirst({
    where: {
      slug: params.slug,
      published: true,
    },
    include: {
      employer: {
        select: {
          id: true,
          name: true,
          employerProfile: {
            select: { companyName: true, companyWebsite: true },
          },
        },
      },
      category: {
        select: { name: true },
      },
    },
  })

  if (!job) return notFound()

  const companyName =
    job.employer?.employerProfile?.companyName || job.employer?.name || "Company"

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {job.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{job.jobType.replace("_", " ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                {job.applicationDeadline && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Closes {formatDate(job.applicationDeadline)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href={`/companies/${job.employer?.id}`}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold text-center"
              >
                {companyName}
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-semibold text-gray-900">
                  {job.salaryMin ? formatCurrency(job.salaryMin) : "Salary hidden"}
                  {job.salaryMax && ` - ${formatCurrency(job.salaryMax)}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 p-4">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-semibold text-gray-900">
                  {job.experience.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Job Description</h2>
              <p className="mt-3 text-gray-700 whitespace-pre-line">
                {job.description}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Requirements</h2>
              <p className="mt-3 text-gray-700 whitespace-pre-line">
                {job.requirements}
              </p>
            </div>
            <JobApplyCard jobId={job.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
