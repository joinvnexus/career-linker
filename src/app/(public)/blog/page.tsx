import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { Reveal } from "@/components/layout/reveal";
import { careerTips } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogPage() {
  const [featuredTip, ...otherTips] = careerTips;

  return (
    <div className="pb-16 pt-8 sm:pb-20 sm:pt-10">
      <section className="page-shell">
        <Reveal>
          <div className="surface-panel rounded-[2.4rem] border border-white/80 px-6 py-10 sm:px-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="eyebrow">
                  <BookOpen className="h-3.5 w-3.5" />
                  Career insights
                </div>
                <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.05em] text-slate-950 sm:text-6xl">
                  Advice that helps applications feel sharper, not louder.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                  Read practical guidance for resumes, interviews, and career momentum without the generic filler.
                </p>
              </div>
              <div className="rounded-[1.7rem] bg-slate-950 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Reading mode</p>
                <p className="mt-3 text-2xl font-semibold">Editorial, quick to scan, and action-oriented.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="page-shell mt-12 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <Reveal>
          <Link href={`/blog/${featuredTip.slug}`} className="block">
            <Card className="group overflow-hidden border-white/10 bg-[var(--surface-dark)] text-white">
              <CardContent className="relative p-7 sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.18),_transparent_26%)]" />
                <div className="relative">
                  <Badge variant="outline" className="border-white/10 bg-white/10 text-white">
                    {featuredTip.label}
                  </Badge>
                  <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {featuredTip.title}
                  </h2>
                  <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
                    {featuredTip.summary}
                  </p>
                  <div className="mt-8 inline-flex items-center text-sm font-semibold text-sky-200 transition-transform group-hover:translate-x-1">
                    Read article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </Reveal>

        <div className="grid gap-6">
          {otherTips.map((tip, index) => (
            <Reveal key={tip.slug} delay={index * 0.05}>
              <Link href={`/blog/${tip.slug}`} className="block">
                <Card className="group border-white/80 bg-white/92">
                  <CardContent className="p-6">
                    <Badge variant="secondary">{tip.label}</Badge>
                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950">
                      {tip.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{tip.summary}</p>
                    <div className="mt-5 inline-flex items-center text-sm font-semibold text-sky-700 transition-transform group-hover:translate-x-1">
                      Open article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-shell mt-12">
        <Reveal>
          <div className="surface-panel rounded-[2rem] border border-white/80 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="eyebrow">
                  <Sparkles className="h-3.5 w-3.5" />
                  Keep moving
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                  Pair insight with action.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  After reading, jump back into live roles and apply what you learned while the context is still fresh.
                </p>
              </div>
              <Link href="/jobs">
                <Button size="lg">
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
