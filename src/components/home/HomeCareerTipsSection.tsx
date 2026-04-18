import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { careerTips } from "@/data";

// ─── Types ────────────────────────────────────────────────────────────────────

// Expects careerTips to have: slug, label, title, summary

// ─── Component ────────────────────────────────────────────────────────────────

export function HomeCareerTipsSection() {
  const [featuredTip, ...otherTips] = careerTips;

  // Bottom strip uses the last 3 tips if available, else fills from otherTips
  const stackTips = otherTips.slice(0, 3);
  const stripTips = otherTips.slice(3, 6);

  return (
    <section className="bg-white/55 py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
              <Sparkles className="h-3.5 w-3.5" />
              Career tips
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Advice that helps applications feel sharper, not louder.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Practical guidance for resumes, interviews, and early-career
              growth without generic filler.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            Visit blog
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* ── Main grid: featured + stack ── */}
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Featured article */}
          <Link
            href={`/blog/${featuredTip.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 transition-all duration-200 hover:border-slate-200 hover:shadow-md sm:p-8"
          >
            {/* Left accent bar */}
            <div className="absolute inset-y-0 left-0 w-0.5 rounded-full bg-sky-500" />

            <div className="pl-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Featured read
              </p>

              <span className="mt-3 inline-block rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                {featuredTip.label}
              </span>

              <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-slate-900 sm:text-2xl">
                {featuredTip.title}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-7 text-slate-500">
                {featuredTip.summary}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                <p className="text-xs text-slate-400">
                  Start here for a practical upgrade.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 transition-transform duration-200 group-hover:translate-x-0.5">
                  Read article
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Numbered tip stack */}
          <div className="flex flex-col gap-3">
            {stackTips.map((tip, i) => (
              <Link
                key={tip.slug}
                href={`/blog/${tip.slug}`}
                className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:border-slate-200 hover:shadow-sm sm:p-5"
              >
                <span className="mt-0.5 min-w-[20px] text-sm font-semibold text-slate-300">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex-1">
                  <span className="inline-block rounded-full border border-slate-100 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {tip.label}
                  </span>
                  <h3 className="mt-1.5 text-sm font-bold leading-snug text-slate-900">
                    {tip.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-6 text-slate-500">
                    {tip.summary}
                  </p>
                </div>

                <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* ── Bottom strip ── */}
        {stripTips.length > 0 && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stripTips.map((tip) => (
              <Link
                key={tip.slug}
                href={`/blog/${tip.slug}`}
                className="group rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 transition-all duration-200 hover:border-slate-200 hover:bg-white"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  {tip.label}
                </p>
                <h3 className="mt-1.5 text-sm font-bold leading-snug text-slate-800">
                  {tip.title}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}