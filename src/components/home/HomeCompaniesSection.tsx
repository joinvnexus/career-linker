import { Building2 } from "lucide-react";
import { topCompanies } from "@/data";

export function HomeCompaniesSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Top Companies Hiring
          </h2>
          <p className="text-xl text-gray-600">
            Join these industry leaders
          </p>
        </div>

        <div className="mb-20 grid grid-cols-2 gap-6 md:grid-cols-4">
          {topCompanies.map((company) => (
            <div
              key={company}
              className="group rounded-3xl border border-white/50 bg-white/70 p-6 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 transition-transform group-hover:rotate-12">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-1 text-lg font-bold transition-colors group-hover:text-blue-600">
                {company}
              </h3>
              <p className="text-sm text-gray-600">250+ Openings</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
