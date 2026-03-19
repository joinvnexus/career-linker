"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type UserItem = {
  id: string
  name?: string | null
  email?: string | null
  role: string
  createdAt: string
}

const roleOptions = ["JOB_SEEKER", "EMPLOYER", "ADMIN"]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/users")
        const data = await res.json()
        setUsers(data.users || [])
      } catch (error) {
        toast.error("Failed to load users")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const updateRole = async (id: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to update user")
        return
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role } : u))
      )
      toast.success("Role updated")
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="h-24 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Manage roles for users</p>
      </div>

      {users.length === 0 ? (
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">No users found</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-gray-600">
            Users will appear here after registration.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="border-0 shadow-md">
              <CardContent className="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {user.name || "Unnamed"}
                  </div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
                <Select value={user.role} onValueChange={(value) => updateRole(user.id, value)}>
                  <SelectTrigger className="h-10 rounded-xl w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
