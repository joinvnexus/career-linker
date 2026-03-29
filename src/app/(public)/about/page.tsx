import Link from "next/link";
import { ArrowRight, Briefcase, Compass, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Reveal } from "@/components/layout/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const principles = [
  {
    icon: Compass,
    title: "Clarity first",
    copy: "We design the product around better signal, faster scanning, and fewer dead ends for every role in the hiring journey.",
  },
  {
    icon: Users,
    title: "Shared workflow",
    copy: "Candidates, employers, and operators should feel like they are using one product, not separate disconnected tools.",
  },
  {
    icon: ShieldCheck,
    title: "Trust at scale",
    copy: "Marketplace quality depends on moderation, visibility, and thoughtful controls that keep operations moving.",
  },
] as const;

const milestones = [
  { label: "Public discovery", value: "Jobs, companies, and career insight in one flow" },
  { label: "Employer tools", value: "Posting, review, and analytics in a single workspace" },
  { label: "Platform ops", value: "Admin controls designed for oversight and response" },
] as const;

export default function AboutPage() {
  return (
    <div className="pb-16 pt-8 sm:pb-20 sm:pt-10">
      <section className="page-shell">
        <Reveal>
          <div className="surface-inverse relative overflow-hidden rounded-[2.5rem] border border-white/10 px-6 py-10 sm:px-10 sm:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.14),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.18),_transparent_26%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <div className="eyebrow border-white/10 bg-white/10 text-sky-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  About Career-Linker
                </div>
                <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.05em] text-white sm:text-6xl">
                  Hiring infrastructure with a calmer product experience.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
                  Career-Linker exists to make job discovery, employer execution, and platform operations feel more intentional. We combine discovery, workflow, and oversight in one responsive product surface.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/jobs">
                    <Button size="lg">Explore Jobs</Button>
                  </Link>
                  <Link href="/companies">
                    <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                      Browse Companies
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-3">
                {milestones.map((item) => (
                  <div key={item.label} className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="page-shell mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Reveal>
          <Card className="h-full border-white/80 bg-white/92">
            <CardContent className="p-7">
              <div className="eyebrow">
                <Briefcase className="h-3.5 w-3.5" />
                Product direction
              </div>
              <h2 className="section-title mt-5 text-[clamp(2rem,3vw,3rem)]">Why we built it this way.</h2>
              <p className="section-copy mt-4 text-base">
                Hiring tools often split discovery, execution, and oversight into separate experiences. We wanted a product where job seekers move faster, employers work with clearer context, and admin teams can keep marketplace quality high without losing momentum.
              </p>
            </CardContent>
          </Card>
        </Reveal>

        <div className="grid gap-6">
          {principles.map(({ icon: Icon, title, copy }, index) => (
            <Reveal key={title} delay={index * 0.06}>
              <Card className="border-white/80 bg-white/92">
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.2rem] bg-[linear-gradient(135deg,#0284c7_0%,#0f766e_100%)] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{copy}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-shell mt-12">
        <Reveal>
          <div className="surface-panel rounded-[2.2rem] border border-white/80 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="eyebrow">Next step</div>
                <h2 className="mt-5 section-title text-[clamp(2rem,3vw,3rem)]">
                  Move from product story to the actual experience.
                </h2>
                <p className="mt-4 section-copy text-base">
                  Browse live roles, scan company surfaces, or create an account to step into the job seeker or employer workflow directly.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/register">
                  <Button size="lg">
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button size="lg" variant="outline">
                    Read Insights
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
