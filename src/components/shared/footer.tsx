import Link from "next/link";
import { ArrowRight, Briefcase, Mail, MapPin, Phone } from "lucide-react";

const footerSections = [
  {
    title: "For Job Seekers",
    links: [
      { href: "/jobs", label: "Browse Jobs" },
      { href: "/register", label: "Create Account" },
      { href: "/dashboard/job-seeker", label: "Job Seeker Dashboard" },
    ],
  },
  {
    title: "For Employers",
    links: [
      { href: "/dashboard/employer/post-job", label: "Post a Job" },
      { href: "/dashboard/employer", label: "Employer Dashboard" },
      { href: "/companies", label: "Featured Companies" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/about", label: "About Career-Linker" },
      { href: "/contact", label: "Contact" },
      { href: "/blog", label: "Career Insights" },
    ],
  },
] as const;

export const Footer = () => (
  <footer className="mt-20 border-t border-white/70 bg-[linear-gradient(180deg,rgba(9,15,29,0.98),rgba(11,32,53,0.98))] text-slate-200">
    <div className="page-shell py-14 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] bg-[linear-gradient(135deg,#0284c7_0%,#0f766e_100%)] text-white shadow-[0_18px_40px_-18px_rgba(2,132,199,0.5)]">
              <Briefcase className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xl font-semibold text-white">Career-Linker</p>
              <p className="text-sm text-slate-400">A calmer hiring experience</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-7 text-slate-400">
            Career-Linker connects job seekers, employers, and admin teams in a single editorial-style workspace designed for clarity and momentum.
          </p>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4" />
              <span>support@career-linker.app</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4" />
              <span>+880 1700-000000</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>

        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Career-Linker. All rights reserved.</span>
        <span>Designed for clearer job discovery, better hiring flow, and responsive workspaces.</span>
      </div>
    </div>
  </footer>
);
