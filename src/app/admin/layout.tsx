"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Shield, Users, Briefcase } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session || session.user.role !== "ADMIN") {
      router.replace("/unauthorized")
    }
  }, [status, session, router])

  if (status === "loading") return <div>Loading...</div>
  if (!session || session.user.role !== "ADMIN") return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <Shield className="h-6 w-6 text-blue-600" />
            <span>HireHub Admin</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-semibold text-gray-600">
            <Link href="/admin/jobs" className="hover:text-blue-600">
              Jobs
            </Link>
            <Link href="/admin/users" className="hover:text-blue-600">
              Users
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="bg-white rounded-2xl border p-4 h-fit">
          <nav className="space-y-2 text-sm font-medium text-gray-700">
            <Link
              href="/admin/jobs"
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600"
            >
              <Briefcase className="h-4 w-4" />
              Jobs
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600"
            >
              <Users className="h-4 w-4" />
              Users
            </Link>
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  )
}
