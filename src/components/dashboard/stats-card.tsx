import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
};

const trendStyles = {
  up: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  down: "bg-rose-50 text-rose-700 ring-rose-200",
  neutral: "bg-slate-100 text-slate-600 ring-slate-200",
} as const;

export function StatsCard({
  title,
  value,
  change,
  trend = "neutral",
  icon,
}: StatsCardProps) {
  return (
    <Card className="border-white/80 bg-white/94">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </CardTitle>
        </div>
        <div className="rounded-[1rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.9),rgba(240,249,255,0.82))] p-3 text-slate-700 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.3)] ring-1 ring-slate-200/80">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-semibold tracking-[-0.04em] text-slate-950">{value}</div>
        {change ? (
          <div
            className={cn(
              "mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1",
              trendStyles[trend]
            )}
          >
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4" />
            ) : trend === "down" ? (
              <TrendingDown className="h-4 w-4" />
            ) : null}
            <span>{change}</span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
