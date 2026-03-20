"use client";

import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type HomeHeroSectionProps = {
  search: string;
  location: string;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export function HomeHeroSection({
  search,
  location,
  onSearchChange,
  onLocationChange,
  onSubmit,
}: HomeHeroSectionProps) {
  return (
    <section className="pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mb-6 text-5xl font-bold leading-tight text-transparent md:text-7xl">
          <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-emerald-700 bg-clip-text">
            Find Your
          </span>
          <span className="block bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text">
            Dream Job
          </span>
        </h1>
        <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-600 md:text-2xl">
          Discover thousands of opportunities from top companies. Simple
          search, easy apply, and career growth in one place.
        </p>

        <form
          className="mx-auto mb-20 max-w-4xl rounded-3xl border border-white/50 bg-white/70 p-1 shadow-2xl backdrop-blur-xl"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-3 p-4 lg:flex-row lg:p-6">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
              <Input
                className="h-16 rounded-2xl border-2 border-gray-200 pl-16 pr-4 text-lg focus:border-blue-500"
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Job title, skills, company..."
                value={search}
              />
            </div>
            <div className="relative lg:w-80">
              <MapPin className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-gray-400" />
              <Input
                className="h-16 w-full rounded-2xl border-2 border-gray-200 pl-16 pr-4 text-lg focus:border-emerald-500"
                onChange={(event) => onLocationChange(event.target.value)}
                placeholder="Location (e.g. Dhaka, Remote)"
                value={location}
              />
            </div>
            <Button
              className="h-16 whitespace-nowrap px-12 text-xl font-bold"
              type="submit"
            >
              <Search className="mr-2 h-6 w-6" />
              Find Jobs
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
