import Link from "next/link";
import { Briefcase, Mail, MapPin, Phone } from "lucide-react";

const footerSections = [
  {
    title: "Job Seekers",
    links: [
      { href: "/jobs", label: "Browse Jobs" },
      { href: "/register", label: "Create Account" },
      { href: "/dashboard/job-seeker", label: "Job Seeker Dashboard" },
    ],
  },
  {
    title: "Employers",
    links: [
      { href: "/dashboard/employer/post-job", label: "Post a Job" },
      { href: "/dashboard/employer", label: "Employer Dashboard" },
      { href: "/companies", label: "Featured Companies" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Career-Linker" },
      { href: "/contact", label: "Contact" },
      { href: "/blog", label: "Career Tips" },
    ],
  },
] as const;

export const Footer = () => (
  <footer className="bg-slate-950 text-slate-200">
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-600 to-emerald-500 text-white">
              <Briefcase className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xl font-bold text-white">Career-Linker</p>
              <p className="text-sm text-slate-400">Job search and hiring platform</p>
            </div>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-400">
            Career-Linker connects job seekers, employers, and administrators with a
            fast hiring workflow built for modern teams.
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
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-white">
              {section.title}
            </h3>
            <div className="space-y-3">
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
        © 2026 Career-Linker. All rights reserved.
      </div>
    </div>
  </footer>
);
