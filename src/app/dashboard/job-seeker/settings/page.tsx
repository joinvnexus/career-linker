"use client";

import Link from "next/link";
import {
  Bell,
  Globe2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const settingGroups = [
  {
    title: "Account",
    description: "Update your primary login and identity details.",
    icon: UserCog,
    items: [
      "Change email address",
      "Update password",
      "Review connected sign-in methods",
    ],
  },
  {
    title: "Notifications",
    description: "Control how often HireHub reaches out about jobs and updates.",
    icon: Bell,
    items: [
      "Application status alerts",
      "Recommended job digests",
      "Recruiter messages and reminders",
    ],
  },
  {
    title: "Privacy",
    description: "Choose how visible your profile is to employers and recruiters.",
    icon: ShieldCheck,
    items: [
      "Profile visibility",
      "Resume access preferences",
      "Search discoverability",
    ],
  },
  {
    title: "Region",
    description: "Set the language, timezone, and communication region for your dashboard.",
    icon: Globe2,
    items: [
      "Language preference",
      "Timezone display",
      "Location-based recommendations",
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(135deg,_rgba(15,23,42,0.96),_rgba(71,85,105,0.92)_45%,_rgba(14,165,233,0.72))] p-5 text-white shadow-[0_28px_80px_-45px_rgba(15,23,42,0.9)] lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_24%),radial-gradient(circle_at_bottom_left,_rgba(148,163,184,0.20),_transparent_22%)]" />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Preferences
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-5xl">
              Tune the dashboard around how you work.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
              Keep your account secure, decide how visible you want to be, and
              control the updates that reach you.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-white">Quick actions</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-white" />
                  <div>
                    <p className="font-medium text-white">Email preferences</p>
                    <p className="text-sm text-slate-200/85">Choose alerts you want to receive.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-white" />
                  <div>
                    <p className="font-medium text-white">Security review</p>
                    <p className="text-sm text-slate-200/85">Refresh password and access settings.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {settingGroups.map((group) => (
          <Card
            key={group.title}
            className="border-white/80 bg-white/90 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.75)]"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                  <group.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-950">{group.title}</CardTitle>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{group.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {group.items.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-rose-200/80 bg-[linear-gradient(180deg,_rgba(255,241,242,0.96),_rgba(255,228,230,0.82))] shadow-[0_24px_60px_-40px_rgba(190,24,93,0.35)]">
        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-rose-950">Danger zone</p>
              <p className="mt-1 text-sm leading-6 text-rose-800">
                If you need to leave, make sure you export important application
                history and resume links first.
              </p>
            </div>
          </div>
          <Link href="/dashboard/job-seeker/profile">
            <Button variant="outline" className="border-rose-300 bg-white text-rose-700 hover:bg-rose-50">
              Review profile first
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
