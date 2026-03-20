import Link from "next/link";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category } from "@/components/home/types";

type HomeCategoriesSectionProps = {
  categories: Category[];
  loading: boolean;
};

export function HomeCategoriesSection({
  categories,
  loading,
}: HomeCategoriesSectionProps) {
  return (
    <section className="bg-white/50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Trending Categories
          </h2>
          <p className="text-xl text-gray-600">Explore high-demand roles</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="mb-16 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category.id}
                href={`/jobs?category=${category.id}`}
                className="group flex h-24 flex-col items-center rounded-2xl border border-white/30 bg-white/50 p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 transition-transform group-hover:scale-110">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-800 transition-colors group-hover:text-blue-600">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
