import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Megaphone,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/components/home/types";

type HomeCategoriesSectionProps = {
  categories: Category[];
  loading: boolean;
};

const getCategoryMeta = (name: string) => {
  const normalized = name.toLowerCase();

  if (normalized.includes("design") || normalized.includes("ui") || normalized.includes("ux")) {
    return {
      icon: Palette,
      accent: "bg-fuchsia-100 text-fuchsia-700",
      hint: "Creative systems",
    };
  }

  if (
    normalized.includes("market") ||
    normalized.includes("growth") ||
    normalized.includes("sales")
  ) {
    return {
      icon: Megaphone,
      accent: "bg-amber-100 text-amber-700",
      hint: "Growth teams",
    };
  }

  if (
    normalized.includes("security") ||
    normalized.includes("risk") ||
    normalized.includes("compliance")
  ) {
    return {
      icon: ShieldCheck,
      accent: "bg-emerald-100 text-emerald-700",
      hint: "Trusted operations",
    };
  }

  if (
    normalized.includes("developer") ||
    normalized.includes("engineer") ||
    normalized.includes("software")
  ) {
    return {
      icon: Code2,
      accent: "bg-sky-100 text-sky-700",
      hint: "Build products",
    };
  }

  return {
    icon: BriefcaseBusiness,
    accent: "bg-slate-100 text-slate-700",
    hint: "Popular paths",
  };
};

export function HomeCategoriesSection({
  categories,
  loading,
}: HomeCategoriesSectionProps) {
  const totalJobs = categories.reduce((sum, cat) => sum + cat.jobCount, 0);

  return (
    <section className="py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Section header ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600">
              <Sparkles className="h-3.5 w-3.5 text-sky-500" />
              Category map
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] text-slate-950">
              Trending categories.
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-7 text-slate-500">
              Jump into the role clusters candidates open first when they want faster signal and less scrolling.
            </p>
          </div>

          <div className="flex shrink-0 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-white px-5 py-3 text-center shadow-sm">
              <p className="text-xl font-bold text-slate-950">{categories.length}</p>
              <p className="mt-0.5 text-xs text-slate-500">Categories</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white px-5 py-3 text-center shadow-sm">
              <p className="text-xl font-bold text-slate-950">{totalJobs}</p>
              <p className="mt-0.5 text-xs text-slate-500">Open roles</p>
            </div>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-[1.75rem]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 6).map((category, index) => {
                const meta = getCategoryMeta(category.name);
                const Icon = meta.icon;

                return (
                  <Link
                    key={category.id}
                    href={`/jobs?category=${category.id}`}
                    className="group rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-35px_rgba(15,23,42,0.28)]"
                  >
                    {/* Top row: icon + index number */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${meta.accent}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-slate-300">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Name + hint */}
                    <h3 className="mt-5 text-xl font-bold tracking-[-0.02em] text-slate-950">
                      {category.name}
                    </h3>
                    <p className="mt-1.5 text-sm font-medium text-slate-500">{meta.hint}</p>

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm text-slate-400">
                        {category.jobCount} open {category.jobCount === 1 ? "role" : "roles"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition-transform duration-200 group-hover:translate-x-1">
                        View jobs
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}