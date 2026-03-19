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
import { Loader2, CheckCircle } from "lucide-react"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(50, "Description too short"),
  requirements: z.string().min(20, "Requirements too short"),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  location: z.string().min(2, "Location required"),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "REMOTE", "CONTRACT", "INTERNSHIP"]),
  experience: z.enum(["ENTRY", "MID", "SENIOR"]),
  categoryId: z.string(),
})

type FormData = z.infer<typeof schema>

export default function PostJobPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)

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

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error = await response.json()
          toast.error(error.error || "Failed to post job")
          return
        }

        toast.success("Job posted successfully!")
        setSuccess(true)
        setTimeout(() => router.push("/dashboard/employer/jobs"), 1500)
      } catch (error) {
        toast.error("Something went wrong")
      }
    })
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
              Job Posted Successfully!
            </CardTitle>
            <CardContent className="pt-0">
              <p className="text-gray-600 text-lg">
                Your job is now live and candidates can start applying.
              </p>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Post a New Job
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" {...form.register("title")} className="mt-1 h-14" />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input id="location" {...form.register("location")} className="mt-1 h-14" />
              </div>
            </div>

            {/* Salary */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <Label>Salary Range (Optional)</Label>
                <Input 
                  type="number" 
                  placeholder="Min (e.g. 50000)"
                  className="mt-1 h-14"
                  onChange={(e) => form.setValue("salaryMin" as any, parseFloat(e.target.value) || undefined)}
                />
              </div>
              <div>
                <Input 
                  type="number" 
                  placeholder="Max (e.g. 80000)"
                  className="mt-1 h-14"
                  onChange={(e) => form.setValue("salaryMax" as any, parseFloat(e.target.value) || undefined)}
                />
              </div>
              <div>
                <Label htmlFor="salaryType">Salary Type</Label>
                <Select onValueChange={(value) => form.setValue("salaryType" as any, value)}>
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

            {/* Job Type + Experience */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="jobType">Job Type *</Label>
                <Select onValueChange={(value) => form.setValue("jobType" as any, value)}>
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
                <Select onValueChange={(value) => form.setValue("experience" as any, value)}>
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

            {/* Description */}
            <div>
              <Label>Job Description *</Label>
              <Textarea 
                {...form.register("description")} 
                rows={6} 
                className="mt-1 resize-vertical"
                placeholder="Tell candidates about this role, what they will be doing day to day..."
              />
            </div>

            {/* Requirements */}
            <div>
              <Label>Requirements *</Label>
              <Textarea 
                {...form.register("requirements")} 
                rows={4} 
                className="mt-1 resize-vertical"
                placeholder="What skills and experience are required?..."
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
                  Posting job...
                </>
              ) : (
                "Post Job Now"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

