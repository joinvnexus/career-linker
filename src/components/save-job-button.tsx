"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type SaveJobButtonProps = {
  jobId: string;
  initialSaved?: boolean;
};

export function SaveJobButton({
  jobId,
  initialSaved = false,
}: SaveJobButtonProps) {
  const { data: session, status } = useSession();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  if (status === "loading") {
    return (
      <Button disabled size="icon" variant="ghost">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  if (!session?.user || session.user.role !== "JOB_SEEKER") {
    return (
      <Button asChild size="icon" variant="ghost">
        <Link href="/login">
          <Bookmark className="h-4 w-4" />
        </Link>
      </Button>
    );
  }

  const onToggle = (): void => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/users/saved-jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });
        const data = (await response.json()) as { message?: string; error?: string };

        if (!response.ok) {
          toast.error(data.error || "Failed to update saved jobs");
          return;
        }

        const nextSaved = data.message === "Saved";
        setSaved(nextSaved);
        toast.success(nextSaved ? "Job saved" : "Job removed");
      } catch {
        toast.error("Failed to update saved jobs");
      }
    });
  };

  return (
    <Button
      aria-label={saved ? "Remove saved job" : "Save job"}
      className={saved ? "text-sky-700" : ""}
      disabled={isPending}
      onClick={onToggle}
      size="icon"
      type="button"
      variant="ghost"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
      )}
    </Button>
  );
}
