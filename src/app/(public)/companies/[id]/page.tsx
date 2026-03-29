import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Globe, MapPin, Sparkles, Users2 } from "lucide-react";
import { Reveal } from "@/components/layout/reveal";
import { topCompanies } from "@/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const industries = ["SaaS", "Fintech", "Commerce", "Creative Tech"] as const;
const sizes = ["50-100", "100-250", "250-500", "500+"] as const;
const locations = ["Dhaka", "Remote-first", "Singapore", "London"] as const;

export default async function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = Math.max(Number(id) - 1, 0) % topCompanies.length;
  const company = topCompanies[index] ?? `Company ${id}`;

  return (
    <div className="pb-16 pt-8 sm:pb-20 sm:pt-10">
      <section className="page-shell">
        <Reveal>
          <div className="surface-inverse relative overflow-hidden rounded-[2.4rem] border border-white/10 px-6 py-10 sm:px-10 sm:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(45,212,191,0.18),_transparent_26%)]" />
            <div className="relative">
              <Link
                href="/companies"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-white/15"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to companies
              </Link>

              <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                <div>
                  <div className="flex h-18 w-18 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-sky-400 to-emerald-400 text-white shadow-lg">
                    <Building2 className="h-9 w-9" />
                  </div>
                  <div className="eyebrow mt-6 border-white/10 bg-white/10 text-sky-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    Featured employer
                  </div>
                  <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.05em] text-white sm:text-6xl">
                    {company}
                  </h1>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
                    {company} is presented as a high-context employer profile: enough signal for candidates to understand the team, the pace, and the kind of work before jumping into roles.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-[1.5rem] bg-white/8 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Industry</p>
                    <p className="mt-2 text-lg font-semibold text-white">{industries[index % industries.length]}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-white/8 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Company size</p>
                    <p className="mt-2 text-lg font-semibold text-white">{sizes[index % sizes.length]}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-white/8 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Location</p>
                    <p className="mt-2 text-lg font-semibold text-white">{locations[index % locations.length]}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="page-shell mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <Card className="border-white/80 bg-white/92">
            <CardContent className="p-7">
              <h2 className="section-title text-[clamp(2rem,3vw,3rem)]">What this company profile is meant to show.</h2>
              <p className="section-copy mt-4 text-base">
                The best company pages reduce guesswork. Candidates should be able to read the operating context, team shape, and directional signal quickly enough to decide whether deeper exploration is worth it.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-slate-200/80 bg-slate-50/80 p-5">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-500" />
                    <p className="font-semibold text-slate-950">Working setup</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Hybrid collaboration with clear async support for distributed teams.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-slate-200/80 bg-slate-50/80 p-5">
                  <div className="flex items-center gap-3">
                    <Users2 className="h-5 w-5 text-slate-500" />
                    <p className="font-semibold text-slate-950">Team shape</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Cross-functional squads that pair execution speed with high ownership.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.06}>
          <Card className="border-white/80 bg-white/92">
            <CardContent className="p-7">
              <div className="eyebrow">
                <Globe className="h-3.5 w-3.5" />
                Candidate view
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">How to use this page</h2>
              <div className="mt-6 space-y-4">
                {[
                  "Read the company signal before opening roles.",
                  "Check location, scale, and how the team operates.",
                  "Jump into live jobs once the company feels like a fit.",
                ].map((item) => (
                  <div key={item} className="rounded-[1.3rem] border border-slate-200/80 bg-white/80 p-4 text-sm leading-7 text-slate-600">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/jobs">
                  <Button>
                    Browse Jobs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">Contact Team</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </section>
    </div>
  );
}
