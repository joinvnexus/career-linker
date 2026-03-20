import { z } from "zod";

const optionalString = (max = 2000) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().max(max).optional()
  );

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().url().optional()
);

const optionalDate = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().optional()
);

export const profileSkillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Skill is required").max(60),
});

export const profileExperienceSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(2, "Title is required").max(120),
    company: z.string().min(2, "Company is required").max(120),
    location: optionalString(120),
    employmentType: optionalString(60),
    startDate: z.string().min(1, "Start date is required"),
    endDate: optionalDate,
    isCurrent: z.boolean().default(false),
    description: optionalString(2000),
  })
  .refine((value) => value.isCurrent || Boolean(value.endDate), {
    message: "End date is required unless this is your current role",
    path: ["endDate"],
  });

export const profileEducationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(2, "Institution is required").max(160),
  degree: z.string().min(2, "Degree is required").max(120),
  fieldOfStudy: optionalString(120),
  startDate: optionalDate,
  endDate: optionalDate,
  isCurrent: z.boolean().default(false),
  description: optionalString(2000),
});

export const jobSeekerProfileSchema = z.object({
  headline: z.string().min(10, "Headline must be at least 10 characters").max(160),
  bio: optionalString(2000),
  phone: optionalString(20),
  location: optionalString(120),
  resumeUrl: optionalUrl,
  websiteUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  skills: z.array(profileSkillSchema).max(30),
  experiences: z.array(profileExperienceSchema).max(20),
  educations: z.array(profileEducationSchema).max(20),
});

export type JobSeekerProfileInput = z.output<typeof jobSeekerProfileSchema>;
export type JobSeekerProfileFormValues = z.input<typeof jobSeekerProfileSchema>;
