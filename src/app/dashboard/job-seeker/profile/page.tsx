"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ResumeUploader } from "@/components/resume-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
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

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completion, setCompletion] = useState(0);
  const form = useForm<JobSeekerProfileFormValues>({
    resolver: zodResolver(jobSeekerProfileSchema) as never,
    defaultValues,
  });
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
    if (watchedValues.experiences?.some((experience) => experience.title.trim())) score += 15;
    if (watchedValues.educations?.some((education) => education.degree.trim())) score += 15;
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
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-1 text-gray-600">Keep your candidate profile complete and current.</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/dashboard/job-seeker/profile/view">
            <Button variant="outline">Preview Profile</Button>
          </Link>
          <Button disabled={saving} form="profileForm" type="submit">
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
      </div>

      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-600 to-emerald-500 transition-all"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="mt-3 text-sm text-slate-600">{completion}% complete</p>
        </CardContent>
      </Card>

      <form
        className="space-y-8"
        id="profileForm"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input
                className="mt-1"
                id="headline"
                placeholder="Full Stack Developer building polished web products"
                {...form.register("headline")}
              />
            </div>
            <div>
              <Label htmlFor="bio">Professional Summary</Label>
              <Textarea
                className="mt-1 resize-y"
                id="bio"
                rows={5}
                placeholder="Write a concise summary of your strengths, experience, and career focus."
                {...form.register("bio")}
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input className="mt-1" id="phone" {...form.register("phone")} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input className="mt-1" id="location" {...form.register("location")} />
              </div>
              <div>
                <Label htmlFor="websiteUrl">Website</Label>
                <Input className="mt-1" id="websiteUrl" {...form.register("websiteUrl")} />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input className="mt-1" id="linkedinUrl" {...form.register("linkedinUrl")} />
              </div>
              <div>
                <Label htmlFor="resumeUrl">Resume URL</Label>
                <Input className="mt-1" id="resumeUrl" {...form.register("resumeUrl")} />
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">Upload Resume PDF</p>
                  <p className="text-sm text-slate-500">
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
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Skills</CardTitle>
            <Button
              onClick={() => skills.append({ name: "" })}
              size="sm"
              type="button"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.fields.map((field, index) => (
              <div key={field.id} className="flex gap-3">
                <Input
                  placeholder="e.g. TypeScript"
                  {...form.register(`skills.${index}.name`)}
                />
                <Button
                  onClick={() => skills.remove(index)}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Experience</CardTitle>
            <Button
              onClick={() => experiences.append(emptyExperience)}
              size="sm"
              type="button"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </CardHeader>
          <CardContent className="space-y-8">
            {experiences.fields.map((field, index) => (
              <div key={field.id} className="space-y-4 rounded-2xl border border-slate-200 p-5">
                <div className="flex justify-between gap-4">
                  <h3 className="font-semibold text-slate-900">Experience {index + 1}</h3>
                  <Button
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
                  <Input type="date" {...form.register(`experiences.${index}.endDate`)} />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" {...form.register(`experiences.${index}.isCurrent`)} />
                  I currently work here
                </label>
                <Textarea
                  placeholder="Describe your responsibilities and impact."
                  rows={4}
                  {...form.register(`experiences.${index}.description`)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Education</CardTitle>
            <Button
              onClick={() => educations.append(emptyEducation)}
              size="sm"
              type="button"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </CardHeader>
          <CardContent className="space-y-8">
            {educations.fields.map((field, index) => (
              <div key={field.id} className="space-y-4 rounded-2xl border border-slate-200 p-5">
                <div className="flex justify-between gap-4">
                  <h3 className="font-semibold text-slate-900">Education {index + 1}</h3>
                  <Button
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
                  <div />
                  <Input type="date" {...form.register(`educations.${index}.startDate`)} />
                  <Input type="date" {...form.register(`educations.${index}.endDate`)} />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" {...form.register(`educations.${index}.isCurrent`)} />
                  I currently study here
                </label>
                <Textarea
                  placeholder="Achievements, coursework, or notes."
                  rows={4}
                  {...form.register(`educations.${index}.description`)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
