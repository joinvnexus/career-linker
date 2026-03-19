"use client"

import { UploadButton } from "@/lib/uploadthing"

export function ResumeUploader({
  onUploaded,
}: {
  onUploaded: (url: string) => void
}) {
  return (
    <UploadButton
      endpoint="resumeUploader"
      onClientUploadComplete={(res) => {
        const url = res?.[0]?.ufsUrl
        if (url) onUploaded(url)
      }}
      onUploadError={(error) => {
        console.error("Upload failed:", error)
      }}
      appearance={{
        button:
          "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold h-10 px-4 rounded-xl",
        allowedContent: "text-xs text-gray-500",
        container: "items-start",
      }}
      content={{
        button: "Upload Resume (PDF)",
      }}
    />
  )
}
