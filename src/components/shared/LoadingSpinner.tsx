"use client"

import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({
  className = 'h-8 w-8',
}: {
  className?: string
}) {
  return (
    <Loader2 className={cn('animate-spin', className)} />
  )
}

