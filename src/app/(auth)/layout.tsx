import type { Metadata } from "next";
import { Briefcase, Compass, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Career-Linker - Login & Register",
  description: "Job marketplace authentication",
};

const authSignals = [
  {
    icon: Compass,
    title: "Sharper discovery",
    copy: "Search, shortlist, and revisit opportunities without losing context.",
  },
  {
    icon: Briefcase,
    title: "Hiring in one place",
    copy: "Candidates, employers, and platform ops all live in the same product rhythm.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable workflows",
    copy: "Authentication, dashboards, and admin tools share one cohesive experience.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-h-screen bg-background font-sans antialiased")}>
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="surface-inverse relative hidden overflow-hidden px-8 py-10 lg:flex lg:flex-col lg:justify-between">
          <div className="ambient-orb left-[-4rem] top-10 h-56 w-56 bg-sky-300/30" />
          <div className="ambient-orb right-[-2rem] bottom-16 h-64 w-64 bg-emerald-300/25" />

          <div className="relative">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/14">
                <Briefcase className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Career-Linker</p>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                  Editorial tech experience
                </p>
              </div>
            </div>

            <div className="mt-16 max-w-xl">
              <p className="eyebrow border-white/10 bg-white/10 text-sky-100">Access the workspace</p>
              <h1 className="mt-6 font-display text-5xl leading-none tracking-[-0.05em] text-white">
                A calmer way to search, hire, and manage the marketplace.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-slate-300">
                Sign in to continue your current workflow or create an account to move through hiring with a more intentional, responsive product experience.
              </p>
            </div>
          </div>

          <div className="relative grid gap-4">
            {authSignals.map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-sky-100">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-white">{title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{copy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="relative flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="ambient-orb left-[-6rem] top-20 h-56 w-56 bg-sky-200/35" />
          <div className="ambient-orb right-[-5rem] bottom-12 h-56 w-56 bg-emerald-200/35" />
          <div className="relative w-full max-w-lg">{children}</div>
        </main>
      </div>
    </div>
  );
}
