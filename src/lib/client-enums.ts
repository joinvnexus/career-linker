export const APP_ROLES = ["JOB_SEEKER", "EMPLOYER", "ADMIN"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const APP_JOB_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "REMOTE",
  "CONTRACT",
  "INTERNSHIP",
] as const;
export type AppJobType = (typeof APP_JOB_TYPES)[number];

export const APP_JOB_STATUSES = [
  "ACTIVE",
  "PENDING",
  "EXPIRED",
  "DRAFT",
  "REJECTED",
] as const;
export type AppJobStatus = (typeof APP_JOB_STATUSES)[number];
