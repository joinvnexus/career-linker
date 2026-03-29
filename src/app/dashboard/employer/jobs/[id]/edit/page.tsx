"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, FileText, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const schema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(50, "Description too short"),
    requirements: z.string().min(20, "Requirements too short"),
    salaryMin: z.number().optional(),
    salaryMax: z.number().optional(),
    salaryType: z.enum(["Fixed", "Range", "Negotiable"]).optional(),
    location: z.string().min(2, "Location required"),
    jobType: z.enum([
      "FULL_TIME",
      "PART_TIME",
      "REMOTE",
      "CONTRACT",
      "INTERNSHIP",
    ]),
    experience: z.enum(["ENTRY", "MID", "SENIOR"]),
    categoryId: z.string().min(1, "Category is required"),
  })
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMin <= data.salaryMax,
    {
      message: "Minimum salary cannot exceed maximum salary",
      path: ["salaryMax"],
    }
  );

type FormData = z.infer<typeof schema>;
type Category = { id: string; name: string };

export default function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      location: "",
      jobType: "FULL_TIME",
      experience: "ENTRY",
      categoryId: "",
      salaryType: "Range",
    },
  });
  const salaryType = useWatch({ control: form.control, name: "salaryType" });
  const salaryMin = useWatch({ control: form.control, name: "salaryMin" });
  const salaryMax = useWatch({ control: form.control, name: "salaryMax" });
  const jobType = useWatch({ control: form.control, name: "jobType" });
  const experience = useWatch({ control: form.control, name: "experience" });
  const categoryId = useWatch({ control: form.control, name: "categoryId" });

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const [jobResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/jobs/${params.id}`),
          fetch("/api/categories"),
        ]);

        if (!jobResponse.ok) {
          throw new Error("Failed to load job");
        }

        const jobData = (await jobResponse.json()) as {
          job: FormData & {
            salaryMin?: number | null;
            salaryMax?: number | null;
            salaryType?: FormData["salaryType"] | null;
          };
        };
        const categoriesData = (await categoriesResponse.json()) as {
          categories?: Category[];
        };

        setCategories(categoriesData.categories ?? []);
        form.reset({
          ...jobData.job,
          salaryMin: jobData.job.salaryMin ?? undefined,
          salaryMax: jobData.job.salaryMax ?? undefined,
          salaryType: jobData.job.salaryType ?? "Range",
        });
      } catch {
        toast.error("Failed to load job");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [form, params.id]);

  const onSubmit = (data: FormData): void => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          toast.error(payload.error || "Failed to update job");
          return;
        }

        toast.success("Job updated successfully");
        router.push("/dashboard/employer/jobs");
      } catch {
        toast.error("Something went wrong");
      }
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="border-white/80 bg-white/94">
          <CardContent className="space-y-6 p-6">
            <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
            <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
            <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="surface-inverse relative overflow-hidden rounded-[2rem] border border-white/10 p-5 lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.18),_transparent_24%)]" />
        <div className="relative max-w-2xl">
          <div className="eyebrow border-white/10 bg-white/10 text-sky-50">
            <Sparkles className="h-3.5 w-3.5" />
            Edit role
          </div>
          <h1 className="mt-4 font-display text-4xl tracking-[-0.04em] text-white lg:text-5xl">
            Update the listing without losing clarity.
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-200 lg:text-base">
            Refresh the title, requirements, or salary details to keep the role accurate and easier to trust on mobile and desktop.
          </p>
        </div>
      </section>

      <form className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_320px]" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="border-white/80 bg-white/94">
          <CardContent className="space-y-6 p-5 sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input className="h-14" id="title" {...form.register("title")} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="location">Location *</Label>
                <Input className="h-14" id="location" {...form.register("location")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <Input
                  className="h-14"
                  id="salaryMin"
                  onChange={(event) =>
                    form.setValue(
                      "salaryMin",
                      event.target.value ? Number(event.target.value) : undefined
                    )
                  }
                  type="number"
                  value={salaryMin ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary</Label>
                <Input
                  className="h-14"
                  id="salaryMax"
                  onChange={(event) =>
                    form.setValue(
                      "salaryMax",
                      event.target.value ? Number(event.target.value) : undefined
                    )
                  }
                  type="number"
                  value={salaryMax ?? ""}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="salaryType">Salary Type</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("salaryType", value as FormData["salaryType"])
                  }
                  value={salaryType}
                >
                  <SelectTrigger className="h-14 rounded-[1rem]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Range">Range</SelectItem>
                    <SelectItem value="Negotiable">Negotiable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("jobType", value as FormData["jobType"])
                  }
                  value={jobType}
                >
                  <SelectTrigger className="h-14 rounded-[1rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="REMOTE">Remote</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("experience", value as FormData["experience"])
                  }
                  value={experience}
                >
                  <SelectTrigger className="h-14 rounded-[1rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTRY">Entry Level</SelectItem>
                    <SelectItem value="MID">Mid Level</SelectItem>
                    <SelectItem value="SENIOR">Senior Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select
                  onValueChange={(value) => form.setValue("categoryId", value)}
                  value={categoryId}
                >
                  <SelectTrigger className="h-14 rounded-[1rem]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea className="resize-y" id="description" rows={6} {...form.register("description")} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="requirements">Requirements *</Label>
                <Textarea className="resize-y" id="requirements" rows={4} {...form.register("requirements")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-white/80 bg-white/94">
            <CardContent className="p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Editing focus</p>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-[1rem] bg-slate-50/80 p-3">Keep the title and location aligned with what candidates actually see in search.</div>
                <div className="rounded-[1rem] bg-slate-50/80 p-3">Use requirements to remove ambiguity instead of adding generic filler.</div>
                <div className="rounded-[1rem] bg-slate-50/80 p-3">A clear salary structure often improves click quality and applicant trust.</div>
              </div>
            </CardContent>
          </Card>

          <Button className="h-14 w-full text-base font-semibold" disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Saving changes...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Save Changes
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
