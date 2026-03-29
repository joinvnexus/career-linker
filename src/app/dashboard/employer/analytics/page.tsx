"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart3, Sparkles, Eye, Users, Briefcase } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Applications",
        data: [12, 19, 8, 15, 11, 17],
        borderColor: "rgb(14, 165, 233)",
        backgroundColor: "rgba(14, 165, 233, 0.12)",
        tension: 0.35,
        fill: true,
      },
      {
        label: "Views",
        data: [30, 45, 32, 28, 35, 40],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.10)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ["Software", "Design", "Marketing", "Sales"],
    datasets: [
      {
        label: "Jobs Posted",
        data: [12, 19, 7, 5],
        backgroundColor: ["#0ea5e9", "#10b981", "#8b5cf6", "#f59e0b"],
        borderRadius: 12,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const summaryCards = [
    { label: "Profile views", value: "40", icon: Eye },
    { label: "Applications", value: "17", icon: Users },
    { label: "Open roles", value: "5", icon: Briefcase },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="surface-inverse relative overflow-hidden rounded-[2rem] border border-white/10 p-5 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.18),_transparent_24%)]" />
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)]">
          <div className="max-w-2xl">
            <div className="eyebrow border-white/10 bg-white/10 text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Hiring analytics
            </div>
            <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] text-white lg:text-5xl">
              Read the signal behind your hiring pipeline.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              Track application momentum, view trends, and spot which job categories are pulling the strongest interest.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {summaryCards.map((item) => (
              <div
                key={item.label}
                className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur sm:p-5"
              >
                <item.icon className="h-5 w-5 text-sky-100" />
                <p className="mt-3 text-3xl font-semibold tracking-tight">{item.value}</p>
                <p className="mt-1 text-sm text-slate-200">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="border-white/80 bg-white/94">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-950">
              <LineChart className="h-5 w-5" />
              Application trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] sm:h-[320px]">
              <Line data={lineData} options={options} />
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/80 bg-white/94">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-950">
              <BarChart3 className="h-5 w-5" />
              Jobs by category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] sm:h-[320px]">
              <Bar data={barData} options={options} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
