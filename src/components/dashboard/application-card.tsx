"use client";

import Link from "next/link";
import {
  MapPin,
  Building2,
  Clock3,
  ChevronRight,
  Eye,
  CalendarDays,
  CircleCheckBig,
  CircleX,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

const statusConfig: Record<
  ApplicationStatus,
  {
    label: string;
    tone: string;
    accent: string;
    Icon: typeof Clock3;
    note: string;
  }
> = {
  PENDING: {
    label: "Pending",
    tone: "bg-amber-50 text-amber-700 ring-amber-100",
    accent: "from-amber-400 to-orange-400",
    Icon: Clock3,
    note: "Awaiting employer review",
  },
  VIEWED: {
    label: "Viewed",
    tone: "bg-sky-50 text-sky-700 ring-sky-100",
    accent: "from-sky-500 to-cyan-400",
    Icon: Eye,
    note: "Recruiter opened your application",
  },
  INTERVIEW: {
    label: "Interview",
    tone: "bg-violet-50 text-violet-700 ring-violet-100",
    accent: "from-violet-500 to-indigo-400",
    Icon: CalendarDays,
    note: "You are moving to the next stage",
  },
  OFFER: {
    label: "Offer",
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    accent: "from-emerald-500 to-teal-400",
    Icon: CircleCheckBig,
    note: "Strong progress on this opportunity",
  },
  REJECTED: {
    label: "Rejected",
    tone: "bg-rose-50 text-rose-700 ring-rose-100",
    accent: "from-rose-500 to-pink-400",
    Icon: CircleX,
    note: "Keep momentum with other roles",
  },
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
}: ApplicationCardProps) {
  const config = statusConfig[status];

  return (
    <Card className="overflow-hidden border-white/80 bg-white/94">
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 gap-4">
            <div
              className={cn(
                "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[1.2rem] bg-gradient-to-br text-white shadow-lg",
                config.accent
              )}
            >
              <Building2 className="h-6 w-6" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-start gap-3">
                <Link href={`/jobs/${id}`} className="block">
                  <h3 className="text-lg font-semibold tracking-tight text-slate-950 transition-colors hover:text-sky-700">
                    {jobTitle}
                  </h3>
                </Link>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ring-1",
                    config.tone
                  )}
                >
                  {config.label}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-600">{companyName}</p>
              <p className="mt-2 text-sm text-slate-500">{config.note}</p>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {location}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  Applied {formatDate(appliedDate)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end xl:justify-start">
            <Link href={`/jobs/${id}`}>
              <Button variant="outline" size="sm">
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ApplicationCardSkeleton() {
  return (
    <Card className="border-white/80 bg-white/94">
      <CardContent className="p-5">
        <div className="animate-pulse">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-[1.2rem] bg-slate-200" />
            <div className="flex-1">
              <div className="h-5 w-3/4 rounded-full bg-slate-200" />
              <div className="mt-2 h-4 w-1/2 rounded-full bg-slate-200" />
              <div className="mt-4 flex gap-3">
                <div className="h-8 w-28 rounded-full bg-slate-200" />
                <div className="h-8 w-32 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
