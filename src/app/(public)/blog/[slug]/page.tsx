import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/layout/reveal";
import { careerTips } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const articleSections = [
  {
    title: "What matters most",
    copy: "Strong career writing respects the reader's time. Focus on clarity, proof, and what the next step should be after reading.",
  },
  {
    title: "How to use it",
    copy: "Treat the article like a prompt for action. Update a resume bullet, tighten a cover letter, or review a job post immediately after reading.",
  },
  {
    title: "What to avoid",
    copy: "Generic phrasing, bloated summaries, and vague advice create confidence theater instead of actual improvement.",
  },
] as const;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tip = careerTips.find((item) => item.slug === slug);

  if (!tip) {
    notFound();
  }

  return (
    <div className="pb-16 pt-8 sm:pb-20 sm:pt-10">
      <section className="page-shell max-w-4xl">
        <Reveal>
          <div className="surface-inverse relative overflow-hidden rounded-[2.4rem] border border-white/10 px-6 py-10 sm:px-10 sm:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.18),_transparent_26%)]" />
            <div className="relative">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-white/15"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to blog
              </Link>
              <Badge variant="outline" className="mt-8 border-white/10 bg-white/10 text-white">
                {tip.label}
              </Badge>
              <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.05em] text-white sm:text-6xl">
                {tip.title}
              </h1>
              <p className="mt-6 text-base leading-8 text-slate-300">{tip.summary}</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="page-shell mt-12 max-w-4xl grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Reveal>
          <Card className="border-white/80 bg-white/92">
            <CardContent className="p-7 sm:p-8">
              <div className="prose prose-slate max-w-none">
                <div className="space-y-8">
                  {articleSections.map((section) => (
                    <section key={section.title}>
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{section.title}</h2>
                      <p className="mt-3 text-base leading-8 text-slate-600">{section.copy}</p>
                    </section>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <div className="grid gap-6 self-start lg:sticky lg:top-24">
          <Reveal delay={0.06}>
            <Card className="border-white/80 bg-white/92">
              <CardContent className="p-6">
                <div className="eyebrow">
                  <BookOpen className="h-3.5 w-3.5" />
                  Reading prompt
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-600">
                  Turn the article into one concrete improvement before moving on.
                </p>
                <div className="mt-5 space-y-3">
                  {["Refine one resume bullet", "Rewrite one intro paragraph", "Revisit one saved job"].map((item) => (
                    <div key={item} className="rounded-[1.2rem] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>

          <Reveal delay={0.12}>
            <Card className="border-white/80 bg-white/92">
              <CardContent className="p-6">
                <div className="eyebrow">
                  <Sparkles className="h-3.5 w-3.5" />
                  Next step
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-600">
                  Bring the advice back into the live product flow and apply it while the context is fresh.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <Link href="/jobs">
                    <Button className="w-full">
                      Browse Jobs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full" variant="outline">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
