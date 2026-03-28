"use client";

import { cn } from "@/lib/utils";

type StatusType = "ALL" | "PENDING" | "VIEWED" | "INTERVIEW" | "OFFER" | "REJECTED";

interface StatusChipProps {
  status: StatusType;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
}

const statusConfig: Record<
  StatusType,
  {
    label: string;
    selectedClass: string;
    idleClass: string;
  }
> = {
  ALL: {
    label: "All",
    selectedClass: "bg-slate-950 text-white ring-slate-900/20",
    idleClass: "bg-slate-100 text-slate-600 hover:bg-slate-200",
  },
  PENDING: {
    label: "Pending",
    selectedClass: "bg-amber-50 text-amber-700 ring-amber-200",
    idleClass: "bg-slate-100 text-slate-600 hover:bg-slate-200",
  },
  VIEWED: {
    label: "Viewed",
    selectedClass: "bg-sky-50 text-sky-700 ring-sky-200",
    idleClass: "bg-slate-100 text-slate-600 hover:bg-slate-200",
  },
  INTERVIEW: {
    label: "Interview",
    selectedClass: "bg-violet-50 text-violet-700 ring-violet-200",
    idleClass: "bg-slate-100 text-slate-600 hover:bg-slate-200",
  },
  OFFER: {
    label: "Offer",
    selectedClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    idleClass: "bg-slate-100 text-slate-600 hover:bg-slate-200",
  },
  REJECTED: {
    label: "Rejected",
    selectedClass: "bg-rose-50 text-rose-700 ring-rose-200",
    idleClass: "bg-slate-100 text-slate-600 hover:bg-slate-200",
  },
};

export function StatusChip({ status, count, selected, onClick }: StatusChipProps) {
  const config = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ring-1 ring-transparent",
        selected ? config.selectedClass : config.idleClass
      )}
      type="button"
    >
      <span>{config.label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
            selected ? "bg-white/70 text-current" : "bg-white/70 text-slate-500"
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
