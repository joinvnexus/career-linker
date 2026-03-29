"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Plus,
  Save,
  Trash2,
  Sparkles,
  UserRound,
  Wrench,
  BriefcaseBusiness,
  GraduationCap,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { ResumeUploader } from "@/components/resume-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  jobSeekerProfileSchema,
  type JobSeekerProfileFormValues,
} from "@/schemas/job-seeker-profile";

const emptyExperience = {
  title: "",
  company: "",
  location: "",
  employmentType: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};

const emptyEducation = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
};

const defaultValues: JobSeekerProfileFormValues = {
  headline: "",
  bio: "",
  phone: "",
  location: "",
  resumeUrl: "",
  websiteUrl: "",
  linkedinUrl: "",
  skills: [{ name: "" }],
  experiences: [emptyExperience],
  educations: [emptyEducation],
};

type ProfileResponse = {
  profile?: {
    headline?: string | null;
    bio?: string | null;
    phone?: string | null;
    location?: string | null;
    resumeUrl?: string | null;
    websiteUrl?: string | null;
    linkedinUrl?: string | null;
    isComplete?: boolean;
    skills?: Array<{ id: string; name: string }>;
    experiences?: Array<{
      id: string;
      title: string;
      company: string;
      location?: string | null;
      employmentType?: string | null;
      startDate: string;
      endDate?: string | null;
      isCurrent: boolean;
      description?: string | null;
    }>;
    educations?: Array<{
      id: string;
      institution: string;
      degree: string;
      fieldOfStudy?: string | null;
      startDate?: string | null;
      endDate?: string | null;
      isCurrent: boolean;
      description?: string | null;
    }>;
  };
};

const toDateInput = (value?: string | null): string =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  action,
  id,
  children,
}: {
  icon: typeof UserRound;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="scroll-mt-28 border-white/80 bg-white/94" id={id}>
      <CardHeader className="flex flex-col gap-4 border-b border-slate-100/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl text-slate-950">{title}</CardTitle>
            <p className="mt-1 text-sm leading-6 text-slate-600">{subtitle}</p>
          </div>
        </div>
        {action}
      </CardHeader>
      <CardContent className="space-y-6 p-4 pt-5 sm:p-5 sm:pt-5">{children}</CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completion, setCompletion] = useState(0);
  const form = useForm<JobSeekerProfileFormValues>({
    resolver: zodResolver(jobSeekerProfileSchema) as never,
    defaultValues,
  });
  const {
    formState: { isDirty },
  } = form;
  const watchedValues = form.watch();
  const skills = useFieldArray({ control: form.control, name: "skills" });
  const experiences = useFieldArray({ control: form.control, name: "experiences" });
  const educations = useFieldArray({ control: form.control, name: "educations" });

  useEffect(() => {
    const fetchProfile = async (): Promise<void> => {
      try {
        const response = await fetch("/api/profiles/seeker");
        const data = (await response.json()) as ProfileResponse;
        const profile = data.profile;

        if (profile) {
          form.reset({
            headline: profile.headline ?? "",
            bio: profile.bio ?? "",
            phone: profile.phone ?? "",
            location: profile.location ?? "",
            resumeUrl: profile.resumeUrl ?? "",
            websiteUrl: profile.websiteUrl ?? "",
            linkedinUrl: profile.linkedinUrl ?? "",
            skills:
              profile.skills?.length
                ? profile.skills.map((skill) => ({ id: skill.id, name: skill.name }))
                : [{ name: "" }],
            experiences:
              profile.experiences?.length
                ? profile.experiences.map((experience) => ({
                    id: experience.id,
                    title: experience.title,
                    company: experience.company,
                    location: experience.location ?? "",
                    employmentType: experience.employmentType ?? "",
                    startDate: toDateInput(experience.startDate),
                    endDate: toDateInput(experience.endDate),
                    isCurrent: experience.isCurrent,
                    description: experience.description ?? "",
                  }))
                : [emptyExperience],
            educations:
              profile.educations?.length
                ? profile.educations.map((education) => ({
                    id: education.id,
                    institution: education.institution,
                    degree: education.degree,
                    fieldOfStudy: education.fieldOfStudy ?? "",
                    startDate: toDateInput(education.startDate),
                    endDate: toDateInput(education.endDate),
                    isCurrent: education.isCurrent,
                    description: education.description ?? "",
                  }))
                : [emptyEducation],
          });
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, [form]);

  useEffect(() => {
    let score = 0;
    if (watchedValues.headline) score += 20;
    if (watchedValues.location) score += 10;
    if (watchedValues.resumeUrl) score += 20;
    if (watchedValues.skills?.some((skill) => skill.name.trim())) score += 20;
    if (watchedValues.experiences?.some((experience) => experience.title.trim())) {
      score += 15;
    }
    if (watchedValues.educations?.some((education) => education.degree.trim())) {
      score += 15;
    }
    setCompletion(score);
  }, [watchedValues]);

  const handleSubmit = async (data: JobSeekerProfileFormValues): Promise<void> => {
    setSaving(true);
    try {
      const response = await fetch("/api/profiles/seeker", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          skills: data.skills.filter((skill) => skill.name.trim()),
          experiences: data.experiences.filter(
            (experience) => experience.title.trim() && experience.company.trim()
          ),
          educations: data.educations.filter(
            (education) => education.institution.trim() && education.degree.trim()
          ),
        }),
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        toast.error(result.error || "Failed to update profile");
        return;
      }

      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-[2rem]" />
        <Skeleton className="h-64 w-full rounded-[2rem]" />
        <Skeleton className="h-64 w-full rounded-[2rem]" />
      </div>
    );
  }

  const profileChecks = [
    { label: "Headline", complete: Boolean(watchedValues.headline) },
    { label: "Location", complete: Boolean(watchedValues.location) },
    { label: "Resume", complete: Boolean(watchedValues.resumeUrl) },
    {
      label: "Skills",
      complete: Boolean(watchedValues.skills?.some((skill) => skill.name.trim())),
    },
    {
      label: "Experience",
      complete: Boolean(
        watchedValues.experiences?.some((experience) => experience.title.trim())
      ),
    },
    {
      label: "Education",
      complete: Boolean(
        watchedValues.educations?.some((education) => education.degree.trim())
      ),
    },
  ];

  const sectionLinks = [
    { id: "basic-information", label: "Basics" },
    { id: "links-and-resume", label: "Links" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
  ];

  return (
    <div className="space-y-6 pb-24 lg:space-y-8 lg:pb-0">
      <section className="surface-inverse relative overflow-hidden rounded-[2rem] border border-white/10 p-5 text-white lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(125,211,252,0.18),_transparent_22%)]" />
        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
          <div>
            <div className="eyebrow border-white/10 bg-white/10 text-sky-50">
              <Sparkles className="h-3.5 w-3.5" />
              Candidate profile
            </div>
            <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] lg:text-5xl">
              Shape the profile recruiters remember.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-sky-50/85 lg:text-base">
              Keep your story clear, show your best work, and turn your profile into
              a stronger signal for matching and outreach.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard/job-seeker/profile/view">
                <Button className="w-full sm:w-auto" variant="inverse">
                  Preview Profile
                </Button>
              </Link>
              <Button
                disabled={saving}
                form="profileForm"
                type="submit"
                className="w-full border-white/20 bg-white/10 text-white hover:bg-white/15 sm:w-auto"
                variant="outline"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {sectionLinks.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-50 transition-colors hover:bg-white/15"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-white">Profile completion</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-5xl font-bold tracking-tight">{completion}%</p>
              <p className="max-w-[12rem] text-right text-sm leading-6 text-sky-50/80">
                The closer to 100%, the stronger your search visibility.
              </p>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {profileChecks.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm font-medium",
                    item.complete
                      ? "bg-white/20 text-white"
                      : "bg-slate-950/25 text-sky-50/75"
                  )}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <form className="space-y-6" id="profileForm" onSubmit={form.handleSubmit(handleSubmit)}>
        <SectionCard
          id="basic-information"
          icon={UserRound}
          title="Basic information"
          subtitle="Introduce yourself with a concise headline, summary, and core contact details."
        >
          <div>
            <Label htmlFor="headline">Headline</Label>
            <Input
              className="mt-2"
              id="headline"
              placeholder="Full Stack Developer building polished web products"
              {...form.register("headline")}
            />
          </div>
          <div>
            <Label htmlFor="bio">Professional Summary</Label>
            <Textarea
              className="mt-2 resize-y"
              id="bio"
              rows={5}
              placeholder="Write a concise summary of your strengths, experience, and career focus."
              {...form.register("bio")}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input className="mt-2" id="phone" {...form.register("phone")} />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input className="mt-2" id="location" {...form.register("location")} />
            </div>
            <div>
              <Label htmlFor="websiteUrl">Website</Label>
              <Input className="mt-2" id="websiteUrl" {...form.register("websiteUrl")} />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="links-and-resume"
          icon={Link2}
          title="Links and resume"
          subtitle="Make it easy for recruiters to verify your profile and open your resume quickly."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
              <Input className="mt-2" id="linkedinUrl" {...form.register("linkedinUrl")} />
            </div>
            <div>
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <Input className="mt-2" id="resumeUrl" {...form.register("resumeUrl")} />
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-slate-950">Upload resume PDF</p>
                <p className="mt-1 text-sm text-slate-500">
                  Uploading will fill the resume URL field automatically.
                </p>
              </div>
              <ResumeUploader
                onUploaded={(url) => {
                  form.setValue("resumeUrl", url, { shouldDirty: true });
                  toast.success("Resume uploaded");
                }}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          id="skills"
          icon={Wrench}
          title="Skills"
          subtitle="List the tools, technologies, and strengths that define your profile."
          action={
            <Button
              onClick={() => skills.append({ name: "" })}
              size="sm"
              type="button"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          }
        >
          <div className="grid gap-3 md:grid-cols-2">
            {skills.fields.map((field, index) => (
              <div key={field.id} className="flex gap-3">
                <Input
                  placeholder="e.g. TypeScript"
                  {...form.register(`skills.${index}.name`)}
                />
                <Button
                  disabled={skills.fields.length === 1}
                  onClick={() => skills.remove(index)}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          id="experience"
          icon={BriefcaseBusiness}
          title="Experience"
          subtitle="Highlight the work that proves your impact and the kind of roles you are ready for."
          action={
            <Button
              onClick={() => experiences.append(emptyExperience)}
              size="sm"
              type="button"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          }
        >
          <div className="space-y-6">
            {experiences.fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 rounded-[1.75rem] border border-slate-200/80 bg-slate-50/70 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-semibold text-slate-950">Experience {index + 1}</h3>
                  <Button
                    disabled={experiences.fields.length === 1}
                    onClick={() => experiences.remove(index)}
                    size="icon"
                    type="button"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="Role title" {...form.register(`experiences.${index}.title`)} />
                  <Input placeholder="Company" {...form.register(`experiences.${index}.company`)} />
                  <Input placeholder="Location" {...form.register(`experiences.${index}.location`)} />
                  <Input
                    placeholder="Employment type"
                    {...form.register(`experiences.${index}.employmentType`)}
                  />
                  <Input type="date" {...form.register(`experiences.${index}.startDate`)} />
                  {!watchedValues.experiences?.[index]?.isCurrent ? (
                    <Input type="date" {...form.register(`experiences.${index}.endDate`)} />
                  ) : (
                    <div className="flex min-h-12 items-center rounded-[1.15rem] border border-dashed border-slate-200 bg-white/60 px-4 text-sm text-slate-500">
                      Current role, no end date needed
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-3 rounded-[1rem] border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-slate-700">
                  <input
                    className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-sky-500/40"
                    type="checkbox"
                    {...form.register(`experiences.${index}.isCurrent`)}
                  />
                  I currently work here
                </label>
                <Textarea
                  placeholder="Describe your responsibilities and impact."
                  rows={4}
                  {...form.register(`experiences.${index}.description`)}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          id="education"
          icon={GraduationCap}
          title="Education"
          subtitle="Show the credentials, coursework, or learning history that supports your path."
          action={
            <Button
              onClick={() => educations.append(emptyEducation)}
              size="sm"
              type="button"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          }
        >
          <div className="space-y-6">
            {educations.fields.map((field, index) => (
              <div
                key={field.id}
                className="space-y-4 rounded-[1.75rem] border border-slate-200/80 bg-slate-50/70 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="font-semibold text-slate-950">Education {index + 1}</h3>
                  <Button
                    disabled={educations.fields.length === 1}
                    onClick={() => educations.remove(index)}
                    size="icon"
                    type="button"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Institution"
                    {...form.register(`educations.${index}.institution`)}
                  />
                  <Input placeholder="Degree" {...form.register(`educations.${index}.degree`)} />
                  <Input
                    placeholder="Field of study"
                    {...form.register(`educations.${index}.fieldOfStudy`)}
                   />
                   <div className="hidden md:block" />
                   <Input type="date" {...form.register(`educations.${index}.startDate`)} />
                   {!watchedValues.educations?.[index]?.isCurrent ? (
                     <Input type="date" {...form.register(`educations.${index}.endDate`)} />
                   ) : (
                     <div className="flex min-h-12 items-center rounded-[1.15rem] border border-dashed border-slate-200 bg-white/60 px-4 text-sm text-slate-500">
                       Current study, no end date needed
                     </div>
                   )}
                 </div>
                <label className="flex items-center gap-3 rounded-[1rem] border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-slate-700">
                  <input
                    className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-sky-500/40"
                    type="checkbox"
                    {...form.register(`educations.${index}.isCurrent`)}
                  />
                  I currently study here
                </label>
                <Textarea
                  placeholder="Achievements, coursework, or notes."
                  rows={4}
                  {...form.register(`educations.${index}.description`)}
                />
              </div>
            ))}
          </div>
        </SectionCard>
      </form>

      {isDirty ? (
        <div className="fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-40 px-4 lg:hidden">
          <div className="mx-auto max-w-md rounded-[1.5rem] border border-slate-200/80 bg-white/95 p-3 shadow-[0_24px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-950">Unsaved profile changes</p>
                <p className="text-xs text-slate-500">Save before leaving this screen.</p>
              </div>
              <Button
                disabled={saving}
                form="profileForm"
                size="sm"
                type="submit"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
