// Shared constants for job filtering components
// These are used by JobsFiltersPanel, JobsResultsHeader, and JobsSearchHeader

export const JOB_TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "REMOTE", label: "Remote" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
] as const;

export const EXPERIENCE_OPTIONS = [
  { value: "ENTRY", label: "Entry level" },
  { value: "MID", label: "Mid level" },
  { value: "SENIOR", label: "Senior level" },
] as const;

export const SALARY_OPTIONS = [
  { value: "30000", label: "30,000+" },
  { value: "50000", label: "50,000+" },
  { value: "80000", label: "80,000+" },
  { value: "120000", label: "120,000+" },
] as const;

// Label mappings for display
export const JOB_TYPE_LABELS: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  REMOTE: "Remote",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export const EXPERIENCE_LABELS: Record<string, string> = {
  ENTRY: "Entry level",
  MID: "Mid level",
  SENIOR: "Senior level",
};

export const SALARY_LABELS: Record<string, string> = {
  "30000": "30,000+",
  "50000": "50,000+",
  "80000": "80,000+",
  "120000": "120,000+",
};

// Filter sections for the filters panel
export const FILTER_SECTIONS = [
  {
    key: "jobType",
    label: "Job Type",
    items: JOB_TYPE_OPTIONS,
  },
  {
    key: "experience",
    label: "Experience",
    items: EXPERIENCE_OPTIONS,
  },
  {
    key: "salaryMin",
    label: "Minimum Salary",
    items: SALARY_OPTIONS,
  },
] as const;
