"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HomeCareerTipsSection } from "@/components/home/HomeCareerTipsSection";
import { HomeCategoriesSection } from "@/components/home/HomeCategoriesSection";
import { HomeCompaniesSection } from "@/components/home/HomeCompaniesSection";
import { HomeEmployerCtaSection } from "@/components/home/HomeEmployerCtaSection";
import { HomeFeaturedJobsSection } from "@/components/home/HomeFeaturedJobsSection";
import { HomeHeroSection } from "@/components/home/HomeHeroSection";
import type { Category, FeaturedJob } from "@/components/home/types";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState<FeaturedJob[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async (): Promise<void> => {
      try {
        const [jobsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/jobs?page=1&limit=6"),
          fetch("/api/categories"),
        ]);

        const jobsData = (await jobsResponse.json()) as {
          jobs?: FeaturedJob[];
          total?: number;
        };
        const categoriesData = (await categoriesResponse.json()) as {
          categories?: Category[];
        };

        setFeaturedJobs(jobsData.jobs ?? []);
        setCategories(categoriesData.categories ?? []);
        setTotalJobs(jobsData.total ?? 0);
      } catch {
        console.error("Failed to load home page data");
      } finally {
        setLoading(false);
      }
    };

    void fetchFeatured();
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (location) {
      params.set("location", location);
    }

    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <div className="bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.10),_transparent_24%),linear-gradient(180deg,_#f8fbff_0%,_#f8fafc_38%,_#ecfdf5_100%)]">
      <HomeHeroSection
        categoriesCount={categories.length}
        location={location}
        onLocationChange={setLocation}
        onSearchChange={setSearch}
        onSubmit={handleSearch}
        search={search}
        totalJobs={totalJobs}
      />
      <HomeCategoriesSection categories={categories} loading={loading} />
      <HomeFeaturedJobsSection
        featuredJobs={featuredJobs}
        loading={loading}
        totalJobs={totalJobs}
      />
      <HomeCompaniesSection />
      <HomeCareerTipsSection />
      <HomeEmployerCtaSection />
    </div>
  );
}
