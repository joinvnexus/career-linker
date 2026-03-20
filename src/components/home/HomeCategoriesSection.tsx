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
    return { icon: Palette, accent: "bg-fuchsia-100 text-fuchsia-700", hint: "Creative systems" };
  }

  if (normalized.includes("market") || normalized.includes("growth") || normalized.includes("sales")) {
    return { icon: Megaphone, accent: "bg-amber-100 text-amber-700", hint: "Growth teams" };
  }

  if (normalized.includes("security") || normalized.includes("risk") || normalized.includes("compliance")) {
    return { icon: ShieldCheck, accent: "bg-emerald-100 text-emerald-700", hint: "Trusted operations" };
  }

  if (normalized.includes("developer") || normalized.includes("engineer") || normalized.includes("software")) {
    return { icon: Code2, accent: "bg-sky-100 text-sky-700", hint: "Build products" };
  }

  return { icon: BriefcaseBusiness, accent: "bg-slate-100 text-slate-700", hint: "Popular paths" };
};

export function HomeCategoriesSection({
  categories,
  loading,
}: HomeCategoriesSectionProps) {
  return (
    <section className="bg-white/45 py-16 sm:py-18 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:gap-8 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-10 lg:px-8">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_30px_70px_-35px_rgba(15,23,42,0.7)] sm:p-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-sky-200">
              <Sparkles className="h-4 w-4" />
              Category map
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.03em]">
              Trending categories.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Jump into the role clusters candidates open first when they want
              faster signal and less scrolling.
            </p>
            <div className="mt-8 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-2xl font-bold">6</p>
                <p className="text-sm text-slate-400">High-demand groups surfaced</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-2xl font-bold">Daily</p>
                <p className="text-sm text-slate-400">Fresh roles routed into search</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-[1.75rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {categories.slice(0, 6).map((category, index) => {
              const meta = getCategoryMeta(category.name);
              const Icon = meta.icon;

              return (
                <Link
                  key={category.id}
                  href={`/jobs?category=${category.id}`}
                  className="group rounded-[1.75rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-35px_rgba(15,23,42,0.35)] sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${meta.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-slate-300">0{index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold tracking-[-0.02em] text-slate-950">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium text-slate-500">{meta.hint}</p>
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm text-slate-500">Open category</span>
                    <span className="inline-flex items-center text-sm font-semibold text-slate-900 transition-transform group-hover:translate-x-1">
                      View jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
