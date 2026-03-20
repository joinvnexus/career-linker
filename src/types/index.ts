// src/types/index.ts
import type { Role } from '@prisma/client'
import type { Session as NextAuthSession } from 'next-auth'

export interface User {
  id: string
  name: string
  email: string
  image?: string | null
  role: Role
}

export interface ExtendedSession extends NextAuthSession {
  user: {
    id: string
    role: Role
  }
}

export interface Job {
  id: string
  title: string
  slug: string
  description: string
  location: string
  salaryMin?: number
  salaryMax?: number
  jobType: string
  experience: string
  status: string
  createdAt: string
}

export type ApplicationStatus = 'PENDING' | 'SHORTLISTED' | 'INTERVIEW' | 'REJECTED' | 'HIRED'

