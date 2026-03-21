"use client";

import Link from "next/link";
import { MapPin, Building2, Clock, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ApplicationStatus = "PENDING" | "VIEWED" | "INTERVIEW" | "OFFER" | "REJECTED";

interface ApplicationCardProps {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: string;
  onView?: () => void;
  onWithdraw?: () => void;
}

const statusConfig: Record<ApplicationStatus, { label: string; color: string; bgColor: string; icon: string }> = {
  PENDING: { label: "Pending", color: "text-amber-700", bgColor: "bg-amber-100", icon: "⏳" },
  VIEWED: { label: "Viewed", color: "text-blue-700", bgColor: "bg-blue-100", icon: "👁" },
  INTERVIEW: { label: "Interview", color: "text-purple-700", bgColor: "bg-purple-100", icon: "📅" },
  OFFER: { label: "Offer", color: "text-green-700", bgColor: "bg-green-100", icon: "🎉" },
  REJECTED: { label: "Rejected", color: "text-red-700", bgColor: "bg-red-100", icon: "❌" },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ApplicationCard({
  id,
  jobTitle,
  companyName,
  location,
  status,
  appliedDate,
  onView,
}: ApplicationCardProps) {
  const config = statusConfig[status];

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
            <Building2 className="h-6 w-6 text-white" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link href={`/jobs/${id}`} className="block">
                  <h3 className="truncate font-semibold text-slate-900 hover:text-blue-600">
                    {jobTitle}
                  </h3>
                </Link>
                <p className="mt-0.5 truncate text-sm text-slate-500">{companyName}</p>
              </div>
              <span
                className={`flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${config.bgColor} ${config.color}`}
              >
                {config.label}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(appliedDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Action */}
        <div className="mt-4 flex items-center justify-end">
          <Link href={`/jobs/${id}`}>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              View Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function ApplicationCardSkeleton() {
  return (
    <Card className="animate-pulse border border-slate-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-200" />
          <div className="flex-1">
            <div className="h-5 w-3/4 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
            <div className="mt-3 flex gap-3">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="h-3 w-16 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
