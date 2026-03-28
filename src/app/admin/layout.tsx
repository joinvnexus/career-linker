"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart3,
  Briefcase,
  Building2,
  CreditCard,
  LayoutGrid,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { href: "/admin/jobs/pending", label: "Pending Jobs", icon: ShieldCheck },
  { href: "/admin/companies", label: "Companies", icon: Building2 },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings2 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session || session.user.role !== "ADMIN") {
      router.replace("/unauthorized");
    }
  }, [router, session, status]);

  if (status === "loading") {
    return <div className="p-8 text-sm text-slate-500">Loading admin panel...</div>;
  }

  if (!session || session.user.role !== "ADMIN") {
    return <></>;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_36%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)]">
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">HireHub</p>
              <p className="font-semibold text-slate-950">Admin Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:inline">
              {session.user.email}
            </span>
            <Link href="/jobs">
              <Button variant="outline" className="rounded-full border-slate-300 bg-white/70">
                View Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-8">
        <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-7rem)]">
          <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] backdrop-blur-xl">
            <div className="mb-4 rounded-3xl bg-slate-950 p-4 text-white">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Governance</p>
              <h2 className="mt-2 text-lg font-semibold">Marketplace control</h2>
              <p className="mt-2 text-sm text-slate-300">
                Moderate listings, protect trust, and keep operations moving.
              </p>
            </div>

            <nav className="space-y-2" aria-label="Admin navigation">
              {adminLinks.map(({ href, label, icon: Icon }) => {
                const active =
                  pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      active
                        ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
