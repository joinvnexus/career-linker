// src/lib/constants.ts
// Aligned with Prisma schema enums (source of truth)

export const ROLES = ["JOB_SEEKER", "EMPLOYER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const JOB_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "REMOTE",
  "CONTRACT",
  "INTERNSHIP",
] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const EXPERIENCE_LEVELS = ["ENTRY", "MID", "SENIOR"] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const CATEGORIES = [
  "Software Development",
  "Design",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Operations",
  "Healthcare",
  "Education",
] as const;

export const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_RESUME_TYPES = ["application/pdf", "application/msword"];
