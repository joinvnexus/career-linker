"use client"

import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const schema = z.object({
  companyName: z.string().min(2).max(120).optional(),
  companyWebsite: z.string().url().optional(),
  companySize: z.string().min(1).max(50).optional(),
  industry: z.string().min(2).max(80).optional(),
  location: z.string().min(2).max(120).optional(),
  companyLogo: z.string().url().optional(),
})

type FormData = z.infer<typeof schema>

export default function EmployerProfilePage() {
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: "",
      companyWebsite: "",
      companySize: "",
      industry: "",
      location: "",
      companyLogo: "",
    },
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/profile/employer")
        const data = await res.json()
        if (data.profile) {
          form.reset({
            companyName: data.profile.companyName || "",
            companyWebsite: data.profile.companyWebsite || "",
            companySize: data.profile.companySize || "",
            industry: data.profile.industry || "",
            location: data.profile.location || "",
            companyLogo: data.profile.companyLogo || "",
          })
        }
      } catch (error) {
        toast.error("Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [form])

  const onSubmit = (values: FormData) => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/profile/employer", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        })
        if (!res.ok) {
          const error = await res.json()
          toast.error(error.error || "Failed to update profile")
          return
        }
        toast.success("Profile updated")
      } catch (error) {
        toast.error("Something went wrong")
      }
    })
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-400">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          Company Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Company Name</Label>
            <Input className="mt-1 h-12" {...form.register("companyName")} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Website</Label>
              <Input className="mt-1 h-12" {...form.register("companyWebsite")} />
            </div>
            <div>
              <Label>Company Size</Label>
              <Input className="mt-1 h-12" {...form.register("companySize")} />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Industry</Label>
              <Input className="mt-1 h-12" {...form.register("industry")} />
            </div>
            <div>
              <Label>Location</Label>
              <Input className="mt-1 h-12" {...form.register("location")} />
            </div>
          </div>
          <div>
            <Label>Company Logo URL</Label>
            <Input className="mt-1 h-12" {...form.register("companyLogo")} />
          </div>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
