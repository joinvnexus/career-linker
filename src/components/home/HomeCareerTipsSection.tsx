import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { careerTips } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function HomeCareerTipsSection() {
  const [featuredTip, ...otherTips] = careerTips;

  return (
    <section className="bg-white/55 py-16 sm:py-18 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
              <Sparkles className="h-4 w-4" />
              Career Tips
            </div>
            <h2 className="text-3xl font-bold tracking-[-0.03em] text-slate-900 sm:text-4xl">
              Advice that helps applications feel sharper, not louder.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Read practical guidance for resumes, interviews, and early-career
              growth without generic filler.
            </p>
          </div>

          <Link href="/blog">
            <Button className="rounded-full px-6" variant="outline">
              Visit Blog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Link
            href={`/blog/${featuredTip.slug}`}
            className="group relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,41,59,0.95)_45%,_rgba(8,145,178,0.85))] p-6 text-white shadow-[0_30px_80px_-40px_rgba(15,23,42,0.75)] sm:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.18),_transparent_20%)]" />
            <div className="relative">
              <Badge className="border-white/10 bg-white/10 text-white">
                {featuredTip.label}
              </Badge>
              <h3 className="mt-6 max-w-xl text-2xl font-bold leading-tight tracking-[-0.03em] sm:text-3xl">
                {featuredTip.title}
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                {featuredTip.summary}
              </p>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Featured read
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Start here for a practical upgrade.
                  </p>
                </div>
                <span className="inline-flex items-center text-sm font-semibold text-sky-200 transition-transform duration-300 group-hover:translate-x-1">
                  Read article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>

          <div className="grid gap-5">
            {otherTips.map((tip) => (
              <Link
                key={tip.slug}
                href={`/blog/${tip.slug}`}
                className="group rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_18px_55px_-35px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_-35px_rgba(15,23,42,0.3)] sm:p-6"
              >
                <Badge variant="secondary" className="w-fit">
                  {tip.label}
                </Badge>
                <h3 className="mt-4 text-lg font-bold leading-snug text-slate-950 sm:text-xl">
                  {tip.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{tip.summary}</p>
                <div className="mt-5 inline-flex items-center text-sm font-semibold text-sky-700 transition-transform duration-300 group-hover:translate-x-1">
                  Read article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
