export type Category = {
  id: string;
  name: string;
};

export type FeaturedJob = {
  id: string;
  slug: string;
  title: string;
  companyName: string;
  companySlug?: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: string;
  jobType: "FULL_TIME" | "PART_TIME" | "REMOTE" | "CONTRACT" | "INTERNSHIP";
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "DRAFT" | "REJECTED";
  createdAt: string;
  applicationDeadline?: string;
  employerId: string;
};
