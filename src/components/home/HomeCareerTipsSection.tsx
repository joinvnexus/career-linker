import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { careerTips } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomeCareerTipsSection() {
  return (
    <section className="bg-white/60 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
              <Sparkles className="h-4 w-4" />
              Career Tips
            </div>
            <h2 className="text-4xl font-bold text-slate-900">
              Advice for better applications and interviews
            </h2>
          </div>
          <Link href="/blog">
            <Button variant="outline">
              Visit Blog
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {careerTips.map((tip) => (
            <Card key={tip.slug} className="h-full bg-white/90">
              <CardHeader className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  {tip.label}
                </Badge>
                <CardTitle className="text-2xl leading-snug">
                  {tip.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base leading-7 text-slate-600">
                  {tip.summary}
                </p>
                <Link
                  href={`/blog/${tip.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-sky-700 transition-colors hover:text-sky-900"
                >
                  Read article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
