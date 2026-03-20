"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-400">Loading...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-40 animate-pulse rounded-xl bg-gray-100" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900">Edit Job</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input className="mt-1 h-14" id="title" {...form.register("title")} />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input className="mt-1 h-14" id="location" {...form.register("location")} />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <Input
                  className="mt-1 h-14"
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
              <div>
                <Label htmlFor="salaryMax">Maximum Salary</Label>
                <Input
                  className="mt-1 h-14"
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
              <div>
                <Label htmlFor="salaryType">Salary Type</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("salaryType", value as FormData["salaryType"])
                  }
                  value={salaryType}
                >
                  <SelectTrigger className="mt-1 h-14">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Range">Range</SelectItem>
                    <SelectItem value="Negotiable">Negotiable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <Label htmlFor="jobType">Job Type *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("jobType", value as FormData["jobType"])
                  }
                  value={jobType}
                >
                  <SelectTrigger className="mt-1 h-14">
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
              <div>
                <Label htmlFor="experience">Experience *</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("experience", value as FormData["experience"])
                  }
                  value={experience}
                >
                  <SelectTrigger className="mt-1 h-14">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTRY">Entry Level</SelectItem>
                    <SelectItem value="MID">Mid Level</SelectItem>
                    <SelectItem value="SENIOR">Senior Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="categoryId">Category *</Label>
                <Select
                  onValueChange={(value) => form.setValue("categoryId", value)}
                  value={categoryId}
                >
                  <SelectTrigger className="mt-1 h-14">
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
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                className="mt-1 resize-y"
                id="description"
                rows={6}
                {...form.register("description")}
              />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements *</Label>
              <Textarea
                className="mt-1 resize-y"
                id="requirements"
                rows={4}
                {...form.register("requirements")}
              />
            </div>

            <Button className="h-16 w-full text-xl font-bold" disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
