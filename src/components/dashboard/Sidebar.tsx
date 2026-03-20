"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  User, 
  Briefcase, 
  Bookmark, 
  Settings 
} from 'lucide-react'

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-50 border-r p-4 space-y-4">
      <Button asChild variant="ghost" className="w-full justify-start">
        <Link href="/dashboard">
          <Home className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </Button>
      <Button asChild variant="ghost" className="w-full justify-start">
        <Link href="/dashboard/profile">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Link>
      </Button>
      <Button asChild variant="ghost" className="w-full justify-start">
        <Link href="/dashboard/applications">
          <Briefcase className="mr-2 h-4 w-4" />
          Applications
        </Link>
      </Button>
      <Button asChild variant="ghost" className="w-full justify-start">
        <Link href="/dashboard/saved-jobs">
          <Bookmark className="mr-2 h-4 w-4" />
          Saved
        </Link>
      </Button>
      <Button asChild variant="ghost" className="w-full justify-start">
        <Link href="/dashboard/settings">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </Button>
    </div>
  )
}

