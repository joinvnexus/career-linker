"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useState, useTransition, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(50, "Description too short"),
  requirements: z.string().min(20, "Requirements too short"),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryType: z.enum(["Fixed", "Range", "Negotiable"]).optional(),
  location: z.string().min(2, "Location required"),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "REMOTE", "CONTRACT", "INTERNSHIP"]),
  experience: z.enum(["ENTRY", "MID", "SENIOR"]),
  categoryId: z.string(),
})

type FormData = z.infer<typeof schema>

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      location: "",
      jobType: "FULL_TIME",
      experience: "ENTRY",
      categoryId: "",
    },
  })

  useEffect(() => {
    const load = async () => {
      try {
        const [jobRes, catRes] = await Promise.all([
          fetch(`/api/jobs/${params.id}`),
          fetch("/api/categories"),
        ])
        if (!jobRes.ok) throw new Error("Failed to load job")
        const jobData = await jobRes.json()
        const catData = await catRes.json()
        const job = jobData.job
        const cats = catData.categories || []
        setCategories(cats)
        form.reset({
          title: job.title,
          description: job.description,
          requirements: job.requirements,
          salaryMin: job.salaryMin ?? undefined,
          salaryMax: job.salaryMax ?? undefined,
          salaryType: job.salaryType ?? undefined,
          location: job.location,
          jobType: job.jobType,
          experience: job.experience,
          categoryId: job.categoryId,
        })
      } catch (error) {
        toast.error("Failed to load job")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [form, params.id])

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error = await response.json()
          toast.error(error.error || "Failed to update job")
          return
        }

        toast.success("Job updated successfully!")
        router.push("/dashboard/employer/jobs")
      } catch (error) {
        toast.error("Something went wrong")
      }
    })
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-400">
            Loading...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Edit Job
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" {...form.register("title")} className="mt-1 h-14" />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input id="location" {...form.register("location")} className="mt-1 h-14" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label>Salary Range (Optional)</Label>
                <Input
                  type="number"
                  placeholder="Min (e.g. 50000)"
                  className="mt-1 h-14"
                  value={form.watch("salaryMin") ?? ""}
                  onChange={(e) =>
                    form.setValue(
                      "salaryMin",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max (e.g. 80000)"
                  className="mt-1 h-14"
                  value={form.watch("salaryMax") ?? ""}
                  onChange={(e) =>
                    form.setValue(
                      "salaryMax",
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="salaryType">Salary Type</Label>
                <Select
                  value={form.watch("salaryType")}
                  onValueChange={(value) => form.setValue("salaryType" as any, value)}
                >
                  <SelectTrigger className="mt-1 h-14">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Range">Range</SelectItem>
                    <SelectItem value="Negotiable">Negotiable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="jobType">Job Type *</Label>
                <Select
                  value={form.watch("jobType")}
                  onValueChange={(value) => form.setValue("jobType" as any, value)}
                >
                  <SelectTrigger className="mt-1 h-14">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience">Experience Level *</Label>
                <Select
                  value={form.watch("experience")}
                  onValueChange={(value) => form.setValue("experience" as any, value)}
                >
                  <SelectTrigger className="mt-1 h-14">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTRY">Entry Level</SelectItem>
                    <SelectItem value="MID">Mid Level</SelectItem>
                    <SelectItem value="SENIOR">Senior Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="categoryId">Category *</Label>
              <Select
                value={form.watch("categoryId")}
                onValueChange={(value) => form.setValue("categoryId", value)}
              >
                <SelectTrigger className="mt-1 h-14">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <Label>Job Description *</Label>
              <Textarea
                {...form.register("description")}
                rows={6}
                className="mt-1 resize-vertical"
              />
            </div>

            <div>
              <Label>Requirements *</Label>
              <Textarea
                {...form.register("requirements")}
                rows={4}
                className="mt-1 resize-vertical"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-16 bg-gradient-to-r from-blue-600 via-green-600 to-emerald-600 hover:from-blue-700 text-white font-bold text-xl shadow-2xl rounded-2xl"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
