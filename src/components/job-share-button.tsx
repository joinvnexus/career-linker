"use client";

import { useState } from "react";
import { Share2, Check, Copy, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";

interface JobShareButtonProps {
  jobTitle: string;
  companyName?: string;
  jobSlug: string;
}

export function JobShareButton({
  jobTitle,
  companyName,
  jobSlug,
}: JobShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const jobUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/jobs/${jobSlug}` 
    : `/jobs/${jobSlug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleShare = (platform: string) => {
    const text = `${jobTitle} at ${companyName || "a great company"}`;
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(jobUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${jobTitle} - ${companyName || "Hiring"}`,
          text: `Check out this job opportunity: ${jobTitle}`,
          url: jobUrl,
        });
      } catch {
        // User cancelled or error
      }
    }
  };

  return (
    <Dropdown
      label={
        <Button variant="outline" size="sm" className="w-full gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      }
      align="left"
      className="w-full"
      menuClassName="w-56"
    >
      <DropdownItem onClick={handleNativeShare} className="cursor-pointer">
        <Share2 className="mr-2 h-4 w-4" />
        Share via...
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem onClick={() => handleShare("twitter")} className="cursor-pointer">
        <Twitter className="mr-2 h-4 w-4 text-sky-500" />
        Twitter
      </DropdownItem>
      <DropdownItem onClick={() => handleShare("linkedin")} className="cursor-pointer">
        <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
        LinkedIn
      </DropdownItem>
      <DropdownSeparator />
      <DropdownItem onClick={handleCopyLink} className="cursor-pointer">
        {copied ? (
          <>
            <Check className="mr-2 h-4 w-4 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="mr-2 h-4 w-4" />
            Copy link
          </>
        )}
      </DropdownItem>
    </Dropdown>
  );
}
