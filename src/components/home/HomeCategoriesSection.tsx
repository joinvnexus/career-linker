import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  FileText,
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

const categoryHighlights = [
  { label: "Fast-moving teams", value: "6 sectors" },
  { label: "Remote-friendly roles", value: "Daily" },
  { label: "New listings", value: "Fresh" },
] as const;

const getCategoryMeta = (name: string) => {
  const normalized = name.toLowerCase();

  if (
    normalized.includes("design") ||
    normalized.includes("ui") ||
    normalized.includes("ux") ||
    normalized.includes("creative")
  ) {
    return {
      icon: Palette,
      accent: "from-fuchsia-500 to-pink-500",
      badge: "Visual + product",
    };
  }

  if (
    normalized.includes("market") ||
    normalized.includes("brand") ||
    normalized.includes("sales") ||
    normalized.includes("growth")
  ) {
    return {
      icon: Megaphone,
      accent: "from-amber-500 to-orange-500",
      badge: "Growth driven",
    };
  }

  if (
    normalized.includes("security") ||
    normalized.includes("compliance") ||
    normalized.includes("risk")
  ) {
    return {
      icon: ShieldCheck,
      accent: "from-emerald-500 to-teal-500",
      badge: "High trust",
    };
  }

  if (
    normalized.includes("developer") ||
    normalized.includes("engineer") ||
    normalized.includes("tech") ||
    normalized.includes("software")
  ) {
    return {
      icon: Code2,
      accent: "from-sky-500 to-cyan-500",
      badge: "Build + scale",
    };
  }

  return {
    icon: BriefcaseBusiness,
    accent: "from-sky-500 to-emerald-500",
    badge: "Popular roles",
  };
};

export function HomeCategoriesSection({
  categories,
  loading,
}: HomeCategoriesSectionProps) {
  return (
    <section className="relative overflow-hidden bg-white/45 py-24">
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_55%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" />
              High-demand role clusters
            </div>
            <h2 className="max-w-3xl text-4xl font-bold tracking-[-0.03em] text-slate-950 sm:text-5xl">
              Trending categories built for how people actually search.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Browse focused role groups instead of digging through a flat job
              list. These categories surface the areas candidates and hiring
              teams are moving through most often.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="grid grid-cols-3 gap-3">
              {categoryHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-slate-50 px-3 py-4 text-center"
                >
                  <p className="text-lg font-bold text-slate-950">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-44 rounded-[1.75rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categories.slice(0, 6).map((category, index) => {
              const meta = getCategoryMeta(category.name);
              const Icon = meta.icon;

              return (
                <Link
                  key={category.id}
                  href={`/jobs?category=${category.id}`}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_55px_-35px_rgba(15,23,42,0.35)] backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-sky-100 hover:shadow-[0_30px_70px_-35px_rgba(14,165,233,0.35)]"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${meta.accent}`}
                  />
                  <div className="absolute right-0 top-0 h-28 w-28 translate-x-8 -translate-y-8 rounded-full bg-slate-100/70 blur-2xl transition-transform duration-300 group-hover:scale-125" />

                  <div className="relative">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="mt-6">
                      <p className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                        {meta.badge}
                      </p>
                      <h3 className="mt-4 text-2xl font-bold tracking-[-0.02em] text-slate-950">
                        {category.name}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        Explore current openings, role-specific matches, and fast
                        paths into this category.
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <FileText className="h-4 w-4" />
                        Browse open roles
                      </div>
                      <span className="inline-flex items-center text-sm font-semibold text-slate-900 transition-transform duration-300 group-hover:translate-x-1">
                        View jobs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </div>
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
