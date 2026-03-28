import type { AppRole } from "@/lib/client-enums";

export const getDashboardPathForRole = (role?: AppRole | null): string => {
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
