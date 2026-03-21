"use client";

import { cn } from "@/lib/utils";

type StatusType = "ALL" | "PENDING" | "VIEWED" | "INTERVIEW" | "OFFER" | "REJECTED";

interface StatusChipProps {
  status: StatusType;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
}

const statusConfig: Record<StatusType, { label: string; color: string; bgColor: string }> = {
  ALL: { label: "All", color: "text-slate-700", bgColor: "bg-slate-100" },
  PENDING: { label: "Pending", color: "text-amber-700", bgColor: "bg-amber-100" },
  VIEWED: { label: "Viewed", color: "text-blue-700", bgColor: "bg-blue-100" },
  INTERVIEW: { label: "Interview", color: "text-purple-700", bgColor: "bg-purple-100" },
  OFFER: { label: "Offer", color: "text-green-700", bgColor: "bg-green-100" },
  REJECTED: { label: "Rejected", color: "text-red-700", bgColor: "bg-red-100" },
};

export function StatusChip({ status, count, selected, onClick }: StatusChipProps) {
  const config = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all",
        selected
          ? config.bgColor + " " + config.color + " ring-2 ring-offset-1 ring-" + config.color.split("-")[1] + "-400"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      )}
    >
      <span>{config.label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs",
            selected ? "bg-white/50" : "bg-slate-200"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function StatusFilterBar({
  selectedStatus,
  onStatusChange,
  counts,
}: {
  selectedStatus: StatusType;
  onStatusChange: (status: StatusType) => void;
  counts?: Record<StatusType, number>;
}) {
  const statuses: StatusType[] = ["ALL", "PENDING", "VIEWED", "INTERVIEW", "OFFER", "REJECTED"];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {statuses.map((status) => (
        <StatusChip
          key={status}
          status={status}
          count={counts?.[status]}
          selected={selectedStatus === status}
          onClick={() => onStatusChange(status)}
        />
      ))}
    </div>
  );
}
