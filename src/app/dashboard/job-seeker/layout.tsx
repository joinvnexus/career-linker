import Link from "next/link"

export default function JobSeekerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Job Seeker</h1>
          <nav className="flex gap-4 text-sm font-semibold text-gray-600">
            <Link href="/dashboard/job-seeker/profile" className="hover:text-blue-600">
              Profile
            </Link>
            <Link href="/dashboard/job-seeker/applications" className="hover:text-blue-600">
              Applications
            </Link>
          </nav>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </div>
    </div>
  )
}
