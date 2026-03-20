import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatsCardProps = {
  title: string;
  value: number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
};

export function StatsCard({
  title,
  value,
  change,
  trend = "neutral",
  icon,
}: StatsCardProps) {
  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className="text-slate-500">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {change ? (
          <div className="mt-2 flex items-center gap-2 text-sm">
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) : trend === "down" ? (
              <TrendingDown className="h-4 w-4 text-rose-600" />
            ) : null}
            <span
              className={
                trend === "up"
                  ? "text-emerald-600"
                  : trend === "down"
                    ? "text-rose-600"
                    : "text-slate-500"
              }
            >
              {change}
            </span>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
