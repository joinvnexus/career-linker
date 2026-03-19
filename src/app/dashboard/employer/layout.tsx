"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Briefcase, Settings, Users } from "lucide-react"

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session || session.user.role !== "EMPLOYER") {
      router.replace("/unauthorized")
    }
  }, [status, session, router])

  if (status === "loading") return <div>Loading...</div>
  if (!session || session.user.role !== "EMPLOYER") return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
              <Briefcase className="h-6 w-6 text-blue-600" />
              <span>HireHub Employer</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/employer/jobs">
                <Button variant="ghost">My Jobs</Button>
              </Link>
              <Link href="/dashboard/employer/post-job">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700">
                  Post New Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex">
        <aside className="w-64 bg-white border-r shadow-sm">
          <nav className="p-6 space-y-2">
            <Link href="/dashboard/employer/jobs" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium">
              <LayoutGrid className="h-5 w-5" />
              <span>My Jobs</span>
            </Link>
            <Link href="/dashboard/employer/applicants" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-gray-50">
              <Users className="h-5 w-5" />
              <span>Applicants</span>
            </Link>
            <Link href="/dashboard/employer/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-gray-50">
              <Settings className="h-5 w-5" />
              <span>Company Settings</span>
            </Link>
          </nav>
        </aside>
        
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

