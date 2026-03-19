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
import { ResumeUploader } from "@/components/resume-uploader"

const schema = z.object({
  headline: z.string().min(2).max(120).optional(),
  phone: z.string().min(7).max(20).optional(),
  location: z.string().min(2).max(120).optional(),
  resumeUrl: z.string().url().optional(),
})

type FormData = z.infer<typeof schema>

export default function JobSeekerProfilePage() {
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      headline: "",
      phone: "",
      location: "",
      resumeUrl: "",
    },
  })

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/profile/job-seeker")
        const data = await res.json()
        if (data.profile) {
          form.reset({
            headline: data.profile.headline || "",
            phone: data.profile.phone || "",
            location: data.profile.location || "",
            resumeUrl: data.profile.resumeUrl || "",
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
        const res = await fetch("/api/profile/job-seeker", {
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
          My Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Professional Headline</Label>
            <Input
              className="mt-1 h-12"
              {...form.register("headline")}
              placeholder="e.g. Junior Frontend Developer"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Phone</Label>
              <Input className="mt-1 h-12" {...form.register("phone")} />
            </div>
            <div>
              <Label>Location</Label>
              <Input className="mt-1 h-12" {...form.register("location")} />
            </div>
          </div>
          <div>
            <Label>Resume URL</Label>
            <Input
              className="mt-1 h-12"
              {...form.register("resumeUrl")}
              placeholder="https://..."
            />
            <div className="mt-3">
              <ResumeUploader
                onUploaded={(url) => {
                  form.setValue("resumeUrl", url, { shouldDirty: true })
                  form.handleSubmit(onSubmit)()
                }}
              />
            </div>
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
