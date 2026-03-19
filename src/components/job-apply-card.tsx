"use client"

import { useSession } from "next-auth/react"
import { useState, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

export function JobApplyCard({ jobId }: { jobId: string }) {
  const { data: session, status } = useSession()
  const [isPending, startTransition] = useTransition()
  const [resumeUrl, setResumeUrl] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = () => {
    setMessage(null)
    startTransition(async () => {
      try {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId, resumeUrl, coverLetter }),
        })
        const data = await res.json()
        if (!res.ok) {
          setMessage(data.error || "Failed to apply")
          return
        }
        setMessage("Application submitted!")
        setResumeUrl("")
        setCoverLetter("")
      } catch (error) {
        setMessage("Something went wrong")
      }
    })
  }

  if (status === "loading") return null

  if (!session?.user) {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Apply to this job</CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
            <Link href="/login">Sign in to apply</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (session.user.role !== "JOB_SEEKER") {
    return (
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Apply to this job</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Only job seekers can apply.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle>Apply to this job</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <div className="text-sm font-medium text-gray-700">{message}</div>
        )}
        <div className="space-y-2">
          <Label>Resume URL</Label>
          <Input
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label>Cover Letter (optional)</Label>
          <Textarea
            rows={4}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            placeholder="Briefly tell us why you are a good fit..."
          />
        </div>
        <Button
          onClick={onSubmit}
          disabled={isPending}
          className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
