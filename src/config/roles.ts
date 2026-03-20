import type { Role } from "@prisma/client";

export const getDashboardPathForRole = (role?: Role | null): string => {
  switch (role) {
    case "EMPLOYER":
      return "/dashboard/employer";
    case "ADMIN":
      return "/admin";
    case "JOB_SEEKER":
    default:
      return "/dashboard/job-seeker";
  }
};
