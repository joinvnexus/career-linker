"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold mb-6">
          Find Your Dream Job
        </h1>
        <p className="text-2xl mb-12 opacity-90">
          Discover thousands of job opportunities locally and globally.
        </p>
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Input placeholder="Job title, skills..." className="h-14 text-lg bg-white/20 border-white/30 placeholder-white/70" />
          </div>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 text-lg font-bold px-12">
            Search Jobs
          </Button>
        </div>
      </div>
    </section>
  )
}

