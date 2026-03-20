"use client"

import { useSession } from 'next-auth/react'
import { Role } from '@/lib/constants'
import { User } from '@/types'

export function useAuth() {
  const { data: session, status } = useSession()

  const user = session?.user as User | undefined

  return {
    user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    role: user?.role as Role | undefined,
    isAdmin: user?.role === 'ADMIN',
  }
}

