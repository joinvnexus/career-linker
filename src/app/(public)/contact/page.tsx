import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageSquare, Phone, Sparkles } from "lucide-react";
import { Reveal } from "@/components/layout/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const contactWays = [
  {
    icon: Mail,
    title: "Email support",
    value: "support@career-linker.app",
    copy: "Best for product questions, account help, and platform support.",
  },
  {
    icon: Phone,
    title: "Call the team",
    value: "+880 1700-000000",
    copy: "Good for direct coordination during business hours.",
  },
  {
    icon: MapPin,
    title: "Visit our base",
    value: "Dhaka, Bangladesh",
    copy: "Our operating hub for product, support, and platform operations.",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="pb-16 pt-8 sm:pb-20 sm:pt-10">
      <section className="page-shell">
        <Reveal>
          <div className="surface-panel rounded-[2.4rem] border border-white/80 px-6 py-10 sm:px-10 sm:py-12">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <div className="eyebrow">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Contact
                </div>
                <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.05em] text-slate-950 sm:text-6xl">
                  Reach the team behind the product.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                  Get in touch about the platform, employer onboarding, candidate questions, or operational support.
                </p>
              </div>
              <div className="rounded-[1.7rem] bg-slate-950 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Best use</p>
                <p className="mt-3 text-2xl font-semibold">Questions that need a thoughtful, human response.</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="page-shell mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-6">
          {contactWays.map(({ icon: Icon, title, value, copy }, index) => (
            <Reveal key={title} delay={index * 0.05}>
              <Card className="border-white/80 bg-white/92">
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.2rem] bg-[linear-gradient(135deg,#0284c7_0%,#0f766e_100%)] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{value}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{copy}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <Card className="border-white/80 bg-white/92">
            <CardContent className="p-7">
              <div className="eyebrow">
                <Sparkles className="h-3.5 w-3.5" />
                Send a message
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Name</label>
                  <Input placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <Input placeholder="you@company.com" type="email" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-slate-700">Subject</label>
                <Input placeholder="What can we help with?" />
              </div>
              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium text-slate-700">Message</label>
                <Textarea placeholder="Tell us a little about your question or request." rows={6} />
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg">
                  Send Message
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/register">
                  <Button size="lg" variant="outline">
                    Create Account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </section>
    </div>
  );
}
