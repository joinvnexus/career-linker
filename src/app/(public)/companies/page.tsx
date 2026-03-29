import Link from "next/link";
import { ArrowRight, Building2, Globe2, Sparkles, TrendingUp, Users2 } from "lucide-react";
import { Reveal } from "@/components/layout/reveal";
import { topCompanies } from "@/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const companyMeta = [
  {
    tag: "Product-led",
    theme: "from-sky-500 to-cyan-500",
    summary: "Shipping software with high-tempo product and engineering loops.",
    signal: "Global teams",
    icon: Globe2,
  },
  {
    tag: "Growth-driven",
    theme: "from-emerald-500 to-teal-500",
    summary: "Hiring across marketing, operations, and commercial roles.",
    signal: "Remote friendly",
    icon: TrendingUp,
  },
  {
    tag: "Creative systems",
    theme: "from-fuchsia-500 to-pink-500",
    summary: "Scaling brand, design, and customer-facing experiences.",
    signal: "Cross-functional",
    icon: Sparkles,
  },
  {
    tag: "Team expansion",
    theme: "from-amber-500 to-orange-500",
    summary: "Opening key roles as hiring demand accelerates.",
    signal: "Active pipeline",
    icon: Users2,
  },
] as const;

export default function CompaniesPage() {
  return (
    <div className="pb-16 pt-8 sm:pb-20 sm:pt-10">
      <section className="page-shell">
        <Reveal>
          <div className="surface-panel relative overflow-hidden rounded-[2.4rem] border border-white/80 px-6 py-10 sm:px-10 sm:py-12">
            <div className="absolute right-0 top-0 h-48 w-48 translate-x-12 -translate-y-12 rounded-full bg-sky-200/50 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-12 translate-y-12 rounded-full bg-emerald-200/45 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="eyebrow">
                  <Building2 className="h-3.5 w-3.5" />
                  Company directory
                </div>
                <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.05em] text-slate-950 sm:text-6xl">
                  Browse employers with stronger hiring signals.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                  This isn&apos;t a flat directory. It&apos;s a curated company surface built to help candidates move from curiosity to a more informed shortlist.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Featured employers</p>
                  <p className="mt-2 text-3xl font-semibold">{topCompanies.length}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/80 bg-white/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Best used for</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">Shortlisting high-context teams</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="page-shell mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {topCompanies.map((company, index) => {
          const meta = companyMeta[index % companyMeta.length];
          const Icon = meta.icon;

          return (
            <Reveal key={company} delay={index * 0.05}>
              <Link href={`/companies/${index + 1}`} className="block h-full">
                <Card className="group h-full overflow-hidden border-white/80 bg-white/92">
                  <CardContent className="relative p-6">
                    <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${meta.theme}`} />
                    <div className="flex items-start justify-between gap-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-gradient-to-r text-white ${meta.theme}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                        {meta.tag}
                      </span>
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950">{company}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{meta.summary}</p>
                    <div className="mt-6 rounded-[1.3rem] border border-slate-200/80 bg-slate-50/80 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Hiring signal</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{meta.signal}</p>
                    </div>
                    <div className="mt-6 inline-flex items-center text-sm font-semibold text-sky-700 transition-transform group-hover:translate-x-1">
                      View company
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </Reveal>
          );
        })}
      </section>

      <section className="page-shell mt-12">
        <Reveal>
          <div className="surface-inverse rounded-[2.2rem] border border-white/10 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="eyebrow border-white/10 bg-white/10 text-sky-100">Next move</div>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Pair company discovery with live roles.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  Once a company stands out, jump directly into the job board and scan for active roles that match your skills and timing.
                </p>
              </div>
              <Link href="/jobs">
                <Button size="lg" variant="inverse">
                  Browse Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
