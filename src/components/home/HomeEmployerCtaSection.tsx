import Link from "next/link";
import { ArrowRight, Building2, Sparkles, Users2 } from "lucide-react";

// ─── Static data ──────────────────────────────────────────────────────────────

const features = [
  {
    icon: Building2,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    label: "Dashboard",
    value: "1 place",
    desc: "Roles, applicants, and updates all in one view.",
  },
  {
    icon: Users2,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    label: "Candidate review",
    value: "Fast review",
    desc: "Move through candidates with less friction.",
  },
  {
    icon: ArrowRight,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    label: "Hiring flow",
    value: "End-to-end",
    desc: "From publishing to shortlist, no tab-switching.",
  },
] as const;

const stats = [
  { value: "2,400+", label: "Active employers" },
  { value: "18k+", label: "Jobs posted this month" },
  { value: "3.2 days", label: "Avg. time to first hire" },
] as const;

const headerStats = [
  { label: "Time to publish", value: "5 min" },
  { label: "Applicant tracking", value: "Real-time" },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeEmployerCtaSection() {
  return (
    <section className="py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-slate-200">

          {/* ── Dark header strip ── */}
          <div className="bg-[linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(8,47,73,0.94)_45%,_rgba(6,95,70,0.92)_100%)] px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">

              {/* Left: copy + CTAs */}
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-emerald-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  For employers
                </div>

                <h2 className="mt-4 text-2xl font-bold leading-snug tracking-tight text-slate-50 sm:text-3xl">
                  Post jobs, manage applicants, and hire faster with one workflow.
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Career-Linker gives employers a cleaner hiring cockpit — job
                  posting, candidate review, and tracking without scattered tabs.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/dashboard/employer/post-job"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
                  >
                    Post a job
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800"
                  >
                    Create employer account
                  </Link>
                </div>
              </div>

              {/* Right: quick stat cards */}
              <div className="flex shrink-0 flex-col gap-3 lg:w-48">
                {headerStats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                      {s.label}
                    </p>
                    <p className="mt-1 text-xl font-bold text-slate-50">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Feature grid ── */}
          <div className="grid divide-y divide-slate-100 border-t border-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="px-6 py-5">
                  <div
                    className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${f.iconBg}`}
                  >
                    <Icon className={`h-4 w-4 ${f.iconColor}`} />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    {f.label}
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {f.value}
                  </p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ── Stats row ── */}
          <div className="grid divide-y divide-slate-100 border-t border-slate-100 bg-slate-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((s) => (
              <div key={s.label} className="px-6 py-4">
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="mt-0.5 text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Footer strip ── */}
          <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              No setup fee. Free to post your first role.
            </p>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
            >
              See how it works
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}