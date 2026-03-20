"use client"

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard } from "@/components/job-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Briefcase, MapPin, Users, Award, Users2, TrendingUp, Building2, FileText } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  useEffect(() => {
    fetchFeatured();
  }, []);

  const fetchFeatured = async () => {
    try {
      const res = await fetch("/api/jobs?page=1&limit=6");
      const data = await res.json();
      setFeaturedJobs(data.jobs || []);

      const catRes = await fetch("/api/categories");
      const catData = await catRes.json();
      setCategories(catData.categories || []);
    } catch (error) {
      console.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  };

  const JobSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-80 w-full" />
      ))}
    </div>
  );

  const TopCategories = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-16">
      {categories.slice(0, 6).map((cat) => (
        <Link
          key={cat.id}
          href={`/jobs?category=${cat.id}`}
          className="group flex flex-col items-center p-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center h-24"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-800 group-hover:text-blue-600">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );

  const TopCompanies = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
      {["TechCorp", "GrowEasy", "Innovate", "FutureWorks"].map((company, i) => (
        <div key={i} className="group p-6 rounded-3xl bg-white/70 backdrop-blur-md border border-white/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600">{company}</h3>
          <p className="text-sm text-gray-600">250+ Openings</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/50 supports-[backdrop-filter]:bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              <Briefcase className="h-8 w-8" />
              HireHub
            </Link>
            <nav className="hidden md:flex gap-8 items-center">
              <Link href="/jobs" className="text-lg font-medium text-gray-700 hover:text-blue-600">Find Jobs</Link>
              <Link href="/companies" className="text-lg font-medium text-gray-700 hover:text-blue-600">Companies</Link>
              <Link href="/about" className="text-lg font-medium text-gray-700 hover:text-blue-600">About</Link>
            </nav>
            <div className="flex items-center gap-3">
              {status === "authenticated" ? (
                <span className="text-sm font-medium text-gray-700">Hi, {session.user.name}</span>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="border-blue-200">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700">Join</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-700 bg-clip-text text-transparent mb-6 leading-tight">
            Find Your
            <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Dream Job</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover thousands of opportunities from top companies. Simple search, easy apply, career growth.
          </p>
          
          {/* Hero Search */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl p-1 shadow-2xl border border-white/50 mb-20">
            <div className="flex flex-col lg:flex-row gap-3 p-4 lg:p-6">
              <div className="flex-1 relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                <Input
                  placeholder="Job title, skills, company..."
                  className="h-16 pl-16 pr-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 text-lg"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="lg:w-80">
                <div className="relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <Input
                    placeholder="Location (e.g. Dhaka, Remote)"
                    className="h-16 pl-16 pr-4 rounded-2xl border-2 border-gray-200 focus:border-emerald-500 text-lg w-full"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="h-16 px-12 bg-gradient-to-r from-blue-600 via-emerald-600 to-green-600 hover:from-blue-700 text-xl font-bold shadow-xl whitespace-nowrap flex items-center gap-2"
              >
                <Search className="h-6 w-6" />
                Find Jobs
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Trending Categories */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trending Categories</h2>
            <p className="text-xl text-gray-600">Explore high-demand roles</p>
          </div>
          {!loading ? <TopCategories /> : <div className="grid grid-cols-3 md:grid-cols-6 gap-4"><div className="space-y-3">{Array.from({length:6}).map((_,i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div></div>}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
            <p className="text-xl text-gray-600">Latest opportunities from top employers</p>
          </div>
          {loading ? <JobSkeleton /> : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} employerId={job.employerId} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <Briefcase className="h-20 w-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No featured jobs yet</h3>
              <p className="text-gray-600 mb-8">Check back soon for new opportunities</p>
              <Link href="/jobs">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-600">
                  Browse All Jobs
                </Button>
              </Link>
            </div>
          )}
          <div className="text-center mt-16">
            <Link href="/jobs">
              <Button variant="outline" size="lg" className="border-2 text-lg px-12 h-14">
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Companies Hiring</h2>
            <p className="text-xl text-gray-600">Join these industry leaders</p>
          </div>
          <TopCompanies />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-t from-slate-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="h-10 w-10" />
                <span className="text-2xl font-bold">HireHub</span>
              </div>
              <p className="text-gray-400 mb-6">Connecting talent with opportunity.</p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Job Seekers</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/jobs" className="hover:text-white">Find Jobs</Link></li>
                <li><Link href="/register" className="hover:text-white">Create Profile</Link></li>
                <li><Link href="/dashboard/job-seeker" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Employers</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/dashboard/employer/post-job" className="hover:text-white">Post Job</Link></li>
                <li><Link href="/dashboard/employer" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            © 2024 HireHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

