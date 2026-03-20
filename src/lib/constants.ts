// src/lib/constants.ts
export const ROLES = ['JOBSEEKER', 'EMPLOYER', 'ADMIN', 'MODERATOR'] as const
export type Role = typeof ROLES[number]

export const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', 'REMOTE', 'HYBRID'] as const
export type JobType = typeof JOB_TYPES[number]

export const EXPERIENCE_LEVELS = ['ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'MANAGER', 'DIRECTOR', 'EXECUTIVE'] as const
export type ExperienceLevel = typeof EXPERIENCE_LEVELS[number]

export const CATEGORIES = [
  'Software Development',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'HR',
  'Operations',
  'Healthcare',
  'Education'
] as const

export const MAX_RESUME_SIZE = 5 * 1024 * 1024 // 5MB
export const SUPPORTED_RESUME_TYPES = ['application/pdf', 'application/msword']

